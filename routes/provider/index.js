import express from "express";
import spaceAction from "./spaceAction.js";
import profile from "./profile.js";
import { HEADERS, USER_TYPES } from "./../../constants/index.js";
import User from "../../model/User.js";
import Provider from "../../model/Provider.js";
import SpaceModel from "../../model/SpaceModel.js";
import db from "../../util/db.js";

const { USER_ID } = HEADERS;

const router = express.Router();

router.get("/", (_req, res) => {
  return res.send({
    health: "OK",
  });
});

const validateProvider = async (req, res, next) => {
  // const id = req.headers[USER_ID]

  // const user = await User.findById(id).select({
  //     "type": 1
  // })

  // if (!user || user.type !== USER_TYPES.TEACHER) {
  //     return res.status(400).send({
  //         success: false,
  //         message: "Not a valid teacher profile",
  //     });
  // }

  next();
};

router.use("/space", validateProvider, spaceAction);
router.use("/profile", profile);

router.get("/getAllSpaces", validateProvider, async (req, res) => {
  const id = req.query.profileId;

  const provider = await Provider.findById(id).select({
    spaces: 1,
  });

  if (!provider)
    return res.status(401).send({
      success: false,
      message: "Could not find the provider",
    });

  const idList = provider.spaces;

  const spaces = await SpaceModel.find({
    _id: {
      $in: idList,
    },
  });

  return res.send({
    spaces,
  });
});

router.post("/createSpace", async (req, res) => {
  const { profileId, title } = req.body;

  let session = null,
    spaceObj;

  db.startSession()
    .then((_session) => {
      session = _session;

      session.startTransaction();
      return SpaceModel.create(
        [
          {
            title,
            provider: profileId,
          },
        ],
        { session }
      );
    })
    .then(([arg]) => {
      spaceObj = arg;

      return Provider.findByIdAndUpdate(profileId, {
        $push: { spaces: spaceObj._id },
      });
    })
    .then(() => {
      return session.commitTransaction();
    })
    .then(() => {
      return res.send({ space: spaceObj });
    })
    .catch((err) => {
      res.status(400).send({
        success: false,
        message: `Something went error: ${err}`,
      });
      return session.abortTransaction();
    })
    .finally(() => {
      return session.endSession();
    });
});

export default router;

import express from "express";
import spaceAction from "./spaceAction.js";
import profile from "./profile.js";
import { HEADERS, USER_TYPES } from "./../../constants/index.js";
import User from "../../model/User.js";
import Consumer from "../../model/Consumer.js";
import SpaceModel from "../../model/SpaceModel.js";
import db from "../../util/db.js";

const { USER_ID } = HEADERS;

const router = express.Router();

router.get("/", (_req, res) => {
  return res.send({
    health: "OK",
  });
});

const validateConsumer = async (req, res, next) => {
  // const id = req.headers[USER_ID]

  // const user = await User.findById(id).select({
  //     "type": 1
  // })

  // if (!user || user.type !== USER_TYPES.STUDENT) {
  //     return res.status(400).send({
  //         success: false,
  //         message: "Not a valid student profile",
  //     });
  // }

  next();
};

router.use("/space", validateConsumer, spaceAction);
router.use("/profile", profile);

router.get("/getAllSpaces", validateConsumer, async (req, res) => {
  const id = req.query.profileId;

  const consumer = await Consumer.findById(id).select({
    spaces: 1,
  });

  if (!consumer)
    return res.status(401).send({
      success: false,
      message: "Could not find the Consumer",
    });

  const idList = consumer.spaces;

  const spaces = await SpaceModel.find({
    _id: {
      $in: idList,
    },
  });

  return res.send({
    spaces,
  });
});

router.post("/joinSpace", validateConsumer, async (req, res) => {
  const { userId, spaceId } = req.body;

  let session = null;

  db.startSession()
    .then((_session) => {
      session = _session;

      session.startTransaction();
      return Consumer.findOneAndUpdate(
        {
          userId,
        },
        {
          $push: { spaces: spaceId },
        }
      );
    })
    .then(() => {
      return SpaceModel.findByIdAndUpdate(spaceId, {
        $push: { consumers: userId },
      });
    })
    .then(() => {
      return session.commitTransaction();
    })
    .then(() => {
      return res.send({ success: true });
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

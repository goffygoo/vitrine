import express from "express";
import space from "./space.js";
import profile from "./profile.js";
import { HEADERS, USER_TYPES } from "./../../constants/index.js";
import Provider from "../../model/Provider.js";
import SpaceModel from "../../model/SpaceModel.js";
import db from "../../util/db.js";
import Page from "../../service/search/model/Page.js";

const required = [
  "_id",
  "provider",
  "consumer",
  "streams",
  "greenBoard",
  "shelf",
  "events",
];
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

router.use("/space", validateProvider, space);
router.use("/profile", profile);

router.get("/getAllSpaces", validateProvider, async (req, res) => {
  try {
    const { profileId } = res.locals.data;

    const provider = await Provider.findById(profileId).select({
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
    const array = [];

    for (const space of spaces) {
      let page;
      try {
        page = await Page.findById(space._id);
      } catch (e) {
        page = {};
      }
      const obj = {};
      for (const key of required) {
        obj[key] = space[key];
      }
      obj.title = page.heading || "Hello App";
      obj.description = page.subHeading || "Hello Hello";
      obj.displayPicture = page.profileImg || "tempuser.jpg";
      obj.coverPicture = page.banner || "tempcover.jpg";
      array.push(obj);
    }
    return res.send({
      spaces: array,
    });
  } catch (e) {
    console.log(e);
    res.sendStatus(400);
  }
});

router.post("/createSpace", async (req, res) => {
  try {
    const { title, subtitle } = req.body;
    const { profileId, type, email } = res.locals.data;
    if (type === USER_TYPES.PROVIDER) {
      let session = null,
        spaceObj;

      db.startSession()
        .then((_session) => {
          session = _session;

          session.startTransaction();
          return SpaceModel.create(
            [
              {
                provider: profileId,
                meetAttendees: [email],
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
          return Page.createOrUpdateOne({
            heading: title,
            subHeading: subtitle,
            id: spaceObj._id,
            banner: "tempcover.jpg",
            profileImg: "tempuser.jpg",
          });
        })
        .then(() => {
          return session.commitTransaction();
        })
        .then(() => {
          const createdSpace = {
            title,
            description: subtitle,
            coverPicture: "tempcover.jpg",
            displayPicture: "tempuser.jpg",
          };
          for (const key of required) createdSpace[key] = spaceObj[key];
          return res.send({
            space: createdSpace,
            message: "Added Successfully",
          });
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
    } else {
      res.status(400).send({
        success: false,
        message: `Something went error.`,
      });
    }
  } catch (e) {
    res.sendStatus(400);
  }
});

router.get("/getSpace", async (req, res) => {
  const { spaceId } = req.query;
  const space = await SpaceModel.findById(spaceId);
  return res.send({
    space,
  });
});

export default router;

import express from "express";
import spaceAction from "./spaceAction.js";
import profile from "./profile.js";
import Consumer from "../../model/Consumer.js";
import SpaceModel from "../../model/SpaceModel.js";
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

const validateConsumer = async (req, res, next) => {
  next();
};

// TODO: change spaceAction -> space and move APIs to /space
router.use("/space", validateConsumer, spaceAction);
router.use("/profile", profile);

router.get("/getAllSpaces", validateConsumer, async (req, res) => {
  try {
    const { profileId } = res.locals.data;

    const consumer = await Consumer.findById(profileId).select({
      spaces: 1,
    });
    if (!consumer) {
      return res.sendStatus(400);
    }

    const idList = consumer.spaces;

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
      // TODO: remove fallback
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
    res.sendStatus(400);
  }
});

export default router;

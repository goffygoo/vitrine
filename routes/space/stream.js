import express from "express";
import Editor from "../../model/Editor.js";
import Stream from "../../model/Stream.js";
import { STREAM_TYPES } from "../../constants/index.js";
import SpaceModel from "../../model/SpaceModel.js";

const router = express.Router();

router.get("/", (_req, res) => {
  return res.send({
    health: "OK",
  });
});

router.post("/getPosts", async (req, res) => {
  const { spaceId } = req.body;
  console.log(spaceId);
  try {
    const posts = await Stream.find({
      spaceId,
    }).sort({ createdAt: -1 });

    res.status(200).send({
      success: true,
      posts: posts,
    });
  } catch (err) {
    res.status(400).send({
      success: false,
      message: `Something went wrong`,
      err,
    });
    console.log(err);
  }
});

router.post("/addPost", async (req, res) => {
  const { spaceId, type, file, editor, poll } = req.body;
  const content = {};
  if (type === STREAM_TYPES.EDITOR) content["editor"] = editor;
  else if (type === STREAM_TYPES.POLL) content["poll"] = poll;
  else content["file"] = file;

  try {
    const post = await Stream.create({
      spaceId,
      type,
      ...content,
    });

    await SpaceModel.findByIdAndUpdate(spaceId, {
      $push: { streams: post._id },
    });
    res.status(200).send({
      success: true,
      post,
    });
  } catch (err) {
    res.status(400).send({
      success: false,
      message: `Something went wrong`,
      err,
    });
    console.log(err);
  }
});

export default router;

import express from "express";
import Stream from "../../model/Stream.js";
import { STREAM_TYPES } from "../../constants/index.js";
import SpaceModel from "../../model/SpaceModel.js";

const router = express.Router();

router.get("/", (_req, res) => {
  return res.send({
    health: "OK",
  });
});

router.get('/post', async (req, res) => {
  const { postId } = req.query;
  try {
    const post = await Stream.findById(postId);
    return res.status(200).send(post);
  } catch (_e) {
    return res.sendStatus(400);
  }
})

router.post("/getPosts", async (req, res) => {
  const { spaceId } = req.body;
  try {
    const posts = await Stream.find({
      spaceId,
    }).sort({ createdAt: -1 });

    return res.status(200).send({
      success: true,
      posts: posts,
    });
  } catch (err) {
    return res.sendStatus(400);
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
    return res.status(200).send({
      success: true,
      post,
    });
  } catch (err) {
    return res.sendStatus(400);
  }
});

export default router;

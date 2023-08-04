import express from "express";
import Message from "../../model/Message.js";
const router = express.Router();

router.get("/", (_req, res) => {
  return res.send({
    health: "OK",
  });
});

router.get("/getMessages", async (req, res) => {
  const { spaceId } = req.query;
  try {
    const messages = await Message.find({ spaceId });
    return res.send({
      data: messages,
    });
  } catch (err) {
    console.log(err);
    return res.status(400).send({
      success: false,
      err,
    });
  }
});

export default router;

import express from "express";
import Editor from "../../model/Editor.js";

const router = express.Router();

router.get("/", (_req, res) => {
  return res.send({
    health: "OK",
  });
});

router.post("/addEditor", async (req, res) => {
  const { spaceID, content } = req.body;

  try {
    await Editor.create({
      content,
    });

    res.status(200).send({
      success: true,
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

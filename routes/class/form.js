import express from "express";
import Editor from "../../model/Editor.js";
import Form from "../../model/Form.js";

const router = express.Router();

router.get("/", (_req, res) => {
  return res.send({
    health: "OK",
  });
});

router.post("/addForm", async (req, res) => {
  const { classId, title } = req.body;
  try {
    // TODO: Sanity check
    await Form.create({
      classId,
      title,
      titleEditorContent: {},
      entities: {}
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

router.get("/getForms", async (req, res) => {
  const { classId } = req.query;
  try {
    const forms = await Form.find({ classId }).select({ _id: 1, title: 1 });

    return res.send({
      forms,
    });
  } catch (err) {
    console.log(err);
    return res.status(400).send({
      success: false,
      err,
    });
  }
});

router.get("/getFormById", async (req, res) => {
  const { formId } = req.query;
  try {
    const formData = await Form.findById(formId);

    return res.send({
      formData,
    });
  } catch (err) {
    console.log(err);
    return res.status(400).send({
      success: false,
      err,
    });
  }
});

router.post("/updateForm", async (req, res) => {
  const { formId, formContent } = req.body;

  try {
    // TODO: Sanity check
    console.log(formContent);
    await Form.findByIdAndUpdate(formId, {
      title: formContent.title,
      titleEditorContent: formContent.titleEditorContent,
      entities: formContent.entities,
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

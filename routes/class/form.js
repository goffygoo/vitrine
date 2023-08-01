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
    const editor = await Editor.create({ content: {} });
    await Form.create({
      classId,
      title,
      titleEditor: editor._id,
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
    const form = await Form.findById(formId);
    const formData = {};
    formData.titleEditorContent = (
      await Editor.findById(form.titleEditor)
    )?.content;
    formData.title = form.title;
    formData.titleEditor = form.titleEditor;

    formData.entities = await Promise.all(
      form.entities.map((entityId) => Editor.findById(entityId))
    );

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
    const title = formContent.title;
    await Editor.findByIdAndUpdate(formContent.titleEditor, {
      content: formContent.titleEditorContent,
    });

    console.log(formContent);
    console.log(formContent.titleEditor);
    const pp = await Editor.findById(formContent.titleEditor);
    console.log(pp);

    // const entitiesArray = await Promise.all(
    //   formContent.formEntities.map((element) =>
    //     Editor.create({ content: element.questionDescription })
    //   )
    // );
    // const entities = formContent.formEntities.forEach((element, index) => {
    //   return {
    //     ...element,
    //     questionDescription: entitiesArray[index]._id,
    //   };
    // });
    await Form.findByIdAndUpdate(formId, {
      title,
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

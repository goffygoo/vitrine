import express from "express";
import Editor from "../../model/Editor.js";
import Form from "../../model/Form.js";
import { FORM_ENTITY_TYPES, FORM_TYPES } from "../../constants/index.js";
import FormResponse from "../../model/FormResponse.js";

const router = express.Router();

router.get("/", (_req, res) => {
	return res.send({
		health: "OK",
	});
});

router.post("/addForm", async (req, res) => {
  const { spaceId, title, type } = req.body;
  try {
    await Form.create({
      type,
      spaceId,
      title,
      titleEditorContent: {},
      entities: {},
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
	const { spaceId } = req.query;
	try {
		const forms = await Form.find({ spaceId }).select({ _id: 1, title: 1 });

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

const verifyForm = (formType, entities) => {
  for (let entity in entities) {
    const { type } = entities[entity];
    if (formType === FORM_TYPES.SURVEY) {
      if (type !== FORM_ENTITY_TYPES.MCQ) throw Error("Invalid Entities");
    }
  }
}

router.post("/updateForm", async (req, res) => {
	const { formId, formContent } = req.body;

  try {
    const form = await Form.findById(formId).select({ type: 1 });
    if (!form) throw Error("Invalid FormId");
    const formType = form.type;
    verifyForm(formType, formContent.entities);

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

const handleSurveySubmit = (entities, responses, previousResponses) => {
  const update = {};

  for (let id in responses) {
    const response = responses[id], entity = entities[id];

    if (!entity) throw Error("Invalid Entities");
    if (response < 0 || response > entity.options.length) throw Error("Invalid Entities");

    update[id] = update[id] ?? {};
    update[id][response] = update[id][response] ?? 0;
    update[id][response]++;
  }

  for (let id in previousResponses) {
    const response = previousResponses[id], entity = entities[id];

    update[id] = update[id] ?? {};
    update[id][response] = update[id][response] ?? 0;
    update[id][response]--;
  }

  const incrementObject = {};

  for (let id in update) {
    const options = update[id];

    for (let index in options) {
      incrementObject[`responses.${id}.${index}`] = options[index];
    }
  }

  return incrementObject;
}

router.post("/submitForm", async (req, res) => {
  const { formId, formResponse, userId } = req.body;
  // TODO: get user id from jwt
  try {
    const form = await Form.findById(formId);
    const previousResponse = await FormResponse.findOne({ userId, formId })

    const type = form.type;

    if (type === FORM_TYPES.SURVEY) {
      const incrementObject = handleSurveySubmit(form.entities, formResponse, previousResponse?.entities);
      await Form.findOneAndUpdate({ _id: formId }, {
        $inc: incrementObject
      })
    }

    if (previousResponse) {
      await FormResponse.updateOne({ _id: previousResponse._id }, {
        entities: formResponse
      })
    } else {
      await FormResponse.create({
        userId,
        formId,
        entities: formResponse
      })
    }

    return res.send({});
  } catch (err) {
    res.status(400).send({
      success: false,
      message: `Something went wrong`,
      err,
    });
    console.log(err);
  }
})

export default router;

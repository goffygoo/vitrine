import express from "express";
import Message from "../../model/Message.js";
import SpaceModel from "../../model/SpaceModel.js";
import { ORDER_PLAN_TYPES } from "../../constants/index.js";
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

router.get("/getPlans", async (req, res) => {
	const { spaceId } = req.query;
	try {
		const space = await SpaceModel.findById(spaceId);
		return res.send({
			plans: space.plan,
		});
	} catch (err) {
		console.log(err);
		return res.status(400).send({
			success: false,
			err,
		});
	}
});

router.post("/setPlans", async (req, res) => {
	try {
		const { spaceId, plans } = req.body;

		if (plans[ORDER_PLAN_TYPES.BUY] === "") {
			delete plans[ORDER_PLAN_TYPES.BUY];
		}

		if (plans[ORDER_PLAN_TYPES.MONTHLY] === "") {
			delete plans[ORDER_PLAN_TYPES.MONTHLY];
		}

		if (plans[ORDER_PLAN_TYPES.YEARLY] === "") {
			delete plans[ORDER_PLAN_TYPES.YEARLY];
		}

		await SpaceModel.findByIdAndUpdate(spaceId, {
			plan: plans,
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

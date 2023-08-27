import express from "express";
import Editor from "../../model/Editor.js";
import Stream from "../../model/Stream.js";

const router = express.Router();

router.get("/", (_req, res) => {
	return res.send({
		health: "OK",
	});
});

router.post("/getPosts", async (req, res) => {
	const { spaceID } = req.body;

	try {
		const posts = await Stream.find({
			spaceID,
		});

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
	const { spaceID, content } = req.body;

	try {
		await Stream.create({
			...content,
			spaceID,
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

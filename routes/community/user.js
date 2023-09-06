import express from "express";
import User from "../../service/search/model/User.js";

const router = express.Router();

router.get("/", (_req, res) => {
	return res.send({
		health: "OK",
	});
});

router.get("/getUser", async (req, res) => {
	const { id } = req.query;

	try {
		const user = await User.findById(id);
		res.send({ userData: user });
	} catch (error) {
		res.status(400).send({
			success: false,
			message: `Something went wrong`,
			error,
		});
		console.log(error);
	}
});

router.get("/searchUser", async (req, res) => {
	const { query } = req.query;

	try {
		const users = await User.searchQuery(query);
		res.send({ users });
	} catch (error) {
		res.status(400).send({
			success: false,
			message: `Something went wrong`,
			error,
		});
		console.log(error);
	}
});

export default router;

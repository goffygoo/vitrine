import express from "express";
import Chat from "../../model/Chat.js";

const router = express.Router();

router.get("/", (_req, res) => {
	return res.send({
		health: "OK",
	});
});

router.post("/getAllChats", async (req, res) => {
	try {
		const { userId } = req.body;
		const chats = await Chat.find({
			participants: { $elemMatch: { $eq: userId } },
		}).select({
			messages: 0,
		});

		chats = await Promise.all(
			chats.map((chat) => {
				const partner =
					chat.participants[0] === userId
						? chat.participants[1]
						: chat.participants[0];
				return {
					_id: chat._id,
					partner,
				};
			})
		);

		return res.status(200).send({
			success: true,
			chats,
		});
	} catch (err) {
		return res.status(404).send({
			success: false,
			err,
		});
	}
});

router.post("/getMessages", async (req, res) => {
	try {
		const { chatId } = req.body;
		const chat = await Chat.findById(chatId).select({
			participants: 0,
		});

		return res.status(200).send({
			success: true,
			chat,
		});
	} catch (err) {
		return res.status(404).send({
			success: false,
			err,
		});
	}
});

export default router;

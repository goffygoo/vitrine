import express from "express";
import Chat from "../../model/Chat.js";
import { USER_TYPES } from "../../constants/index.js";
import Consumer from "../../model/Consumer.js";
import Provider from "../../model/Provider.js";
import mongoose from "mongoose";

const router = express.Router();

router.get("/", (_req, res) => {
	return res.send({
		health: "OK",
	});
});

router.post("/getAllChats", async (req, res) => {
	try {
		const { userId } = req.body;
		let chats = await Chat.find({
			participants: { $elemMatch: { id: userId } },
		});

		chats = await Promise.all(
			chats
				.filter((chat) => {
					if (
						chat.messages.length === 0 &&
						chat.openedBy.toString() !== userId
					) {
						return false;
					}
					return true;
				})
				.map(async (chat) => {
					const partnerIndx =
						chat.participants[0].id.toString() === userId ? 1 : 0;
					const Model =
						chat.participants[partnerIndx].userType === USER_TYPES.CONSUMER
							? Consumer
							: Provider;
					const partner = await Model.findById(
						chat.participants[partnerIndx].id
					).select({
						userId: 0,
						spaces: 0,
					});
					return {
						_id: chat._id,
						partner,
						partnerType: chat.participants[partnerIndx].userType,
						messages: chat.messages,
						openedBy: chat.openedBy,
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

router.post("/getChat", async (req, res) => {
	try {
		const { chatId, userId } = req.body;
		const chat = await Chat.findById(chatId);

		if (!chat) {
			return res.status(404).send({
				success: false,
				message: "No Such chat exists",
			});
		}

		const partnerIndx = chat.participants[0].id.toString() === userId ? 1 : 0;
		const Model =
			chat.participants[partnerIndx].userType === USER_TYPES.CONSUMER
				? Consumer
				: Provider;
		const partner = await Model.findById(
			chat.participants[partnerIndx].id
		).select({
			userId: 0,
			spaces: 0,
		});
		let finalData = {
			_id: chat._id,
			partner,
			partnerType: chat.participants[partnerIndx].userType,
			messages: chat.messages,
			openedBy: chat.openedBy,
		};

		return res.status(200).send({
			success: true,
			chat: finalData,
		});
	} catch (err) {
		return res.status(404).send({
			success: false,
			err,
		});
	}
});

router.post("/createChat", async (req, res) => {
	try {
		const { userId, partnerId, userType, partnerType } = req.body;
		if (userId === partnerId) return;
		let chatExists = await Chat.findOne({
			participants: { $elemMatch: { id: partnerId } },
			openedBy: userId,
		});
		if (chatExists) {
			return res.status(200).send({
				success: false,
				message: "Chat Already Present",
			});
		}
		let chat = await Chat.findOne({
			participants: { $elemMatch: { id: userId } },
			openedBy: partnerId,
		});

		if (!chat) {
			chat = await Chat.create({
				messages: [],
				participants: [
					{
						id: userId,
						userType: userType,
					},
					{
						id: partnerId,
						userType: partnerType,
					},
				],
				openedBy: userId,
			});
		} else {
			await Chat.updateOne({ _id: chat._id }, { openedBy: userId });
		}

		const Model = partnerType === USER_TYPES.CONSUMER ? Consumer : Provider;
		const partner = await Model.findById(partnerId).select({
			userId: 0,
			spaces: 0,
		});

		return res.status(200).send({
			success: true,
			chat: {
				_id: chat._id,
				partner,
				partnerType,
				openedBy: userId,
				messages: chat.messages,
			},
		});
	} catch (err) {
		return res.status(404).send({
			success: false,
			err,
		});
	}
});

export default router;

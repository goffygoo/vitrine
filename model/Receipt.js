import mongoose from "mongoose";
import { ORDER_STATUS } from "../constants/index.js";

const { ObjectId } = mongoose.Schema.Types;

const Schema = new mongoose.Schema(
	{
		profileId: {
			type: ObjectId,
			required: true,
		},
		spaceId: {
			type: ObjectId,
			required: true,
		},
		orderId: {
			type: ObjectId,
			required: true,
		},
	},
);

Schema.index({ profileId: 1, spaceId: 1 }, { unique: true });

export default mongoose.model("Receipt", Schema);

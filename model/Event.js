import mongoose from "mongoose";
import { CALENDER_EVENT_SLOT_TYPES, CALENDER_EVENT_TYPES } from "../constants/index.js";

const { ObjectId } = mongoose.Schema.Types;

const Schema = new mongoose.Schema({
    userId: {
        type: ObjectId,
        required: true,
    },
    type: {
        type: String,
        enum: [CALENDER_EVENT_TYPES.CALL],
        required: true,
    },
    slotType: {
        type: String,
        enum: [CALENDER_EVENT_SLOT_TYPES.ALL_DAY, CALENDER_EVENT_SLOT_TYPES.TIMED],
        required: true,
    },
    lockSlot: {
        type: Boolean,
        default: false,
    },
    parentId: {
        type: ObjectId,
        required: true,
    },
    startTime: {
        type: Date,
        required: true,
    },
    endTime: {
        type: Date,
    },
});

export default mongoose.model("Event", Schema);

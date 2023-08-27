import { MODEL_INDEX, USER_TYPES } from "../../../constants/index.js";
import modelEngine from "./modelEngine.js";

const schema = {
	type: "object",
	properties: {
		id: { type: "string" },
		email: { type: "string" },
		name: { type: "string" },
		type: {
			enum: [USER_TYPES.PROVIDER, USER_TYPES.CONSUMER, USER_TYPES.ADMIN],
		},
		profilePicture: { type: String },
	},
	required: ["id", "email", "name", "type"],
};

const sampleData = {
	id: "uuid",
	name: "Helen Mask",
	email: "helenmask@tesla.com",
	type: "PROVIDER",
	profilePicture: "/tempuser.jpg",
};

const User = modelEngine(schema, MODEL_INDEX.USERS);

export default User;

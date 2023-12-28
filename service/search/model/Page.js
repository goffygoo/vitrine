import { MODEL_INDEX } from "../../../constants/index.js";
import modelEngine from "./modelEngine.js";

const schema = {
    type: "object",
    properties: {
        id: { type: "string" },
        banner: { type: "string" },
        profileImg: { type: "string" },
        heading: { type: "string" },
        subHeading: { type: "string" },
        highlights: {
            type: "array",
            items: {
                type: "string",
            },
        },
        description: { type: "string" },
    },
    required: [
        "id",
        "banner",
        "profileImg",
        "heading",
        "subHeading",
        "highlights",
        "description",
    ],
    additionalProperties: false,
};

const sampleData = {
    id: "uuid",
    banner: "url",
    profileImg: "url",
    heading: "heading",
    subHeading: "sub heading",
    highlights: [
        "hightlight1",
        "hightlight2",
        "hightlight3",
        "hightlight4",
    ],
    description: "description goes here",
};

const Page = modelEngine(schema, MODEL_INDEX.PAGES);

export default Page;
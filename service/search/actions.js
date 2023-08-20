import config from "../../constants/config.js";
import { httpRequest } from "../../util/index.js";

const MEILISEARCH_SECRET_KEY = 'SECRET';
const { SEARCH_ENGINE } = config;

const searchConfig = {
    headers: {
        Authorization: `Bearer ${MEILISEARCH_SECRET_KEY}`
    }
};

const addOrReplace = async (data, index) => {
    return httpRequest(
        "post",
        `${SEARCH_ENGINE}/indexes/${index}/documents`,
        data,
        searchConfig
    )
}

const addOrUpdate = async (data, index) => {
    return httpRequest(
        "put",
        `${SEARCH_ENGINE}/indexes/${index}/documents`,
        data,
        searchConfig
    )
}

const getDocumentById = async (id, index) => {
    return httpRequest(
        "get",
        `${SEARCH_ENGINE}/indexes/${index}/documents/${id}`,
        {},
        searchConfig
    );
}

const searchQuery = async (query, index) => {
    return httpRequest(
        "post",
        `${SEARCH_ENGINE}/indexes/${index}/search`,
        {
            q: query
        },
        searchConfig
    );
}

export {
    getDocumentById,
    addOrReplace,
    addOrUpdate,
    searchQuery,
};
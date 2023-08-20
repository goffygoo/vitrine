import config from "../constants/config.js";
import { MODEL_INDEX } from "../constants/index.js";
import { httpRequest } from "../util/index.js";

const pageIndex = MODEL_INDEX.PAGES;

const MEILISEARCH_SECRET_KEY = 'SECRET';
const { SEARCH_ENGINE } = config;

const axiosConfig = {
  headers: {
    Authorization: `Bearer ${MEILISEARCH_SECRET_KEY}`
  }
};

console.log('Index initiation started');
const initiationData = await httpRequest(
  "post",
  `${SEARCH_ENGINE}/indexes`,
  {
    uid: pageIndex,
    primaryKey: "id"
  },
  axiosConfig
);

const { taskUid } = initiationData;

const getTask = async (taskUid, count = 0) => {
  if (count > 5) throw Error('getTask function call limit exceeded');

  const getData = await httpRequest(
    "get",
    `${SEARCH_ENGINE}/tasks/${taskUid}`,
    {},
    axiosConfig
  );

  const { status, error } = getData;

  if (status === 'failed') throw error;
  if (status === 'succeeded') return true;

  if (error) throw {
    message: 'getTask function call failed',
    error,
  };

  setTimeout(() => {
    getTask(taskUid, count + 1);
  }, 1000);
}

await getTask(taskUid);

console.log('Index initiation completed');

await httpRequest(
  "patch",
  `${SEARCH_ENGINE}/indexes/${pageIndex}/settings`,
  {
    displayedAttributes: [
      "id",
      "profileImg",
      "heading",
      "subHeading",
    ],
    searchableAttributes: [
      "heading",
      "subHeading",
      "highlights",
      "description",
    ],
    filterableAttributes: [],
    sortableAttributes: [],
    rankingRules:
      [
        "words",
        "typo",
        "proximity",
        "attribute",
        "sort",
        "exactness"
      ],
    stopWords: [],
    synonyms: {},
    distinctAttribute: null,
    typoTolerance: {
      enabled: true,
      minWordSizeForTypos: {
        oneTypo: 5,
        twoTypos: 9
      },
      disableOnWords: [],
      disableOnAttributes: []
    },
    faceting: {
      maxValuesPerFacet: 100
    },
    pagination: {
      maxTotalHits: 1000
    }
  },
  axiosConfig
)

console.log('Index updation completed');

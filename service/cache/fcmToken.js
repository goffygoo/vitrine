const TokenTable = {};

const getTokens = profileId => {
    return TokenTable[profileId] || new Set();
}

const addToken = (profileId, token) => {
    if (!TokenTable[profileId]) TokenTable[profileId] = new Set();
    TokenTable[profileId].add(token);
}

const deleteToken = (profileId, token) => {
    TokenTable[profileId]?.delete(token);
}

const clear = () => {
    TokenTable.clear();
}

const FCMToken = {
    getTokens,
    addToken,
    deleteToken,
    clear
};

export default FCMToken;

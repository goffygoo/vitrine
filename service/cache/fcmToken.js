const TokenTable = new Map();

const getTokens = userId => {
    return TokenTable.get(userId) || [];
}

const addToken = (userId, token) => {
    const previousValue = getTokens(userId);
    if (![previousValue].includes(token))
        TokenTable.set(userId, [...previousValue, token]);
}

const deleteToken = (userId, token) => {
    const newValue = getIds(userId).filter(id => id !== token);
    if (newValue.length === 0) TokenTable.delete(userId);
    else TokenTable.set(userId, newValue);
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

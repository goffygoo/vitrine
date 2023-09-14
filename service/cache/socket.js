const SocketTable = new Map();

const getIds = userId => {
    return SocketTable.get(userId) || [];
}

const addId = (userId, socketId) => {
    SocketTable.set(userId, [...getIds(userId), socketId]);
}

const deleteId = (userId, socketId) => {
    const newValue = getIds(userId).filter(id => id !== socketId);
    if (newValue.length === 0) SocketTable.delete(userId);
    else SocketTable.set(userId, newValue);
}

const isOnline = (userId) => {
    return getIds(userId).length !== 0;
}

const clear = () => {
    SocketTable.clear();
}

const Socket = {
    getIds,
    addId,
    deleteId,
    isOnline,
    clear
};

export default Socket;

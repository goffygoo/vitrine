const SocketTable = {};

const getIds = (profileId) => {
  return SocketTable[profileId] || new Set();
};

const addId = (profileId, socketId) => {
  if (!SocketTable[profileId]) SocketTable[profileId] = new Set();
  SocketTable[profileId].add(socketId);
};

const deleteId = (profileId, socketId) => {
  SocketTable[profileId]?.delete(socketId);
};

const isOnline = (profileId) => {
  return getIds(profileId).size !== 0;
};

const clear = () => {
  SocketTable.clear();
};

const log = () => {
  console.log(SocketTable);
}

const Socket = {
  getIds,
  addId,
  deleteId,
  isOnline,
  clear,
  log,
};

export default Socket;

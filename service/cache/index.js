import Switch from "./switch.js";
import Socket from "./socket.js";

const clearCache = () => {
  Switch.clear();
  Socket.clear();
}

const Cache = {
  Switch,
  Socket,
  clearCache
};

export default Cache;

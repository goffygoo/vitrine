import Switch from "./switch.js";
import Socket from "./socket.js";
import FCMToken from "./fcmToken.js";

const clearCache = () => {
  Switch.clear();
  Socket.clear();
  FCMToken.clear();
}

const Cache = {
  Switch,
  Socket,
  FCMToken,
  clearCache
};

export default Cache;

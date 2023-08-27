import Events from "./events.js";
import Switch from "./switch.js";

const clearCache = () => {
  Events.clear();
}

const Cache = {
  Events,
  Switch,
  clearCache
};

export default Cache;

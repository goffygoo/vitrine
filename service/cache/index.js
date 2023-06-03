import Events from "./events.js";

const clearCache = () => {
  Events.clear();
}

const Cache = {
  Events,
  clearCache
};

export default Cache;

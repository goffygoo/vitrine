const EventTable = new Map();
const ResetFlagSet = new Set();

const hasEvents = userId => {
    return EventTable.has(userId);
}

const getEvents = userId => {
    return EventTable.get(userId);
}

const setEvents = (userId, event) => {
    EventTable.set(userId, event);
}

const hasResetFlag = userId => {
    return ResetFlagSet.has(userId);
}

const addResetFlag = userId => {
    ResetFlagSet.add(userId);
}

const clearResetFlag = userId => {
    ResetFlagSet.clear(userId)
}

const clear = () => {
    EventTable.clear();
    ResetFlagTable.clear();
}

const Events = {
    hasEvents,
    getEvents,
    setEvents,
    hasResetFlag,
    addResetFlag,
    clearResetFlag,
    clear
};

export default Events;

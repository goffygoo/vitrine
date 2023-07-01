const joinChat = (socket) => {
    socket.on("join-chat", (classID) => {
        socket.join("")
    })
}

const registerEvents = socket => {
    joinChat(socket);
}

const Events = {
    registerAll
};

export default Events;

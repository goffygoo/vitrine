import { Server } from "socket.io";

let io;

export const initConnection = (server) => {
  io = new Server(server, {
    cors: {
      origin: "*",
      methods: ["GET", "POST"],
    },
  });

  io.on("connection", (socket) => {
    console.log(`User Connected : ${socket.id}`);

    socket.on("ping", () => {
      console.log("Message sent");
      emit("reply", 200);
    });
  });
};

export const emit = (event, data) => {
  io.emit(event, data);
};

export default io;

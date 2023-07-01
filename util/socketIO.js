import { Server } from "socket.io";

const SOCKET_TOKEN = "SOCKET_TOKEN";

let io;

export const initConnection = (server) => {
  io = new Server(server, {
    cors: {
      origin: "*",
      methods: ["GET", "POST"],
    },
  });

  io.use((socket, next) => {
    next();
    // const token = socket.handshake.auth.token;
    // if (token === SOCKET_TOKEN) {
    //   next();
    // } else {
    //   next(new Error("Invalid Connection"))
    // }
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

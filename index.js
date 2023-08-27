import express from "express";
import cors from "cors";
import _db from "./util/db.js";
import router from "./routes/index.js";
import http from "http";
import { initConnection, emit } from "./util/socketIO.js";
import initScheduler from "./util/scheduler.js";
const app = express();

const PORT = process.env.PORT || 5000;

app.use(express.json({ limit: "20mb", extended: true }));
app.use(express.urlencoded({ limit: "20mb", extended: true }));
app.use(cors());

const server = http.Server(app);

initConnection(server);
initScheduler();

app.use("/api", router);

server.listen(PORT, () => {
	console.log(`Server starting in port: ${PORT}`);
});

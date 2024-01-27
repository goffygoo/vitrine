import express from "express";
import cors from "cors";
import _db from "./util/db.js";
import router from "./routes/index.js";
import webhooks from './util/webhooks/index.js'
import http from "http";
import { initConnection } from "./util/socketIO.js";
import initScheduler from "./util/scheduler.js";
import { applicationDefault, initializeApp } from 'firebase-admin/app';
initializeApp({ credential: applicationDefault() })

const app = express();
const PORT = process.env.PORT || 5000;

app.use('/webhooks', webhooks);

app.use(express.json({ limit: "1mb", extended: true }));
app.use(express.urlencoded({ limit: "1mb", extended: true }));
app.use(cors());

const server = http.Server(app);

initConnection(server);
initScheduler();

app.use("/api", router);

server.listen(PORT, () => {
	console.log(`Server starting in port: ${PORT}`);
});

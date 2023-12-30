import express from "express";
import cors from "cors";
import _db from "./util/db.js";
import router from "./routes/index.js";
import webhooks from './util/webhooks/index.js'
import http from "http";
import { initConnection } from "./util/socketIO.js";
import initScheduler from "./util/scheduler.js";
import { applicationDefault, initializeApp } from 'firebase-admin/app';
import admin from 'firebase-admin';
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

const token1 = 'd3fH_F6IQOapY30YpnB2ez:APA91bETZx9IPEGkhZgEXUPLymWgtkzY4A7obFXa1_4YCUT_bZghr7oa-FqxE6lfmpk1Xi7tbpYQxtbCsfAYUdG-ahJyuL2FBlXrATwu2uBGEXKEtELloOdYoc4o_nC47Q9EXxiE1n7c'
const token2 = 'd3fH_F6IQOapY30YpnB2ez:APA91bF-8sVSxoIuUnemCp2vLB1xZ5OGgIaUrR_k6fz5ME7HGxAcrjrxnExvaIgH2hAH3knsGHsw0OIa8EmqyOKuKa_DuCMjqrF84uUMX3yQ9cRyF2YMGGv0NN4Q2mb58MVgYsk1UHoI'

app.get('/', async (_req, res) => {
	// await admin.messaging().sendEachForMulticast({
	// 	tokens: [token1, token2],
	// 	data: {
	// 		title: "heading",
	// 		body: "description goes here",
	// 	},
	// 	notification: {
	// 		title: "heading",
	// 		body: "description goes here",
	// 	},
	// }).then(response => {
	// 	console.log('Successfully sent message:', response);
	// 	console.log('error:', response.responses[0].error);
	// }).catch(error => {
	// 	console.log('Error sending message:', error);
	// });

	return res.send({ "ok": "ok" })
})

app.use("/api", router);

server.listen(PORT, () => {
	console.log(`Server starting in port: ${PORT}`);
});

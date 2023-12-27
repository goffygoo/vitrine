import express from 'express';
import Page from '../../service/search/model/Page.js';

const router = express.Router();

router.get('/', (_req, res) => {
	return res.send({
		health: 'OK',
	});
});

router.get('/get', async (req, res) => {
	const { id } = req.query;

	try {
		const page = await Page.findById(id);
		res.send({ pageData: page });
	} catch (_e) {
		res.sendStatus(400);
	}
});

router.post("/createOrUpdate", async (req, res) => {
	const { data } = req.body;
	try {
		const task = await Page.createOrUpdateOne(data);
		return res.send(task);
	} catch (_e) {
		return res.sendStatus(400);
	}
});

export default router;

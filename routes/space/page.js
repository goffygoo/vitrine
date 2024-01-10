import express from 'express';
import Page from '../../service/search/model/Page.js';
import SpaceModel from '../../model/SpaceModel.js';
import { verifyProvider } from '../middleware.js';

const router = express.Router();

router.get('/', (_req, res) => {
	return res.send({
		health: 'OK',
	});
});

router.post("/createOrUpdate", verifyProvider,async (req, res) => {
	const { data } = req.body;
	const spaceId = data.id;
	const { price, ...pageData } = data;
	try {
		if (!Number.isInteger(price) || price < 0 || price > 2000) throw new Error();
		const space = await SpaceModel.findByIdAndUpdate(spaceId, {
			price
		});
		if (!space) throw new Error();
		const task = await Page.createOrUpdateOne(pageData);
		return res.send(task);
	} catch (_e) {
		return res.sendStatus(400);
	}
});

export default router;

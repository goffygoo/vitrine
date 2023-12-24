import express from 'express';
import User from '../../model/User.js';
import config from '../../constants/config.js';
import jwt from 'jsonwebtoken';
import axios from 'axios';

const {
	GOOGLE_CLIENT_ID,
	GOOGLE_CLIENT_SECRET,
	GOOGLE_TOKEN_URL,
	JWT_SECRET_KEY,
} = config;

const ACCESS_TOKEN_EXPIRE_TIME = '30m';

const router = express.Router();

router.get('/', (_req, res) => {
	return res.send({
		health: 'OK',
	});
});

router.post('/newAccessToken', async (req, res) => {
	const { userId, refreshToken } = req.body;

	try {
		const user = await User.findById(userId).select({
			refreshToken: 1,
			profileId: 1,
			tokenEAT: 1,
			type: 1,
		});

		if (
			!(
				user &&
				user.refreshToken === refreshToken &&
				Date.now() < user.tokenEAT
			)
		) {
			return res.status(400).send({
				success: false,
				message: `Invaild token or id. Login Again`,
			});
		}

		const payload = {
			userId,
			type: user.type,
			profileId: user.profileId,
		};

		const accessToken = jwt.sign(payload, JWT_SECRET_KEY, {
			expiresIn: ACCESS_TOKEN_EXPIRE_TIME,
		});

		return res.send({
			accessToken,
		});
	} catch (err) {
		return res.status(404).send({
			message: 'error in refreshing access token',
		});
	}
});

router.post('/logoutEverywhere', async (req, res) => {
	const { userId } = req.body;

	try {
		await User.findByIdAndUpdate(userId, {
			refreshToken: '',
			tokenEAT: 0,
		});

		return res.send({
			success: true,
			message: 'Log out initiated',
		});
	} catch (err) {
		return res.status(400).send({
			success: false,
			message: `Invaild id`,
		});
	}
});

router.post('/googleAuth', async (req, res) => {
	const { code } = req.body;

	axios
		.post(
			GOOGLE_TOKEN_URL,
			{
				code,
				client_id: GOOGLE_CLIENT_ID,
				client_secret: GOOGLE_CLIENT_SECRET,
				redirect_uri: 'http://localhost:3000/auth',
				grant_type: 'authorization_code',
			},
			{}
		)
		.then(({ data }) => {
			const { access_token, refresh_token } = data;

			res.send({
				googleAuth: {
					access_token,
					refresh_token,
				},
			});
		})
		.catch((err) => {
			console.log(err);
			res.status(400).send(err);
		});
});

export default router;

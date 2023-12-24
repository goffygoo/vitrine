// TODO: add a route for adding refresh token to db
// TODO: add a function to get access token
import { verifyAccessToken } from "../middleware.js";
import config from "../../constants/config.js";
import axios from "axios";
import express from "express";
import User from "../../model/User.js";

const router = express.Router();

const { GOOGLE_CLIENT_ID, GOOGLE_CLIENT_SECRET, GOOGLE_TOKEN_URL } = config;

router.post(
  "/updateGoogleRefreshToken",
  verifyAccessToken,
  async (req, res) => {
    const { code } = req.body;
    try {
      const response = await axios.post(GOOGLE_TOKEN_URL, {
        code,
        client_id: GOOGLE_CLIENT_ID,
        client_secret: GOOGLE_CLIENT_SECRET,
        redirect_uri: "http://localhost:3000/integration/google/callback",
        grant_type: "authorization_code",
      });

      const { data } = response;
      const { userId } = res.locals.data;

      const { refresh_token } = data;
      await User.findByIdAndUpdate(userId, { googleAuth: refresh_token });
      return res.status(200).send({
        success: true,
      });
    } catch (err) {
      console.log(err);
      res.status(400).send(err);
    }
  }
);

export default router
import express from "express";
import User from "../../model/User.js";
import jwt from "jsonwebtoken";
import axios from "axios";

const SECRET = "SECRET";
const CLIENT_ID =
  "611755391410-8cin2sd35dg0o3p04d46a7qn9fpfsjcp.apps.googleusercontent.com";
const CLIENT_SECRET = "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";
const GOOGLE_TOKEN_URL = "https://oauth2.googleapis.com/token";
const CALANDER_API_KEY = "AIzaSyBfDJ2N6w6cUbzK5lQNczliBGHv_rgC57U";

const ACCESS_TOKEN_EXPIRE_TIME = "30m";

const router = express.Router();

router.get("/", (_req, res) => {
  return res.send({
    health: "OK",
  });
});

router.post("/newAccessToken", async (req, res) => {
  const { id, refreshToken } = req.body;

  const user = await User.findById(id).select({
    refreshToken: 1,
    tokenEAT: 1,
    type: 1,
  });

  if (
    !(user && user.refreshToken === refreshToken && Date.now() < user.tokenEAT)
  ) {
    return res.status(400).send({
      success: false,
      message: `Invaild token or id. Login Again`,
    });
  }

  const payload = {
    id,
    type: user.type,
  };

  const accessToken = jwt.sign(payload, SECRET, {
    expiresIn: ACCESS_TOKEN_EXPIRE_TIME,
  });

  return res.send({
    accessToken,
  });
});

router.post("/logoutEverywhere", async (req, res) => {
  const { userId } = req.body;

  try {
    await User.findByIdAndUpdate(userId, {
      refreshToken: "",
      tokenEAT: 0,
    });

    return res.send({
      success: true,
      message: "Log out initiated",
    });
  } catch (err) {
    return res.status(400).send({
      success: false,
      message: `Invaild id`,
    });
  }
});

router.post("/googleAuth", async (req, res) => {
  const { code } = req.body;

  axios
    .post(
      GOOGLE_TOKEN_URL,
      {
        code,
        client_id: CLIENT_ID,
        client_secret: CLIENT_SECRET,
        redirect_uri: "http://localhost:3000/auth",
        grant_type: "authorization_code",
      },
      {}
    )
    .then(({ data }) => {
      res.send(data);
    })
    .catch((err) => {
      console.log(err);
      res.status(400).send(err);
    });
});

export default router;

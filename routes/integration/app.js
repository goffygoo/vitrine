import express from "express";
import { verifyAccessToken } from "../middleware.js";
import Cache from "../../service/cache/index.js";

const router = express.Router();

router.get("/", (_req, res) => {
    return res.send({
        health: "OK",
    });
});

router.post("/init", verifyAccessToken, (req, res) => {
    const { fcmToken } = req.body;
    const { profileId } = res.locals.data;
    Cache.FCMToken.addToken(profileId, fcmToken);
    res.sendStatus(200);
})

export default router;
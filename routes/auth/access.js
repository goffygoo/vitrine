import express from "express";
import User from "../../model/User.js";
import jwt from 'jsonwebtoken'

const SECRET = "SECRET";

const ACCESS_TOKEN_EXPIRE_TIME = '30m';

const router = express.Router();

router.get("/", (_req, res) => {
    return res.send({
        "health": "OK"
    })
})

router.post("/newAccessToken", async (req, res) => {
    const { id, refreshToken } = req.body;

    const user = await User.findById(id).select({
        refreshToken: 1,
        tokenEAT: 1,
        type: 1
    })

    if (!(user && user.refreshToken === refreshToken && Date.now() < user.tokenEAT)) {
        return res.status(400).send({
            success: false,
            message: `Invaild token or id. Login Again`,
        });
    }

    const payload = {
        id,
        type: user.type
    };

    const accessToken = jwt.sign(payload, SECRET, { expiresIn: ACCESS_TOKEN_EXPIRE_TIME });

    return res.send({
        accessToken
    })
})

router.post("/logoutEverywhere", async (req, res) => {
    const { id } = req.body;

    try {
        await User.findByIdAndUpdate(id, {
            refreshToken: "",
            tokenEAT: 0
        })
        
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
})

export default router;
import express from "express";
import google from './google.js'

const router = express.Router();

router.get("/", (_req, res) => {
    return res.send({
        "health": "OK"
    })
});

router.use('/google', google);

export default router;
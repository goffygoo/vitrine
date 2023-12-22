import express from "express";
import google from './google.js'
import app from './app.js'

const router = express.Router();

router.get("/", (_req, res) => {
    return res.send({
        "health": "OK"
    })
});

router.use('/google', google);
router.use('/app', app);

export default router;
import express from "express";
import space from "./space.js";

const router = express.Router();

router.get("/", (_req, res) => {
    return res.send({
        "health": "OK"
    })
});

router.use('/space', space);

export default router;
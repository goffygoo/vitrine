import express from "express";
import auth from "./auth/index.js";
import teacher from "./teacher/index.js";

const router = express.Router();

router.get("/", (_req, res) => {
    res.send({
        "health": "OK"
    })
});

router.use('/auth', auth);
router.use('/teacher', teacher);

export default router;
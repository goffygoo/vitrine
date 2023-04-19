import express from "express";
import user from "./user.js";
import access from "./access.js";

const router = express.Router();

router.get("/", (_req, res) => {
    return res.send({
        "health": "OK"
    })
});

router.use('/user', user);
router.use('/access', access);

export default router;
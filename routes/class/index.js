import express from "express";
import essential from "./essential.js";
import calender from "./calender.js";

const router = express.Router();

router.get("/", (_req, res) => {
    return res.send({
        "health": "OK"
    })
});

router.use('/essential', essential);
router.use('/calender', calender)

export default router;
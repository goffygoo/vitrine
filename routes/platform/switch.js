import express from "express";
import Cache from "../../service/cache/index.js";

const router = express.Router();

router.get("/", (_req, res) => {
    return res.send({
        health: "OK",
    });
});

router.get("/featureKey", (req, res) => {
    const { key } = req.query;
    return Cache.Switch.getFeature(key);
})

export default router;

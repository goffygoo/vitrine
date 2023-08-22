import express from "express";
import Cache from "../../service/cache/index.js";

const router = express.Router();

router.get("/", (_req, res) => {
    return res.send({
        health: "OK",
    });
});

router.get("/allFeatureKeys", (_req, res) => {
    return res.send({
        features: Cache.Switch.getAllFeatures()
    })
})

router.patch("/feature", (req, res) => {
    const { key, value } = req.body;
    Cache.Switch.setFeature(key, value);
    return res.send({ success: true });
})

router.delete("/feature", (req, res) => {
    const { key } = req.query;
    Cache.Switch.deleteFeature(key);
    return res.send({ success: true });
})

export default router;

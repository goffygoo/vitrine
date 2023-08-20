import express from "express";
import Page from "../../service/search/model/Page.js";

const router = express.Router();

router.get("/", (_req, res) => {
    return res.send({
        "health": "OK"
    })
});

router.get("/getPage", async (req, res) => {
    const { id } = req.query;

    try {
        const page = await Page.findById(id);
        res.send({ pageData: page });
    } catch (error) {
        res.status(400).send({
            success: false,
            message: `Something went wrong`,
            error,
        });
        console.log(error);
    }
})

router.get("/searchPage", async (req, res) => {
    const { query } = req.query;

    try {
        const pages = await Page.searchQuery(query);
        res.send({ pages });
    } catch (error) {
        res.status(400).send({
            success: false,
            message: `Something went wrong`,
            error,
        });
        console.log(error);
    }
})

export default router;
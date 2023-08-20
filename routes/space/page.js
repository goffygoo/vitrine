import express from "express";
import Page from "../../service/search/model/Page.js";

const router = express.Router();

router.get("/", (_req, res) => {
    return res.send({
        "health": "OK"
    })
});

router.get("/get", async (req, res) => {
    const { id } = req.query;

    try {
        const page = await Page.findById(id);
        res.send({ pageData: page });
    } catch (err) {
        res.status(400).send({
            success: false,
            message: `Something went wrong`,
            err,
        });
        console.log(err);
    }
})

router.post("/create", async (req, res) => {
    const { data, spaceId } = req.body;
    let pageNotFound = false;

    try {
        try {
            const page = await Page.findById(spaceId);
            if (page) return res.status(400).send({
                success: false,
                message: `Page already exist`,
            });;
        } catch (error) {
            if (error?.error?.code !== "document_not_found") throw error;
            pageNotFound = true;
        }
        const task = await Page.createOrReplaceOne({...data, id: spaceId});
        return res.send(task);
    } catch (error) {
        res.status(400).send({
            success: false,
            message: `Something went wrong`,
            error,
        });
        console.log(error);
    }
})

router.post("/replace", async (req, res) => {
    const { data, spaceId } = req.body;

    try {
        const task = await Page.createOrReplaceOne({...data, id: spaceId});
        return res.send(task);
    } catch (error) {
        res.status(400).send({
            success: false,
            message: `Something went wrong`,
            error,
        });
        console.log(error);
    }
})

router.post("/update", async (req, res) => {
    const { data, spaceId } = req.body;

    try {
        const task = await Page.createOrUpdateOne({...data, id: spaceId});
        return res.send(task);
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
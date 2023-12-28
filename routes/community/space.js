import express from "express";
import Page from "../../service/search/model/Page.js";
import SpaceModel from "../../model/SpaceModel.js";
import Provider from "../../model/Provider.js";
import Presentation from "../../model/Presentation.js";
import { PRESENTATION_TAGS } from "../../constants/index.js";

const router = express.Router();

router.get("/", (_req, res) => {
    return res.send({
        "health": "OK"
    })
});

router.get("/page", async (req, res) => {
    const { id } = req.query;
    try {
        const page = await Page.findById(id);
        const space = await SpaceModel.findById(id).select({
            price: 1,
            consumer: 1,
            streams: 1,
            provider: 1,
        });
        const provider = await Provider.findById(space.provider).select({
            instagram: 1,
            x: 1,
            linkedIn: 1,
        });
        return res.send({
            pageData: page,
            space: {
                price: space.price,
                consumer: space.consumer.length,
                streams: space.streams.length,
                socialMedia: {
                    instagram: provider.instagram,
                    x: provider.x,
                    linkedIn: provider.linkedIn,
                }
            }
        });
    } catch (_e) {
        return res.sendStatus(400);
    }
})

router.get("/featured", async (req, res) => {
    try {
        const object = await Presentation.findOne({
            tag: PRESENTATION_TAGS.FEATURED_PAGES,
        });
        const featuredIds = object?.data || [];
        const spaces = await SpaceModel.find({ _id: { $in: featuredIds } }).select({
            price: 1,
            consumer: 1,
            streams: 1,
        })
        const pages = await Promise.all(featuredIds.map(id => Page.findById(id)));
        const responseData = pages.map((page, index) => {
            return {
                pageData: page,
                space: {
                    price: spaces[index].price,
                    consumer: spaces[index].consumer.length,
                    streams: spaces[index].streams.length,
                }
            }
        })
        return res.send(responseData);
    } catch (_e) {
        return res.sendStatus(400);
    }
})

router.get("/search", async (req, res) => {
    const { query } = req.query;

    try {
        const queryResponse = await Page.searchQuery(query);
        const pages = queryResponse.hits;
        const spaceIds = pages.map(page => page.id);
        const spaces = await SpaceModel.find({ _id: { $in: spaceIds } }).select({
            price: 1,
            consumer: 1,
            streams: 1,
        })
        const responseData = pages.map((page, index) => {
            return {
                pageData: page,
                space: {
                    price: spaces[index].price,
                    consumer: spaces[index].consumer.length,
                    streams: spaces[index].streams.length,
                }
            }
        })
        return res.send(responseData);
    } catch (_e) {
        console.log(_e)
        return res.sendStatus(400);
    }
})

export default router;
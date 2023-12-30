import express from "express";
import { HEADERS } from "../../constants/index.js";
import config from "../../constants/config.js";
import { createHmac } from 'crypto'
import Monet from "../../service/monet/index.js";

const router = express.Router();

router.use(express.json({
    limit: "1mb",
    extended: true,
    verify: function (req, _res, buf) {
        const signature = req.headers[HEADERS.RAZORPAY_SIGNATURE];
        const secret = config.RAZORPAY_WEBHOOK_SECRET;
        if (createHmac('sha256', secret).update(buf).digest('hex') !== signature) {
            throw new Error();
        }
    }
}))

router.post('/', async (req, res) => {
    try {
        res.sendStatus(200);
        const checkPayment = req.body.payload.payment.entity;
        await Monet.Order.confirmPayment(undefined, checkPayment);
    } catch (e) {
        res.sendStatus(400);
    }
})

export default router;

import express from "express";
import razorpay from './razorpay.js';

const router = express.Router();

router.use('/razorpay', razorpay);

export default router;

import { ORDER_STATUS, PG_PAYMENT_STATUS } from "../../constants/index.js"
import Consumer from "../../model/Consumer.js";
import Order from "../../model/Order.js"
import Receipt from "../../model/Receipt.js";
import SpaceModel from "../../model/SpaceModel.js";
import db from "../../util/db.js";
import Payment from "./payment.js";

const paymentFailed = async ({
    pgPaymentId,
    orderId
}) => {
    const order = await Order.findById(orderId);
    if (order.status === ORDER_STATUS.PENDING) {
        await Order.findByIdAndUpdate(order._id, {
            status: ORDER_STATUS.FAILED,
            pgPaymentId
        })
    }
    return {
        paymentSuccess: false,
    }
}

const paymentSuccess = async ({
    pgPaymentId,
    orderId
}) => {
    let session = null;

    try {
        session = await db.startSession();
        session.startTransaction();

        const order = await Order.findById(orderId).session(session);
        if (!order || (order.status === ORDER_STATUS.SUCCESS)) {
            await session.abortTransaction();
            return {
                paymentSuccess: true,
            }
        }
        const prevReceipt = await Receipt.findOne({
            profileId: order.profileId,
            spaceId: order.spaceId
        }).session(session);
        if (prevReceipt) {
            await session.abortTransaction();
            return {
                refundPayment: true,
            }
        }
        await Order.findByIdAndUpdate(orderId, {
            status: ORDER_STATUS.SUCCESS,
            pgPaymentId
        }).session(session);
        const createResp = await Receipt.create(
            [
                {
                    orderId: order._id,
                    profileId: order.profileId,
                    spaceId: order.spaceId,
                }
            ],
            { session }
        );
        const receipt = createResp[0];

        await session.commitTransaction();
        return { receipt };
    } catch (e) {
        await session.abortTransaction();
        return {
            paymentSuccess: false,
        }
    } finally {
        await session.endSession();
    }
}

const refundOrder = async ({
    pgPaymentId,
    orderId
}) => {
    return Order.findByIdAndUpdate(orderId, {
        status: ORDER_STATUS.REFUNDED,
        pgPaymentId
    })

    return
}

const joinSpace = async (receipt) => {
    const {
        _id,
        spaceId,
        profileId,
    } = receipt;

    let session = null;

    try {
        session = await db.startSession();
        session.startTransaction();
        await Consumer.findByIdAndUpdate(profileId, {
            $push: { spaces: spaceId }
        }).session(session)
        await SpaceModel.findByIdAndUpdate(spaceId, {
            $push: { consumer: profileId }
        }).session(session)
        await session.commitTransaction();
        return true;
    } catch (e) {
        await session.abortTransaction();
        return false
    } finally {
        await session.endSession();
    }
}

const leaveSpace = async () => { }

const confirmPayment = async (pgPaymentId, checkPaymentPre) => {
    const checkPayment = checkPaymentPre ?? await Payment.checkPaymentStatus(pgPaymentId);

    const params = {
        pgPaymentId,
        orderId: checkPayment.notes.orderId
    }

    let paymentResponse = {};

    if (checkPayment.status === PG_PAYMENT_STATUS.CAPTURED) {
        paymentResponse = await paymentSuccess(params);
    } else if (checkPayment.status === PG_PAYMENT_STATUS.FAILED) {
        paymentResponse = await paymentFailed(params);
    }

    if (paymentResponse.refundPayment) {
        await refundOrder(params);
        return {
            refundPayment: true
        }
    }

    if (paymentResponse.receipt) {
        const resp = await joinSpace(paymentResponse.receipt);
        return {
            paymentSuccess: resp
        }
    }

    return {
        paymentSuccess: paymentResponse.paymentSuccess || false
    };
}

const OrderModule = {
    confirmPayment,
};

export default OrderModule;

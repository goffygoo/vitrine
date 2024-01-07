import express from "express";
import space from "./space.js";
import user from "./user.js";
import Monet from "../../service/monet/index.js";

const router = express.Router();

router.get("/", (_req, res) => {
  return res.send({
    health: "OK",
  });
});

router.post("/paymentRedirect", async (req, res) => {
  if (req.body.error) {
    return res.redirect(`http://localhost:3000/confirmpayment?success=false`);
  }
  const successObj = await Monet.Order.confirmPayment(
    req.body.razorpay_payment_id
  );
  let success = "Refund";
  if (successObj.paymentSuccess) success = successObj.paymentSuccess;
  return res.redirect(
    `http://localhost:3000/confirmpayment?success=${success}`
  );
});

router.use("/space", space);
router.use("/user", user);

export default router;

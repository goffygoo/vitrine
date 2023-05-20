import express from "express";
import auth from "./auth/index.js";
import teacher from "./teacher/index.js";
import student from "./student/index.js";
import classRoute from "./class/index.js";

const router = express.Router();

router.get("/", (_req, res) => {
  return res.send({
    health: "OK",
  });
});

router.use("/auth", auth);
router.use("/teacher", teacher);
router.use("/student", student);
router.use("/class", classRoute);

export default router;

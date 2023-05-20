import express from "express";
import classAction from "./classAction.js";
import profile from "./profile.js";
import { HEADERS, USER_TYPES } from "./../../constants/index.js";
import User from "../../model/User.js";
import Teacher from "../../model/Teacher.js";
import ClassModel from "../../model/ClassModel.js";
import db from "../../util/db.js";

const { USER_ID } = HEADERS;

const router = express.Router();

router.get("/", (_req, res) => {
  return res.send({
    health: "OK",
  });
});

const validateTeacher = async (req, res, next) => {
  // const id = req.headers[USER_ID]

  // const user = await User.findById(id).select({
  //     "type": 1
  // })

  // if (!user || user.type !== USER_TYPES.TEACHER) {
  //     return res.status(400).send({
  //         success: false,
  //         message: "Not a valid teacher profile",
  //     });
  // }

  next();
};

router.use("/class", validateTeacher, classAction);
router.use("/profile", profile);

router.get("/getAllClasses", validateTeacher, async (req, res) => {
  const id = req.query.profileId;

  const teacher = await Teacher.findById(id).select({
    classes: 1,
  });

  if (!teacher)
    return res.status(401).send({
      success: false,
      message: "Could not find the teacher",
    });

  const idList = teacher.classes;

  const classes = await ClassModel.find({
    _id: {
      $in: idList,
    },
  });

  return res.send({
    classes,
  });
});

router.post("/createClass", async (req, res) => {
  const { profileId, title } = req.body;

  let session = null,
    classObj;

  db.startSession()
    .then((_session) => {
      session = _session;

      session.startTransaction();
      return ClassModel.create(
        [
          {
            title,
            teacher: profileId,
          },
        ],
        { session }
      );
    })
    .then(([arg]) => {
      classObj = arg;

      return Teacher.findByIdAndUpdate(profileId, {
        $push: { classes: classObj._id },
      });
    })
    .then(() => {
      return session.commitTransaction();
    })
    .then(() => {
      return res.send({ class: classObj });
    })
    .catch((err) => {
      res.status(400).send({
        success: false,
        message: `Something went error: ${err}`,
      });
      return session.abortTransaction();
    })
    .finally(() => {
      return session.endSession();
    });
});

export default router;

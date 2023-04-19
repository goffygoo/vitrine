import express from "express";

import classAction from "./classAction.js"
import { USER_ID } from "./../../constants/header.js"
import User from "../../model/User.js";
import Student from "../../model/Student.js";
import ClassModel from "../../model/ClassModel.js";
import db from "../../util/db.js";

const router = express.Router();

router.get("/", (_req, res) => {
    return res.send({
        "health": "OK"
    })
});

const validateStudent = async (req, res, next) => {
    // const id = req.headers[USER_ID]

    // const user = await User.findById(id).select({
    //     "type": 1
    // })

    // if (!user || user.type !== "STUDENT") {
    //     return res.status(400).send({
    //         success: false,
    //         message: "Not a valid student profile",
    //     });
    // }

    next()
}

router.use("/class", validateStudent, classAction)

router.get("/getAllClasses", validateStudent, async (req, res) => {
    const id = req.query.id;

    const student = await Student.findById(id).select({
        "classes": 1
    });

    if (!student) return res.status(401).send({
        success: false,
        message: "Could not find the student",
    })

    const idList = student.classes

    const classes = await ClassModel.find({
        '_id': {
            $in: idList
        }
    })

    return res.send({
        classes
    })
})

router.post("/joinClass", validateStudent, async (req, res) => {
    const { student_id, class_id } = req.body

    let session = null;

    db.startSession().then((_session) => {
        session = _session;

        session.startTransaction();
        return Student.findByIdAndUpdate(student_id, {
            $push: { classes: class_id }
        })
    }).then(() => {

        return ClassModel.findByIdAndUpdate(class_id, {
            $push: { students: student_id }
        })
    }).then(() => {
        return session.commitTransaction()
    }).then(() => {
        return res.send({ success: true });
    }).catch((err) => {
        res.status(400).send({
            success: false,
            message: `Something went error: ${err}`,
        });
        return session.abortTransaction()
    }).finally(() => {
        return session.endSession()
    })
})

export default router;
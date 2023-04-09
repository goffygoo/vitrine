import express from "express";

import classAction from "./classAction.js"
import { USER_ID } from "./../../constants/header.js"
import User from "../../model/User.js";
import Teacher from "../../model/Teacher.js";
import ClassModel from "../../model/ClassModel.js";

const router = express.Router();

router.get("/", (_req, res) => {
    res.send({
        "health": "OK"
    })
});

const validateTeacher = async (req, res, next) => {
    const id = req.headers[USER_ID]

    const user = await User.findById(id).select({
        "type": 1
    })

    if (!user || user.type !== "TEACHER") {
        return res.status(400).send({
            success: false,
            message: "Not a valid teacher profile",
        });
    }

    next()
}

router.use("/class", validateTeacher, classAction)

router.get("/getAllClasses", validateTeacher, async (req, res) => {
    const id = req.query.id;

    const teacher = await Teacher.findById(id).select({
        "classes": 1
    });

    if (!teacher) return res.status(401).send({
        success: false,
        message: "Could not find the teacher",
    })

    const idList = teacher.classes

    const classes = await ClassModel.find({
        '_id': {
            $in: idList
        }
    })

    return res.send({
        classes
    })
})

export default router;
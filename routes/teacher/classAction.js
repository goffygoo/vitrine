import express from "express";

import ClassModel from "../../model/ClassModel.js";
import Teacher from "../../model/Teacher.js";
import db from "../../util/db.js";

const router = express.Router();

router.get("/", (_req, res) => {
    res.send({
        "health": "OK"
    })
});

router.post("/createClass", async (req, res) => {
    const { teacher_id, title } = req.body

    let session = null, classObj;

    db.startSession().then((_session) => {
        session = _session;

        session.startTransaction();
        return ClassModel.create([{
            title,
            teacher: teacher_id
        }], { session });
    }).then(([arg]) => {
        classObj = arg

        return Teacher.findByIdAndUpdate(teacher_id, {
            $push: { classes: classObj._id }
        })
    }).then(() => {
        return session.commitTransaction()
    }).then(() => {
        return res.send({ class: classObj });
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
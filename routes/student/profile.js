import express from "express";
import Student from "../../model/Student.js";

const router = express.Router();

router.get("/", (_req, res) => {
    return res.send({
        "health": "OK"
    })
});

router.get("/view", async (req, res) => {
    try {
        const id = req.query.id;

        const student = await Student.findById(id);
        if (!student) throw new Error('Invalid id');

        return res.send(student);
    } catch (err) {
        return res.status(400).send({
            success: false,
            err,
        });
    }
})

router.post("/update", async (req, res) => {
    const {
        id,
        name,
        address,
    } = req.body;

    try {
        await Student.findByIdAndUpdate(id, {
            ...(name && { name }),
            ...(address && { address }),
        });

        return res.send({
            success: true,
            message: "Updated Successfully",
        }); 
    } catch (err) {
        return res.status(400).send({
            success: false,
            err,
        });
    }
})

export default router;
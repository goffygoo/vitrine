import express from "express";
import TempToken from "../../model/TempToken.js";
import User from "../../model/User.js";
import db from "../../util/db.js";
import { sendResetPasswordMail, sendVerifyMail } from "../../util/mailer.js";
import { randomUUID } from "crypto";
import jwt from 'jsonwebtoken'
import TempLink from "../../model/TempLink.js";
import Teacher from "../../model/Teacher.js";
import Student from "../../model/Student.js";

const SECRET = "SECRET";

const REFRESH_TOKEN_EXPIRE_TIME = 1000 * 60 * 60 * 24 * 28;
const ACCESS_TOKEN_EXPIRE_TIME = '30m';

const generateToken = () => {
    return randomUUID() + '-' + randomUUID();
}

const router = express.Router();

router.get("/", (_req, res) => {
    res.send({
        "health": "OK"
    })
})

router.post("/signup", async (req, res) => {
    const { name = "New User", email, password, type } = req.body

    const userCheck = await User.findOne({ email });

    if (userCheck) {
        return res.status(400).send({
            success: false,
            message: "User already exists",
        });
    }

    const prevToken = await TempToken.findOne({ email }).select({ 'token': 1 });

    if (prevToken) {
        sendVerifyMail(email, prevToken.token);

        return res.status(201).send({
            success: true,
            message: "Mail already sent, check your email",
            email,
        });
    }

    if (!(type === "TEACHER" || type === "STUDENT")) {
        return res.status(400).send({
            success: false,
            message: "Invalid user type",
        });
    }

    const token = await TempToken.create({
        name,
        email,
        password,
        type,
        token: randomUUID()
    });

    sendVerifyMail(email, token.token);

    return res.status(201).send({
        success: true,
        message: "Please check your email",
        email,
    });
})

router.post("/login", async (req, res) => {
    const { email, password } = req.body

    const user = await User.findOne({ email });

    if (!user) {
        return res.status(401).send({
            success: false,
            message: "Could not find the user",
        });
    }

    if (password != user.password) {
        return res.status(401).send({
            success: false,
            message: "Password Invalid",
        });
    }

    let refreshToken = user.refreshToken;

    if (!user.refreshToken || user.tokenEAT <= (Date.now())) {
        refreshToken = generateToken();

        await User.findByIdAndUpdate(user._id, {
            refreshToken,
            tokenEAT: (Date.now() + REFRESH_TOKEN_EXPIRE_TIME)
        })
    }

    const payload = {
        id: user._id.toString(),
        type: user.type
    };

    const accessToken = jwt.sign(payload, SECRET, { expiresIn: ACCESS_TOKEN_EXPIRE_TIME });

    return res.status(201).send({
        success: true,
        message: "Logged In Successfully",
        accessToken,
        refreshToken
    });
})

router.post("/verify", async (req, res) => {
    let session = null, name = "";

    db.startSession().then((_session) => {
        session = _session;

        session.startTransaction();
        return TempToken.findOneAndDelete({ token: req.body.token }).session(session);
    }).then((userData) => {
        if (!userData) throw Error("Invalid token");

        name = userData.name
        return User.create([{
            email: userData.email,
            password: userData.password,
            type: userData.type,
            refreshToken: generateToken(),
            tokenEAT: (Date.now() + REFRESH_TOKEN_EXPIRE_TIME)
        }], { session })
    }).then(([userData]) => {
        if (userData.type === 'TEACHER') {
            return Teacher.create([{
                userId: userData._id,
                name
            }], { session })
        } else {
            return Student.create([{
                userId: userData._id,
                name
            }], { session })
        }
    }).then(() => {
        return session.commitTransaction()
    }).then(() => {
        return res.status(201).send({
            success: true,
            message: `Your email is verified, Please login again`,
        });
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

router.post("/forgotPassword", async (req, res) => {
    const { email } = req.body

    try {
        const user = await User.findOne({ email }).select({
            _id: 1
        })

        if (!user) {
            return res.status(400).send({
                success: false,
                message: "Invalid user email",
            });
        }

        const prevLink = await TempLink.findOne({ email })

        if (prevLink) {
            sendResetPasswordMail(email, prevLink.token);

            return res.status(201).send({
                success: true,
                message: "Mail already sent, check your email to reset password",
            });
        }

        const link = await TempLink.create({
            userId: user._id,
            token: randomUUID()
        });

        sendResetPasswordMail(email, link.token);

        return res.status(201).send({
            success: true,
            message: "Please check your email to reset password",
        });
    } catch (err) {
        return res.status(400).send({
            success: false,
            message: "Something went wrong",
            error: err
        });
    }
})

router.post("/resetPassword", async (req, res) => {
    const { token, password } = req.body
    let session = null;

    db.startSession().then((_session) => {
        session = _session;

        session.startTransaction();
        return TempLink.findOneAndDelete({ token }).session(session);
    }).then((userData) => {
        if (!userData) throw Error("Invalid token");

        return User.findById(userData.userId).session(session)
    }).then(user => {
        if (!user) throw Error("Invalid token");

        return User.findByIdAndUpdate(user._id, {
            password,
            refreshToken: generateToken(),
            tokenEAT: (Date.now() + REFRESH_TOKEN_EXPIRE_TIME)
        }).session(session)
    }).then(() => {
        return session.commitTransaction()
    }).then(() => {
        return res.status(201).send({
            success: true,
            message: `Your password is changed, please login again`,
        });
    }).catch((err) => {
        res.status(400).send({
            success: false,
            message: `Something went wrong: ${err}`,
        });
        return session.abortTransaction();
    }).finally(() => {
        return session.endSession()
    })
})

export default router;
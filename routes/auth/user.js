import express from "express";
import TempToken from "../../model/TempToken.js";
import User from "../../model/User.js";
import db from "../../util/db.js";
import { sendResetPasswordMail, sendVerifyMail } from "../../util/mailer.js";
import { randomUUID } from "crypto";
import jwt from "jsonwebtoken";
import TempLink from "../../model/TempLink.js";
import Teacher from "../../model/Teacher.js";
import Student from "../../model/Student.js";
import { USER_TYPES } from "../../constants/index.js";
import { processPassword } from "../../util/index.js";

const SECRET = "SECRET";

const REFRESH_TOKEN_EXPIRE_TIME = 1000 * 60 * 60 * 24 * 28;
const ACCESS_TOKEN_EXPIRE_TIME = "30m";

const generateToken = () => {
  return randomUUID() + "-" + randomUUID();
};

const router = express.Router();

router.get("/", (_req, res) => {
  return res.send({
    health: "OK",
  });
});

router.post("/signup", async (req, res) => {
  const { name = "New User", email, password, type } = req.body;

  const userCheck = await User.findOne({ email });

  if (userCheck) {
    return res.status(400).send({
      success: false,
      message: "User already exists",
    });
  }

  const prevToken = await TempToken.findOne({ email }).select({ token: 1 });

  if (prevToken) {
    sendVerifyMail(email, prevToken.token);

    return res.status(201).send({
      success: true,
      message: "Mail already sent, check your email",
      email,
    });
  }
  if (!(type === USER_TYPES.TEACHER || type === USER_TYPES.STUDENT)) {
    return res.status(400).send({
      success: false,
      message: "Invalid user type",
    });
  }

  const token = await TempToken.create({
    name,
    email,
    password: processPassword(password),
    type,
    token: randomUUID(),
  });

  sendVerifyMail(email, token.token);

  return res.status(201).send({
    success: true,
    message: "Please check your email",
    email,
  });
});

router.post("/login", async (req, res) => {
  const { email, password } = req.body;

  const user = await User.findOne({ email });

  if (!user) {
    return res.status(401).send({
      success: false,
      message: "Could not find the user",
    });
  }

  if (processPassword(password) != user.password) {
    return res.status(401).send({
      success: false,
      message: "Password Invalid",
    });
  }

  let refreshToken = user.refreshToken;

  if (!user.refreshToken || user.tokenEAT <= Date.now()) {
    refreshToken = generateToken();

    await User.findByIdAndUpdate(user._id, {
      refreshToken,
      tokenEAT: Date.now() + REFRESH_TOKEN_EXPIRE_TIME,
    });
  }

  const payload = {
    id: user._id.toString(),
    profileId: user.profileId.toString(),
    type: user.type,
  };

  const accessToken = jwt.sign(payload, SECRET, {
    expiresIn: ACCESS_TOKEN_EXPIRE_TIME,
  });

  return res.status(201).send({
    accessToken,
    refreshToken,
    type: user.type,
    userId: payload.id,
    profileId: payload.profileId,
    email: user.email,
  });
});

router.post("/verify", async (req, res) => {
  let session = null,
    name = "",
    email,
    userId,
    profileId,
    type;
  const refreshToken = generateToken();

  db.startSession()
    .then((_session) => {
      session = _session;

      session.startTransaction();
      return TempToken.findOneAndDelete({ token: req.body.token }).session(
        session
      );
    })
    .then((userData) => {
      if (!userData) throw Error("Invalid token");

      name = userData.name;
      email = userData.email;
      return User.create(
        [
          {
            email: userData.email,
            password: userData.password,
            type: userData.type,
            refreshToken,
            tokenEAT: Date.now() + REFRESH_TOKEN_EXPIRE_TIME,
          },
        ],
        { session }
      );
    })
    .then(([userData]) => {
      type = userData.type;
      if (type === USER_TYPES.TEACHER) {
        return Teacher.create(
          [
            {
              userId: userData._id,
              name,
            },
          ],
          { session }
        );
      } else if (type === USER_TYPES.STUDENT) {
        return Student.create(
          [
            {
              userId: userData._id,
              name,
            },
          ],
          { session }
        );
      } else {
        throw Error("Invalid Request");
      }
    })
    .then(([profile]) => {
      const id = profile.userId;
      userId = id;
      profileId = profile._id.toString();
      return User.findByIdAndUpdate(id, { profileId }).session(session);
    })
    .then(() => {
      return session.commitTransaction();
    })
    .then(() => {
      const payload = { userId, profileId, type };

      const accessToken = jwt.sign(payload, SECRET, {
        expiresIn: ACCESS_TOKEN_EXPIRE_TIME,
      });

      return res.status(201).send({
        accessToken,
        refreshToken,
        userId,
        profileId,
        type,
        email,
      });
    })
    .catch((err) => {
      console.log(err);
      res.status(400).send({
        success: false,
        message: `Something went wrong`,
        err,
      });
      return session.abortTransaction();
    })
    .finally(() => {
      return session.endSession();
    });
});

router.post("/forgotPassword", async (req, res) => {
  const { email } = req.body;

  try {
    const user = await User.findOne({ email }).select({
      _id: 1,
    });

    if (!user) {
      return res.status(400).send({
        success: false,
        message: "Invalid user email",
      });
    }

    const prevLink = await TempLink.findOne({ email });

    if (prevLink) {
      sendResetPasswordMail(email, prevLink.token);

      return res.status(201).send({
        success: true,
        message: "Mail already sent, check your email to reset password",
      });
    }

    const link = await TempLink.create({
      userId: user._id,
      token: randomUUID(),
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
      error: err,
    });
  }
});

router.post("/resetPassword", async (req, res) => {
  const { token, password } = req.body;
  let session = null;

  db.startSession()
    .then((_session) => {
      session = _session;

      session.startTransaction();
      return TempLink.findOneAndDelete({ token }).session(session);
    })
    .then((userData) => {
      if (!userData) throw Error("Invalid token");

      return User.findById(userData.userId).session(session);
    })
    .then((user) => {
      if (!user) throw Error("Invalid token");

      return User.findByIdAndUpdate(user._id, {
        password: processPassword(password),
        refreshToken: generateToken(),
        tokenEAT: Date.now() + REFRESH_TOKEN_EXPIRE_TIME,
      }).session(session);
    })
    .then(() => {
      return session.commitTransaction();
    })
    .then(() => {
      return res.status(201).send({
        success: true,
        message: `Your password is changed, please login again`,
      });
    })
    .catch((err) => {
      res.status(400).send({
        success: false,
        message: `Something went wrong: ${err}`,
      });
      return session.abortTransaction();
    })
    .finally(() => {
      return session.endSession();
    });
});

export default router;
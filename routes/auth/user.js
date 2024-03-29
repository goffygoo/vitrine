import express from "express";
import TempToken from "../../model/TempToken.js";
import User from "../../model/User.js";
import db from "../../util/db.js";
import {
  sendResetPasswordMail,
  sendVerifyMail,
} from "../../util/mailer/index.js";
import { randomUUID } from "crypto";
import jwt from "jsonwebtoken";
import TempLink from "../../model/TempLink.js";
import Provider from "../../model/Provider.js";
import Consumer from "../../model/Consumer.js";
import config from "../../constants/config.js";
import { USER_PICTURE_DEFAULT, USER_TYPES } from "../../constants/index.js";
import { processPassword } from "../../util/index.js";
import axios from "axios";
import refreshGoogleAccessToken from "./../../util/integration.js"
import Cache from "../../service/cache/index.js";

const {
  GOOGLE_CLIENT_ID,
  GOOGLE_CLIENT_ID_ANDROID,
  GOOGLE_CLIENT_SECRET,
  GOOGLE_CLIENT_SECRET_ANDROID,
  GOOGLE_TOKEN_URL,
  JWT_SECRET_KEY,
} = config;

const REFRESH_TOKEN_EXPIRE_TIME = 1000 * 60 * 60 * 24 * 90;
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
  if (!(type === USER_TYPES.PROVIDER || type === USER_TYPES.CONSUMER)) {
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
  const { email, password, device = 'web', fcmToken } = req.body;

  const user = await User.findOne({ email });

  if (!user) {
    return res.status(401).send({
      success: false,
      message: "Could not find the user",
    });
  }

  if (!user.verified) {
    if (device === 'android') {
      const response = await verifyProfileHandler({
        type: USER_TYPES.CONSUMER,
        name,
        userId: user._id,
        profilePicture: picture
      })
      return res.send(response);
    }
    const token = jwt.sign(
      {
        userId: user._id,
      },
      JWT_SECRET_KEY,
      {
        expiresIn: ACCESS_TOKEN_EXPIRE_TIME,
      }
    );

    return res.send({
      verifyProfileToken: token,
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
    email: email,
    userId: user._id.toString(),
    profileId: user.profileId.toString(),
    type: user.type,
    verified: user.verified,
  };

  const accessToken = jwt.sign(payload, JWT_SECRET_KEY, {
    expiresIn: ACCESS_TOKEN_EXPIRE_TIME,
  });

  if (device === 'android') Cache.FCMToken.addToken(payload.profileId, fcmToken);

  return res.status(201).send({
    accessToken,
    refreshToken,
    type: user.type,
    userId: payload.userId,
    profileId: payload.profileId,
    email: user.email,
    verified: user.verified,
  });
});

router.post("/verify", async (req, res) => {
  const { token } = req.body;
  let session = null,
    name = "",
    email,
    password,
    userId,
    profileId,
    type,
    verified;

  const refreshToken = generateToken();
  db.startSession()
    .then((_session) => {
      session = _session;
      console.log(name);

      session.startTransaction();
      return TempToken.findOneAndDelete({ token }).session(session);
    })
    .then((userData) => {
      if (!userData) throw Error("Invalid token");

      name = userData.name;
      email = userData.email;
      password = userData.password;
      type = userData.type;
      verified = true;

      return User.findOne({ email }).session(session);
    })
    .then((userData) => {
      if (!userData) {
        return User.create(
          [
            {
              email,
              password,
              type,
              refreshToken,
              tokenEAT: Date.now() + REFRESH_TOKEN_EXPIRE_TIME,
              verified,
            },
          ],
          { session }
        );
      }

      if (!userData.verified) {
        return User.findByIdAndUpdate(userData._id, {
          password,
          type,
          refreshToken,
          tokenEAT: Date.now() + REFRESH_TOKEN_EXPIRE_TIME,
          verified,
        }).session(session);
      }

      throw Error("Account already exists");
    })
    .then((response) => {
      let userData = response;
      if (Array.isArray(response)) [userData] = response;

      if (type === USER_TYPES.PROVIDER) {
        return Provider.create(
          [
            {
              userId: userData._id,
              name,
            },
          ],
          { session }
        );
      } else if (type === USER_TYPES.CONSUMER) {
        return Consumer.create(
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
      const payload = { email, userId, profileId, type, verified };

      const accessToken = jwt.sign(payload, JWT_SECRET_KEY, {
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

router.post("/googleLogin", async (req, res) => {
  const { code, device = 'web', fcmToken } = req.body;

  try {
    const response = await axios.post(GOOGLE_TOKEN_URL, {
      code,
      client_id: device === 'android' ? GOOGLE_CLIENT_ID_ANDROID : GOOGLE_CLIENT_ID,
      client_secret: device === 'android' ? GOOGLE_CLIENT_SECRET_ANDROID : GOOGLE_CLIENT_SECRET,
      ...(device === 'web' && { redirect_uri: "http://localhost:3000/auth" }),
      grant_type: "authorization_code",
    });

    const { data } = response;

    const {
      access_token,
      expires_in,
      refresh_token,
      scope,
      id_token,
      token_type,
    } = data;

    const userData = jwt.decode(id_token);
    const { email, name, picture } = userData;

    if (device === 'web') await refreshGoogleAccessToken(refresh_token, true)
    /* {
      iss: 'https://accounts.google.com',
      azp: '611755391410-8cin2sd35dg0o3p04d46a7qn9fpfsjcp.apps.googleusercontent.com',
      aud: '611755391410-8cin2sd35dg0o3p04d46a7qn9fpfsjcp.apps.googleusercontent.com',
      sub: '101254660173627597783',
      email: 'jrvineetoli52.2@gmail.com',
      email_verified: true,
      at_hash: 'fBZHyhvzYI3Mo_t1vKvq3Q',
      name: 'Master 01',
      picture: 'https://lh3.googleusercontent.com/a/AAcHTtfs9mROiwWWQ-3vJhrRKbrleFT0spkagfJqfTcCq9rM=s96-c',
      given_name: 'Master',
      family_name: '01',
      locale: 'en-GB',
      iat: 1688683022,
      exp: 1688686622
    } */

    let user = await User.findOne({ email });

    if (!user) {
      user = await User.create({
        email,
        googleAuth: refresh_token,
      });
    } else {
      user = await User.findByIdAndUpdate(user._id, {
        googleAuth: refresh_token,
      });
    }
    if (!user.verified) {
      if (device === 'android') {
        const response = await verifyProfileHandler({
          type: USER_TYPES.CONSUMER,
          name,
          userId: user._id,
          profilePicture: picture
        })
        return res.send(response);
      }
      const token = jwt.sign(
        {
          name,
          profilePicture: picture,
          userId: user._id,
        },
        JWT_SECRET_KEY,
        {
          expiresIn: ACCESS_TOKEN_EXPIRE_TIME,
        }
      );

      return res.send({
        verifyProfileToken: token,
      });
    }

    let refreshToken = user.refreshToken,
      updateObject = {},
      updateRequired = false;
    if (!user.refreshToken || user.tokenEAT <= Date.now()) {
      refreshToken = generateToken();
      updateObject = {
        ...updateObject,
        refreshToken,
        tokenEAT: Date.now() + REFRESH_TOKEN_EXPIRE_TIME,
      };
      updateRequired = true;
    }
    if (!user.googleAuth) {
      updateObject = {
        ...updateObject,
        googleAuth: refresh_token,
      };
      updateRequired = true;
    }
    if (updateRequired) {
      await User.findByIdAndUpdate(user._id, updateObject);
    }

    const payload = {
      email: email,
      userId: user._id.toString(),
      profileId: user.profileId.toString(),
      type: user.type,
      verified: user.verified,
    };
    const accessToken = jwt.sign(payload, JWT_SECRET_KEY, {
      expiresIn: ACCESS_TOKEN_EXPIRE_TIME,
    });

    if (device === 'android') Cache.FCMToken.addToken(payload.profileId, fcmToken);

    return res.status(200).send({
      accessToken,
      refreshToken,
      type: user.type,
      userId: payload.userId,
      profileId: payload.profileId,
      email: user.email,
    });
  } catch (err) {
    console.log(err);
    res.status(400).send(err);
  }
});

const verifyProfileMiddleware = (req, res, next) => {
  const token = req.body.verifyProfileToken;

  jwt.verify(token, JWT_SECRET_KEY, (err, data) => {
    if (err) {
      return res.status(404).send("Invalid Request");
    } else {
      res.locals.data = data;
      next();
    }
  });
};

const verifyProfileHandler = async ({
  type,
  name = "New User",
  userId,
  profilePicture = USER_PICTURE_DEFAULT,
}) => {
  let session = null,
    profileId,
    verified,
    email;
  const refreshToken = generateToken();

  try {
    session = await db.startSession();
    session.startTransaction();

    const userData = await User.findById(userId).session(session);
    if (!userData) throw Error("Invalid Request");
    if (userData.verified) throw Error("Account already exists");
    email = userId.email;

    let createProfileResponse;
    if (type === USER_TYPES.PROVIDER) {
      createProfileResponse = await Provider.create(
        [
          {
            userId,
            name,
            profilePicture,
          },
        ],
        { session }
      );
    } else if (type === USER_TYPES.CONSUMER) {
      createProfileResponse = await Consumer.create(
        [
          {
            userId,
            name,
            profilePicture,
          },
        ],
        { session }
      );
    } else {
      throw Error("Invalid Request");
    }

    const profile = createProfileResponse[0];
    verified = true;
    profileId = profile._id.toString();

    await User.findByIdAndUpdate(userId, {
      type,
      profileId,
      verified,
      refreshToken,
      tokenEAT: Date.now() + REFRESH_TOKEN_EXPIRE_TIME,
    }).session(session);

    await session.commitTransaction();

    const payload = { userId, profileId, type, verified, email };
    const accessToken = jwt.sign(payload, JWT_SECRET_KEY, {
      expiresIn: ACCESS_TOKEN_EXPIRE_TIME,
    });

    return {
      accessToken,
      refreshToken,
      userId,
      profileId,
      type,
      email,
    };
  } catch (err) {
    await session.abortTransaction();
    throw err;
  } finally {
    await session.endSession();
  }
}

router.post("/verifyProfile", verifyProfileMiddleware, async (req, res) => {
  const { type } = req.body;
  const {
    userId,
    name = "New User",
    profilePicture = USER_PICTURE_DEFAULT,
  } = res.locals.data;

  try {
    const response = await verifyProfileHandler({
      type,
      name,
      userId,
      profilePicture
    })
    return res.send(response);
  } catch (err) {
    console.log(err);
    return res.status(400).send({
      success: false,
      message: `Something went wrong`,
      err,
    });
  }
})
export default router;

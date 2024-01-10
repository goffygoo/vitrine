import { HEADERS, USER_TYPES } from "../constants/index.js";
import jwt from "jsonwebtoken";
import config from "../constants/config.js";

const { JWT_SECRET_KEY } = config;

export const verifyAccessToken = (req, res, next) => {
  const token = req.headers[HEADERS.AUTHORIZATION];
  jwt.verify(token, JWT_SECRET_KEY, (err, data) => {
    if (err) {
      return res.status(404).send({ invalid: true });
    } else {
      res.locals.data = data;
      next();
    }
  });
};

export const verifyProvider = (req, res, next) => {
  const { type } = res.locals.data;
  if (type !== USER_TYPES.PROVIDER) {
    return res.status(400).send({
      success: false,
      message: `Something went wrong`,
    });
  }
  next();
};

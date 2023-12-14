import { HEADERS } from "../constants/index.js";
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

// export const verifyProfile = (req, res, next) => {

// }
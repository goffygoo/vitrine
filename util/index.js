import axios from "axios";
import { createHash } from "crypto";
const PASSWORD_SALT = "PASSWORD_SALT";

export const processPassword = (password) => {
  const hash = createHash("sha256");
  hash.write(password + PASSWORD_SALT);
  return hash.digest("base64");
};

export const getHashString = (data) => {
  const hash = createHash("sha256");
  hash.write(data);
  return hash.digest("base64");
};

const getUpdatedUrl = (url, body) => {
  let newUrl = url;
  const keys = Object.keys(body);
  if (keys.length > 0) {
    newUrl = newUrl + "?";
    for (let i = 0; i < keys.length; i++) {
      newUrl =
        newUrl +
        encodeURIComponent(keys[i]) +
        "=" +
        encodeURIComponent(body[keys[i]]) +
        "&";
    }
    newUrl = newUrl.slice(0, -1);
  }
  return newUrl;
};

export const httpRequest = async (method, url, body, config) => {
  try {
    if (method === "get") {
      url = getUpdatedUrl(url, body);
      body = config;
    }
    const { data: response } = await axios[method](url, body, config);
    return response;
  } catch (err) {
    if (err?.response?.data) {
      throw {
        message: 'axios error',
        error: err.response.data
      }
    }
    throw err;
  }
}

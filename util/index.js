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

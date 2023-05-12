import { createHash } from 'crypto';
const PASSWORD_SALT = 'PASSWORD_SALT';

export const processPassword = password => {
    const hash = createHash("sha256");
    hash.write(password + PASSWORD_SALT);
    return hash.digest("base64");
}
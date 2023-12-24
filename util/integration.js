import { google } from "googleapis";
import jwt from "jsonwebtoken";

import User from "../model/User.js";

import config from "../constants/config.js";


async function refreshGoogleAccessToken(refreshToken, save = false) {
  try {
    const oauth2Client = new google.auth.OAuth2(
      config.GOOGLE_CLIENT_ID,
      config.GOOGLE_CLIENT_SECRET,
      config.GOOGLE_REDIRECT_URI
    );
    oauth2Client.setCredentials({
      refresh_token: refreshToken
    });
    let response = await oauth2Client.getAccessToken();
    const idToken = response.res.data.id_token
    const { email } = jwt.decode(idToken);
    if (save) await User.findOneAndUpdate ({email}, { googleAuth: response.res.data.refresh_token });
    return response.res.data.access_token
  } catch(err) {
    console.log("err", err);
    return null
  }
}

export default refreshGoogleAccessToken;

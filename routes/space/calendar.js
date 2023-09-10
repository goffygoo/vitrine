import express from "express";
import { getHashString } from "../../util/index.js";
import axios from "axios";
import Call from "../../model/Call.js";
import Notification from "../../service/notification/index.js";
import Cache from "../../service/cache/index.js";

const router = express.Router();

const CALANDER_API_KEY = "AIzaSyBfDJ2N6w6cUbzK5lQNczliBGHv_rgC57U";

router.get("/", (_req, res) => {
  return res.send({
    health: "OK",
  });
});

const getGoogleMeetLink = (req, res, next) => {
  const { googleAccessToken, startTime, endTime, meetAttendees } = req.body;

  axios
    .post(
      `https://www.googleapis.com/calendar/v3/calendars/${"primary"}/events?key=${CALANDER_API_KEY}&conferenceDataVersion=${1}`,
      {
        start: {
          dateTime: startTime,
          timeZone: "Asia/Kolkata",
        },
        end: {
          dateTime: endTime,
          timeZone: "Asia/Kolkata",
        },
        attendees: meetAttendees,
        conferenceData: {
          createRequest: {
            conferenceSolutionKey: {
              type: "hangoutsMeet",
            },
            requestId: getHashString(
              "?" + Date.now() + Math.random() + googleAccessToken
            ),
            // The client-generated unique ID for this request. Clients should regenerate this ID for every new request. If an ID provided is the same as for the previous request, the request is ignored.
          },
        },
      },
      {
        headers: {
          ["Authorization"]: "Bearer " + googleAccessToken,
        },
      }
    )
    .then(({ data }) => {
      const googleMeetLink = data.hangoutLink;

      res.locals.googleMeetLink = googleMeetLink;

      return next();
    })
    .catch((err) => {
      console.log(err.response.data.error.errors);
      res.status(400).send(err);
    });
};

router.post("/addCall", getGoogleMeetLink, async (req, res) => {
  const { title, spaceId, description, startTime, endTime, participants } =
    req.body;

  const googleMeet = res.locals.googleMeetLink;

  try {
    const call = await Call.create({
      title,
      spaceId,
      description,
      startTime,
      endTime,
      googleMeet,
      participants,
    });

    participants.forEach((id) => {
      Cache.Events.addResetFlag(id);
    });

    await Notification.Call.addCall(call);

    return res.send({
      success: true,
    });
  } catch (err) {
    console.log(err);
    return res.status(400).send({
      success: false,
      err,
    });
  }
});

export default router;

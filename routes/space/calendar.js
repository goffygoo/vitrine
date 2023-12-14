import express from "express";
import { getHashString } from "../../util/index.js";
import axios from "axios";
import Call from "../../model/Call.js";
import Notification from "../../service/notification/index.js";
import Calander from "../../service/calender/index.js";
import {
  CALENDER_EVENT_SLOT_TYPES,
  CALENDER_EVENT_TYPES,
} from "../../constants/index.js";
import refreshGoogleAccessToken from "../../util/integration.js";
import User from "../../model/User.js";
import SpaceModel from "../../model/SpaceModel.js";

const router = express.Router();

const CALANDER_API_KEY = "AIzaSyBfDJ2N6w6cUbzK5lQNczliBGHv_rgC57U";

router.get("/", (_req, res) => {
  return res.send({
    health: "OK",
  });
});

const getGoogleMeetLink = async (req, res, next) => {
  const { startTime, endTime, spaceId } = req.body;
  const { userId, profileId } = res.locals.data;
  // TODO: get googleRefreshToken from db
  // TODO: refresh the googleAccessToken
  // (add a checker) :
  const { googleAuth } = await User.findById(userId);
  const googleAccessToken = await refreshGoogleAccessToken(googleAuth);
  if (googleAccessToken) {
    const { meetAttendees, provider } = await SpaceModel.findById(spaceId);
    if (provider.toString() !== profileId) {
      return res.status(204).send({
        message: "User is not an admin.",
      });
    }
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
        return res.status(400).send(err);
      });
  } else {
    return res.status(204).send({
      message: "User needs to login",
      type: 'INTEGRATE-GOOGLE-AGAIN'
    });
  }
};

router.post("/addCall", getGoogleMeetLink, async (req, res) => {
  console.log("addcall");
  const { title, spaceId, description, startTime, endTime } = req.body;
  const { consumer: participants, provider } = await SpaceModel.findById(
    spaceId
  );
  participants.push(provider);
  const googleMeet = res.locals.googleMeetLink;

  try {
    // TODO: Transactions?
    const call = await Call.create({
      title,
      spaceId,
      description,
      startTime,
      endTime,
      googleMeet,
      participants,
    });
    await Promise.all([
      ...participants.map((id) =>
        Calander.addEventForUser(
          id,
          CALENDER_EVENT_TYPES.CALL,
          CALENDER_EVENT_SLOT_TYPES.TIMED,
          true,
          call._id,
          startTime,
          endTime
        )
      ),
      Notification.Call.addCall(call),
    ]);

    return res.send({
      success: true,
      message: "Event added successfully."
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

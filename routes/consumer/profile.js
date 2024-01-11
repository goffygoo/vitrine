import express from "express";
import Consumer from "../../model/Consumer.js";

const router = express.Router();

router.get("/", (_req, res) => {
  return res.send({
    health: "OK",
  });
});

router.get("/view", async (_req, res) => {
  try {
    const { profileId } = res.locals.data;
    const consumer = await Consumer.findById(profileId);
    if (!consumer) throw new Error();
    return res.send(consumer);
  } catch (_e) {
    return res.sendStatus(400);
  }
});

router.post("/update", async (req, res) => {
  const {
    name,
    profilePicture,
    coverPicture,
    instagram,
    x,
    linkedIn,
    about,
    workingHours,
    offDays,
  } = req.body;
  const { profileId } = res.locals.data;
  try {
    await Consumer.findByIdAndUpdate(profileId, {
      ...(name && { name }),
      ...(profilePicture && { profilePicture }),
      ...(coverPicture && { coverPicture }),
      ...(instagram && { instagram }),
      ...(x && { x }),
      ...(linkedIn && { linkedIn }),
      ...(about && { about }),
      ...(workingHours && { workingHours }),
      ...(offDays && { offDays }),
    });
    return res.sendStatus(200);
  } catch (_e) {
    return res.sendStatus(400);
  }
});

export default router;

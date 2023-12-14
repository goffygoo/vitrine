import express from "express";
import Provider from "../../model/Provider.js";

const router = express.Router();

router.get("/", (_req, res) => {
  return res.send({
    health: "OK",
  });
});

router.get("/view", async (req, res) => {
  try {
    const { profileId } = res.locals.data;
    const provider = await Provider.findById(profileId);
    if (!provider) throw new Error("Invalid id");
    return res.send(provider);
  } catch (err) {
    return res.status(400).send({
      success: false,
      err,
    });
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
    await Provider.findByIdAndUpdate(profileId, {
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
    return res.send({
      success: true,
      message: "Updated Successfully",
    });
  } catch (err) {
    return res.status(400).send({
      success: false,
      err,
    });
  }
});

export default router;

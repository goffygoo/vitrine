import express from "express";
import Folder from "../../model/Folder.js";
import File from "../../model/File.js";
import { verifyProvider } from "../middleware.js";

const router = express.Router();



router.get("/", (_req, res) => {
  return res.send({
    health: "OK",
  });
});

router.post("/addFolder", verifyProvider, async (req, res) => {
  const { spaceId, folderName } = req.body;

  try {
    let folder = await Folder.create({
      spaceId,
      folderName,
    });

    return res.status(200).send({
      success: true,
      folder,
    });
  } catch (err) {
    res.status(400).send({
      success: false,
      message: `Something went wrong`,
      err,
    });
    console.log(err);
  }
});

router.get("/getFolders", async (req, res) => {
  const { spaceId } = req.query;
  try {
    const folders = await Folder.find({ spaceId });
    return res.send({
      data: folders,
    });
  } catch (err) {
    console.log(err);
    return res.status(400).send({
      success: false,
      err,
    });
  }
});

router.post("/renameFolder", verifyProvider, async (req, res) => {
  const { folderId, folderName } = req.body;
  try {
    const folder = await Folder.findByIdAndUpdate(
      folderId,
      {
        folderName,
      },
      { new: true }
    );
    console.log("folder", folder);
    return res.status(200).send({
      success: true,
      folder,
    });
  } catch (err) {
    res.status(400).send({
      success: false,
      message: `Something went wrong`,
      err,
    });
    console.log(err);
  }
});

router.post("/deleteFolder", verifyProvider, async (req, res) => {
  const { folderId } = req.body;

  try {
    await Folder.findByIdAndDelete(folderId);
    res.status(200).send({
      success: true,
    });
  } catch (err) {
    res.status(400).send({
      success: false,
      message: `Something went wrong`,
      err,
    });
    console.log(err);
  }
});

router.post("/addFile", verifyProvider,async (req, res) => {
  const { folderId, fileName, url } = req.body;
  try {
    const isFileAlreadyPresent = await File.find({
      fileName: fileName,
      folderId: folderId,
    });
    console.log(isFileAlreadyPresent);
    if (isFileAlreadyPresent.length) {
      return res.status(400).send({
        success: false,
        message: `File already present in the folder`,
      });
    }
    const file = await File.create({
      folderId,
      fileName,
      url,
    });
    const files = await File.find({ folderId });
    res.status(200).send({
      success: true,
      data: files,
      file,
    });
  } catch (err) {
    res.status(400).send({
      success: false,
      message: `Something went wrong`,
      err,
    });
    console.log(err);
  }
});

router.get("/getFiles", async (req, res) => {
  const { folderId } = req.query;
  try {
    const files = await File.find({ folderId });
    return res.send({
      data: files,
    });
  } catch (err) {
    console.log(err);
    return res.status(400).send({
      success: false,
      err,
    });
  }
});

router.post("/renameFile", verifyProvider,async (req, res) => {
  const { fileId, fileName } = req.body;

  try {
    await File.findByIdAndUpdate(fileId, {
      fileName,
    });
    res.status(200).send({
      success: true,
    });
  } catch (err) {
    res.status(400).send({
      success: false,
      message: `Something went wrong`,
      err,
    });
    console.log(err);
  }
});

router.post("/deleteFile", verifyProvider,async (req, res) => {
  const { fileId } = req.body;

  try {
    await File.findByIdAndDelete(fileId);
    res.status(200).send({
      success: true,
    });
  } catch (err) {
    res.status(400).send({
      success: false,
      message: `Something went wrong`,
      err,
    });
    console.log(err);
  }
});

router.post("/moveFile", async (req, res) => {
  const { fileId, folderId } = req.body;

  try {
    await File.findByIdAndUpdate(fileId, {
      folderId,
    });
    res.status(200).send({
      success: true,
    });
  } catch (err) {
    res.status(400).send({
      success: false,
      message: `Something went wrong`,
      err,
    });
    console.log(err);
  }
});
export default router;

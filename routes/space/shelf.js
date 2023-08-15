import express from "express";
import Folder from "../../model/Folder.js";
import File from "../../model/File.js";
import axios from "axios";

const router = express.Router();

router.get("/", (_req, res) => {
  return res.send({
    health: "OK",
  });
});

router.post("/addFolder", async (req, res) => {
  const { spaceId, folderName } = req.body;

  try {
    await Folder.create({
      spaceId,
      folderName,
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

router.post("/renameFolder", async (req, res) => {
  const { folderId, folderName } = req.body;

  try {
    await Folder.findByIdAndUpdate(folderId, {
      folderName,
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

router.post("/deleteFolder", async (req, res) => {
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

router.post("/addFile", async (req, res) => {
  const { folderId, fileName, url } = req.body;
  try {
    await File.create({
      folderId,
      fileName,
      url,
    });
    const files = await File.find({ folderId });
    res.status(200).send({
      success: true,
      data: files,
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

router.post("/renameFile", async (req, res) => {
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

router.post("/deleteFile", async (req, res) => {
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

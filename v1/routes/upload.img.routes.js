const express = require("express");
const uploadImgController = require("../controllers/upload.img.controller");

const router = express.Router();

router.get("/get-upload-url", uploadImgController.generateUploadUrl);
router.get("/images", uploadImgController.getAllImages);
router.post("/upload-image", uploadImgController.uploadNewImg);

module.exports = router;
const express = require("express");
const tagsController = require("../controllers/tags.controller");

const router = express.Router();

router.get("/", tagsController.getAllTags);

router.get("/:tagsId", tagsController.getOneTag);

router.post("/", tagsController.createNewTag);

router.patch("/:tagsId", tagsController.updateOneTag);

router.post("/deactivate", tagsController.deactivateOneTag);

router.post("/activate", tagsController.activateOneTag);

module.exports = router;
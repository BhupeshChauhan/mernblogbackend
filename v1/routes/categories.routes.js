const express = require("express");
const categoriesController = require("../controllers/categories.controller");

const router = express.Router();

router.get("/", categoriesController.getAllCategories);

router.get("/:categoriesId", categoriesController.getOneCategory);

router.post("/", categoriesController.createNewCategory);

router.patch("/:categoriessId", categoriesController.updateOneCategory);

router.post("/deactivate", categoriesController.deactivateOneCategory);

router.post("/activate", categoriesController.activateOneCategory);

module.exports = router;
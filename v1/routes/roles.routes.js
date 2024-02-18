const express = require("express");
const rolesController = require("../controllers/roles.controller");

const router = express.Router();

router.get("/", rolesController.getAllRoles);

router.get("/:roleId", rolesController.getOneRole);

router.post("/", rolesController.createNewRole);

router.patch("/:roleId", rolesController.updateOneRole);

router.patch("/:roleId", rolesController.updateOneRole);

router.post("/deactivate", rolesController.deactivateOneRole);

router.post("/activate", rolesController.activateOneRole);

module.exports = router;
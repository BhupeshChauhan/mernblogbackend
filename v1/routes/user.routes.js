//import express
const express = require('express');

//import user controller
const userController = require("../controllers/user.controller");

//import authetication middleware
const authController = require('../auth/auth.controller')

//create router
const router = express.Router();

//API endpoint for an author
// router.get('/author', authController.authenticate, userController.getAllPosts);

//API endpoint for signup and login
router.post("/signup", authController.signup)

router.post("/login", authController.login)

router.get("/", userController.getAllUsers);

router.get("/:userId", userController.getOneUser);

router.post("/", userController.createNewUser);

router.patch("/:userId", userController.updateOneUser);

router.post("/deactivate", userController.deactivateOneUser);

router.post("/activate", userController.activateOneUser);

module.exports = router;
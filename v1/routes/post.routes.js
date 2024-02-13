const express = require("express");
const postController = require("../controllers/post.controller");

const router = express.Router();

router.get("/", postController.getAllPosts);

router.get("/:postsId", postController.getOnePost);

router.post("/", postController.createNewPost);

router.patch("/:postsId", postController.updateOnePost);

router.delete("/:postsId", postController.deleteOnePost);

module.exports = router;
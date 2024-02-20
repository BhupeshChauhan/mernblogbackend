const express = require("express");
const postController = require("../controllers/post.controller");

const router = express.Router();

router.get("/", postController.getAllPosts);

router.get("/draft", postController.getAllDraftPosts);

router.post("/searchbycategory", postController.getPostsByCategory);

router.post("/searchbyquery", postController.getSearchByQuery);

router.post("/latest", postController.getLatestPosts);

router.get("/trending", postController.getTrendingPosts);

router.get("/:postsId", postController.getOnePost);

router.post("/", postController.createNewPost);

router.post("/draft", postController.createNewDraftPost);

router.patch("/:postsId", postController.updateOnePost);

router.patch("draft/:postsId", postController.updateOneDraftPost);

router.post("/deactivate", postController.deactivateOnePost);

router.post("/activate", postController.activateOnePost);

module.exports = router;
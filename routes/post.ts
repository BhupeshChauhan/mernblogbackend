import express from "express";
import {
  activateOnePost,
  createNewDraftPost,
  createNewPost,
  deactivateOnePost,
  getAllDraftPosts,
  getAllFeaturedPosts,
  getAllPosts,
  getLatestPosts,
  getOnePost,
  getPostsByCategory,
  getSearchByQuery,
  getTrendingPosts,
  updateOneDraftPost,
  updateOnePost,
} from "../controllers/post";

const postRoutes = express.Router();

postRoutes.get("/", getAllPosts);

postRoutes.get("/draft", getAllDraftPosts);

postRoutes.post("/searchbycategory", getPostsByCategory);

postRoutes.get("/featured", getAllFeaturedPosts);

postRoutes.post("/searchbyquery", getSearchByQuery);

postRoutes.post("/latest", getLatestPosts);

postRoutes.get("/trending", getTrendingPosts);

postRoutes.get("/:postsId", getOnePost);

postRoutes.post("/", createNewPost);

postRoutes.post("/draft", createNewDraftPost);

postRoutes.patch("/:postsId", updateOnePost);

postRoutes.patch("draft/:postsId", updateOneDraftPost);

postRoutes.post("/deactivate", deactivateOnePost);

postRoutes.post("/activate", activateOnePost);

export default postRoutes;

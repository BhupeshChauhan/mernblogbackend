import express from 'express';
import { activateOneTag, createNewTag, deactivateOneTag, getAllTags, getOneTag, getTagsList, updateOneTag } from '../controllers/tags';

const tagsRoutes = express.Router();

tagsRoutes.get("/", getTagsList);

tagsRoutes.post("/", getAllTags);

tagsRoutes.get("/:tagsId", getOneTag);

tagsRoutes.post("/create", createNewTag);

tagsRoutes.patch("/:tagsId", updateOneTag);

tagsRoutes.post("/deactivate", deactivateOneTag);

tagsRoutes.post("/activate", activateOneTag);

export default tagsRoutes;
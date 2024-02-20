import express from 'express';
import { activateOneTag, createNewTag, deactivateOneTag, getAllTags, getOneTag, updateOneTag } from '../controllers/tags';

const tagsRoutes = express.Router();

tagsRoutes.get("/", getAllTags);

tagsRoutes.get("/:tagsId", getOneTag);

tagsRoutes.post("/", createNewTag);

tagsRoutes.patch("/:tagsId", updateOneTag);

tagsRoutes.post("/deactivate", deactivateOneTag);

tagsRoutes.post("/activate", activateOneTag);

export default tagsRoutes;
import express from 'express';
import { activateOneCategory, createNewCategory, deactivateOneCategory, getAllCategories, getAllCategoriesActive, getAllByType, getOneCategory, updateOneCategory } from '../controllers/categories';

const categoriesRoutes = express.Router();

categoriesRoutes.get("/", getAllCategories);

categoriesRoutes.get("/active", getAllCategoriesActive);

categoriesRoutes.post("/getbytype", getAllByType);

categoriesRoutes.get("/:categoriesId", getOneCategory);

categoriesRoutes.post("/", createNewCategory);

categoriesRoutes.patch("/:categoriessId", updateOneCategory);

categoriesRoutes.post("/deactivate", deactivateOneCategory);

categoriesRoutes.post("/activate", activateOneCategory);

export default categoriesRoutes;
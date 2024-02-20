import express from 'express';
import { generateUploadUrl, getAllImages, uploadNewImg } from '../controllers/uploadImg';

const uploadImgRoutes = express.Router();

uploadImgRoutes.get("/get-upload-url", generateUploadUrl);
uploadImgRoutes.get("/images", getAllImages);
uploadImgRoutes.post("/upload-image", uploadNewImg);

export default uploadImgRoutes;
import express from 'express';
import { getAllImages, uploadNewImg } from '../controllers/uploadImg';
import {upload} from '../middleware/multer'
const uploadImgRoutes = express.Router();

uploadImgRoutes.get("/images", getAllImages);
uploadImgRoutes.post("/upload-image", upload.single('image'), uploadNewImg);

export default uploadImgRoutes;
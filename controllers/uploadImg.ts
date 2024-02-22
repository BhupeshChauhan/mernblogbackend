import Gallery from '../model/gallery'
import cloudinary from '../utils/cloudinary'
import fs from 'fs'

export const uploadNewImg = async (req: any, res: any) => {
  try {
    cloudinary.uploader.upload(req.file.path, async function (err: any, result: any){
      if(err) {
        console.log(err);
        return res.status(500).json({
          success: false,
          message: "Error"
        })
      }

    fs.unlinkSync(req.file.path); // remove temporary file from filesystem
    const gallery = await Gallery.create({
      filename: result.original_filename,
      contentType: result.format,
      size: result.bytes,
      uploadDate: new Date(),
      imageUrl: result.url,
      metadata: {
        title: result.original_filename,
        alt: result.original_filename
      },
    });
      res.status(200).json({
        success: true,
        message:"Uploaded!",
        gallery
      })
    })
    
    

  } catch (err: any) {
    res.status(500).json({
      status: "success",
      error: err.message,
    });
  }
};

export const getAllImages = async (req: any, res: any) => {
  try {
    const images = await Gallery.find();

    res.status(200).json({
      status: "success",
      images,
    });
  } catch (err) {
    throw err;
  }
};

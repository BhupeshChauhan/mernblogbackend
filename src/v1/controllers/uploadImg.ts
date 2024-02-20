import Gallery from '../model/gallery'
import aws from 'aws-sdk'
import {nanoid} from "nanoid";

//AwsClient
export const s3 = new aws.S3({
  region: "ap-south-1",
  accessKeyId: process.env.AWS_ACCESS_KEY_ID,
  secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
});

export const generateUploadUrl = async (req: any, res: any) => {
  try {
    const date: any = new Date();
    const imgName = `${nanoid()}-${date.getTime().jpeg}`;
  
    const uploadUrl = await s3.getSignedUrlPromise("putObject", {
      Bucket: process.env.AWS_S3_BUCKET_NAME,
      Key: imgName,
      Expires: 1000,
      ContentType: "image/jpeg",
    });
    res.status(200).json({
      uploadUrl: uploadUrl
    });
  } catch (err) {
    throw err;
  }
};

export const uploadNewImg = async (req: any, res: any) => {
  try {
    const { filename, contentType, size, imageUrl, alt } = req.body;

    const gallery = await Gallery.create({
      filename,
      contentType,
      size,
      uploadDate: new Date(),
      imageUrl,
      metadata: {
        title: filename,
        alt: alt
      },
    });

    //send back response
    res.status(201).json({
      status: "success",
      gallery,
    });
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

import multer from 'multer';

const storage = multer.diskStorage({
  destination: function (req,file,cb) {
    cb(null,'./public/temp');
  },
  filename: function (req,file,cb) {
    const uniqueSuffix = Date.now() + '-' + Math.random();
    cb(null, file.originalname + "-" + uniqueSuffix)
  }
});

export const upload = multer({storage});
const mongoose = require("mongoose");

const gallerySchema = mongoose.Schema({
  filename: String, // Name of the image file
  contentType: String, // MIME type of the image (e.g., image/jpeg, image/png)
  size: Number, // Size of the image file in bytes
  uploadDate: Date, // Date and time when the image was uploaded
  metadata: {
    title: String,
    description: String,
    alt: String,
    tags: [String],
  },
  imageUrl: String, // URL of the image
});

const Gallery = mongoose.model("gallery", gallerySchema);
module.exports = Gallery;

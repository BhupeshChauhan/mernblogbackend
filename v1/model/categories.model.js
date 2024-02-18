const mongoose = require("mongoose");

const categoriesSchema = new mongoose.Schema(
  {
    id: String,
    name: {
      type: String,
      required: true,
    },
    featuredImage: {
      type: String,
      required: true,
    },
    slug: {
      type: String,
      required: true,
    },
    description: {
      type: String,
      required: true,
    },
    createdDate: {
      type: Date,
      default: Date.now,
    },
    inActive: Boolean,
  },
  { timestamps: true },
);

const Categories = mongoose.models?.categories || mongoose.model("categories", categoriesSchema)
module.exports = Categories;

import mongoose from 'mongoose'

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
    type: [String]
  },
  { timestamps: true },
);

const Categories = mongoose.models?.categories || mongoose.model("categories", categoriesSchema)
export default Categories;

const Tags = require("../model/tags.model");
const {validatePayload} = require("../utils")
const getAllTags = async (req, res) => {
  try {
    const TagData = await Tags.find();

    res.status(200).json({
      status: "success",
      TagData,
    });
  } catch (error) {
    console.error("Error:", error);
    res.status(500).json({
      message: "Internal Server Error"
    });
  }
};

const getOneTag = async (req, res) => {
  try {
    const TagData = await Tags.findById(req.params.tagsId)

    res.status(200).json({
      status: "success",
      TagData,
    });
  } catch (err) {
    console.error("Error:", error);
    res.status(500).json({
      message: "Internal Server Error"
    });
  }
};

const createNewTag = async (req, res) => {
  try {
    const requiredFields = ["name", "slug", "description", "featuredImage"];
    const validate = validatePayload(req.body, requiredFields);
    if (!validate?.payloadIsCurrect) {
      return {
        status: 400,
        message: `Missing required fields: ${validate.missingFields}`,
      };
    }
    const { name, slug, description, featuredImage } = req.body;

    const categoriesData = await Tags.find();

    const newcategories = new Tags({
      id: categoriesData.length + 1,
      name,
      slug,
      description,
      featuredImage,
    });

    await newcategories.save();

    //send back response
    res.status(201).json({
      status: "success",
    });
  } catch (err) {

    console.error("Error:", err);
    res.status(500).json({
      message: "Internal Server Error"
    });
  }
};

const updateOneTag = async (req, res) => {
  try {
    const requiredFields = [
      "id",
      "name",
      "description",
      "slug",
      "featuredImage",
    ];
    const validate = validatePayload(req.body, requiredFields);
    if (!validate?.payloadIsCurrect) {
      return {
        status: 400,
        message: `Missing required fields: ${validate.missingFields}`,
      };
    }
    const { id, name, description, slug, featuredImage } = await req.body;

    const filter = { id }; // Specify the criteria for the document to update
    const update = {
      $set: {
        name: name,
        description: description,
        slug: slug,
        featuredImage: featuredImage,
      },
    }; // Define the update operation

    await Tags.updateOne(filter, update);

    res.status(200).json({
      status: "Updated Succesfully",
    });
  } catch (err) {
    console.error("Error:", err);
    res.status(500).json({
      message: "Internal Server Error"
    });
  }
};

const deactivateOneTag = async (req, res) => {
  try {
    const {id} = req.body;
    const filter = { id }; // Specify the criteria for the document to update
    const update = { $set: { inActive: true } }; // Define the update operation

    await Tags.updateOne(filter, update);
    const categories = await Tags.find();
    //return deleted post
    res.status(200).json({
      status: "success",
      message: "Tag deactivate successfully",
      categories
    });
  } catch (err) {
    console.error("Error:", err);
  res.status(500).json({
    message: "Internal Server Error"
  });
  }
};

const activateOneTag = async (req, res) => {
  try {
    const {id} = req.body;
    const filter = { id }; // Specify the criteria for the document to update
    const update = { $set: { inActive: false } }; // Define the update operation

    await Tags.updateOne(filter, update);

    const categories = await Tags.find();

    //return deleted post
    res.status(200).json({
      status: "success",
      message: "Tag activate successfully",
      categories
    });
  } catch (err) {
    console.error("Error:", err);
  res.status(500).json({
    message: "Internal Server Error"
  });
  }
};

module.exports = {
  getAllTags,
  getOneTag,
  createNewTag,
  updateOneTag,
  deactivateOneTag,
  activateOneTag
};

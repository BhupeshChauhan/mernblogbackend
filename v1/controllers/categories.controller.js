const Categories = require("../model/categories.model");
const {validatePayload} = require("../utils")
const getAllCategories = async (req, res) => {
  try {
    const categories = await Categories.find();

    res.status(200).json({
      status: "success",
      categories,
    });
  } catch (error) {
    console.error("Error:", error);
    res.status(500).json({
      message: "Internal Server Error"
    });
  }
};

const getAllCategoriesActive = async (req, res) => {
  try {
    const categories = await Categories.find( {inActive: false});

    res.status(200).json({
      status: "success",
      categories,
    });
  } catch (error) {
    console.error("Error:", error);
    res.status(500).json({
      message: "Internal Server Error"
    });
  }
};

const getOneCategory = async (req, res) => {
  try {
    const categories = await Categories.findById(req.params.categoriesId)

    res.status(200).json({
      status: "success",
      categories,
    });
  } catch (err) {
    console.error("Error:", err);
    res.status(500).json({
      message: "Internal Server Error"
    });
  }
};

const createNewCategory = async (req, res) => {
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

    const categoriesData = await Categories.find();

    const newcategories = new Categories({
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

const updateOneCategory = async (req, res) => {
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

    await Categories.updateOne(filter, update);

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

const deactivateOneCategory = async (req, res) => {
  try {
    const {id} = req.body;
    const filter = { id }; // Specify the criteria for the document to update
    const update = { $set: { inActive: true } }; // Define the update operation

    await Categories.updateOne(filter, update);
    const categories = await Categories.find();
    //return deleted post
    res.status(200).json({
      status: "success",
      message: "Category deactivate successfully",
      categories
    });
  } catch (err) {
    console.error("Error:", err);
  res.status(500).json({
    message: "Internal Server Error"
  });
  }
};

const activateOneCategory = async (req, res) => {
  try {
    const {id} = req.body;
    const filter = { id }; // Specify the criteria for the document to update
    const update = { $set: { inActive: false } }; // Define the update operation

    await Categories.updateOne(filter, update);

    const categories = await Categories.find();

    //return deleted post
    res.status(200).json({
      status: "success",
      message: "Category activate successfully",
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
  getAllCategories,
  getOneCategory,
  createNewCategory,
  updateOneCategory,
  deactivateOneCategory,
  activateOneCategory,
  getAllCategoriesActive
};

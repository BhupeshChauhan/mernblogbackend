import Categories from '../model/categories'
import { validatePayload } from '../utils'

export const getAllCategories = async (req: any, res: any) => {
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

export const getAllByType = async (req: any, res: any) => {
  try {
    const {page, type} = req.body
    const maxLimit = 4;
    const posts = await Categories.find({ type: type, inActive: false });
    await Categories.find({ type: type, inActive: false }).skip((page - 1) * maxLimit)
    .limit(maxLimit)
    .then((categories: any) => {
      res.status(200).json({
        status: "success",
        response: {
          categories,
          total_length: posts.length,
        },
      });
    })
    .catch((err: any) => {
      console.error(err);
      res.status(500).json({
        status: "error",
        message: "Internal Server Error",
      });
    });
  } catch (error) {
    console.error("Error:", error);
    res.status(500).json({
      message: "Internal Server Error"
    });
  }
};
export const getAllCategoriesActive = async (req: any, res: any) => {
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

export const getOneCategory = async (req: any, res: any) => {
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

export const createNewCategory = async (req: any, res: any) => {
  try {
    const requiredFields = ["name", "slug", "description", "featuredImage", 'type'];
    const validate = validatePayload(req.body, requiredFields);
    if (!validate?.payloadIsCurrect) {
      return {
        status: 400,
        message: `Missing required fields: ${validate.missingFields}`,
      };
    }
    const { name, slug, description, featuredImage, type } = req.body;

    const categoriesData = await Categories.find();

    const newcategories = new Categories({
      id: categoriesData.length + 1,
      name,
      slug,
      description,
      featuredImage,
      inActive: false,
      type
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

export const updateOneCategory = async (req: any, res: any) => {
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
        inActive: false
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

export const deactivateOneCategory = async (req: any, res: any) => {
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

export const activateOneCategory = async (req: any, res: any) => {
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
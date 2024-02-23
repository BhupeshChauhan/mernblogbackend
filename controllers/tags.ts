import Tags from '../model/tags'
import { validatePayload } from '../utils'

export const getTagsList = async (req: any, res: any) => {
  try {
    const data = await Tags.find({inActive: false})

      res.status(200).json({
        status: "success",
        data,
      });
  } catch (error) {
    console.error("Error:", error);
    res.status(500).json({
      message: "Internal Server Error"
    });
  }
};

export const getAllTags = async (req: any, res: any) => {
  try {
    const { maxLimit, page, query } = req.body;

    const categoryList = await Tags.find();
    if (query && query.length > 0) {
      const filterQuery = { name: new RegExp(query, "i")};
      const data = await Tags.find(filterQuery)
        .skip((page - 1) * maxLimit)
        .limit(maxLimit);
      res.status(200).json({
        status: "success",
        data,
        pagination: {
          page,
          pagelength: categoryList.length,
          pageSize: maxLimit,
        },
      });
    } else {
      const data = await Tags.find()
        .skip((page - 1) * maxLimit)
        .limit(maxLimit);

      res.status(200).json({
        status: "success",
        data,
        pagination: {
          page,
          pagelength: categoryList.length,
          pageSize: maxLimit,
        },
      });
    }
  } catch (error) {
    console.error("Error:", error);
    res.status(500).json({
      message: "Internal Server Error"
    });
  }
};

export const getOneTag = async (req: any, res: any) => {
  try {
    const TagData = await Tags.findById(req.params.tagsId)

    res.status(200).json({
      status: "success",
      TagData,
    });
  } catch (err) {
    console.error("Error:", err);
    res.status(500).json({
      message: "Internal Server Error"
    });
  }
};

export const createNewTag = async (req: any, res: any) => {
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
      inActive: false
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

export const updateOneTag = async (req: any, res: any) => {
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

export const deactivateOneTag = async (req: any, res: any) => {
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

export const activateOneTag = async (req: any, res: any) => {
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

const Blog = require("../model/Blog");
const { validatePayload } = require("../utils");

const getAllPosts = async (req, res) => {
  try {
    const posts = await Blog.find();

    res.status(200).json({
      status: "success",
      posts,
    });
  } catch (err) {
    throw err;
  }
};

const getAllDraftPosts = async (req, res) => {
  try {
    const posts = await Blog.find({ draft: true });

    res.status(200).json({
      status: "success",
      posts,
    });
  } catch (err) {
    throw err;
  }
};

const getLatestPosts = async (req, res) => {
  try {
    const {page} = req.body
    const maxLimit = 5;
    const posts = await Blog.find({ draft: false, inActive: false });
    await Blog.find({ draft: false })
      .populate(
        "author",
        "personal_info.profile_img personal_info.username personal_info.fullname"
      )
      .sort({ publishedAt: -1 })
      .select("id title des banner activity categories publishedAt")
      .skip((page - 1) * maxLimit)
      .limit(maxLimit)
      .then((blogs) => {
        res.status(200).json({
          status: "success",
          response: {
            blogs,
            total_length: posts.length,
          },
        });
      })
      .catch((err) => {
        console.error(err);
        res.status(500).json({
          status: "error",
          message: "Internal Server Error",
        });
      });
  } catch (err) {
    console.error(err);
    res.status(500).json({
      status: "error",
      message: "Internal Server Error",
    });
  }
};

const getTrendingPosts = async (req, res) => {
  try {
    const maxLimit = 5;
    await Blog.find({ draft: false, inActive: false })
      .populate(
        "author",
        "personal_info.profile_img personal_info.username personal_info.fullname"
      )
      .sort({ publishedAt: -1, 'activity.total_reads': -1, 'activity.total_likes': -1 })
      .select("id title publishedAt")
      .limit(maxLimit)
      .then((blogs) => {
        res.status(200).json({
          status: "success",
          blogs,
        });
      })
      .catch((err) => {
        console.error(err);
        res.status(500).json({
          status: "error",
          message: "Internal Server Error",
        });
      });
  } catch (err) {
    console.error(err);
    res.status(500).json({
      status: "error",
      message: "Internal Server Error",
    });
  }
};

const getPostsByCategory = async (req, res) => {
  try {
    const {category, page} = req.body
    const filterQuery = { draft: false, categories: category, inActive: false }
    const maxLimit = 5;
    const posts = await Blog.find(filterQuery);
    await Blog.find(filterQuery)
      .populate(
        "author",
        "personal_info.profile_img personal_info.username personal_info.fullname"
      )
      .sort({ publishedAt: -1 })
      .select("id title des banner activity categories publishedAt")
      .skip((page - 1) * maxLimit)
      .limit(maxLimit)
      .then((blogs) => {
        res.status(200).json({
          status: "success",
          response: {
            blogs,
            total_length: posts.length,
          },
        });
      })
      .catch((err) => {
        console.error(err);
        res.status(500).json({
          status: "error",
          message: "Internal Server Error",
        });
      });
  } catch (err) {
    console.error(err);
    res.status(500).json({
      status: "error",
      message: "Internal Server Error",
    });
  }
};

const getSearchByQuery = async (req, res) => {
  try {
    const {query, page} = req.body
    const filterQuery = { draft: false, title: new RegExp(query, 'i'), inActive: false }
    const maxLimit = 5;
    const posts = await Blog.find(filterQuery);
    await Blog.find(filterQuery)
      .populate(
        "author",
        "personal_info.profile_img personal_info.username personal_info.fullname"
      )
      .sort({ publishedAt: -1 })
      .select("id title des banner activity categories publishedAt")
      .skip((page - 1) * maxLimit)
      .limit(maxLimit)
      .then((blogs) => {
        res.status(200).json({
          status: "success",
          response: {
            blogs,
            total_length: posts.length,
          },
        });
      })
      .catch((err) => {
        console.error(err);
        res.status(500).json({
          status: "error",
          message: "Internal Server Error",
        });
      });
  } catch (err) {
    console.error(err);
    res.status(500).json({
      status: "error",
      message: "Internal Server Error",
    });
  }
};

const getOnePost = async (req, res) => {
  try {
    const post = await Blog.findById(req.params.postsId).populate(
        "author",
        "personal_info.profile_img personal_info.username personal_info.fullname"
      );

    if (!post) {
      return res.status(404).json({
        status: "Failed",
        message: "Post with given Id not found",
      });
    } else {
      //increment the `readCount` property
      post.activity.total_reads++;
      await post.save();
    }

    res.status(200).json({
      status: "success",
      post,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({
      status: "error",
      message: "Internal Server Error",
    });
  }
};

const createNewPost = async (req, res) => {
  try {
    const {
      title,
      banner,
      content,
      tags,
      categories,
      des,
      author,
      excerpt,
      visible,
      slug,
      feature,
    } = req.body;
    const requiredFields = [
      "title",
      "banner",
      "content",
      "tags",
      "categories",
      "des",
      "author",
      "excerpt",
      "visible",
      "slug",
      "feature",
    ];
    const validate = validatePayload(req.body, requiredFields);
    if (!validate?.payloadIsCurrect) {
      return {
        status: 400,
        message: `Missing required fields: ${validate.missingFields}`,
      };
    }
    const BlogData = await Blog.find();
    const post = await Blog.create({
      id: BlogData.length + 1,
      title,
      banner,
      des,
      content,
      categories,
      tags,
      author,
      excerpt,
      visible,
      slug,
      feature,
      draft: false,
    });

    await post.save(); //save changes made to the user doc

    //send back response
    res.status(201).json({
      status: "success",
      post,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({
      status: "error",
      message: "Internal Server Error",
    });
  }
};

const createNewDraftPost = async (req, res) => {
  try {
    const {
      title,
      banner,
      content,
      tags,
      categories,
      des,
      author,
      excerpt,
      visible,
      slug,
      feature,
    } = req.body;
    const requiredFields = [
      "title",
      "banner",
      "content",
      "tags",
      "categories",
      "des",
      "author",
      "excerpt",
      "visible",
      "slug",
      "feature",
    ];
    const validate = validatePayload(req.body, requiredFields);
    if (!validate?.payloadIsCurrect) {
      return {
        status: 400,
        message: `Missing required fields: ${validate.missingFields}`,
      };
    }
    const BlogData = await Blog.find();
    const post = await Blog.create({
      id: BlogData.length + 1,
      title,
      banner,
      des,
      content,
      categories,
      tags,
      author,
      excerpt,
      visible,
      slug,
      feature,
      draft: true,
    });

    await post.save(); //save changes made to the user doc

    //send back response
    res.status(201).json({
      status: "success",
      post,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({
      status: "error",
      message: "Internal Server Error",
    });
  }
};
const updateOnePost = async (req, res) => {
  try {
    const {
      title,
      banner,
      content,
      tags,
      categories,
      des,
      author,
      excerpt,
      visible,
      slug,
      feature,
      id
    } = req.body;
    const requiredFields = [
      "id",
      "title",
      "banner",
      "content",
      "tags",
      "categories",
      "des",
      "author",
      "excerpt",
      "visible",
      "slug",
      "feature",
    ];
    const validate = validatePayload(req.body, requiredFields);
    if (!validate?.payloadIsCurrect) {
      return {
        status: 400,
        message: `Missing required fields: ${validate.missingFields}`,
      };
    }
    const filter = { id }; // Specify the criteria for the document to update
    const update = {
      $set: {
        title,
      banner,
      des,
      content,
      categories,
      tags,
      author,
      excerpt,
      visible,
      slug,
      feature,
      draft: false,
      },
    }; // Define the update operation

    await Blog.updateOne(filter, update);

    //send back response
    res.status(201).json({
      status: "success",
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({
      status: "error",
      message: "Internal Server Error",
    });
  }
};

const updateOneDraftPost = async (req, res) => {
  try {
    const {
      title,
      banner,
      content,
      tags,
      categories,
      des,
      author,
      excerpt,
      visible,
      slug,
      feature,
      id
    } = req.body;
    const requiredFields = [
      "id",
      "title",
      "banner",
      "content",
      "tags",
      "categories",
      "des",
      "author",
      "excerpt",
      "visible",
      "slug",
      "feature",
    ];
    const validate = validatePayload(req.body, requiredFields);
    if (!validate?.payloadIsCurrect) {
      return {
        status: 400,
        message: `Missing required fields: ${validate.missingFields}`,
      };
    }
    const filter = { id }; // Specify the criteria for the document to update
    const update = {
      $set: {
        title,
      banner,
      des,
      content,
      categories,
      tags,
      author,
      excerpt,
      visible,
      slug,
      feature,
      draft: true,
      },
    }; // Define the update operation

    await Blog.updateOne(filter, update);

    //send back response
    res.status(201).json({
      status: "success",
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({
      status: "error",
      message: "Internal Server Error",
    });
  }
};

const deactivateOnePost = async (req, res) => {
  try {
    const {id} = req.body;
    const filter = { id }; // Specify the criteria for the document to update
    const update = { $set: { inActive: true } }; // Define the update operation

    await Blog.updateOne(filter, update);
    const posts = await Blog.find();
    //return deleted post
    res.status(200).json({
      status: "success",
      message: "Post deactivate successfully",
      posts
    });
  } catch (err) {
    console.error("Error:", err);
  res.status(500).json({
    message: "Internal Server Error"
  });
  }
};

const activateOnePost = async (req, res) => {
  try {
    const {id} = req.body;
    const filter = { id }; // Specify the criteria for the document to update
    const update = { $set: { inActive: false } }; // Define the update operation

    await Blog.updateOne(filter, update);

    const posts = await Blog.find();

    //return deleted post
    res.status(200).json({
      status: "success",
      message: "Post activate successfully",
      posts
    });
  } catch (err) {
    console.error("Error:", err);
  res.status(500).json({
    message: "Internal Server Error"
  });
  }
};

module.exports = {
  getAllPosts,
  getOnePost,
  createNewPost,
  updateOnePost,
  deactivateOnePost,
  activateOnePost,
  getLatestPosts,
  getTrendingPosts,
  getPostsByCategory,
  getSearchByQuery,
  createNewDraftPost,
  updateOneDraftPost,
  getAllDraftPosts
};

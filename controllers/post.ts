import Blog from '../model/blog'
import { validatePayload } from '../utils'

export const getAllPosts = async (req: any, res: any) => {
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

export const getAllDraftPosts = async (req: any, res: any) => {
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

export const getAllFeaturedPosts = async (req: any, res: any) => {
  try {
    const filterQuery = { draft: false, feature: "Feature on Home", inActive: false }
    const maxLimit = 5;
    await Blog.find(filterQuery)
      .populate(
        "author",
        "personal_info.profile_img personal_info.username personal_info.fullname"
      )
      .sort({ publishedAt: -1 })
      .select("id title des banner activity categories publishedAt")
      .limit(maxLimit)
      .then((blogs: any) => {
        res.status(200).json({
          status: "success",
          blogs
        });
      })
      .catch((err: any) => {
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

export const getLatestPosts = async (req: any, res: any) => {
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
      .then((blogs: any) => {
        res.status(200).json({
          status: "success",
          response: {
            blogs,
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
  } catch (err) {
    console.error(err);
    res.status(500).json({
      status: "error",
      message: "Internal Server Error",
    });
  }
};

export const getTrendingPosts = async (req: any, res: any) => {
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
      .then((blogs: any) => {
        res.status(200).json({
          status: "success",
          blogs,
        });
      })
      .catch((err: any) => {
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

export const getPostsByCategory = async (req: any, res: any) => {
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
      .then((blogs: any) => {
        res.status(200).json({
          status: "success",
          response: {
            blogs,
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
  } catch (err) {
    console.error(err);
    res.status(500).json({
      status: "error",
      message: "Internal Server Error",
    });
  }
};

export const getSearchByQuery = async (req: any, res: any) => {
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
      .then((blogs: any) => {
        res.status(200).json({
          status: "success",
          response: {
            blogs,
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
  } catch (err) {
    console.error(err);
    res.status(500).json({
      status: "error",
      message: "Internal Server Error",
    });
  }
};

export const getOnePost = async (req: any, res: any) => {
  try {
    const post: any = await Blog.findById(req.params.postsId).populate(
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

export const createNewPost = async (req: any, res: any) => {
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
      inActive: false
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

export const createNewDraftPost = async (req: any, res: any) => {
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
      inActive: false
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
export const updateOnePost = async (req: any, res: any) => {
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

export const updateOneDraftPost = async (req: any, res: any) => {
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

export const deactivateOnePost = async (req: any, res: any) => {
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

export const activateOnePost = async (req: any, res: any) => {
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

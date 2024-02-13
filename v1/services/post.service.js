const getAllPosts = async () => {
  try {
    const posts = await Post.find({ state: "published" });
    return posts;
  } catch (err) {
    throw err;
  }
};

const getOnePost = () => {
  return;
};

const createNewPost = () => {
  return;
};

const updateOnePost = () => {
  return;
};

const deleteOnePost = () => {
  return;
};

module.exports = {
  getAllPosts,
  getOnePost,
  createNewPost,
  updateOnePost,
  deleteOnePost,
};

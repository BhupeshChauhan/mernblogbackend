const User = require("../model/user.model");
const { validatePayload } = require("../utils");
const Roles = require("../model/roles.model");

const getRolesData = async (UserData) => {
  let newUserData = [];
  for (const item of UserData) {
    const RolesData = await Roles.findOne({ id: Number(item?.roleId) });
    newUserData = [...newUserData, { ...item, role: RolesData?.name }];
  }
  return newUserData;
};

const getAllUsers = async (req, res) => {
  // *** ADD ***
  try {
    const UserData = await User.find();
    let newUserData = await getRolesData(JSON.parse(JSON.stringify(UserData)));
    res.status(200).json({
      status: "success",
      UserData: newUserData,
    });
  } catch (error) {
    console.error("Error:", error);
    res.status(500).json({
      message: "Internal Server Error",
    });
  }
};

const getOneUser = async (req, res) => {
  try {
    const UserData = await User.findById(req.params.userId);
    const RolesData = await Roles.findOne({
      id: Number(UserData?.roleId),
    });

    delete UserData.password;
    res.status(200).json({
      status: "success",
      UserData: {
        ...JSON.parse(JSON.stringify(UserData)),
        role: JSON.parse(JSON.stringify(RolesData))?.name,
      },
    });
  } catch (err) {
    console.error("Error:", err);
    res.status(500).json({
      message: "Internal Server Error",
    });
  }
};

const createNewUser = async (req, res) => {
  try {
    const requiredFields = [
      "name",
      "email",
      "password",
      "role",
      "bio",
      "profilePicture",
    ];
    const validate = validatePayload(req.body, requiredFields);
    if (!validate?.payloadIsCurrect) {
      return {
        status: 400,
        message: `Missing required fields: ${validate.missingFields}`,
      };
    }
    const { name, email, password, role, bio, profilePicture } = req.body;

    const existingUser = await User.findOne({ email });

    if (existingUser) {
      res.status(400).json({
        status: "Email already in use",
      });
    }

    const RolesData = await Roles.findOne({ name: role });
    const UserData = await User.find();

    const newUser = new User({
      id: UserData.length + 1,
      personal_info: {
        fullname: name,
        bio,
        profile_img: profilePicture,
        email,
        password,
        inActive: false,
        username: name + Math.random(4).toString(),
      },
      roleId: RolesData.id,
      client: false,
    });

    await newUser.save();

    //send back response
    res.status(201).json({
      status: "success",
    });
  } catch (err) {
    console.error("Error:", err);
    res.status(500).json({
      message: "Internal Server Error",
    });
  }
};

const updateOneUser = async (req, res) => {
  try {
    const requiredFields = ["name", "email", "role", "bio", "profilePicture"];
    const validate = validatePayload(req.body, requiredFields);
    if (!validate?.payloadIsCurrect) {
      return {
        status: 400,
        message: `Missing required fields: ${validate.missingFields}`,
      };
    }
    const { id, name, email, role, bio, profilePicture } = await req.body;
    const RolesData = await Roles.findOne({ name: role });
    const filter = { id }; // Specify the criteria for the document to update

    const update = {
      $set: {
        personal_info: {
          fullname: name,
          bio,
          profile_img: profilePicture,
          email,
        },
        roleId: RolesData.id,
        client: false,
      },
    }; // Define the update operation

    await User.updateOne(filter, update);

    res.status(200).json({
      status: "Updated Succesfully",
    });
  } catch (err) {
    console.error("Error:", err);
    res.status(500).json({
      message: "Internal Server Error",
    });
  }
};

const deactivateOneUser = async (req, res) => {
  try {
    const { id } = req.body;
    const filter = { id }; // Specify the criteria for the document to update
    const update = { $set: { "personal_info.inActive": true } }; // Define the update operation

    await User.updateOne(filter, update);
    const UserData = await User.find();
    console.log(filter, update)
    //return deleted post
    res.status(200).json({
      message: "User deactivate successfully",
      UserData,
    });
  } catch (err) {
    console.error("Error:", err);
    res.status(500).json({
      message: "Internal Server Error",
    });
  }
};

const activateOneUser = async (req, res) => {
  try {
    const { id } = req.body;
    const filter = { id }; // Specify the criteria for the document to update
    const update = { $set: { "personal_info.inActive": false } }; // Define the update operation

    await User.updateOne(filter, update);

    const UserData = await User.find();

    //return deleted post
    res.status(200).json({
      status: "success",
      message: "User activate successfully",
      UserData,
    });
  } catch (err) {
    console.error("Error:", err);
    res.status(500).json({
      message: "Internal Server Error",
    });
  }
};

module.exports = {
  getAllUsers,
  getOneUser,
  createNewUser,
  updateOneUser,
  deactivateOneUser,
  activateOneUser,
};

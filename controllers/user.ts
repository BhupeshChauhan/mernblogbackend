import User from '../model/user'
import { validatePayload } from '../utils'
import Roles from '../model/roles'

export const getRolesData = async (UserData: any) => {
  let newUserData: any = [];
  for (const item of UserData) {
    const RolesData = await Roles.findOne({ id: Number(item?.roles) });
    newUserData = [...newUserData, { ...item, role: RolesData?.name }];
  }
  return newUserData;
};

export const getAllUsers = async (req: any, res: any) => {
  // *** ADD ***
  try {
    const { maxLimit, page, query } = req.body;

    const categoryList = await User.find();
    if (query && query.length > 0) {
      const filterQuery = { "personal_info.fullname": new RegExp(query, "i")};
      const data = await User.find(filterQuery)
        .populate("roles", "name description id")
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
      const data = await User.find()
      .populate("roles", "name description id")
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
      message: "Internal Server Error",
    });
  }
};

export const getAllClientUsers = async (req: any, res: any) => {
  // *** ADD ***
  try {
    const { maxLimit, page, query } = req.body;

    const categoryList = await User.find();
    if (query && query.length > 0) {
      const filterQuery = { "personal_info.fullname": new RegExp(query, "i"), client: true};
      const data = await User.find(filterQuery)
        .populate("roles", "name description id")
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
      const data = await User.find({ client: true})
      .populate("roles", "name description id")
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
      message: "Internal Server Error",
    });
  }
};

export const getOneUser = async (req: any, res: any) => {
  try {
    const UserData: any = await User.findById(req.params.userId);
    const RolesData = await Roles.findOne({
      id: Number(UserData?.roles),
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

export const createNewUser = async (req: any, res: any) => {
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

    const RolesData: any = await Roles.findOne({ name: role });
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
        username: name + Math.random().toString(),
      },
      roles: RolesData.id,
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

export const updateOneUser = async (req: any, res: any) => {
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
    const RolesData: any = await Roles.findOne({ name: role });
    const filter = { id }; // Specify the criteria for the document to update

    const update = {
      $set: {
        personal_info: {
          fullname: name,
          bio,
          profile_img: profilePicture,
          email,
        },
        roles: RolesData.id,
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

export const deactivateOneUser = async (req: any, res: any) => {
  try {
    const { id } = req.body;
    const filter = { id }; // Specify the criteria for the document to update
    const update = { $set: { "personal_info.inActive": true } }; // Define the update operation

    await User.updateOne(filter, update);
    const UserData = await User.find();
    
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

export const activateOneUser = async (req: any, res: any) => {
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
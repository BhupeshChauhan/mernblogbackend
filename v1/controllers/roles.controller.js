const Roles = require("../model/roles.model");
const User = require("../model/user.model");
const ModulePermissions = require("../model/modulePermissions.model");
const { validatePayload, modulePermissionsFunc, modulePermissionsCnvrt } = require("../utils");
const getAllRoles = async (req, res) => {
  try {
    const RoleData = await Roles.find();

    res.status(200).json({
      status: "success",
      RoleData,
    });
  } catch (error) {
    console.error("Error:", error);
    res.status(500).json({
      message: "Internal Server Error",
    });
  }
};

async function createModulePermissions(id, payload) {
  try {
    const modulePermissions = modulePermissionsFunc(payload);

    const newModulePermissions = new ModulePermissions({
      id: id,
      ...modulePermissions,
    });
    await newModulePermissions.save();
    return { status: 200, message: "Added Succesfully" };
  } catch (error) {
    console.error("Error:", error);
    throw error;
  }
}

async function updateModulePermissions(payload) {
  try {
    const modulePermissions = modulePermissionsFunc(payload);

    const filter = { id: payload.id }; // Specify the criteria for the document to update
    const update = { $set: modulePermissions }; // Define the update operation
    const res = await ModulePermissions.updateOne(filter, update);

    return { status: 200, message: "Updated Succesfully" };
  } catch (error) {
    console.error("Error:", error);

    return { status: 500, message: "Internal Server Error" };
  }
}

async function deleteModulePermissions(id) {
  try {
    const filter = { id: id }; // Specify the criteria for the document to update
    const update = { $set: { $set: { inActive: true } } }; // Define the update operation
    const res = await ModulePermissions.updateOne(filter, update);

    return { status: 200, message: "Updated Succesfully" };
  } catch (error) {
    console.error("Error:", error);

    return { status: 500, message: "Internal Server Error" };
  }
}

async function activateModulePermissions(id) {
  try {
    const filter = { id: id }; // Specify the criteria for the document to update
    const update = { $set: { $set: { inActive: false } } }; // Define the update operation
    const res = await ModulePermissions.updateOne(filter, update);

    return { status: 200, message: "Updated Succesfully" };
  } catch (error) {
    console.error("Error:", error);

    return { status: 500, message: "Internal Server Error" };
  }
}

const getOneRole = async (req, res) => {
  try {
    const RoleData = await Roles.findById(req.params.roleId);

    const modulePermissions = await ModulePermissions.findOne( {id: RoleData.id } );

    const newModulePermissions =
    await modulePermissionsCnvrt(modulePermissions);
    res.status(200).json({
      status: "success",
      RoleData :{
        ...newModulePermissions,
        ...JSON.parse(JSON.stringify(RoleData)),
      },
    });
  } catch (err) {
    console.error("Error:", err);
    res.status(500).json({
      message: "Internal Server Error",
    });
  }
};

const createNewRole = async (req, res) => {
  try {
    const requiredFields = ["name", "description"];
    const validate = validatePayload(req.body, requiredFields);
    if (!validate?.payloadIsCurrect) {
      return {
        status: 400,
        message: `Missing required fields: ${validate.missingFields}`,
      };
    }
    const { name, description } = req.body;

    const RolesData = await Roles.find();

    const newRoles = new Roles({
      id: RolesData.length + 1,
      name,
      description,
    });

    await createModulePermissions(RolesData.length + 1, req.body);
    await newRoles.save();

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

const updateOneRole = async (req, res) => {
  try {
    const requiredFields = ["name", "description"];
    const validate = validatePayload(req.body, requiredFields);
    if (!validate?.payloadIsCurrect) {
      return {
        status: 400,
        message: `Missing required fields: ${validate.missingFields}`,
      };
    }
    const { id, name, description } = await req.body;

    const filter = { id }; // Specify the criteria for the document to update
    const update = { $set: { name: name, description: description } }; // Define the update operation
    await updateModulePermissions(req.body);

    await Roles.updateOne(filter, update);

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

const deactivateOneRole = async (req, res) => {
  try {
    const { id } = req.body;
    const filter = { id }; // Specify the criteria for the document to update
    const update = { $set: { inActive: true } }; // Define the update operation

    await deleteModulePermissions(id);

    const UserData = await User.find({ client: false, roleId: id });

    for (const user of UserData) {
      const { id } = user;
      const filter = { id }; // Specify the criteria for the document to update
      const update = { $set: { "personal_info.inActive": true } }; // Define the update operation

      await User.updateOne(filter, update);
    }

    await Roles.updateOne(filter, update);
    const RoleData = await Roles.find();
    //return deleted post
    res.status(200).json({
      status: "success",
      message: "Category deactivate successfully",
      RoleData,
    });
  } catch (err) {
    console.error("Error:", err);
    res.status(500).json({
      message: "Internal Server Error",
    });
  }
};

const activateOneRole = async (req, res) => {
  try {
    const { id } = req.body;
    const filter = { id }; // Specify the criteria for the document to update
    const update = { $set: { inActive: false } }; // Define the update operation

    await Roles.updateOne(filter, update);

    await activateModulePermissions(id);

    const UserData = await User.find({ client: false, roleId: id });

    for (const user of UserData) {
      const { id } = user;
      const filter = { id }; // Specify the criteria for the document to update
      const update = { $set: { "personal_info.inActive": false } }; // Define the update operation

      await User.updateOne(filter, update);
    }

    const RoleData = await Roles.find();

    //return deleted post
    res.status(200).json({
      status: "success",
      message: "Category activate successfully",
      RoleData,
    });
  } catch (err) {
    console.error("Error:", err);
    res.status(500).json({
      message: "Internal Server Error",
    });
  }
};

module.exports = {
  getAllRoles,
  getOneRole,
  createNewRole,
  updateOneRole,
  deactivateOneRole,
  activateOneRole,
};

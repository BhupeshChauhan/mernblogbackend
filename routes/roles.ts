import express from 'express';
import { activateOneRole, createNewRole, deactivateOneRole, getAllRoles, getOneRole, getRolesList, updateOneRole } from '../controllers/roles';

const rolesRoutes = express.Router();

rolesRoutes.get("/", getRolesList);

rolesRoutes.post("/", getAllRoles);

rolesRoutes.get("/:roleId", getOneRole);

rolesRoutes.post("/create", createNewRole);

rolesRoutes.patch("/:roleId", updateOneRole);

rolesRoutes.post("/deactivate", deactivateOneRole);

rolesRoutes.post("/activate", activateOneRole);

export default rolesRoutes;
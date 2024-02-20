import express from 'express';
import { activateOneRole, createNewRole, deactivateOneRole, getAllRoles, getOneRole, updateOneRole } from '../controllers/roles';

const rolesRoutes = express.Router();

rolesRoutes.get("/", getAllRoles);

rolesRoutes.get("/:roleId", getOneRole);

rolesRoutes.post("/", createNewRole);

rolesRoutes.patch("/:roleId", updateOneRole);

rolesRoutes.post("/deactivate", deactivateOneRole);

rolesRoutes.post("/activate", activateOneRole);

export default rolesRoutes;
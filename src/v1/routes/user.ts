//import express
import express from 'express';
import { login, signup } from '../auth/auth';
import { activateOneUser, createNewUser, deactivateOneUser, getAllUsers, getOneUser, updateOneUser } from '../controllers/user';

//create router
const userRoutes = express.Router();

//API endpoint for an author
// router.get('/author', authenticate, getAllPosts);

//API endpoint for signup and login
userRoutes.post("/signup", signup)

userRoutes.post("/login", login)

userRoutes.get("/", getAllUsers);

userRoutes.get("/:userId", getOneUser);

userRoutes.post("/", createNewUser);

userRoutes.patch("/:userId", updateOneUser);

userRoutes.post("/deactivate", deactivateOneUser);

userRoutes.post("/activate", activateOneUser);

export default userRoutes;
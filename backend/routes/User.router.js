import express from 'express';
import * as userController from '../controllers/UserRoute_controller.js';
import { authenticateJWT } from '../middlewares/Auth.js';
import multer from 'multer';
import { isOwnerOrAdmin } from '../middlewares/Authorization.js';
import User from '../models/User.js';

const upload = multer({ dest: 'uploads/' }); 
const userRouter = express.Router();

userRouter.get('/', authenticateJWT, userController.GetAllUser);
userRouter.get('/:userId', authenticateJWT, userController.GetIDUser);
userRouter.put("/:userId", authenticateJWT, isOwnerOrAdmin(User, "userId"), upload.single("image"),  userController.PutUser);
userRouter.delete('/:userId', authenticateJWT, isOwnerOrAdmin(User, "userId"), userController.DeleteUser);


export default userRouter;

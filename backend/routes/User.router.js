import express from 'express';
import * as userController from '../controllers/UserRoute_controller.js';
import { authenticateJWT } from '../middlewares/auth.js';

const userRouter = express.Router();

userRouter.get('/', authenticateJWT, userController.GetAllUser);
userRouter.get('/:userId', authenticateJWT, userController.GetIDUser);
userRouter.put("/:userId", authenticateJWT, userController.PutUser);
userRouter.delete('/:userId', authenticateJWT, userController.DeleteUser);


export default userRouter;

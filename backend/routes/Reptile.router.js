import express from 'express';
import * as reptileController from '../controllers/ReptileRoute_controller.js';
import { authenticateJWT } from '../middlewares/Auth.js';
import { isOwnerOrAdmin } from '../middlewares/Authorization.js';
import multer from 'multer';
import Reptile from '../models/Reptile.js';

const reptileRouter = express.Router();
const upload = multer({ dest: 'uploads/' });

reptileRouter.get('/', authenticateJWT, reptileController.GetAllReptile);
reptileRouter.get('/:reptileId', authenticateJWT, isOwnerOrAdmin(Reptile, 'reptileId'), reptileController.GetIDReptile);
reptileRouter.get('/:userId/AllReptile', authenticateJWT, reptileController.GetAllReptileByUser);
reptileRouter.post('/', authenticateJWT, upload.single('image'), reptileController.PostReptile);
reptileRouter.put('/:reptileId', authenticateJWT, upload.single('image'), isOwnerOrAdmin(Reptile, 'reptileId'), reptileController.PutReptile);
reptileRouter.delete('/:reptileId', authenticateJWT, isOwnerOrAdmin(Reptile, 'reptileId'), reptileController.DeleteReptile);

export default reptileRouter;

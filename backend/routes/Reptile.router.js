import express from 'express';
import * as reptileController from '../controllers/ReptileRoute_controller.js';
import { authenticateJWT } from '../middlewares/auth.js';
import multer from 'multer';

const reptileRouter = express.Router();
const upload = multer({ dest: 'uploads/' }); 

reptileRouter.get('/', authenticateJWT, reptileController.GetAllReptile);
reptileRouter.get('/:reptileId', authenticateJWT, reptileController.GetIDReptile);
reptileRouter.get('/:userId/AllReptile', authenticateJWT, reptileController.GetAllReptileByUser);
reptileRouter.post("/", authenticateJWT, upload.single("image"), reptileController.PostReptile);
reptileRouter.put("/:reptileId", authenticateJWT, reptileController.PutReptile);
reptileRouter.delete('/:reptileId', authenticateJWT, reptileController.DeleteReptile);


export default reptileRouter;

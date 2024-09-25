import express from 'express';
import * as feedingController from '../controllers/FeedingRoute_controller.js';
import { authenticateJWT } from '../middlewares/auth.js';

const feedingRouter = express.Router();

feedingRouter.get('/:reptileId', authenticateJWT, feedingController.GetReptileFeeding);
feedingRouter.post("/:reptileId", authenticateJWT, feedingController.PostFeeding);
feedingRouter.put("/:feedingId", authenticateJWT, feedingController.PutFeeding);
feedingRouter.delete('/:feedingId', authenticateJWT, feedingController.DeleteFeeding);


export default feedingRouter;

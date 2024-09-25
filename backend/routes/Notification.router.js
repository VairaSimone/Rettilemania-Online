import express from 'express';
import * as notificationController from '../controllers/NotificationRoute_controller.js';
import { authenticateJWT } from '../middlewares/Auth.js';

const notificationRouter = express.Router();

notificationRouter.get('/user/:userId', authenticateJWT, notificationController.getUserNotifications);
notificationRouter.post('/reptile/:reptileId/', authenticateJWT, notificationController.createNotification);
notificationRouter.put('/:notificationId', authenticateJWT, notificationController.updateNotification);
notificationRouter.get('/unread/count', authenticateJWT, notificationController.getUnreadNotificationCount);
notificationRouter.delete('/:notificationId', authenticateJWT, notificationController.deleteNotification);

export default notificationRouter;

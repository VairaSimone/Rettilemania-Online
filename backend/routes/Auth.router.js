import express from 'express';
import * as authController from '../controllers/AuthRoute_controller.js';
import { authenticateJWT } from '../middlewares/auth.js';
import { refreshToken } from '../config/RefreshToken.js';
import passport from 'passport';

const authRouter = express.Router();

authRouter.get('/me', authenticateJWT, authController.getMe);
authRouter.post('/login', authController.login);
authRouter.post('/register', authController.register);
authRouter.post('/refresh-token', refreshToken); // Route to request refresh token
authRouter.post('/logout', authController.logout);
authRouter.get("/login-google", passport.authenticate("google", { scope: ["profile", "email"] }))
authRouter.get("/callback-google", passport.authenticate("google", { session: false }), authController.callBackGoogle)

export default authRouter;

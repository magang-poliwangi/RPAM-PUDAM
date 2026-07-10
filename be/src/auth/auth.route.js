import express from 'express';
import AuthController from './auth.controller.js';
import validate from '../middlewares/validate.js';
import { loginSchema } from './auth.validator.js';
import authenticateToken from '../middlewares/authenticate-token.js';

const authRouter = express.Router();

authRouter.post('/login', validate(loginSchema), AuthController.login);
authRouter.post('/logout', authenticateToken, AuthController.logout);

export default authRouter;

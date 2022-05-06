import express from 'express';
import { userSiginController, userRegisterController } from '../controller/authController.js';

const authRouter = express.Router();

authRouter.route('/signin').post(userSiginController);

authRouter.route('/register').post(userRegisterController);

export default authRouter;

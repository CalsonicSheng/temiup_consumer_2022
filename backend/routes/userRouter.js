import express from 'express';
import { getTargetUserController, updateTargetUserController } from '../controller/userController.js';
import { jwtVerificationHandler } from '../middleware/localMiddleware.js';

const userRouter = express.Router();

userRouter.route('/').get(jwtVerificationHandler, getTargetUserController);

userRouter.route('/').put(jwtVerificationHandler, updateTargetUserController);

export default userRouter;

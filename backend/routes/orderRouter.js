import express from 'express';
import { getTargetUserOrderController, joinTeamAndCreateNewOrderController } from '../controller/orderController.js';
import { jwtVerificationHandler } from '../middleware/localMiddleware.js';

const orderRouter = express.Router();

// this new order creation will does lots other stuffer to sync up with rest of the app
orderRouter.route('/:selectTeamId').post(jwtVerificationHandler, joinTeamAndCreateNewOrderController);

orderRouter.route('/').get(jwtVerificationHandler, getTargetUserOrderController);

export default orderRouter;

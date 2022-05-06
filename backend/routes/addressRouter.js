import express from 'express';
import {
  createTargetUserNewAddressController,
  deleteTargetUserSelectedAddressController,
  getTargetUserAddressesController,
  getTargetUserNewestAddressController,
  updateTargetUserSelectedAddressController,
} from '../controller/addressController.js';
import { jwtVerificationHandler } from '../middleware/localMiddleware.js';

const addressRouter = express.Router();

addressRouter.route('/').get(jwtVerificationHandler, getTargetUserAddressesController);

addressRouter.route('/newest').get(jwtVerificationHandler, getTargetUserNewestAddressController);

addressRouter.route('/').post(jwtVerificationHandler, createTargetUserNewAddressController);

addressRouter.route('/:selectedAddressId').put(jwtVerificationHandler, updateTargetUserSelectedAddressController);

addressRouter.route('/:selectedAddressId').delete(jwtVerificationHandler, deleteTargetUserSelectedAddressController);

export default addressRouter;

import express from 'express';
import { deleteOneSavedTeamController, getSavedTeamsController, saveTeamController } from '../controller/savedTeamController.js';
import { jwtVerificationHandler } from '../middleware/localMiddleware.js';

const savedTeamRouter = express.Router();

savedTeamRouter.route('/').get(jwtVerificationHandler, getSavedTeamsController);

savedTeamRouter.route('/').post(jwtVerificationHandler, saveTeamController);

savedTeamRouter.route('/:selectedSavedTeamId').delete(jwtVerificationHandler, deleteOneSavedTeamController);

export default savedTeamRouter;

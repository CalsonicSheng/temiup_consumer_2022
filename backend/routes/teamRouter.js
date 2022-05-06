import express from 'express';
import { getAllTeamsController, getAlmostCompleteTeamsController, getCategoryListController, getNewTeamsController } from '../controller/teamController.js';
import { getSelectedTeamController } from '../controller/teamController.js';

const teamRouter = express.Router();

teamRouter.route('/').get(getCategoryListController);

teamRouter.route('/all-teams').get(getAllTeamsController);

teamRouter.route('/almost-complete-teams').get(getAlmostCompleteTeamsController);

teamRouter.route('/new-teams').get(getNewTeamsController);

teamRouter.route('/:selectedTeamId').get(getSelectedTeamController);

export default teamRouter;

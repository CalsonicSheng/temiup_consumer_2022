import { deleteSavedTeamErrorHandler, savedTeamsFetchErrorHandler, saveNewTeamErrorHandler } from '../error/errorHandling.js';
import SavedTeamsModel from '../models/savedTeamsModel.js';
import { savedTeamsPriceSummaryHandler } from '../utils/utils.js';

async function getSavedTeamsController(req, res, next) {
  console.log('getSavedTeamsController run');
  const targetUserId = req.userId;
  try {
    const savedTeamsList = await SavedTeamsModel.find({ userId: targetUserId });
    const savedTeamsCount = savedTeamsList.length;
    const savedTeamsPriceSummary = savedTeamsPriceSummaryHandler(savedTeamsList);
    const responseObject = { savedTeamsList, savedTeamsCount, savedTeamsPriceSummary };
    res.status(200).json(responseObject);
  } catch (error) {
    console.log(error);
    const customizedErrorObject = savedTeamsFetchErrorHandler();
    next(customizedErrorObject);
  }
}

//----------------------------------------------------------------------------------------------------------------------------------------------------------------------------

async function saveTeamController(req, res, next) {
  console.log('saveTeamController run');

  const targetUserId = req.userId;
  const newSavedTeamObject = req.body;
  newSavedTeamObject.userId = targetUserId;

  // all the res.json will not return the latest updated version. Because the save team action is conduct ON THE DIFFERENT PAGE THAN WHERE THE SAVED TEAM LIST IS REQUEST
  try {
    const isTeamExisting = await SavedTeamsModel.findOne({ userId: targetUserId, teamId: newSavedTeamObject.teamId });
    if (isTeamExisting !== null) {
      // same doc already exist, no new doc creation
      const savedTeamsCount = await SavedTeamsModel.countDocuments({ userId: targetUserId }); // only send back doc count number | this CRUD operation is done on different page in frontend
      res.status(201).json(savedTeamsCount);
    }
    if (isTeamExisting === null) {
      // doc does not exist yet, create new doc
      await SavedTeamsModel.create(newSavedTeamObject);
      const savedTeamsCount = await SavedTeamsModel.countDocuments({ userId: targetUserId }); // only send back doc count number | this CRUD operation is done on different page in frontend
      res.status(201).json(savedTeamsCount);
    }
  } catch (error) {
    console.log(error);
    const customizedErrorObject = saveNewTeamErrorHandler();
    next(customizedErrorObject);
  }
}

//----------------------------------------------------------------------------------------------------------------------------------------------------------------------------

async function deleteOneSavedTeamController(req, res, next) {
  console.log('deleteOneSavedTeamController run');

  const targetUserId = req.userId;
  const selectedSavedTeamId = req.params.selectedSavedTeamId;

  try {
    // delete first
    await SavedTeamsModel.deleteOne({ _id: selectedSavedTeamId });

    // and then fetch again
    const savedTeamsList = await SavedTeamsModel.find({ userId: targetUserId });
    const savedTeamsCount = savedTeamsList.length;
    const savedTeamsPriceSummary = savedTeamsPriceSummaryHandler(savedTeamsList);
    const responseObject = { savedTeamsList, savedTeamsCount, savedTeamsPriceSummary };
    res.status(200).json(responseObject);
  } catch (error) {
    console.log(error);
    const customizedErrorObject = deleteSavedTeamErrorHandler();
    next(customizedErrorObject);
  }
}

export { getSavedTeamsController, saveTeamController, deleteOneSavedTeamController };

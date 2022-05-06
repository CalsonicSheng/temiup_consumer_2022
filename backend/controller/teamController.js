import { teamFetchErrorHandler } from '../error/errorHandling.js';
import TeamModel from '../models/teamModel.js';
import CategoryModel from '../models/categoryModel.js';
import '../models/vendorModel.js';
import '../models/userModel.js';
import { capitalizeHandler } from '../utils/utils.js';
import { selectedTeamFetchErrorHandler } from '../error/errorHandling.js';
import { populateSingleTeamDocHandler } from '../utils/utils.js';

// NOTE, all category stored data is lowercase in backend data base
// but when we send to the frontend, it will change to capitalized version (on first letter)

async function getCategoryListController(req, res, next) {
  console.log('getCategoryListController run');
  try {
    let categoryList = await CategoryModel.find({}, { category: 1, _id: 0 });
    categoryList = categoryList.map((e) => {
      return capitalizeHandler(e.category);
    });
    res.status(200).json(categoryList);
  } catch (error) {
    console.log(error);
    const customizedErrorObject = teamFetchErrorHandler();
    next(customizedErrorObject);
  }
}

//-----------------------------------------------------------------------------------------------------------------------

const docSize = 16; // this same value will be used across all 3 following different tabs

async function getAllTeamsController(req, res, next) {
  console.log('getAllTeamsController run');
  const { selectedCategory, selectedPage } = req.query;

  try {
    if (selectedCategory === 'all') {
      const totalTeamDocCount = await TeamModel.countDocuments({ teamStatus: 'available' });
      const totalPageCount = Math.ceil(totalTeamDocCount / docSize);

      const allTeams = await TeamModel.find({ teamStatus: 'available' })
        .skip(docSize * selectedPage)
        .limit(docSize);

      const responseObject = { totalPageCount, fetchedTeamList: allTeams };
      res.status(200).json(responseObject);
    }
    if (selectedCategory !== 'all') {
      const totalTeamDocCount = await TeamModel.countDocuments({ category: selectedCategory, teamStatus: 'available' });
      const totalPageCount = Math.ceil(totalTeamDocCount / docSize);

      const allTeamsByCategory = await TeamModel.find({ category: selectedCategory, teamStatus: 'available' })
        .skip(docSize * selectedPage)
        .limit(docSize);

      const responseObject = { totalPageCount, fetchedTeamList: allTeamsByCategory };

      res.status(200).json(responseObject);
    }
  } catch (error) {
    console.log(error);
    const customizedErrorObject = teamFetchErrorHandler();
    next(customizedErrorObject);
  }
}

//-----------------------------------------------------------------------------------------------------------------------

async function getAlmostCompleteTeamsController(req, res, next) {
  console.log('getAlmostCompleteTeamsController run');
  const { selectedCategory, selectedPage } = req.query;

  try {
    if (selectedCategory === 'all') {
      const totalTeamDocCount = await TeamModel.countDocuments({ teamStatus: 'available' });
      const totalPageCount = Math.ceil(totalTeamDocCount / docSize);

      const almostCompleteTeams = await TeamModel.find({ teamStatus: 'available' })
        .sort({ currentTeamSize: -1 })
        .skip(docSize * selectedPage)
        .limit(docSize);

      const responseObject = { totalPageCount, fetchedTeamList: almostCompleteTeams };

      res.status(200).json(responseObject);
    }
    if (selectedCategory !== 'all') {
      const totalTeamDocCount = await TeamModel.countDocuments({ teamStatus: 'available', category: selectedCategory });
      const totalPageCount = Math.ceil(totalTeamDocCount / docSize);

      const almostCompleteTeamsByCategory = await TeamModel.where('category')
        .equals(selectedCategory)
        .where('teamStatus')
        .equals('available')
        .sort({ currentTeamSize: -1 })
        .skip(docSize * selectedPage)
        .limit(docSize);

      const responseObject = { totalPageCount, fetchedTeamList: almostCompleteTeamsByCategory };

      res.status(200).json(responseObject);
    }
  } catch (error) {
    console.log(error);
    const customizedErrorObject = teamFetchErrorHandler();
    next(customizedErrorObject);
  }
}

//-----------------------------------------------------------------------------------------------------------------------

async function getNewTeamsController(req, res, next) {
  console.log('getNewTeamsController run');
  const { selectedCategory, selectedPage } = req.query;

  try {
    if (selectedCategory === 'all') {
      const totalTeamDocCount = await TeamModel.countDocuments({ teamStatus: 'available' });
      const totalPageCount = Math.ceil(totalTeamDocCount / docSize);

      const allNewTeams = await TeamModel.find({ teamStatus: 'available' })
        .sort({ createdAt: -1 })
        .skip(docSize * selectedPage)
        .limit(docSize);

      const responseObject = { totalPageCount, fetchedTeamList: allNewTeams };

      res.status(200).json(responseObject);
    }
    if (selectedCategory !== 'all') {
      const totalTeamDocCount = await TeamModel.countDocuments({ teamStatus: 'available', category: selectedCategory });
      const totalPageCount = Math.ceil(totalTeamDocCount / docSize);

      const allNewTeamsByCategory = await TeamModel.where('category')
        .equals(selectedCategory)
        .where('teamStatus')
        .equals('available')
        .sort({ createdAt: -1 })
        .skip(docSize * selectedPage)
        .limit(docSize);

      const responseObject = { totalPageCount, fetchedTeamList: allNewTeamsByCategory };

      res.status(200).json(responseObject);
    }
  } catch (error) {
    console.log(error);
    const customizedErrorObject = teamFetchErrorHandler();
    next(customizedErrorObject);
  }
}

//---------------------------------------------------------------------------------------------------------------------------------------------

async function getSelectedTeamController(req, res, next) {
  // console.log('getSelectedTeamController run');
  const selectedTeamId = req.params.selectedTeamId;
  try {
    const selectedTeam = await TeamModel.findById(selectedTeamId);
    if (selectedTeam === null) {
      throw new Error('The resources you request may not exist. Please try to explore some other teams');
    } else {
      const selectedTeamPopulated = await populateSingleTeamDocHandler(selectedTeam);
      res.status(200).json(selectedTeamPopulated);
    }
  } catch (error) {
    console.log(error);
    const customizedErrorObject = selectedTeamFetchErrorHandler();
    next(customizedErrorObject);
  }
}

export { getCategoryListController, getAllTeamsController, getAlmostCompleteTeamsController, getNewTeamsController, getSelectedTeamController };

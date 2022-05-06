import { scheduleJob } from 'node-schedule';
import TeamModel from '../models/teamModel.js';
import jwt from 'jsonwebtoken';

async function teamAutoUpdateScheduler(docId) {
  // fetch the most current target team doc
  const currentDoc = await TeamModel.findById(docId);

  // always conduct target team doc auto updating scheduling process as long as "currentTeamRound" <= "totalTeamRound"
  if (currentDoc.currentTeamRound <= currentDoc.totalTeamRound) {
    // get current round original team deal end time (OTDET)
    const currentRoundOriginalTeamDealEndedAt = currentDoc.teamDealEndedAt;

    // schedule our target team doc auto updating process job at OTDET
    scheduleJob(currentRoundOriginalTeamDealEndedAt, async () => {
      // once time reaches at OTDET, fetch the latest target team doc again at OTDET
      const docAtOriginalTeamDealEnd = await TeamModel.findById(docId);

      // compare two team deal end times (when doc is fetched before OTDET VS when doc is fetched at OTDET) at OTDET
      // this is to count for "team-success"case BEFORE the OTDET | "team-success" will also update team setting and change "teamDealEndedAt" value
      // without "team-success"case, then these two team deal end times MUST BE EQUAL, scheduler will auto update target team doc setting
      // with "team-success" case, target team doc setting should be directly updated, therefore, our scheduler-auto-update process here need to pass
      // "team-success" case in any team round can ONLY happen before OTDET and AFTER "teamDealStartedAt". Thus, the NEXT OTDET is always AFTER CURRENT OTDET for "team-success" case
      if (Date.parse(currentRoundOriginalTeamDealEndedAt) === Date.parse(docAtOriginalTeamDealEnd.teamDealEndedAt)) {
        console.log(`${docAtOriginalTeamDealEnd.name.substring(0, 10)} | end dates match at round (${docAtOriginalTeamDealEnd.currentTeamRound})`);

        // at this last moment, we will check again ONE MORE TIME if there is team success case or not
        if (docAtOriginalTeamDealEnd.currentTeamSize !== docAtOriginalTeamDealEnd.teamSizeRequired) {
          docAtOriginalTeamDealEnd.teamDealStartedAt = Date.now();
          docAtOriginalTeamDealEnd.teamDealEndedAt = Date.parse(docAtOriginalTeamDealEnd.teamDealStartedAt) + docAtOriginalTeamDealEnd.teamDuration * 86400000;
          docAtOriginalTeamDealEnd.currentTeamRound++;
          docAtOriginalTeamDealEnd.joinedMemberList = [];
          docAtOriginalTeamDealEnd.currentTeamSize = 0;
          await docAtOriginalTeamDealEnd.save();
          teamAutoUpdateScheduler();
        }
        if (docAtOriginalTeamDealEnd.currentTeamSize === docAtOriginalTeamDealEnd.teamSizeRequired) {
          docAtOriginalTeamDealEnd.teamDealStartedAt = Date.now();
          docAtOriginalTeamDealEnd.teamDealEndedAt = Date.parse(docAtOriginalTeamDealEnd.teamDealStartedAt) + docAtOriginalTeamDealEnd.teamDuration * 86400000;
          docAtOriginalTeamDealEnd.currentTeamRound++;
          docAtOriginalTeamDealEnd.teamSuccessCount++;
          docAtOriginalTeamDealEnd.joinedMemberList = [];
          docAtOriginalTeamDealEnd.currentTeamSize = 0;
          await docAtOriginalTeamDealEnd.save();
          teamAutoUpdateScheduler();
        }
      }
      // this is for the "team-success" case (only the "team-success" case will cause the "teamDealEndedAt" comparsion to be different)
      // our scheduler-auto-update process here need to pass (no auto update needed)
      else {
        console.log('endDates not mach');
        teamAutoUpdateScheduler();
      }
    });
  }
  // this is case when "currentTeamRound" > "totalTeamRound" (all rounds are used up)
  else {
    currentDoc.teamStatus = 'unavailable';
    await currentDoc.save();
  }
}
//-----------------------------------------------------------------------------------------------------------------------------------------------------------------------------

function createJwtTokenHandler(payload, expiredInDays) {
  const maxAge = 60 * 60 * 24 * expiredInDays;
  const createdToken = jwt.sign(payload, process.env.JWT_SECRET_KEY, { expiresIn: maxAge });
  return createdToken;
}

//-----------------------------------------------------------------------------------------------------------------------------------------------------------------------------

async function populateSingleTeamDocHandler(teamDoc) {
  let teamDocPopulated = await teamDoc.populate('vendor.detailRef', 'brandName webSiteUrl instagramUrl');
  // teamDocPopulated = await teamDocPopulated.populate('joinedMemberList.detail', '-password');
  return teamDocPopulated;
}

//-----------------------------------------------------------------------------------------------------------------------------------------------------------------------------

function savedTeamsPriceSummaryHandler(savedTeamsListInput) {
  let totalOriginalPrice = 0;
  savedTeamsListInput.forEach((e) => {
    totalOriginalPrice += e.originalPrice;
  });
  let totalTeamDiscountedPrice = 0;
  savedTeamsListInput.forEach((e) => {
    totalTeamDiscountedPrice += e.teamDiscountedPrice;
  });
  return { totalOriginalPrice, totalTeamDiscountedPrice };
}

//-----------------------------------------------------------------------------------------------------------------------------------------------------------------------------

function capitalizeHandler(input) {
  const result = input[0].toUpperCase() + input.slice(1);
  return result;
}

//-----------------------------------------------------------------------------------------------------------------------------------------------------------------------------

// function priceRoundDownHandler(input) {
//   const result =

// }

export { teamAutoUpdateScheduler, populateSingleTeamDocHandler, createJwtTokenHandler, savedTeamsPriceSummaryHandler, capitalizeHandler };

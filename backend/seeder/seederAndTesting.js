import mongoose from 'mongoose';
import TeamModel from '../models/teamModel.js';
import dotenv from 'dotenv';
import { dummyTeamData } from './dummy_data.js';
import { scheduleJob } from 'node-schedule';
import OrderModel from '../models/orderModel.js';
import UserModel from '../models/userModel.js';
import AddressModel from '../models/addressModel.js';

dotenv.config();
await mongoose.connect(process.env.MONGODB_CONNECTION_STRING);

async function createTeam(inputs) {
  try {
    const newDoc = await TeamModel.create(inputs);
    console.log(`${newDoc.productName.substring(0, 10)} team created`);

    //------------------------------------------------------------------------------------------------

    if (Date.now() < Date.parse(newDoc.teamDealStartedAt)) {
      scheduleJob(newDoc.teamDealStartedAt, async () => {
        newDoc.teamStatus = 'available';
        await newDoc.save();
        console.log(`${newDoc.productName.substring(0, 10)} teamStatus updated`);
      });
    }

    //------------------------------------------------------------------------------------------------
  } catch (error) {
    console.log(error);
  }
}

async function deleteCollection() {
  await TeamModel.deleteMany();

  console.log('done');
}

// all find //////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

async function findOneById() {
  // "_id" will always return if you dont specify: "_id: 0"
  const result = await TeamModel.findById('62670fa18680e4772bafe0e6', { productName: 1, totalTeamSize: 1, currentTeamSize: 1 });
  // right now, you can functionally treat the found doc the same as js OBJECT
  result.newField = 'lolollololollolol';
  console.log(result);
  console.log(result.newField);
}

//----------------------------------------------------------------------------------------------------------------------------------------------

async function findOneByQuery() {
  const result = await TeamModel.findOne({ productName: 'Logitech G-Series Gaming Mouse', _id: '62670fa18680e4772bafe0e6' }, { productName: 1, totalTeamSize: 1, currentTeamSize: 1 });
  console.log(result);
}

//----------------------------------------------------------------------------------------------------------------------------------------------

async function findMany() {
  // you can also use "select" method for field selection
  const result = await TeamModel.find({ productName: 'Logitech G-Series Gaming Mouse', 'vendor.name': 'Vendor C' }).select({ productName: 1, totalTeamSize: 1, currentTeamSize: 1 });
  console.log(result);
}

//----------------------------------------------------------------------------------------------------------------------------------------------

async function findManyByQuery() {
  // this also will always return a cursor/list of team
  const result = await TeamModel.where('productName').equals('Logitech G-Series Gaming Mouse').where('category').equals('Electronic');
  console.log(result);
}

// all update //////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

// MongoDB doesn’t allow multiple operations on the SAME property in the same update operation. This means that the two operations must happen in two individually atomic operations.
// if any step went wrong during updating process, then doc is not updated and kept in its original version

async function updateTeamDocOldWay() {
  // traditional updating (find first and then manually update) | all arithematic expressions are supported
  const targetDoc = await TeamModel.findById('626737873f4cd50503794906');
  targetDoc.productName = 'new name hahaha';
  targetDoc.numReviews = 400;
  targetDoc.averageRating = targetDoc.numReviews / 100; // update field using another updated field value directly
  await targetDoc.save();
  console.log(targetDoc);
}

//----------------------------------------------------------------------------------------------------------------------------------------------

async function updateTeamDocNewWay1() {
  const targetDoc = await TeamModel.findByIdAndUpdate(
    '626737873f4cd50503794906',
    {
      productName: 'newwwwwwwwwwwwwwwwwwwwwwww',
      numReviews: 100,
      'vendor.name': 'CALSONICCCCCCCCCCCCCCCCCCCCCCCCCCC', // update field inside a nested object field
      $set: {
        averageRating: 1,
      },
      $inc: {
        currentTeamSize: +2,
      },
      $push: {
        joinedMemberList: {
          name: 'Nikki',
          detailRef: '6265b7cfc5138ae2cb72bfbf', // yes, even with "objectID" type, they are basically the string in mongoose
        },
      },
    },
    { new: true, runValidators: true }
  );
  console.log(targetDoc);
}

//----------------------------------------------------------------------------------------------------------------------------------------------

async function updateTeamDocNewWay2() {
  const targetDoc = await TeamModel.findByIdAndUpdate(
    '62670fa18680e4772bafe0e6',
    {
      // pop item in a target array field based field filter
      $pull: {
        joinedMemberList: {
          name: 'Vicky',
        },
      },
    },
    { new: true, runValidators: true }
  ).select({ productName: 1, averageRating: 1, vendor: 1, numReviews: 1, joinedMemberList: 1 });
  console.log(targetDoc);
}

//----------------------------------------------------------------------------------------------------------------------------------------------

async function updateTeamDocNewWay3() {
  // we have to use "findOneAndUpdate" to find both specific doc and specific item under target array
  const targetDoc = await TeamModel.findOneAndUpdate(
    { _id: '62670fa18680e4772bafe0e6', 'joinedMemberList.detailRef': '6265b7cfc5138ae2cb72bfbf' },
    {
      productName: 'oh my god',
      // update item in a target array field based field filter
      $set: {
        'joinedMemberList.$.name': 'calsonnnnnnnnnnnnnnnnnnn',
      },
    },
    { new: true, runValidators: true }
  ).select({ productName: 1, averageRating: 1, vendor: 1, numReviews: 1, joinedMemberList: 1 });
  console.log(targetDoc);
}

//----------------------------------------------------------------------------------------------------------------------------------------------

// it is now recommended that all conditional, field-dependent, expression-based updating process is best to go with traditional update-approach in mongoose
async function conditionalAndExpressionUpdate() {
  const targetDoc = await TeamModel.findByIdAndUpdate(
    '626737873f4cd50503794905',
    {
      $inc: {
        currentTeamSize: +1,
      },
      $push: {
        joinedMemberList: {
          name: 'Calsonic',
          detailRef: '6265b7cfc5138ae2cb72bfbf',
        },
      },
    },
    { new: true }
  );
  if (targetDoc.currentTeamSize >= 1) {
    targetDoc.teamSuccessCount = 10000 + 20000; // direct value assign
    targetDoc.reviewsCount = targetDoc.reviewsCount + 200; // field dependent
    targetDoc.averageRating = targetDoc.averageRating + 10; // field dependent
    targetDoc.maxQtyPerCustomer = targetDoc.numReviews > 200 ? 100000 : 200000; // expression + field dependent
    await targetDoc.save();
  } else {
    targetDoc.teamSuccessCount = -1;
    await targetDoc.save();
  }
}

/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

// await deleteCollection();

dummyTeamData.forEach(async (e, i) => {
  await createTeam(dummyTeamData[i]);
});

// async function test() {
//   const teamDoc = await TeamModel.findById('62675f582a5cffe95a3554ac');
//   teamDoc.teamSuccessCount += 1;
//   teamDoc.currentTeamSize += 111;
//   if (teamDoc.currentTeamSize > 100) {
//     console.log('works');
//     await teamDoc.save();
//   }
//   teamDoc.productName = 'mother fuck';
//   await teamDoc.save();
//   console.log(teamDoc);
// }

// test();

import { joinTeamAndCreateNewOrderErrorHandler, orderFetchErrorHandler } from '../error/errorHandling.js';
import OrderModel from '../models/orderModel.js';
import SavedTeamsModel from '../models/savedTeamsModel.js';
import TeamModel from '../models/teamModel.js';
import UserModel from '../models/userModel.js';

async function joinTeamAndCreateNewOrderController(req, res, next) {
  console.log('joinTeamAndCreateNewOrderController run');
  const targetUserId = req.userId;
  const { selectTeamId } = req.params;
  const requestBodyObject = req.body; // only the "orderAddressSummary" is sent from frontend in request body when user joined a team / make a order

  try {
    const targetUser = await UserModel.findById(targetUserId);
    const targetTeam = await TeamModel.findById(selectTeamId);
    // we first check if this team is still available | only available team can be further joined, updated, and processed (this is the last-sec team availability check)
    if (targetTeam.teamStatus === 'available') {
      console.log('team availability pass');
      // make stripe payment here first if team doc passes availability test

      // and then we make corresponding docs update across different collections/models
      const targetTeamUpdatedAfterJoin = await TeamModel.findByIdAndUpdate(
        selectTeamId,
        {
          $inc: {
            currentTeamSize: +1,
          },
          $push: {
            joinedMemberList: {
              name: targetUser.username,
              detailRef: targetUser._id,
            },
          },
        },
        { new: true }
      );

      await UserModel.findByIdAndUpdate(targetUserId, {
        $inc: {
          totalOrderCount: +1,
        },
      });

      console.log('target team / user order count is updated with new member');

      // ------------------------- if this target team is still on-going for this round -------------------------------------------------------------------------------------------
      if (targetTeamUpdatedAfterJoin.currentTeamSize < targetTeamUpdatedAfterJoin.totalTeamSize) {
        console.log('target team is still on going');

        // update all previous order placed on this specific team + specific round + when orderStatus/teamStatus is not completed/finalized | we only going to update the "currentTeamSize" field
        await OrderModel.updateMany(
          { teamId: selectTeamId, teamRoundJoinedAt: targetTeamUpdatedAfterJoin.currentTeamRound, orderStatus: 'pending', teamStatus: 'on-going' },
          {
            currentTeamSize: targetTeamUpdatedAfterJoin.currentTeamSize,
          }
        );

        console.log('all previous orders are updated');

        // then we create new order model for this new member
        const newOrder = await OrderModel.create({
          vendor: targetTeamUpdatedAfterJoin.vendor,
          userId: targetUserId,
          teamId: selectTeamId,
          productName: targetTeamUpdatedAfterJoin.productName,
          headImage: targetTeamUpdatedAfterJoin.image,
          originalPrice: targetTeamUpdatedAfterJoin.originalPrice,
          teamDiscountedPrice: targetTeamUpdatedAfterJoin.teamDiscountedPrice,
          totalPaidPrice: targetTeamUpdatedAfterJoin.teamDiscountedPrice * requestBodyObject.selectedQtyState,
          currency: targetTeamUpdatedAfterJoin.currency,
          teamRoundJoinedAt: targetTeamUpdatedAfterJoin.currentTeamRound,
          currentTeamSize: targetTeamUpdatedAfterJoin.currentTeamSize,
          totalTeamSize: targetTeamUpdatedAfterJoin.totalTeamSize,
          teamStatus: 'on-going',
          orderStatus: 'pending',
          purchaseQty: requestBodyObject.selectedQtyState,
          shippingDetail: requestBodyObject.orderShippingAddressState,
          shippingSummary: requestBodyObject.orderShippingAddressState.addressSummary,
          customerContactEmail: requestBodyObject.orderContactEmailState,
        });

        console.log('new order doc is created');

        // then we make corresponding change in the SavedTeamsModel for all target team docs
        await SavedTeamsModel.updateMany(
          { teamId: selectTeamId },
          {
            currentTeamSize: targetTeamUpdatedAfterJoin.currentTeamSize,
          }
        );

        console.log('all saved team docs are updated');

        res.status(201).json(newOrder);
      }
      // ------------------------- if team is now success or fulfilled after new join -------------------------------------------------------------------------------------
      if (targetTeamUpdatedAfterJoin.currentTeamSize === targetTeamUpdatedAfterJoin.totalTeamSize) {
        console.log('target team is now success');

        // update all previous order placed on this specific team + specific round + when orderStatus/teamStatus is not completed/finalized
        await OrderModel.updateMany(
          { teamId: selectTeamId, teamRoundJoinedAt: targetTeamUpdatedAfterJoin.currentTeamRound, orderStatus: 'pending', teamStatus: 'on-going' },
          {
            currentTeamSize: targetTeamUpdatedAfterJoin.currentTeamSize,
            orderStatus: 'finalized',
            teamStatus: 'success',
          }
        );

        console.log('all previous orders are updated to success');

        // then we create new order model for this new member
        const newOrder = await OrderModel.create({
          vendor: targetTeamUpdatedAfterJoin.vendor,
          userId: targetUserId,
          teamId: selectTeamId,
          productName: targetTeamUpdatedAfterJoin.productName,
          headImage: targetTeamUpdatedAfterJoin.image,
          originalPrice: targetTeamUpdatedAfterJoin.originalPrice,
          teamDiscountedPrice: targetTeamUpdatedAfterJoin.teamDiscountedPrice,
          totalPaidPrice: targetTeamUpdatedAfterJoin.teamDiscountedPrice * requestBodyObject.selectedQtyState,
          currency: targetTeamUpdatedAfterJoin.currency,
          teamRoundJoinedAt: targetTeamUpdatedAfterJoin.currentTeamRound,
          currentTeamSize: targetTeamUpdatedAfterJoin.currentTeamSize,
          totalTeamSize: targetTeamUpdatedAfterJoin.totalTeamSize,
          teamStatus: 'success',
          orderStatus: 'finalized',
          purchaseQty: requestBodyObject.selectedQtyState,
          shippingDetail: requestBodyObject.orderShippingAddressState,
          shippingSummary: requestBodyObject.orderShippingAddressState.addressSummary,
          customerContactEmail: requestBodyObject.orderContactEmailState,
        });

        console.log('new order doc is created');

        // since now this team round is success, we then further update this specific team doc again for NEXT ROUND or Terminate it if this is last round
        targetTeamUpdatedAfterJoin.joinedMemberList = [];
        targetTeamUpdatedAfterJoin.currentTeamSize = 0;
        targetTeamUpdatedAfterJoin.teamSuccessCount += 1;
        targetTeamUpdatedAfterJoin.currentTeamRound += 1;
        targetTeamUpdatedAfterJoin.teamDealStartedAt = Date.now();
        targetTeamUpdatedAfterJoin.teamDealEndedAt = Date.parse(targetTeamUpdatedAfterJoin.teamDealStartedAt) + targetTeamUpdatedAfterJoin.teamDurationInDays * 86400000;
        if (targetTeamUpdatedAfterJoin.currentTeamRound > targetTeamUpdatedAfterJoin.totalTeamRound) {
          targetTeamUpdatedAfterJoin.teamStatus = 'unavailable';
        }
        if (targetTeamUpdatedAfterJoin.currentTeamRound <= targetTeamUpdatedAfterJoin.totalTeamRound) {
          targetTeamUpdatedAfterJoin.teamStatus = 'available';
        }
        await targetTeamUpdatedAfterJoin.save();

        console.log('target team doc is updated again for success');

        // then we make corresponding change in the SavedTeamsModel for all target team docs
        await SavedTeamsModel.updateMany(
          { teamId: selectTeamId },
          {
            currentTeamSize: 0,
            currentTeamRound: targetTeamUpdatedAfterJoin.currentTeamRound,
            teamStatus: targetTeamUpdatedAfterJoin.teamStatus,
          }
        );

        console.log('all saved team docs are updated for success');

        res.status(201).json(newOrder);
      }
    } else {
      // when team has just become unavailable (team join last sec confirmation availability check)
      console.log('The team has just become unavailable. Please try again later');
      throw new Error('The team has just become unavailable. Please try again later');
    }
  } catch (error) {
    // any stuff going wrong above will be catched here
    console.log(error);
    const customizedErrorObject = joinTeamAndCreateNewOrderErrorHandler();
    next(customizedErrorObject);
  }
}

//----------------------------------------------------------------------------------------------------------------------------------------

async function getTargetUserOrderController(req, res, next) {
  console.log('getTargetUserOrderController run');
  const targetUserId = req.userId;
  try {
    const targetUserOrderList = await OrderModel.find({ userId: targetUserId });
    const targetUserOrderDocCount = await OrderModel.countDocuments({ userId: targetUserId });
    res.status(200).json({ targetUserOrderList, targetUserOrderDocCount });
  } catch (error) {
    console.log(error);
    const customizedErrorObject = joinTeamAndCreateNewOrderErrorHandler();
    next(customizedErrorObject);
  }
}

//----------------------------------------------------------------------------------------------------------------------------------------

export { joinTeamAndCreateNewOrderController, getTargetUserOrderController };

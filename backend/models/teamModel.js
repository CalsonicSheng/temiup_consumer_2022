import mongoose from 'mongoose';

const teamSchema = new mongoose.Schema(
  {
    productName: {
      type: String,
      required: true,
      trim: true,
    },
    image: {
      type: String,
      required: true,
      trim: true,
    },
    desc: {
      type: String,
      required: true,
      trim: true,
    },
    vendor: {
      name: {
        type: String,
        required: true,
        trim: true,
      },
      detailRef: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: 'vendors',
      },
    },
    category: {
      type: String,
      required: true,
      trim: true,
    },
    reviewsCount: {
      type: Number,
      default: 0,
    },
    averageRating: {
      type: Number,
      default: 0,
    },
    originalPrice: {
      type: Number,
      required: true,
    },
    teamDiscountedPrice: {
      type: Number,
      required: true,
    },
    currency: {
      type: String,
      required: true,
      trim: true,
    },
    maxQtyPerCustomer: {
      type: Number,
      required: true,
    },
    // mongoose will auto generate "_id" field for each element in array setting
    // we decide to keep this "_id" field since frontend will need to use this "_id" field as key
    joinedMemberList: [
      {
        name: {
          type: String,
          required: true,
          trim: true,
        },
        detailRef: {
          type: mongoose.Schema.Types.ObjectId,
          required: true,
          ref: 'users',
        },
      },
    ],
    currentTeamSize: {
      type: Number,
      default: 0,
    },
    totalTeamSize: {
      type: Number,
      required: true,
    },
    teamSuccessCount: {
      type: Number,
      default: 0,
    },
    currentTeamRound: {
      type: Number,
      default: 1,
    },
    totalTeamRound: {
      type: Number,
      required: true,
    },

    // this is in unit of day
    teamDurationInDays: {
      type: Number,
      required: true,
      default: 1,
    },
    // if shopify owner does not pre-specify any specific future date to start/post the team deal, then "teamDealCreatedAt" field will always be "NOW"
    teamDealStartedAt: {
      type: Date,
      required: true,
    },
    // this value is always = "teamDealStartedAt + teamDuration * 86400000" (we use "this" keyword to refer to other field)
    teamDealEndedAt: {
      type: Date,
      default: function () {
        return Date.parse(this.teamDealStartedAt) + this.teamDurationInDays * 86400000;
      },
    },
    teamStatus: {
      type: String,
      default: function () {
        return Date.now() < Date.parse(this.teamDealStartedAt) ? 'unavailable' : 'available';
      },
    },
  },
  { timestamps: true }
);

// the wording "model" under mongoose is also treated the same as a CLASS CONSTURCTOR or COLLECTION
// the first string param is the mongodb collection name (in altas, all the collection naming will auto convert to lower case with purals at the end)
// if given naming already involves the purals, then no pural-wording will be auto generated then
const TeamModel = mongoose.model('teams', teamSchema);

export default TeamModel;

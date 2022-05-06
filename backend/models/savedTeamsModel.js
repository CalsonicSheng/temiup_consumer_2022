import mongoose from 'mongoose';

const savedTeamsSchema = new mongoose.Schema(
  {
    userId: {
      type: String,
      trim: true,
      required: true,
    },
    teamId: {
      type: String,
      trim: true,
      required: true,
    },
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
    currentTeamSize: {
      type: Number,
      required: true,
    },

    totalTeamSize: {
      type: Number,
      required: true,
    },
    currentTeamRound: {
      type: Number,
      required: true,
    },
    totalTeamRound: {
      type: Number,
      required: true,
    },

    teamStatus: {
      type: String,
      trim: true,
      required: true,
    },
  },
  { timestamps: true }
);

const SavedTeamsModel = mongoose.model('savedTeams', savedTeamsSchema);

export default SavedTeamsModel;

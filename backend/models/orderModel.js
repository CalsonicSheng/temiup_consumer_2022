import mongoose from 'mongoose';

const orderSchema = new mongoose.Schema(
  {
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
    headImage: {
      type: String,
      required: true,
      trim: true,
    },
    teamRoundJoinedAt: {
      type: Number,
      required: true,
    },
    currentTeamSize: {
      type: Number,
      required: true,
    },
    totalTeamSize: {
      type: Number,
      required: true,
    },
    teamStatus: {
      required: true,
      type: String,
      trim: true,
    },
    orderStatus: {
      required: true,
      type: String,
      trim: true,
    },
    currency: {
      type: String,
      required: true,
      trim: true,
    },
    // Lets actually handle this in backend
    totalPaidPrice: {
      type: Number,
      required: true,
    },
    // send from frontend
    purchaseQty: {
      type: Number,
      required: true,
    },
    // send from frontend
    otherSpecification: {
      type: String,
      trim: true,
      default: undefined,
    },
    // send from frontend
    shippingDetail: {
      required: true,
      type: Object,
    },
    // send from frontend
    shippingSummary: {
      required: true,
      type: String,
      trim: true,
    },
    // send from frontend
    customerContactEmail: {
      required: true,
      type: String,
      trim: true,
    },
  },
  { timestamps: true }
);

const OrderModel = mongoose.model('orders', orderSchema);
export default OrderModel;

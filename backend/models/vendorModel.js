import mongoose from 'mongoose';

const vendorSchema = new mongoose.Schema(
  {
    brandName: {
      required: true,
      type: String,
      trim: true,
    },
    webSiteUrl: {
      required: true,
      type: String,
      trim: true,
    },
    instagramUrl: {
      type: String,
      trim: true,
    },
    desc: {
      required: true,
      type: String,
      trim: true,
    },
    isVendor: {
      required: true,
      type: Boolean,
      default: true,
    },
  },
  { timestamps: true }
);

const VendorModel = mongoose.model('vendors', vendorSchema);
export default VendorModel;

import mongoose from 'mongoose';

const addressSchema = new mongoose.Schema(
  {
    userId: {
      type: String,
      required: true,
      trim: true,
    },
    addressSummary: {
      type: String,
      trim: true,
    },

    firstName: {
      type: String,
      required: [true, 'Please provide your first name'],
      trim: true,
    },
    lastName: {
      type: String,
      required: [true, 'Please provide your last name'],
      trim: true,
    },
    address: {
      type: String,
      required: [true, 'Please provide a address'],
      trim: true,
    },
    additionalAddress: {
      type: String,
      trim: true,
      default: '',
    },
    city: {
      type: String,
      required: [true, 'Please provide a city information'],
      trim: true,
    },
    country: {
      type: String,
      required: [true, 'Please provide a country information'],
      trim: true,
    },
    provinceOrState: {
      type: String,
      required: [true, 'Please provide a province or state'],
      trim: true,
    },
    zipCode: {
      type: String,
      required: [true, 'Please provide a zip code'],
      trim: true,
    },
    phone: {
      type: String,
      required: [true, 'Please provide a phone number'],
      trim: true,
    },
    isDefault: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true,
  }
);

const AddressModel = mongoose.model('addresses', addressSchema);

export default AddressModel;

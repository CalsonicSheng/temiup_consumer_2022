import mongoose from 'mongoose';

const categorySchema = new mongoose.Schema(
  {
    category: {
      type: String,
      unique: true,
      trim: true,
    },
  },
  { timestamps: true }
);

const CategoryModel = mongoose.model('categories', categorySchema);

export default CategoryModel;

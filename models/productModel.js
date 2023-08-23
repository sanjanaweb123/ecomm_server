import mongoose from 'mongoose';
const productSchema = mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },
    description: {
      type: String,
      //required: true
    },
    price: {
      type: Number,
      default: 0,
    },
    quantity: {
      type: Number,
      default: 1,
    },
    image: 
      {
        type: String,
      },
    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'user',
    },
    isDeleted: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true,
  }
);
const productModel = mongoose.model('product', productSchema);
export default productModel;

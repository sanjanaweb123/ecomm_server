import mongoose from 'mongoose';
const userSchema = mongoose.Schema({
  email: {
    type: String,
    required: true,
  },
  password: {
    type: String,
    required: true
  },
  isVerified: {
    type: Boolean,
    default: false,
  },
  firstname: {
    type: String,
  },
  lastname: {
    type: String,
  },
  mobile: {
    type: String,
  },
  forgetPassHash: {
    type: String,
  },
  forgetPassCreatedAt: {
    type: String,
  },
  isDeleted: {
    type: Boolean,
    default: false
  },
}, {
  timestamps: true
});
const userModel = mongoose.model('users', userSchema);
export default userModel;
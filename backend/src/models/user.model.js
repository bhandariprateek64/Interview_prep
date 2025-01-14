import mongoose from 'mongoose';
const userSchema = new mongoose.Schema(
  {
    fullName: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
    },
    password: {
      type: String,
      required: true,
    },
    phoneNumber: {
      type: String,
      required: true,
    },
    currentRating: {
      type: Number,
      default: null,
    },
    completedQuestionNames: {
      type: [String],
    },
    profile: {
      profilePhoto: {
        type: String,
        default: '',
      },
    },
  },
  { timestamps: true }
);
const userModel = mongoose.model('User', userSchema);
export default userModel;

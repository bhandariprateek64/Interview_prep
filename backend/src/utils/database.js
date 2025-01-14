import mongoose from 'mongoose';
const connectdb = async () => {
  await mongoose.connect(process.env.MONGO_URL);
};
export default connectdb;

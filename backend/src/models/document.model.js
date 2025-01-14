import mongoose from 'mongoose';
const documentSchema = new mongoose.Schema({
  name: {
    type: String,
  },
  link: {
    type: String,
  },
  rating: {
    type: Number,
  },
});
const documentModel = mongoose.model('Document', documentSchema);
export default documentModel;

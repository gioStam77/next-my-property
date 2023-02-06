import mongoose from 'mongoose';

const reviewSchema = new mongoose.Schema(
  {
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    name: { type: String, required: true },
    rating: { type: Number, default: 0 },
    comment: { type: String, required: true },
  },
  {
    timestamps: true,
  }
);

const enoikiastisSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    slug: { type: String, required: true, unique: true },
    territory: { type: String, required: true },
    tel: { type: Number, required: true },
    image: { type: String, required: true },
    age: { type: Number, required: true },
    children: {
      boys: { type: Number },
      girls: { type: Number },
      firstBoysAge: { type: Number },
      secondBoysAge: { type: Number },
      firstGirlsAge: { type: Number },
      secondGirlsAge: { type: Number },
    },
    animals: {
      cat: { type: Number },
      dog: { type: Number },
      other: { type: String },
    },
    rating: { type: Number, required: true, default: 0 },
    numReviews: { type: Number, required: true, default: 0 },
    description: { type: String, required: true },
    reviews: [reviewSchema],
    orders: [
      { type: mongoose.Schema.Types.ObjectId, ref: 'Order', required: true },
    ],
  },
  {
    timestamps: true,
  }
);
const Enoikiastis =
  mongoose.models.Enoikiastis ||
  mongoose.model('Enoikiastis', enoikiastisSchema);
export default Enoikiastis;

import mongoose from 'mongoose';

const orderSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    enoikiasti: { type: mongoose.Schema.Types.ObjectId, ref: 'Enoikiastis' },

    orderItems: [
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
      },
    ],
    homeAddress: {
      fullName: { type: String, required: true },
      address: { type: String, required: true },
      city: { type: String, required: true },
      postalCode: { type: String, required: true },
      country: { type: String, required: true },
    },
    madeAt: { type: Date },
    sxolia: { type: String, required: true },
  },

  {
    timestamps: true,
  }
);
const Order = mongoose.models.Order || mongoose.model('Order', orderSchema);
export default Order;

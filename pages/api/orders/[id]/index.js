import { getSession } from 'next-auth/react';
import Order from '../../../../models/Order';
import db from '../../../../utils/db';

const handler = async (req, res) => {
  const session = await getSession({ req });
  if (!session) {
    return res.status(401).send('signin required');
  }
  if (req.method === 'GET') {
    return getHandler(req, res);
  } else if (req.method === 'PUT') {
    const { user } = session;
    return putHandler(req, res, user);
  } else {
    return res.status(400).send({ message: 'method not allowed' });
  }
};

const putHandler = async (req, res) => {
  await db.connect();
  const order = await Order.findById(req.query.id);
  if (order) {
    order.homeAddress.fullName = req.body.fullName;
    order.homeAddress.address = req.body.address;
    // order.homeAdress.postalCode = req.body.postalCode;
    order.homeAddress.city = req.body.city;
    order.homeAddress.country = req.body.country;
    order.sxolia = req.body.sxolia;
    order.madeAt = Date.now();
    const newOrder = {
      ...req.body,
    };
    const order = await newOrder.save();
    await db.disconnect();
    res.send({ message: 'order updated' });
  } else {
    await db.disconnect();
    res.status(404).send({ message: 'Order not found' });
  }
};

const getHandler = async (req, res) => {
  await db.connect();
  const order = await Order.findById(req.query.id);
  await db.disconnect();

  res.send(order);
};

export default handler;

//  if (product) {
//     const existReview = product.reviews.find((x) => x.user == req.user._id);
//     if (existReview) {
//       await Product.updateOne(
//         { _id: req.query.id, 'reviews._id': existReview._id },
//         {
//           $set: {
//             'reviews.$.comment': req.body.comment,
//             'reviews.$.rating': Number(req.body.rating),
//           },
//         }
//       );

//       const updatedProduct = await Product.findById(req.query.id);
//       updatedProduct.numReviews = updatedProduct.reviews.length;
//       updatedProduct.rating =
//         updatedProduct.reviews.reduce((a, c) => c.rating + a, 0) /
//         updatedProduct.reviews.length;
//       await updatedProduct.save();

//       await db.disconnect();
//       return res.send({ message: 'Review updated' });
//     } else {
//       const review = {
//         user: mongoose.Types.ObjectId(req.user._id),
//         name: req.user.name,
//         rating: Number(req.body.rating),
//         comment: req.body.comment,
//       };
//       product.reviews.push(review);
//       product.numReviews = product.reviews.length;
//       product.rating =
//         product.reviews.reduce((a, c) => c.rating + a, 0) /
//         product.reviews.length;
//       await product.save();
//       await db.disconnect();
//       res.status(201).send({
//         message: 'Review submitted',
//       });
//     }
//   } else {
//     await db.disconnect();
//     res.status(404).send({ message: 'Product Not Found' });
//   }
// });

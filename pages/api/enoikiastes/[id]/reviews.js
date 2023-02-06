import mongoose from 'mongoose';
import { getSession } from 'next-auth/react';
import Enoikiastis from '../../../../models/Enoikiastis';
import db from '../../../../utils/db';

const handler = async (req, res) => {
  const session = await getSession({ req });
  if (!session) {
    return res.status(401).send({ message: 'sign in required' });
  }
  if (req.method === 'GET') {
    return getHandler(req, res);
  } else if (req.method === 'POST') {
    const { user } = session;
    return postHandler(req, res, user);
  } else {
    return res.status(400).send({ message: 'method not allowed' });
  }
};

const postHandler = async (req, res, user) => {
  await db.connect();
  const enoikiastis = await Enoikiastis.findById(req.query.id);
  if (enoikiastis) {
    const existReview = enoikiastis.reviews.find((x) => x.user == user._id);
    if (existReview) {
      await Enoikiastis.updateOne(
        { _id: req.query.id, 'reviews._id': existReview._id },
        {
          $set: {
            'reviews.$.comment': req.body.comment,
            'reviews.$.rating': Number(req.body.rating),
          },
        }
      );
      const updatedEnoikiastis = await Enoikiastis.findById(req.query.id);
      updatedEnoikiastis.numReviews = updatedEnoikiastis.reviews.length;
      updatedEnoikiastis.rating =
        updatedEnoikiastis.reviews.reduce((a, c) => c.rating + a, 0) /
        updatedEnoikiastis.reviews.length;
      await updatedEnoikiastis.save();

      await db.disconnect();
      res.send({ message: 'Review updated' });
    } else {
      const review = {
        user: mongoose.Types.ObjectId(user._id),
        name: user.name,
        rating: Number(req.body.rating),
        comment: req.body.comment,
      };
      enoikiastis.reviews.push(review);
      enoikiastis.numReviews = enoikiastis.reviews.length;
      enoikiastis.rating =
        enoikiastis.reviews.reduce((a, c) => c.rating + a, 0) /
        enoikiastis.reviews.length;
      await enoikiastis.save();
      await db.disconnect();
      res.status(201).send({
        message: 'Review submitted',
      });
    }
  } else {
    await db.disconnect();
    res.status(404).send({ message: 'enoikiastis not found' });
  }
};

const getHandler = async (req, res) => {
  await db.connect();
  // const enoikiastis = await Enoikiastis.findById(req.query.id);

  await db.disconnect();
  // if (enoikiastis) {
  //   res.send(enoikiastis.reviews);
  // } else {
  //   res.status(404).send({ message: 'Enoikiastis not found' });
  // }
  const sxolia = await Enoikiastis.findById(req.query.id).populate('orders');
  res.send(sxolia);
};
export default handler;

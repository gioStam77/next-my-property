import { getSession } from 'next-auth/react';
import Enoikiastis from '../../../../models/Enoikiastis';
import Order from '../../../../models/Order';
import db from '../../../../utils/db';

const handler = async (req, res) => {
  const session = getSession({ req });
  if (!session) {
    return res.status(401).send('signin required');
  }

  await db.connect();
  await Order.find({});
  const sxolia = await Enoikiastis.findById(req.query.id).populate({
    path: 'orders',
    select: 'sxolia orderItems.rating',
  });

  if (sxolia) {
    //   const order = {
    //     enoikiasti: mongoose.Types.ObjectId(req.query.id),
    //   };
    //   sxolia.orders.push(order);
    res.send(sxolia);
  } else {
    res.status(404).send({ message: 'sxolia not found' });
  }

  // const sxolia = await Order.findOne(
  //   { 'req.query.id': 'user.id' },
  //   { sxolia: 1, 'orderItems.name': 1 }
  // );
  res.send(sxolia);
};

export default handler;

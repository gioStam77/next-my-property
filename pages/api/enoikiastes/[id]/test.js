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
  const sxolia = await Enoikiastis.findById(req.query.id, 'name').populate({
    path: 'orders',
    match: { 'orderItems.name': req.query.name },
    select: 'sxolia ',
  });

  if (sxolia) {
    res.send(sxolia);
  } else {
    res.status(404).send({ message: 'sxolia not found' });
  }
  res.send(sxolia);
};

export default handler;

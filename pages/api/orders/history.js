import { getSession } from 'next-auth/react';
import Order from '../../../models/Order';

import db from '../../../utils/db';

const handler = async (req, res) => {
  const session = getSession({ req });
  if (!session) {
    return res.status(401).send({ message: 'signin required' });
  }

  await db.connect();
  const orders = await Order.find({});
  await db.disconnect();

  res.send(orders);
};
export default handler;

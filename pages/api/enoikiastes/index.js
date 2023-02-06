import { getSession } from 'next-auth/react';
import Enoikiastis from '../../../models/Enoikiastis';
import db from '../../../utils/db';

const handler = async (req, res) => {
  const session = await getSession({ req });
  if (!session) {
    return res.status(401).send({ message: 'sign in required' });
  }
  if (req.method === 'GET') {
    return getHandler(req, res);
  } else if (req.method === 'POST') {
    const session = await getSession({ req });
    if (!session) {
      return res.status(401).send('signin required');
    }
    const { user } = session;
    return postHandler(req, res, user);
  } else {
    return res.status(400).send({ message: 'method not allowed' });
  }
};

const getHandler = async (req, res) => {
  await db.connect();
  const enoikiastes = await Enoikiastis.find({});
  await db.disconnect();
  res.send(enoikiastes);
};

const postHandler = async (req, res) => {
  await db.connect();
  const newEnoikiastis = Enoikiastis({
    ...req.body,
    orders: ['6373d29aa5c0992543f1dca3'],
  });
  const enoikiastis = await newEnoikiastis.save();
  await db.disconnect();
  res.send({ message: 'enoikiastis created successfully', enoikiastis });
};

export default handler;

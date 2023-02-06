import { getSession } from 'next-auth/react';
import Enoikiastis from '../../../../models/Enoikiastis';
import db from '../../../../utils/db';

const handler = async (req, res) => {
  if (req.method === 'GET') {
    return getHandler(req, res);
  } else if (req.method === 'PUT') {
    const session = await getSession({ req });
    if (!session) {
      return res.status(401).send('signin required');
    }

    const { user } = session;
    return putHandler(req, res, user);
  } else if (req.method === 'DELETE') {
    // const session = await getSession({ req });
    // if (!session) {
    //   return res.status(401).send('signin required');
    return deleteHandler(req, res);
  }

  // const { user } = session;
  //   return deleteHandler(req, res);
  // } else {
  else {
    return res.status(400).send({ message: 'Method not allowed' });
  }
};
const getHandler = async (req, res) => {
  await db.connect();
  const enoikiastis = await Enoikiastis.findById(req.query.id);

  await db.disconnect();
  res.send(enoikiastis);
};

const putHandler = async (req, res) => {
  await db.connect();
  const enoikiastis = await Enoikiastis.findById(req.query.id);
  if (enoikiastis) {
    enoikiastis.name = req.body.name;
    enoikiastis.slug = req.body.slug;
    enoikiastis.territory = req.body.territory;
    enoikiastis.tel = req.body.tel;
    enoikiastis.age = req.body.age;
    enoikiastis.image = req.body.image;
    enoikiastis.rating = req.body.rating;
    enoikiastis.numReviews = req.body.numReviews;
    enoikiastis.description = req.body.description;
    enoikiastis.orders = req.body.orders;
    enoikiastis.animals.dog = req.body.animals.dog;
    enoikiastis.animals.cat = req.body.animals.cat;
    enoikiastis.animals.other = req.body.animals.other;
    enoikiastis.children.boys = req.body.children.boys;
    enoikiastis.children.girls = req.body.children.girls;
    enoikiastis.children.firstBoyAge = req.body.children.firstBoyAge;
    enoikiastis.children.secondBoysAge = req.body.children.secondBoysAge;
    enoikiastis.children.firstGirlsAge = req.body.children.firstGirlsAge;
    enoikiastis.children.secondGirlsAge = req.body.children.secondGirlsAge;
    await enoikiastis.save();
    await db.disconnect();
    res.send({ message: 'Enoikiastis updated successfuly' });
  } else {
    await db.disconnect();
    res.send({ message: 'Enoikiastis not found' });
  }
};

const deleteHandler = async (req, res) => {
  await db.connect();
  const enoikiastis = await Enoikiastis.findById(req.query.id);
  if (enoikiastis) {
    await enoikiastis.remove();
    await db.disconnect();
    res.send({ message: 'enoikiastis deleted successfully' });
  } else {
    await db.disconnect();
    res.status(404).send({ message: 'enoikiastis not found' });
  }
};

export default handler;

import Enoikiastis from '../../models/Enoikiastis';
import User from '../../models/User';
import data from '../../utils/data';
import db from '../../utils/db';

const handler = async (req, res) => {
  await db.connect();
  await User.deleteMany();
  await User.insertMany(data.users);
  await Enoikiastis.deleteMany();
  await Enoikiastis.insertMany(data.enoikiastes);
  await db.disconnect();
  res.send({ message: 'seeded successfully' });
};
export default handler;

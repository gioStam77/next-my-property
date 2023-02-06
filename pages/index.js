import Enoikiastis1 from '../components/Enoikiastis1';
import Layout from '../components/layout';
import db from '../utils/db';
import Enoikiastis from '../models/Enoikiastis';
import Link from 'next/link';
import { toast } from 'react-toastify';
import axios from 'axios';
import { useContext } from 'react';
import { Store } from '../utils/Store';
import { useRouter } from 'next/router';
import { useSession } from 'next-auth/react';

export default function Home(props) {
  const { state, dispatch } = useContext(Store);
  const { cart } = state;

  const { data: session } = useSession();

  const router = useRouter();
  const { enoikiastes1 } = props;

  const addToCartHandler = async (enoikiastis) => {
    if (!session) {
      router.push('/login?redirect=/');
      return;
    }
    const existItem = cart.enoikiastes.find((x) => x.slug === enoikiastis.slug);

    if (existItem) {
      toast('υπάρχει ήδη');
      return;
    }
    const { data } = await axios.get(`/api/enoikiastes/${enoikiastis._id}`);

    if (!data) {
      return toast.error('δεν υπάρχει ο ενοικιαστής');
    }
    dispatch({
      type: 'CART_ADD_ITEM',
      payload: { ...enoikiastis },
    });
    router.push('/cart');
  };

  const removeItemHandler = async (enoikiastis) => {
    if (!session) {
      router.push('/login?redirect=/');
      return;
    }
    await axios.delete(`/api/enoikiastes/${enoikiastis._id}`);
    dispatch({ type: 'CART_REMOVE_ITEM', payload: { enoikiastis } });
    router.push('/');
    toast(' ο ενοικιαστής διεγράφει');
  };

  return (
    <Layout title="home page">
      <div className="flex flex-col ">
        <Link href="/enoikiastis">προσθήκη ενοικιαστή</Link>
        <div className="p-5 grid grid-cols-1 gap-4 md:grid-cols-4 lg:grid-cols-5">
          {enoikiastes1.map((enoikiastis) => (
            <Enoikiastis1
              enoikiastis={enoikiastis}
              key={enoikiastis.slug}
              addToCartHandler={addToCartHandler}
              removeItemHandler={removeItemHandler}
            />
          ))}
        </div>
      </div>
    </Layout>
  );
}
export async function getServerSideProps() {
  await db.connect();
  const enoikiastes1 = await Enoikiastis.find({}, '-reviews -orders').lean();
  return {
    props: {
      enoikiastes1: enoikiastes1.map(db.convertDocToObj),
    },
  };
}

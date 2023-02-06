import axios from 'axios';
import Cookies from 'js-cookie';
import Image from 'next/image';
import Link from 'next/link';
import { useRouter } from 'next/router';
import React from 'react';
import { useState } from 'react';
import { useEffect } from 'react';
import { useContext } from 'react';
import { toast } from 'react-toastify';
import CheckoutWizard from '../components/CheckoutWizard';
import Layout from '../components/layout';
import { getError } from '../utils/error';
import { Store } from '../utils/Store';

export default function LastPage() {
  const { state, dispatch } = useContext(Store);
  const { cart } = state;
  const { enoikiastes, homeAddress, sxolia } = cart;

  const router = useRouter();

  useEffect(() => {
    if (!sxolia) {
      router.push('/sxolia');
    }
  }, [router, sxolia]);

  const [loading, setLoading] = useState();

  const placeOrderHandler = async () => {
    try {
      setLoading(true);
      const { data } = await axios.post('/api/orders', {
        orderItems: enoikiastes,
        homeAddress,
        sxolia,
      });
      setLoading(false);
      dispatch({ type: 'CART_CLEAR_ITEMS' });
      Cookies.set(
        'cart',
        JSON.stringify({
          ...cart,
          enoikiastes: [],
        })
      );
      router.push(`/order/${data._id}`);
    } catch (err) {
      setLoading(false);
      toast.error(getError(err));
    }
  };

  return (
    <Layout title="last page">
      <CheckoutWizard activeStep={3} />
      <h1 className="mb-4 text-xl flex justify-center">Συνοπτικά</h1>
      {enoikiastes.length === 0 ? (
        <div className="text-xs">
          Δεν έχει επιλεγεί ενοικιαστής{' '}
          <Link href="/">πίσω στους ενοικιαστές</Link>
        </div>
      ) : (
        <div className="grid md:grid-cols-4 md:gap-5">
          <div className="overflow-x-auto md:col-span-3">
            <div className="card p-5">
              <h2 className="mb-2 text-lg">Στοιχεία σπιτιού</h2>
              <div>
                <span className="mb-2 text-sm">Ιδιοκτήτης: </span>
                {homeAddress.fullName} ,<br />
                {homeAddress.address} ,{homeAddress.postalCode} ,
                {homeAddress.country} ,{homeAddress.city}
              </div>
              <div>
                <Link href="/homeAddress">edit</Link>
              </div>
            </div>
            <div className="card p-5">
              <h2 className="mb-2 text-lg">Σχόλια</h2>
              <div>{sxolia}</div>
              <div>
                <Link href="/sxolia">edit</Link>
              </div>
            </div>

            <div className="card  p-5">
              <h2>Προσωπικά στοιχεία ενοικιαστή</h2>
              <table className="min-w-full">
                <thead className="border-b">
                  <th className="px-5 text-left">Όνομα</th>
                  <th className="px-5 text-left">Τηλέφωνο</th>
                  <th className="px-5 text-center">Ηλικία</th>
                  <th className="px-5 text-center">Παιδιά</th>
                  <th className="px-5 text-center">Ζώα</th>
                </thead>
                <tbody>
                  {enoikiastes.map((item) => (
                    <tr key={item.name} className="border-b">
                      <td>
                        <Link href={`/item/${item.slug}`}>
                          <a className="flex items-center">
                            <Image
                              src={item.image}
                              alt={item.name}
                              width={150}
                              height={150}
                            ></Image>
                            {item.name}
                          </a>
                        </Link>
                      </td>
                      <td className="p-5 text-center">{item.tel}</td>
                      <td className="p-5 text-center">{item.age}</td>
                      <td className="p-5 text-center">
                        {' '}
                        {item.children?.boys + item.children?.girls > 4 ? (
                          <div>Πολύτεκνοι</div>
                        ) : item.children?.boys && item.children?.girls ? (
                          <div>
                            {item.children?.boys}{' '}
                            {item.children?.boys === 1
                              ? `αγόρι ${item.children?.firstBoysAge} χρονών`
                              : `αγόρια ${item.children?.firstBoysAge} και ${item.children?.secondBoysAge} χρονών`}{' '}
                            και {item.children?.girls}{' '}
                            {item.children?.girls === 1
                              ? `κορίτσι ${item.children?.firstGirlsAge} χρονών`
                              : `κορίτσια ${item.children?.firstGirlsAge} και ${item.children?.secondGirlsAge} χρονών`}{' '}
                          </div>
                        ) : item.children?.boys ? (
                          <div>
                            {item.children?.boys}{' '}
                            {item.children?.boys === 1
                              ? `αγόρι ${item.children?.firstBoysAge} χρονών`
                              : `αγόρια ${item.children?.firstBoysAge} και ${item.children?.secondBoysAge} χρονών`}{' '}
                          </div>
                        ) : item.children?.girls ? (
                          <div>
                            {item.children?.girls}{' '}
                            {item.children?.girls === 1
                              ? `κορίτσι ${item.children?.firstGirlsAge} χρονών`
                              : `κορίτσια ${item.children?.firstGirlsAge} και ${item.children?.secondGirlsAge} χρονών`}{' '}
                          </div>
                        ) : (
                          <div className="text-red-500">άτεκνοι</div>
                        )}
                      </td>
                      <td className="p-5 text-center">
                        {item.animals &&
                        item.animals.dog &&
                        item.animals.cat &&
                        item.animals.other ? (
                          <div>
                            {item.animals.dog}
                            {item.animals.dog === 1 ? ' σκύλος' : ' σκύλοι'} και
                            {item.animals.cat}
                            {item.animals.cat === 1 ? ' γάτα' : ' γάτες'} και
                            {item.animals.other}
                          </div>
                        ) : item.animals && item.animals.dog ? (
                          <div>
                            {item.animals.dog}
                            {item.animals.dog === 1 ? ' σκύλος' : ' σκύλοι'}
                          </div>
                        ) : item.animals && item.animals.cat ? (
                          <div>
                            {item.animals.cat}
                            {item.animals.cat === 1 ? ' γάτα' : ' γάτες'}
                          </div>
                        ) : item.animals && item.animals.other ? (
                          <div className="text-red-500">
                            προσοχή {item.animals.other}
                            {/* {item.animals.other === 1
                      ? `ένα ${item.animals.other}`
                      : `${item.animals.other}`}{' '} */}
                          </div>
                        ) : (
                          <div>χωρίς ζώα</div>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
          <button
            className="primary-button w-auto h-fit "
            disabled={loading}
            onClick={placeOrderHandler}
          >
            {loading ? 'Loading' : 'Κατάθεση σχολίων'}
          </button>
        </div>
      )}
    </Layout>
  );
}
LastPage.auth = true;

import axios from 'axios';
import { useSession } from 'next-auth/react';
import Image from 'next/image';
import Link from 'next/link';
import { useRouter } from 'next/router';
import React, { useEffect, useReducer } from 'react';
import Layout from '../../../components/layout';
import { getError } from '../../../utils/error';

function reducer(state, action) {
  switch (action.type) {
    case 'FETCH_REQUEST':
      return { ...state, loading: true, error: '' };

    case 'FETCH_SUCCESS':
      return { ...state, loading: false, error: '', order: action.payload };
    case 'FETCH_FAIL':
      return { ...state, loading: false, error: action.payload };
    default:
      state;
  }
}

function OrderScreen() {
  const { query } = useRouter();
  const orderId = query.id;

  const router = useRouter();
  const { data: session } = useSession();

  const [{ loading, order, error }, dispatch] = useReducer(reducer, {
    loading: true,
    order: {},
    error: '',
  });

  useEffect(() => {
    if (!session) {
      router.push(`/login?redirect=/order/${orderId}`);
      return;
    }
    const fetchOrder = async () => {
      try {
        dispatch({ type: 'FETCH_REQUEST' });
        const { data } = await axios.get(`/api/orders/${orderId}`);
        dispatch({ type: 'FETCH_SUCCESS', payload: data });
      } catch (err) {
        dispatch({ type: 'FETCH_FAIL', payload: getError(err) });
      }
    };
    if (!order._id || (order._id && order._id !== orderId)) {
      fetchOrder();
    }
  }, [order, orderId, router, session]);

  const { homeAddress, sxolia, orderItems, madeAt } = order;

  return (
    <Layout title={`Σχόλιο ${orderId}`}>
      <h1 className="mb-4 text-xl">{`Σχόλιο υπ.αριθμ: ${orderId.substring(
        0,
        5
      )} απο ${homeAddress?.fullName}`}</h1>
      {loading ? (
        <div>loading...</div>
      ) : error ? (
        <div className="alert-error">{error}</div>
      ) : (
        <div className="grid md:grid-cols-4 md:gap-5">
          <div className="overflow-x-auto md:col-span-3">
            <div className="card p-5">
              <h2 className="mb-2 text-lg">Στοιχεία σπιτιού</h2>

              <div>
                {' '}
                Ιδιοκτήτης:
                <span className="mb-2 p-2 text-lg text-blue-600">
                  {homeAddress?.fullName}
                  {'  '}
                </span>{' '}
                Διεύθυνση:
                <span className="mb-2 p-2 text-lg text-blue-600">
                  {homeAddress?.address}
                </span>{' '}
                ,Ταχ.Κωδ.:
                <span className="mb-2 p-2 text-lg text-blue-600">
                  {homeAddress?.postalCode}{' '}
                </span>
                , Πόλη:
                <span className="mb-2 p-2 text-lg text-blue-600">
                  {homeAddress?.city}
                </span>
                ,Χώρα:
                <span className="mb-2 p-2 text-lg text-blue-600">
                  {homeAddress?.country}
                </span>
              </div>
            </div>
            <div className="card p-5">
              <h2 className="mb-2 text-lg">Σχόλια</h2>
              <div>{sxolia}</div>
            </div>
            <div className="card p-5">
              <h2 className="mb-2 text-lg">Δημιουργήθηκε</h2>
              {madeAt ? <div>{madeAt.substring(0, 10)}</div> : 'arxidia'}
            </div>
            <div className="card  p-5">
              <h2>Προσωπικά στοιχεία ενοικιαστή</h2>
              <table className="min-w-full">
                <thead className="border-b">
                  <th className="px-5 text-left">Όνομα</th>
                  <th className="px-5 text-center">Τηλ.</th>
                  <th className="px-5 text-center">Ηλικία</th>
                  <th className="px-5 text-center">Παιδιά</th>
                  <th className="px-5 text-center">Ζώα</th>
                </thead>
                <tbody>
                  {orderItems?.map((item) => (
                    <tr key={item.slug} className="border-b">
                      <td>
                        <Link href={`/item/${item.slug}`}>
                          <a className="flex items-end">
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
                      <td className="p-5 text-center">{item?.tel}</td>
                      <td className="p-5 text-center">{item?.age}</td>
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
                            και {item.children.girls}{' '}
                            {item.children.girls === 1
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
                        {item.animals?.dog &&
                        item.animals?.cat &&
                        item.animals?.other ? (
                          <div>
                            {item.animals?.dog}
                            {item.animals?.dog === 1
                              ? ' σκύλος'
                              : ' σκύλοι'}{' '}
                            και
                            {item.animals?.cat}
                            {item.animals?.cat === 1 ? ' γάτα' : ' γάτες'} και
                            {item.animals?.other}
                          </div>
                        ) : item.animals?.dog ? (
                          <div>
                            {item.animals?.dog}
                            {item.animals?.dog === 1 ? ' σκύλος' : ' σκύλοι'}
                          </div>
                        ) : item.animals?.cat ? (
                          <div>
                            {item.animals?.cat}
                            {item.animals?.cat === 1 ? ' γάτα' : ' γάτες'}
                          </div>
                        ) : item.animals?.other ? (
                          <div className="text-red-500">
                            προσοχή {item.animals?.other}
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
        </div>
      )}
      <div className="mb-4 ">
        επεξεργασία παραγγελίας?
        <Link href={`/order/${orderId}/orderEditScreen`}>επεξεργασία</Link>
      </div>
    </Layout>
  );
}
OrderScreen.auth = true;

export default OrderScreen;

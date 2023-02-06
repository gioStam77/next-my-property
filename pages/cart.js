import Link from 'next/link';
import React, { useContext } from 'react';
import Layout from '../components/layout';
import { Store } from '../utils/Store';
import Image from 'next/image';
import { XCircleIcon } from '@heroicons/react/outline';
import { useRouter } from 'next/router';
import dynamic from 'next/dynamic';
import { useSession } from 'next-auth/react';
import { toast } from 'react-toastify';

function CartScreen() {
  const { state, dispatch } = useContext(Store);

  const { data: session } = useSession();

  const router = useRouter();

  const {
    cart: { enoikiastes },
  } = state;

  const removeItemHandler = (item) => {
    if (!session) {
      router.push('/login?redirect=/cart');
      return;
    }
    dispatch({ type: 'CART_REMOVE_ITEM', payload: item });
    toast('διεγράφει απο τους επιλεγμένους');
  };

  return (
    <Layout title="Επιλεγμένοι ενοικιαστές">
      <h1 className="mb-4 text-xl">Επιλεγμένοι ενοικιαστές</h1>
      {enoikiastes.length === 0 ? (
        <div className="px-5 ">
          Δεν έχουν επιλεγεί ενοικιαστές
          <Link href="/">
            <a className="px-5 text-xs text-lime-500">Επέλεξε ενοικιαστές</a>
          </Link>
        </div>
      ) : (
        <>
          {' '}
          <div className="py-2">
            <Link href="/">
              <a className="text-sm font-semibold hover:font-thin">
                Πίσω στους ενοικιαστές
              </a>
            </Link>
          </div>
          <div className="grid md:grid-cols-4 md:gap-5">
            <div className="overflow-x-auto md:col-span-3">
              <table className="min-w-full">
                <thead className="border-b">
                  <tr>
                    <th className="px-5 text-left">Name</th>
                    <th className="px-5 text-right">Telefone</th>
                    <th className="px-5 text-right">Age</th>
                    <th className="px-5 ">Action</th>
                  </tr>
                </thead>
                <tbody>
                  {enoikiastes.map((item) => (
                    <tr key={item.slug} className="border-b">
                      <td>
                        <Link href={`/enoikiastis/${item.slug}`}>
                          <a className="flex items-center">
                            <Image
                              src={item.image}
                              alt={item.name}
                              width={50}
                              height={50}
                            ></Image>

                            {item.name}
                          </a>
                        </Link>
                      </td>
                      {session ? (
                        <td className="p-5 text-right">{item.tel}</td>
                      ) : (
                        <td className="p-5 text-right">69******</td>
                      )}

                      <td className="p-5 text-right">{item.age}</td>
                      <td className="p-5 text-center">
                        <button onClick={() => removeItemHandler(item)}>
                          <XCircleIcon className="h-5 w-5"></XCircleIcon>
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <div className="card py-7 px-2 ">
              <ul className="flex flex-col items-stretch space-y-12 ">
                <li className=" p-3 text-xl text-center self-center  rounded-full bg-lime-500 w-2/3">
                  Επιλέχθηκαν{' '}
                  <span className="ml-1 rounded-full bg-red-600 px-2 py-1 text-lg font-bold text-white">
                    {enoikiastes.length}
                  </span>{' '}
                </li>
                <li>
                  <button
                    onClick={() => router.push('/login?redirect=/homeAddress')}
                    className="primary-button w-full text-lg font-black "
                  >
                    Check out
                  </button>
                </li>
              </ul>
            </div>
          </div>
        </>
      )}
    </Layout>
  );
}

export default dynamic(() => Promise.resolve(CartScreen), { ssr: false });

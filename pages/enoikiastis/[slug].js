import React, { useContext } from 'react';
import Layout from '../../components/layout';
import { useRouter } from 'next/router';

import Link from 'next/link';
import Image from 'next/image';

import { toast } from 'react-toastify';
import axios from 'axios';
import Enoikiastis from '../../models/Enoikiastis';
import db from '../../utils/db';
import { Store } from '../../utils/Store';
// import { useState } from 'react';
// import { getError } from '../../utils/error';
// import { useForm } from 'react-hook-form';
// import { useReducer } from 'react';

// function reducer(state, action) {
//   switch (action.type) {
//     case 'FETCH_REQUEST':
//       return { ...state, loading: true, error: '' };

//     case 'FETCH_SUCCESS':
//       return { ...state, loading: false, error: '' };

//     case 'FETCH_FAIL':
//       return { ...state, loading: false, error: action.payload };

//     default:
//       return state;
//   }
// }

export default function EnoikiastisScreen(props) {
  const { state, dispatch } = useContext(Store);
  const { cart } = state;

  const router = useRouter();
  const { enoikiastis } = props;

  // const [sxolia, setSxolia] = useState([]);

  // const [{ loading, error }, dispatch] = useReducer(reducer, {
  //   loading: true,

  //   error: '',
  // });

  // const {
  //   handleSubmit,
  //   register,
  //   setValue,
  //   formState: { errors },
  // } = useForm();
  // useEffect(() => {
  //   const fetchOrders = async () => {
  //     try {
  //       dispatch({ type: 'FETCH_REQUEST' });
  //       const { data } = await axios.get(
  //         `/api/products/${enoikiastis._id}/reviews`
  //       );
  //       setReviews(data);
  //       dispatch({
  //         type: 'FETCH_SUCCESS',
  //       });
  //       setValue('name', data.name);
  //       setValue('rating', data.rating);
  //       setValue('comment', data.comment);
  //       setReviews(data);
  //     } catch (err) {
  //       dispatch({ type: 'FETCH_FAIL', payload: getError(err) });
  //     }
  //   };
  //   fetchOrders();
  // }, [enoikiastis._id, setValue]);

  // const submitHandler = async ({ rating, comment, name }) => {
  //   try {
  //     await axios.post(`/api/enoikiastes/${enoikiastis._id}/reviews`, {
  //       rating,
  //       comment,
  //       name,
  //     });

  //     toast('Review submitted successfully');
  //   } catch (err) {
  //     toast(getError(err));
  //   }
  // };

  // const [reviews, setReviews] = useState([]);
  // console.log(reviews);
  if (!enoikiastis) {
    return <Layout title="Enoikiastis Not Found">Enoikiastis Not Found</Layout>;
  }

  const addToCartHandler = async () => {
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

  // const addToCartHandler1 = async () => {
  //   const { data1 } = await axios.get(
  //     `/api/enoikiastes/${enoikiastis._id}/sxolia`
  //   );
  //   if (!data1) {
  //     return toast.error('δεν υπάρχει το σχολιο');
  //   } else {
  //     setSxolia(data1);
  //   }
  // };
  // console.log(sxolia);

  return (
    <Layout title={enoikiastis.name}>
      <div className="py-2">
        <Link href="/">
          <a className="text-sm font-semibold hover:font-thin">
            Πίσω στους ενοικιαστές
          </a>
        </Link>
        <div className="grid grid-cols-3 gap-12 py-4 px-8">
          <div>
            <Image
              src={enoikiastis.image}
              alt={enoikiastis.name}
              width={150}
              height={150}
              layout="responsive"
            ></Image>
          </div>
          <div>
            <ul>
              <li>
                <h1 className="text-lg">{enoikiastis.name}</h1>
              </li>
              <li>Ηλικία : {enoikiastis.age}</li>
              <li>
                Παιδιά :{''}
                {enoikiastis.children?.boys + enoikiastis.children?.girls >
                4 ? (
                  <div>Πολύτεκνοι</div>
                ) : enoikiastis.children?.boys &&
                  enoikiastis.children?.girls ? (
                  <div>
                    {enoikiastis.children?.boys}{' '}
                    {enoikiastis.children?.boys === 1
                      ? `αγόρι ${enoikiastis.children.firstBoysAge} χρονών`
                      : `αγόρια ${enoikiastis.children.firstBoysAge} και ${enoikiastis.children.secondBoysAge} χρονών`}{' '}
                    και {enoikiastis.children.girls}{' '}
                    {enoikiastis.children?.girls === 1
                      ? `κορίτσι ${enoikiastis.children.firstGirlsAge} χρονών`
                      : `κορίτσια ${enoikiastis.children.firstGirlsAge} και ${enoikiastis.children.secondGirlsAge} χρονών`}{' '}
                  </div>
                ) : enoikiastis.children?.boys ? (
                  <div>
                    {enoikiastis.children?.boys}{' '}
                    {enoikiastis.children?.boys === 1
                      ? `αγόρι ${enoikiastis.children?.firstBoysAge} χρονών`
                      : `αγόρια ${enoikiastis.children?.firstBoysAge} και ${enoikiastis.children.secondBoysAge} χρονών`}{' '}
                  </div>
                ) : enoikiastis.children?.girls ? (
                  <div>
                    {enoikiastis.children?.girls}{' '}
                    {enoikiastis.children?.girls === 1
                      ? `κορίτσι ${enoikiastis.children.firstGirlsAge} χρονών`
                      : `κορίτσια ${enoikiastis.children.firstGirlsAge} και ${enoikiastis.children.secondGirlsAge} χρονών`}{' '}
                  </div>
                ) : (
                  <div className="text-green-500">άτεκνος</div>
                )}
              </li>
              <li>
                Ζώα :{' '}
                {enoikiastis.animals &&
                enoikiastis.animals.dog &&
                enoikiastis.animals.cat &&
                enoikiastis.animals.other ? (
                  <div>
                    {enoikiastis.animals.dog}
                    {enoikiastis.animals.dog === 1 ? ' σκύλος' : ' σκύλοι'} και
                    {enoikiastis.animals.cat}
                    {enoikiastis.animals.cat === 1 ? ' γάτα' : ' γάτες'} και
                    {enoikiastis.animals.other}
                  </div>
                ) : enoikiastis.animals && enoikiastis.animals.dog ? (
                  <div>
                    {enoikiastis.animals.dog}
                    {enoikiastis.animals.dog === 1 ? ' σκύλος' : ' σκύλοι'}
                  </div>
                ) : enoikiastis.animals && enoikiastis.animals.cat ? (
                  <div>
                    {enoikiastis.animals.cat}
                    {enoikiastis.animals.cat === 1 ? ' γάτα' : ' γάτες'}
                  </div>
                ) : enoikiastis.animals && enoikiastis.animals.other ? (
                  <div className="text-red-500">
                    προσοχή {enoikiastis.animals.other}
                  </div>
                ) : (
                  <div>χωρίς ζώα</div>
                )}
              </li>
              <li>
                {enoikiastis.rating} από {enoikiastis.numReviews} ψήφους
              </li>
              <li>{enoikiastis.description}</li>
            </ul>
          </div>
          <div>
            <button
              className="primary-button w-full"
              onClick={addToCartHandler}
            >
              Επιλογή
            </button>
            {/* <button
              className="primary-button w-full"
              onClick={addToCartHandler1}
            >
              sxolia
            </button> */}
            {/* {sxolia.map((sxolio) => (
              <ul key={sxolio._id}>
                <li>{sxolio.name}</li>
              </ul>
            ))} */}
          </div>
        </div>
      </div>{' '}
      {/* <h1>REVIEWS</h1>
      {loading ? (
        <div>Loading...</div>
      ) : error ? (
        <div className="alert-error">{getError(error)}</div>
      ) : (
        <div className="overflow-x-auto">
          <table className="min-w-full">
            <thead className="border-b">
              <tr>
                <th className="px-5 text-left">ID</th>
                <th className="px-5 text-left">DATE</th>
                <th className="px-5 text-left">name</th>
                <th className="px-5 text-left">COMMENT</th>
                <th className="px-5 text-left">RATING</th>
                <th className="px-5 text-left">ACTION</th>
              </tr>
            </thead>
            <tbody>
              {reviews.map((review) => (
                <tr key={review._id}>
                  <td className="p-5">{review._id.substring(20, 24)}</td>
                  <td className="p-5">{review.createdAt.substring(0, 10)}</td>
                  <td className="p-5">{review.name}</td>
                  <td className="p-5">{review.comment}</td>
                  <td className="p-5">{review.rating}</td>
                  <td className="p-5">
                    <Link
                      href={`/api/products/${enoikiastis._id}/reviews`}
                      passHref
                    >
                      <a>Details</a>
                    </Link>
                  </td>
                </tr>
              ))}
            </tbody>
            {reviews}
          </table>
        </div>
      )}
      <form
        className="mx-auto max-w-screen-md"
        onSubmit={handleSubmit(submitHandler)}
      >
        <h1 className="mb-4 text-xl">Leave your review</h1>
        <div className="mb-4">
          <label htmlFor="comment">comment</label>
          <input
            className="w-full"
            id="comment"
            autoFocus
            {...register('comment', {
              required: 'please encoment coment',
            })}
          />
          {errors.comment && (
            <div className="text-red-500">{errors.comment.message}</div>
          )}
        </div>
        <div className="mb-4">
          <label htmlFor="name">ονομα</label>
          <input
            className="w-full"
            id="name"
            {...register('name', {
              required: 'please enter address',
              minLength: { value: 3, message: 'name is more than 2 char' },
            })}
          />
          {errors.address && (
            <div className="text-red-500">{errors.name.message}</div>
          )}
        </div>
        <div className="mb-4">
          <label htmlFor="rating">Rating</label>
          <input
            className="w-full"
            id="rating"
            {...register('rating', {
              required: 'please enter rating',
            })}
          />
          {errors.rating && (
            <div className="text-red-500">{errors.rating.message}</div>
          )}
        </div>

        <div className="mb-4 flex justify-between">
          <button className="primary-button">Επόμενο</button>
        </div>
      </form> */}
    </Layout>
  );
}
export async function getServerSideProps(contex) {
  const { params } = contex;
  const { slug } = params;
  await db.connect();
  const enoikiastis = await Enoikiastis.findOne(
    { slug },
    '-reviews -orders'
  ).lean();
  await db.disconnect();
  return {
    props: {
      enoikiastis: enoikiastis ? db.convertDocToObj(enoikiastis) : null,
    },
  };
}

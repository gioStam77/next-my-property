import axios from 'axios';
import Link from 'next/link';

import React, { useEffect } from 'react';
import { useReducer } from 'react';
import { useForm } from 'react-hook-form';
import { toast } from 'react-toastify';
import Layout from '../../../components/layout';
import { getError } from '../../../utils/error';

function reducer(state, action) {
  switch (action.type) {
    case 'FETCH_REQUEST':
      return { ...state, loading: true, error: '' };
    case 'FETCH_SUCCESS':
      return { ...state, loading: false, error: '' };
    case 'FETCH_FAIL':
      return { ...state, loading: false, error: action.payload };
    case 'UPDATE_REQUEST':
      return { ...state, loadingUpdate: true, errorUpdate: '' };
    case 'UPDATE_SUCCESS':
      return { ...state, loadingUpdate: false, errorUpdate: '' };
    case 'UPDATE_FAIL':
      return { ...state, loadingUpdate: false, errorUpdate: action.payload };

    default:
      return state;
  }
}

export default function OrderEditScreen({ params }) {
  const orderId = params.id;

  const [{ loading, error, loadingUpdate }, dispatch] = useReducer(reducer, {
    loading: true,
    error: '',
  });

  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue,
  } = useForm();

  useEffect(() => {
    const fetchData = async () => {
      try {
        dispatch({ type: 'FETCH_REQUEST' });
        const { data } = await axios.get(`/api/orders/${orderId}`);
        dispatch({ type: 'FETCH_SUCCESS' });
        setValue('fullName', data.homeAddress.fullName);
        setValue('address', data.homeAddress.address);
        setValue('postalCode', data.homeAddress.postalCode);
        setValue('city', data.homeAddress.city);
        setValue('country', data.homeAddress.country);
        setValue('sxolia', data.sxolia);
        setValue(
          'orderItems',
          data.orderItems.map((item) => item.name)
        );
        setValue('madeAt', data.madeAt);
      } catch (err) {
        dispatch({ type: 'FETCH_FAIL', payload: getError(err) });
      }
    };
    fetchData();
  }, [orderId, setValue]);

  //   const router = useRouter();

  const submitHandler = async ({
    fullName,
    address,
    postalCode,
    city,
    country,
    sxolia,
    orderItems,
    madeAt,
  }) => {
    try {
      dispatch({ type: 'UPDATE_REQUEST' });
      await axios.put(`/api/orders/${orderId}`, {
        fullName,
        address,
        postalCode,
        city,
        country,
        sxolia,
        orderItems,
        madeAt,
      });
      dispatch({ type: 'UPDATE_SUCCESS' });
      toast.success('Order updated successfuly');
    } catch (err) {
      dispatch({ type: 'UPDATE_FAIL', payload: getError(err) });
      toast.error(getError(err));
    }
  };

  return (
    <Layout title={`Edit order ${orderId}`}>
      <div className="grid md:grid-cols-3 md:gap-5">
        <div className="md:col-span-3">
          {loading ? (
            <div>Loading...</div>
          ) : error ? (
            <div className="alert-error">{error}</div>
          ) : (
            <form
              className="mx-auto max-w-screen-md"
              onSubmit={handleSubmit(submitHandler)}
            >
              <h1 className="mb-4 text-xl">{`Edit order ${orderId}`}</h1>
              <div className="mb-4">
                <label htmlFor="fullName"> Ιδιοκτήτης:</label>
                <input
                  className="w-full"
                  id="fullName"
                  autoFocus
                  {...register('fullName', {
                    required: 'Please enter fullName',
                  })}
                />
                {errors.fullName && (
                  <div className="text-red-500">{errors.fullName.message}</div>
                )}
              </div>
              <div className="mb-4">
                <label htmlFor="address"> Διεύθυνση:</label>
                <input
                  className="w-full"
                  id="address"
                  {...register('address', {
                    required: 'Please enter address',
                  })}
                />
                {errors.address && (
                  <div className="text-red-500">{errors.address.message}</div>
                )}
              </div>
              <div className="mb-4">
                <label htmlFor="postalCode"> Ταχ.Κωδ.:</label>
                <input
                  className="w-full"
                  id="postalCode"
                  {...register('postalCode', {
                    required: 'Please enter postalCode',
                  })}
                />
                {errors.postalCode && (
                  <div className="text-red-500">
                    {errors.postalCode.message}
                  </div>
                )}
              </div>
              <div className="mb-4">
                <label htmlFor="city"> Πόλη:</label>
                <input
                  type="text"
                  className="w-full"
                  id="city"
                  {...register('city', {
                    required: 'Please enter city',
                  })}
                />
                {errors.city && (
                  <div className="text-red-500">{errors.city.message}</div>
                )}
              </div>
              <div className="mb-4">
                <label htmlFor="country"> Χώρα:</label>
                <input
                  className="w-full"
                  id="country"
                  {...register('country', {
                    required: 'Please enter country',
                  })}
                />
                {errors.country && (
                  <div className="text-red-500">{errors.country.message}</div>
                )}
              </div>
              <div className="mb-4">
                <label htmlFor="sxolia">sxolia</label>
                <input
                  className="w-full"
                  id="sxolia"
                  {...register('sxolia', {
                    required: 'Please enter sxolia',
                  })}
                />
                {errors.sxolia && (
                  <div className="text-red-500">{errors.sxolia.message}</div>
                )}
              </div>
              <div className="mb-4">
                <label htmlFor="price">orderItems</label>
                <input
                  className="w-full"
                  id="orderItems"
                  {...register('orderItems')}
                />
                {errors.orderItems && (
                  <div className="text-red-500">
                    {errors.orderItems.message}
                  </div>
                )}
              </div>
              <div className="mb-4">
                <label htmlFor="image">madeAt</label>
                <input className="w-full" id="madeAt" {...register('madeAt')} />
                {errors.madeAt && (
                  <div className="text-red-500">{errors.madeAt.message}</div>
                )}
              </div>
              <div className="mb-4">
                <button disabled={loadingUpdate} className="primary-button">
                  {loadingUpdate ? 'Loading' : 'Update'}
                </button>
              </div>
              <div className="mb-4">
                <Link href={`/order_history`}>Back</Link>
              </div>
            </form>
          )}
        </div>
      </div>
    </Layout>
  );
}

OrderEditScreen.auth = true;

export async function getServerSideProps({ params }) {
  return {
    props: { params },
  };
}

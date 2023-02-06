import Cookies from 'js-cookie';
import { useRouter } from 'next/router';
import React, { useContext } from 'react';
import { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import CheckoutWizard from '../components/CheckoutWizard.js';
import Layout from '../components/layout';
import { Store } from '../utils/Store';

export default function HomeAddress() {
  const { state, dispatch } = useContext(Store);

  const router = useRouter();

  const {
    handleSubmit,
    register,
    formState: { errors },
    setValue,
  } = useForm();

  const { cart } = state;
  const { homeAddress } = cart;

  useEffect(() => {
    setValue('fullName', homeAddress.fullName);
    setValue('address', homeAddress.address);
    setValue('city', homeAddress.city);
    setValue('postalCode', homeAddress.postalCode);
    setValue('country', homeAddress.country);
  }, [homeAddress, setValue]);

  const submitHandler = ({ fullName, address, postalCode, country, city }) => {
    dispatch({
      type: 'SAVE_HOME_ADDRESS',
      payload: { fullName, address, postalCode, country, city },
    });
    Cookies.set(
      'cart',
      JSON.stringify({
        ...cart,
        homeAddress: {
          fullName,
          address,
          postalCode,
          country,
          city,
        },
      })
    );
    router.push('/sxolia');
  };

  return (
    <Layout title="Home address">
      <CheckoutWizard activeStep={1} />
      <form
        className="mx-auto max-w-screen-md"
        onSubmit={handleSubmit(submitHandler)}
      >
        <h1 className="mb-4 text-xl">Στοιχεία Σπιτιού που έχει νοικιάσει</h1>
        <div className="mb-4">
          <label htmlFor="fullName">Ονοματεπώνυμο Ιδιοκτήτη</label>
          <input
            className="w-full"
            id="fullName"
            autoFocus
            {...register('fullName', {
              required: 'please enter full name',
            })}
          />
          {errors.fullName && (
            <div className="text-red-500">{errors.fullName.message}</div>
          )}
        </div>
        <div className="mb-4">
          <label htmlFor="address">Διεύθυνση</label>
          <input
            className="w-full"
            id="address"
            {...register('address', {
              required: 'please enter address',
              minLength: { value: 3, message: 'Address is more than 2 char' },
            })}
          />
          {errors.address && (
            <div className="text-red-500">{errors.address.message}</div>
          )}
        </div>
        <div className="mb-4">
          <label htmlFor="city">Πόλη</label>
          <input
            className="w-full"
            id="city"
            {...register('city', {
              required: 'please enter city',
              minLength: { value: 3, message: 'city is more than 2 char' },
            })}
          />
          {errors.address && (
            <div className="text-red-500">{errors.city.message}</div>
          )}
        </div>
        <div className="mb-4">
          <label htmlFor="postalCode">Ταχιδρομ. Κώδικας</label>
          <input
            className="w-full"
            id="postalCode"
            {...register('postalCode', {
              required: 'please enter postal Code',
            })}
          />
          {errors.postalCode && (
            <div className="text-red-500">{errors.postalCode.message}</div>
          )}
        </div>
        <div className="mb-4">
          <label htmlFor="country">Χώρα</label>
          <input
            className="w-full"
            id="country"
            {...register('country', {
              required: 'please enter Country',
            })}
          />
          {errors.country && (
            <div className="text-red-500">{errors.country.message}</div>
          )}
        </div>
        <div className="mb-4 flex justify-between">
          <button className="primary-button">Επόμενο</button>
        </div>
      </form>
    </Layout>
  );
}
HomeAddress.auth = true;

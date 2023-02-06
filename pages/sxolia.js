import React from 'react';
import Layout from '../components/layout';
import { useForm } from 'react-hook-form';
import { useContext } from 'react';
import Cookies from 'js-cookie';
import { Store } from '../utils/Store';
import { useRouter } from 'next/router';
import CheckoutWizard from '../components/CheckoutWizard';

function Sxolia() {
  const { state, dispatch } = useContext(Store);
  const { cart } = state;

  const router = useRouter();

  const {
    handleSubmit,
    register,
    formState: { errors },
    // setValue,
  } = useForm();

  const submitHandler = ({ sxolia }) => {
    dispatch({
      type: 'SAVE_SXOLIA',
      payload: sxolia,
    });
    Cookies.set(
      'cart',
      JSON.stringify({
        ...cart,
        sxolia,
      })
    );
    router.push('/lastPage');
  };

  return (
    <Layout title="Sxolia">
      <CheckoutWizard activeStep={2} />
      <form
        className="mx-auto max-w-screen-md"
        onSubmit={handleSubmit(submitHandler)}
      >
        {' '}
        <h1 className="mb-20 text-xl">Γενική Εντύπωση</h1>
        <div className="mb-20">
          <label htmlFor="sxolia">Σχόλια</label>
          <textarea
            className="w-full text-lg  "
            id="sxolia"
            autoFocus
            {...register('sxolia', {
              required: 'παρακαλώ γράψτε τα σχόλιά σας',
              maxLength: {
                value: 255,
                message: 'Cannot Exceed more 255 Characters',
              },
            })}
          />
          {errors.sxolia && (
            <div className="text-red-500">{errors.sxolia.message}</div>
          )}
        </div>
        <div className="flex justify-around">
          <button
            className="default-button "
            type="button"
            onClick={() => router.push('/homeAddress')}
          >
            Πίσω
          </button>
          <button className="primary-button">Σώσε</button>
        </div>
      </form>
    </Layout>
  );
}
Sxolia.auth = true;
export default Sxolia;

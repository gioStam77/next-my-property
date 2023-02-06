import Link from 'next/link';
import React, { useEffect } from 'react';
import Layout from '../components/layout';
import { useForm } from 'react-hook-form';
import { signIn, useSession } from 'next-auth/react';
import { getError } from '../utils/error';
import { toast } from 'react-toastify';
import { useRouter } from 'next/router';
import axios from 'axios';

export default function RegisterScreen() {
  const { data: session } = useSession();

  const router = useRouter();
  const { redirect } = router.query;

  useEffect(() => {
    if (session?.user) {
      router.push(redirect || '/');
    }
  }, [redirect, router, session]);

  const {
    handleSubmit,
    register,
    getValues,
    formState: { errors },
  } = useForm();

  const submitHandler = async ({ name, email, password }) => {
    try {
      await axios.post('/api/auth/signup', {
        name,
        email,
        password,
      });

      const result = await signIn('credentials', {
        redirect: false,
        email,
        password,
      });
      if (result.error) {
        toast.error(result.error);
      }
    } catch (err) {
      toast.error(getError(err));
    }
  };

  return (
    <Layout title="Δημιουργία Λογαριασμού">
      <form
        className="mx-auto max-w-screen-md"
        onSubmit={handleSubmit(submitHandler)}
      >
        <h1 className="mb-4 text-xl">Δημιουργία Λογαριασμού</h1>
        <div className="=mb-4">
          <label htmlFor="email">Name</label>
          <input
            type="text"
            {...register('name', {
              required: 'Παρακαλώ καταχωρίστε το όνομά σας',
              minLength: {
                value: 3,
                message:
                  'Το όνομά πρέπει να αποτελείται απο 3 χαρακτήρες και πάνω',
              },
            })}
            className="w-full"
            id="name"
            autoFocus
          />
        </div>
        {errors.name && (
          <div className="text-red-500">{errors.name.message}</div>
        )}
        <div className="=mb-4">
          <label htmlFor="email">Email</label>
          <input
            type="email"
            {...register('email', {
              required: 'Παρακαλώ καταχωρίστε το email σας',
              pattern: {
                value: /^[a-zA-Z0-9_.+-]+@[a-zA-Z0-9-]+.[a-zA-Z0-9-.]+$/i,
                message: 'Το email δεν είναι έγκυρο',
              },
            })}
            className="w-full"
            id="email"
          />
        </div>
        {errors.email && (
          <div className="text-red-500">{errors.email.message}</div>
        )}
        <div className="=mb-4">
          <label htmlFor="password">Password</label>
          <input
            type="password"
            {...register('password', {
              required: 'Παρακαλώ πληκτρολογήστε το password',
              minLength: {
                value: 6,
                message:
                  'Το password πρέπει να αποτελείται απο 5 χαρακτήρες και πάνω',
              },
            })}
            className="w-full"
            id="password"
            autoFocus
          />
        </div>
        {errors.password && (
          <div className="text-red-500">{errors.password.message}</div>
        )}
        <div className="=mb-4">
          <label htmlFor="confirmPassword">Confirm Password</label>
          <input
            type="password"
            className="w-full"
            id="confirmPassword"
            {...register('confirmPassword', {
              required: 'Παρακαλώ πληκτρολογήστε το confirm password',
              validate: (value) => value === getValues('password'),
              minLength: {
                value: 6,
                message:
                  'Το confirm password πρέπει να αποτελείται απο 5 χαρακτήρες και πάνω',
              },
            })}
          />
        </div>
        {errors.confirmPassword && (
          <div className="text-red-500">{errors.confirmPassword.message}</div>
        )}
        {errors.confirmPassword &&
          errors.confirmPassword.type === 'validate' && (
            <div className="text-red-500">Password do not match</div>
          )}
        <div className="mb-4">
          <button className="primary-button">Εγγραφή</button>
        </div>
        <div className="mb-4">
          Δεν έχετε λογαριασμό?
          <Link href={`/register?redirect=${redirect || '/'}`}> Εγγραφή</Link>
        </div>
      </form>
    </Layout>
  );
}

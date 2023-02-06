/* eslint-disable @next/next/no-img-element */
import Link from 'next/link';
import React from 'react';
import { useSession } from 'next-auth/react';
import { XCircleIcon } from '@heroicons/react/outline';

export default function Enoikiastis1({
  enoikiastis,
  addToCartHandler,
  removeItemHandler,
}) {
  const { data: session } = useSession();

  return (
    <div className="card">
      <Link href={session ? `/enoikiastis/${enoikiastis.slug}` : '/login'}>
        <a>
          <img
            src={enoikiastis.image}
            alt={enoikiastis.name}
            className="rounded shadow scale-50 hover:scale-100"
          />
        </a>
      </Link>
      <div className="flex flex-col items-center justify-center p-5">
        <Link href={`/enoikiastis/${enoikiastis.slug}`}>
          <a>
            <h2 className="text-lg">{enoikiastis.name}</h2>
          </a>
        </Link>
        {session ? (
          <p className="mb-2">
            Τηλ. :{''} {enoikiastis.tel}
          </p>
        ) : (
          <p className="mb-2">Τηλ. :{''} 69********</p>
        )}

        <p className="mb-2">
          Ηλικία :{''} {enoikiastis.age}
        </p>

        <p className="mb-2">
          Παιδιά : {''}
          {enoikiastis.children?.boys + enoikiastis.children?.girls ||
            'άτεκνος'}
        </p>

        <button
          onClick={() => addToCartHandler(enoikiastis)}
          className="primary-button"
          type="button"
        >
          Επιλογή
        </button>
        <button onClick={() => removeItemHandler(enoikiastis)}>
          <XCircleIcon className="h-5 w-5"></XCircleIcon>
        </button>
      </div>
    </div>
  );
}
// Enoikiastis1.auth = true;

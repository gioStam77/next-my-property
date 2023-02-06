import Head from 'next/head';
import { signOut, useSession } from 'next-auth/react';
import Link from 'next/link';
import React, { useContext, useEffect, useState } from 'react';
import { Store } from '../utils/Store';
import { Menu } from '@headlessui/react';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import DropdownLink from './DropdownLink';
import Cookies from 'js-cookie';

export default function Layout({ children, title }) {
  const { status, data: session } = useSession();

  const { state, dispatch } = useContext(Store);
  const { cart } = state;

  const [countEnoikiastes, setCountEnoikiastes] = useState(0);
  useEffect(() => {
    setCountEnoikiastes(cart.enoikiastes.length);
  }, [cart.enoikiastes]);

  const logoutClickHandler = () => {
    Cookies.remove('cart');
    dispatch({ type: 'CART_RESET' });
    signOut({ callbackUrl: '/login' });
  };

  return (
    <>
      <Head>
        <title>{title ? title + '- My-Property' : 'My-Property'}</title>
        <meta name="description" content="database for renters " />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <ToastContainer position="bottom-center" limit={1} />

      <div className="flex min-h-screen flex-col justify-between ">
        <header>
          <nav className="flex h-12 px-4 items-center justify-between shadow-md">
            <Link href="/">
              <a className="text-lg font-bold">myProperty</a>
            </Link>
            <div>
              <Link href="/cart">
                <a className="p-2">
                  Επιλεγμένοι
                  {countEnoikiastes > 0 && (
                    <span className="ml-1 rounded-full bg-red-600 px-2 py-1 text-xs font-bold text-white">
                      {countEnoikiastes}
                    </span>
                  )}
                </a>
              </Link>

              {status === 'loading' ? (
                'loading'
              ) : session?.user ? (
                <Menu as="div" className="relative inline-block">
                  <Menu.Button className="text-blue-600">
                    {session.user.name}
                  </Menu.Button>
                  <Menu.Items className="absolute right-0 w-56 origin-top-right bg-white shadow-lg">
                    <Menu.Item>
                      <DropdownLink className="dropdown-link" href="/profile">
                        Profile
                      </DropdownLink>
                    </Menu.Item>
                    <Menu.Item>
                      <DropdownLink
                        className="dropdown-link"
                        href="/order_history"
                      >
                        Παλιότερες Επιλογές
                      </DropdownLink>
                    </Menu.Item>
                    <Menu.Item>
                      <a
                        className="dropdown-link"
                        href="#"
                        onClick={logoutClickHandler}
                      >
                        Έξοδος
                      </a>
                    </Menu.Item>
                  </Menu.Items>
                </Menu>
              ) : (
                <Link href="/login">
                  <a className="p-2">Login</a>
                </Link>
              )}
            </div>
          </nav>
        </header>
        <main className="container m-auto mt-4 mx-4">{children}</main>
        <footer className="flex justify-center items-center h-10 shadow-inner">
          Copyright @ 2022 myProperty
        </footer>
      </div>
    </>
  );
}

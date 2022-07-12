import Head from 'next/head';
import React from 'react';

export default function Layout({ children, title }) {
  return (
    <>
      <Head>
        <title>{title ? title + '- My-Property' : 'My-Property'}</title>
        <meta name="description" content="database for renters " />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <div className="flex min-h-screen flex-col justify-between ">
        <header>header</header>
        <main>{children}</main>
        <footer>footer</footer>
      </div>
    </>
  );
}

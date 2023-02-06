import { useRouter } from 'next/router';
import React from 'react';
import Layout from '../components/layout';

export default function Unauthorized() {
  const router = useRouter();
  const { query } = router;
  const { message } = query;

  return (
    <Layout title="Unauthorized page">
      <h1 className="text-xl">Acess Denied</h1>
      {message && <div className="mb-4 text-red-500">{message}</div>}
    </Layout>
  );
}

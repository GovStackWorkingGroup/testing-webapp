import React from 'react';
import Head from 'next/head';
import ProductTable from '../components/table/ProductTable';
import Definition from '../components/Definition';

const HomePage = () => {
  return (
    <div>
      <Head>
        <title>GovStack testing</title>
        <meta name='description' content='GovStack Testing App' />
        <link rel='icon' href='/favicon.png' />
      </Head>
      <main>
        <Definition />
        <ProductTable />
      </main>
    </div>
  );
};

export default HomePage;

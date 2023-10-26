import Head from 'next/head';
import Definition from '../components/Definition';
import ProductTable from '../components/table/ProductTable';

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

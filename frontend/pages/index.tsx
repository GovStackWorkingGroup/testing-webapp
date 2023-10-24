import Head from 'next/head';
import Definition from '../components/Definition';
import ProductTable from '../components/table/ProductTable';
import useTranslations from '../hooks/useTranslation';

const HomePage = () => {
  const { format } = useTranslations();

  return (
    <div>
      <Head>
        <title>GovStack testing</title>
        <meta name="description" content="GovStack Testing App" />
        <link rel="icon" href="/favicon.png" />
      </Head>
      <main>
        <Definition
          title={format('app.definition.title')}
          description={format('app.definition.description')}
          hasRedirecting={true}
          note={format('app.definition.note')}
        />
        <ProductTable />
      </main>
    </div>
  );
};

export default HomePage;

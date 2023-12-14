import Head from 'next/head';
import Definition from '../components/Definition';
import ProductTable from '../components/table/ProductTable';
import useTranslations from '../hooks/useTranslation';
import { useRouter } from 'next/router';
import { useEffect } from 'react';

const HomePage = () => {
  const router = useRouter();
  const { format } = useTranslations();

  const processToken = (token: string | string[]) => {
    const tokenValue = Array.isArray(token) ? token[0] : token;
    sessionStorage.setItem('accessToken', tokenValue);
  };

  const updateQueryParams = () => {
    const { token, ...rest } = router.query;
    if (token) {
      processToken(token);
      router.replace({
        pathname: router.pathname,
        query: rest,
      }, undefined, { shallow: true });
    }
  };

  useEffect(updateQueryParams, [router]);

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

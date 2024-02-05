import Head from 'next/head';
import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';
import { toast } from 'react-toastify';
import Definition from '../../components/Definition';
import ProductTable from '../../components/table/ProductTable';
import useTranslations from '../../hooks/useTranslation';

const ApiTestingPage = () => {
  const router = useRouter();
  const { format } = useTranslations();
  const [showAll, setShowAll] = useState(false);

  const processToken = (token: string | string[]) => {
    const tokenValue = Array.isArray(token) ? token[0] : token;
    sessionStorage.setItem('accessToken', tokenValue);
  };

  const updateQueryParams = () => {
    const { token, showAll, ...rest } = router.query;
    if (token) {
      processToken(token);
      router.replace({
        pathname: router.pathname,
        query: rest,
      }, undefined, { shallow: true });
    }

    if (showAll) {
      setShowAll(true);
    }
  };

  const handleLoginRejected = () => {
    if (router.query.loginRejected === 'true') {
      toast.error(format('app.error_login.message'));
      const newQuery = { ...router.query };
      delete newQuery.loginRejected;
      router.replace({
        pathname: router.pathname,
        query: newQuery,
      }, undefined, { shallow: true });
    }
  };

  useEffect(() => {
    handleLoginRejected();
  }, [router.query]);

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
        <ProductTable showAll={showAll} />
      </main>
    </div>
  );
};

export default ApiTestingPage;

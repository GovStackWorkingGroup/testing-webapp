import Head from 'next/head';
import React from 'react';
import Link from 'next/link';
import useTranslations from '../../hooks/useTranslation';

const SoftwareComplianceTestingPage = () => {
  const { format } = useTranslations();

  return (
    <div>
      <Head>
        <title>GovStack testing</title>
        <meta name="description" content="GovStack Testing App"/>
        <link rel="icon" href="/favicon.png"/>
      </Head>
      <main className='description-main-container'>
        <p>{format('app.page_description_template')}</p>
      </main>
    </div>
  );
};

export default SoftwareComplianceTestingPage;

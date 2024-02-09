import Head from 'next/head';
import { useRouter } from 'next/router';
import { useEffect } from 'react';
import Definition from '../../components/Definition';
import useTranslations from '../../hooks/useTranslation';
import ListOfCandidateResults from '../../components/compliance/ListOfCandidateResults';

const SoftwareComplianceTestingPage = () => {
  const { format } = useTranslations();
  const router = useRouter();

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
      <main className="software-compliance-main-container">
        <Definition
          title={format('app.definition_self_assessment.title')}
          description={format(
            'app.definition_self_assessment_part_1.description'
          )}
          descriptionPartTwo={format(
            'app.definition_self_assessment_part_2.description'
          )}
          hasRedirecting={true}
          customStyle="definition-section-software-compliance"
        />
        <ListOfCandidateResults />
      </main>
    </div>
  );
};

export default SoftwareComplianceTestingPage;

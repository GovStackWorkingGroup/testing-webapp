import Head from 'next/head';
import Definition from '../../components/Definition';
import useTranslations from '../../hooks/useTranslation';
import ListOfCandidateApplicationComplianceResults from '../../components/ListOfCandidateApplicationComplianceResults';

const SoftwareComplianceTestingPage = () => {
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
          title={format('app.definition_self_assessment.title')}
          description={format('app.definition_self_assessment.description')}
          customStyle="definition-section-software-compliance"
        />
        <ListOfCandidateApplicationComplianceResults />
      </main>
    </div>
  );
};

export default SoftwareComplianceTestingPage;

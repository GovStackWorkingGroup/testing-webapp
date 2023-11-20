import Head from 'next/head';
import Definition from '../../components/Definition';
import useTranslations from '../../hooks/useTranslation';
import ListOfCandidateResults from '../../components/compliance/ListOfCandidateResults';

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

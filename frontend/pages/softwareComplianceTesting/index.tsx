import Head from 'next/head';
import InfoModal from '../../components/shared/modals/InfoModal';
import EvaluationSchemaTable from '../../components/table/EvaluationSchemaTable';

const SoftwareComplianceTestingPage = () => {
  return (
    <div>
      <Head>
        <title>GovStack testing</title>
        <meta name="description" content="GovStack Testing App" />
        <link rel="icon" href="/favicon.png" />
      </Head>
      <main>
        <InfoModal modalTitle="xx" onClose={() => {}}>
          <EvaluationSchemaTable />
        </InfoModal>
      </main>
    </div>
  );
};

export default SoftwareComplianceTestingPage;

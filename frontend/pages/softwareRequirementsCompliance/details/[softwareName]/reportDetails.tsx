import { useRouter } from 'next/router';
import ReportViewDetail from '../../../../components/compliance/ReportViewDetail';

const ReportViewDetailsPage = () => {
  const router = useRouter();
  const { softwareName } = router.query;
  console.log(softwareName, router.query, router);

  return <ReportViewDetail />;
};

export default ReportViewDetailsPage;

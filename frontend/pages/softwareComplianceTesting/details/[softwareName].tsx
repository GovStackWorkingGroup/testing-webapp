import Link from 'next/link';
import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';
import SoftwareAttributes from '../../../components/compliance/SoftwareAttributes';
import SoftwareComplinceWith from '../../../components/compliance/SoftwareComplinceWith';
import SoftwareDetails from '../../../components/compliance/SoftwareDetails';
import useTranslations from '../../../hooks/useTranslation';
import {
  getComplianceList,
  getSoftwareDetails,
} from '../../../service/serviceAPI';
import { SoftwareDetailsType } from '../../../service/types';

const SoftwareComplianceDetailsPage = () => {
  const [dat, setData] = useState<SoftwareDetailsType>({
    logo: '',
    website: '',
    documentation: [],
    pointOfContact: '',
    compliance: [
      {
        formId: '',
        version: '',
        bbDetails: '',
      },
    ],
    softwareName: 'string;',
  });
  const { format } = useTranslations();
  const router = useRouter();

  const { softwareName } = router.query;

  const fetchData = async (softwareName: string) => {
    const data = await getSoftwareDetails(softwareName);
    console.log('data', data);
    setData(data.data[0]);
  };

  useEffect(() => {
    fetchData(softwareName as string);
  }, []);

  return (
    <div className="compliance-detail-page-container">
      <Link className="back-to-btn " href={'/softwareComplianceTesting'}>
        {format('api.back_to_reports_list.label')}
      </Link>
      <SoftwareDetails title={format('app.software_attributes.label')}>
        {/* <SoftwareAttributes softwareDetails={dat} /> */}
      </SoftwareDetails>
      <SoftwareDetails title={format('app.compliance_with.label')}>
        <SoftwareComplinceWith />
      </SoftwareDetails>
    </div>
  );
};

export default SoftwareComplianceDetailsPage;

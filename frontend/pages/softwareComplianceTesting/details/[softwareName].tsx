import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';
import { COMPLIANCE_TESTING_RESULT_PAGE } from '../../../service/constants';
import BackToPageButton from '../../../components/shared/buttons/BackToPageButton';
import { getSoftwareDetails } from '../../../service/serviceAPI';
import SoftwareDetails from '../../../components/compliance/SoftwareDetails';
import SoftwareComplianceWith from '../../../components/compliance/SoftwareComplianceWith';
import { SoftwareDetailsType } from '../../../service/types';
import SoftwareAttributes from '../../../components/compliance/SoftwareAttributes';
import useTranslations from '../../../hooks/useTranslation';

const SoftwareComplianceDetailsPage = () => {
  const { format } = useTranslations();
  const router = useRouter();

  const { softwareName } = router.query;
  const [softwareDetail, setSoftwareDetail] = useState<SoftwareDetailsType>([
    {
      logo: '',
      website: '',
      documentation: [],
      pointOfContact: '',
      compliance: [
        {
          formId: '',
          version: '',
          bbDetails: {},
        },
      ],
      softwareName: 'string;',
    },
  ]);

  const fetchData = async (softwareName: string) => {
    const data = await getSoftwareDetails(softwareName);
    if (data.status) {
      setSoftwareDetail(data.data);
    }
  };

  useEffect(() => {
    fetchData(softwareName as string);
  }, []);

  return (
    <div className="compliance-detail-page-container">
      <BackToPageButton
        text={format('app.back_to_reports_list.label')}
        href={COMPLIANCE_TESTING_RESULT_PAGE}
      />
      <SoftwareDetails title={format('app.software_attributes.label')}>
        <SoftwareAttributes softwareDetails={softwareDetail} />
      </SoftwareDetails>
      <SoftwareDetails title={format('app.compliance_with.label')}>
        {/* <SoftwareComplianceWith /> */}
      </SoftwareDetails>
    </div>
  );
};

export default SoftwareComplianceDetailsPage;

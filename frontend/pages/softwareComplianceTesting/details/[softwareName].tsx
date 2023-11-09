import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';
import {
  COMPLIANCE_TESTING_RESULT_PAGE,
  complianceTEST,
} from '../../../service/constants';
import BackToPageButton from '../../../components/shared/buttons/BackToPageButton';
import { getSoftwareDetails } from '../../../service/serviceAPI';
import SoftwareDetails from '../../../components/compliance/SoftwareDetails';
import SoftwareComplianceWith from '../../../components/compliance/SoftwareComplianceWith';
import { SoftwareDetailsType } from '../../../service/types';
import SoftwareAttributes from '../../../components/compliance/SoftwareAttributes';
import useTranslations from '../../../hooks/useTranslation';

const SoftwareComplianceDetailsPage = () => {
  const [softwareDetail, setSoftwareDetail] = useState<SoftwareDetailsType>([
    {
      logo: '',
      website: '',
      documentation: [],
      pointOfContact: '',
      compliance: [
        {
          softwareVersion: '',
          bbDetails: [],
        },
      ],
      softwareName: 'string;',
    },
  ]);
  const { format } = useTranslations();
  const router = useRouter();
  const { softwareName } = router.query;

  const fetchData = async (softwareName: string) => {
    const data = await getSoftwareDetails(softwareName);
    if (data.status) {
      setSoftwareDetail(data.data);
    }
  };

  useEffect(() => {
    fetchData(softwareName as string);
  }, [softwareName]);

  return (
    <div className="compliance-detail-page-container">
      <BackToPageButton
        text={format('app.back_to_reports_list.label')}
        href={COMPLIANCE_TESTING_RESULT_PAGE}
      />
      <SoftwareDetails title={format('app.software_attributes.label')}>
        <SoftwareAttributes softwareDetails={softwareDetail} />
      </SoftwareDetails>
      {/* {softwareDetail[0].compliance.length */}
      {complianceTEST.length
        ? complianceTEST.map((item, indexKey) => (
          <SoftwareDetails
            title={format('app.compliance_with.label')}
            complianceSection={true}
            softwareVersion={item.softwareVersion}
            key={`software-compliance-with-${indexKey}`}
          >
            <SoftwareComplianceWith softwareComplianceData={item.bbDetails} />
          </SoftwareDetails>
        ))
        : null}
    </div>
  );
};

export default SoftwareComplianceDetailsPage;

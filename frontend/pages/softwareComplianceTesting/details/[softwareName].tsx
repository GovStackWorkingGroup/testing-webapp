import Link from 'next/link';
import SoftwareAttributes from '../../../components/compliance/SoftwareAttributes';
import SoftwareComplinceWith from '../../../components/compliance/SoftwareComplinceWith';
import SoftwareDetails from '../../../components/compliance/SoftwareDetails';
import useTranslations from '../../../hooks/useTranslation';

const SoftwareComplianceDetailsPage = () => {
  const { format } = useTranslations();

  return (
    <div className="compliance-detail-page-container">
      <Link className="back-to-btn " href={'/softwareComplianceTesting'}>
        {format('api.back_to_reports_list.label')}
      </Link>
      <SoftwareDetails title={format('app.software_attributes.label')}>
        <SoftwareAttributes />
      </SoftwareDetails>
      <SoftwareDetails title={format('app.compliance_with.label')}>
        <SoftwareComplinceWith />
      </SoftwareDetails>
    </div>
  );
};

export default SoftwareComplianceDetailsPage;

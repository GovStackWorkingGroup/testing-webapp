import { useRouter } from 'next/router';
import useTranslations from '../../hooks/useTranslation';
import { COMPLIANCE_TESTING_DETAILS_PAGE } from '../../service/constants';
import Button from '../shared/buttons/Button';
import { formatTranslationType } from '../../service/types';

type SoftwareDetailsProps = {
  title: formatTranslationType;
  children: React.ReactNode;
  complianceSection?: boolean;
  softwareVersion?: string;
  softwareId?: string;
  customStyles?: string;
  editButton?: boolean;
  redirectToStep?: number;
  viewReportDetails?: boolean;
};

const SoftwareDetails = ({
  title,
  children,
  complianceSection = false,
  softwareVersion,
  softwareId,
  customStyles,
  editButton = false,
  redirectToStep,
  viewReportDetails,
}: SoftwareDetailsProps) => {
  const { format } = useTranslations();
  const router = useRouter();

  const { draftUUID, softwareName } = router.query;

  const handlePressEdit = () => {
    if (draftUUID) {
      router.replace({
        query: { draftUUID, formStep: redirectToStep },
      });
    }
  };

  return (
    <div
      className={`software-attributes-section ${
        customStyles ? customStyles : ''
      }`}
    >
      {complianceSection ? (
        <div className="software-attributes-title-with-link">
          <p>
            {title}{' '}
            <span className="bold">{`${format(
              'table.software_name.label'
            )} ${softwareVersion}`}</span>
          </p>
          {viewReportDetails && (
            <Button
              type="link"
              href={`/${COMPLIANCE_TESTING_DETAILS_PAGE}${softwareName}/reportDetails/${softwareId}`}
              text={format('app.view_report_details.label')}
              styles="primary-button"
            />
          )}
        </div>
      ) : (
        <div className="software-attributes-title-with-link">
          <p>{title}</p>
          {editButton && (
            <p
              className="software-attributes-title-edit-link"
              onClick={() => handlePressEdit()}
            >
              {format('app.edit.label')}
            </p>
          )}
        </div>
      )}

      {children}
    </div>
  );
};

export default SoftwareDetails;

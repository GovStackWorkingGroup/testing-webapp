import { useRouter } from 'next/router';
import Link from 'next/link';
import useTranslations from '../../hooks/useTranslation';
import { COMPLIANCE_TESTING_DETAILS_PAGE } from '../../service/constants';

type SoftwareDetailsProps = {
  title: string;
  children: React.ReactNode;
  complianceSection?: boolean;
  softwareVersion?: string;
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
            <Link
              className="software-attributes-title-edit-link"
              href={{
                pathname: `/${COMPLIANCE_TESTING_DETAILS_PAGE}${softwareName}/reportDetails`,
              }}
            >
              {format('app.view_report_details.label')}
            </Link>
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

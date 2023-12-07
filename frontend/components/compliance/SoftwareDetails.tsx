import { useRouter } from 'next/router';
import useTranslations from '../../hooks/useTranslation';

type SoftwareDetailsProps = {
  title: string;
  children: React.ReactNode;
  complianceSection?: boolean;
  softwareVersion?: string;
  customStyles?: string;
  editButton?: boolean;
  redirectToStep?: number;
};

const SoftwareDetails = ({
  title,
  children,
  complianceSection = false,
  softwareVersion,
  customStyles,
  editButton = false,
  redirectToStep,
}: SoftwareDetailsProps) => {
  const { format } = useTranslations();
  const router = useRouter();

  const { draftUUID } = router.query;

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
        <p>
          {title}{' '}
          <span className="bold">Software version {softwareVersion}</span>
        </p>
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

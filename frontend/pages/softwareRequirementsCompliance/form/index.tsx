import { COMPLIANCE_TESTING_RESULT_PAGE } from '../../../service/constants';
import BackToPageButton from '../../../components/shared/buttons/BackToPageButton';
import useTranslations from '../../../hooks/useTranslation';

const SoftwareComplianceForm = () => {
  const { format } = useTranslations();

  return (
    <div>
      <BackToPageButton
        text={format('app.back_to_reports_list.label')}
        href={COMPLIANCE_TESTING_RESULT_PAGE}
      />
    </div>
  );
};

export default SoftwareComplianceForm;

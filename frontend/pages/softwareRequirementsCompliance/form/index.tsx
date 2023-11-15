import { useState } from 'react';
import {
  COMPLIANCE_TESTING_RESULT_PAGE,
  softwareComplianceFormSteps,
} from '../../../service/constants';
import BackToPageButton from '../../../components/shared/buttons/BackToPageButton';
import useTranslations from '../../../hooks/useTranslation';
import ProgressBar from '../../../components/shared/ProgressBar';
import SoftwareAttributesForm from '../../../components/form/SoftwareAttributesForm';

const SoftwareComplianceForm = () => {
  const [currentProgressBarStep, setCurrentProgressBarStep] =
    useState<number>(1);
  const { format } = useTranslations();

  const handleStepChange = (currentStep: number) => {
    setCurrentProgressBarStep(currentStep);
  };

  return (
    <div>
      <BackToPageButton
        text={format('app.back_to_reports_list.label')}
        href={COMPLIANCE_TESTING_RESULT_PAGE}
      />
      <ProgressBar
        steps={softwareComplianceFormSteps}
        currentStep={handleStepChange}
      >
        <>
          {currentProgressBarStep === 1 && <SoftwareAttributesForm />}
          {currentProgressBarStep === 2 && <div>step 2</div>}
          {currentProgressBarStep === 3 && <div>step 3</div>}
          {currentProgressBarStep === 4 && <div>step 4</div>}
        </>
      </ProgressBar>
    </div>
  );
};

export default SoftwareComplianceForm;

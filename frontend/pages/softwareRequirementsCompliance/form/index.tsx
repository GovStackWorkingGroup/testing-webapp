import { useRef, useState } from 'react';
import {
  COMPLIANCE_TESTING_RESULT_PAGE,
  softwareComplianceFormSteps,
} from '../../../service/constants';
import BackToPageButton from '../../../components/shared/buttons/BackToPageButton';
import useTranslations from '../../../hooks/useTranslation';
import ProgressBar from '../../../components/shared/ProgressBar';
import SoftwareAttributesForm, {
  SoftwareAttributedRef,
} from '../../../components/form/SoftwareAttributesForm';

const SoftwareComplianceForm = () => {
  const softwareAttributedRef = useRef<SoftwareAttributedRef>(null);

  const [currentProgressBarStep, setCurrentProgressBarStep] =
    useState<number>(1);
  const [softwareAttributesFormValues, setSoftwareAttributesFormValues] =
    useState({});
  const [isSoftwareAttributesFormValid, setIsSoftwareAttributesFormValid] =
    useState(false);
  const [isCurrentFormValid, setIsCurrentFormValid] = useState(false);

  const { format } = useTranslations();

  const handleStepChange = (currentStep: number) => {
    setCurrentProgressBarStep(currentStep);
  };

  const handleNextButton = () => {
    if (currentProgressBarStep === 1) {
      // setValidateForm(true);
      softwareAttributedRef.current?.validate();
      setIsCurrentFormValid(isSoftwareAttributesFormValid);
    }
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
        onNextButton={handleNextButton}
        isCurrentFormValid={isCurrentFormValid}
      >
        <>
          {currentProgressBarStep === 1 && (
            <SoftwareAttributesForm
              softwareAttributesFormValues={setSoftwareAttributesFormValues}
              isSoftwareAttributesFormValid={setIsSoftwareAttributesFormValid}
              customRef={softwareAttributedRef}
            />
          )}
          {currentProgressBarStep === 2 && <div>step 2</div>}
          {currentProgressBarStep === 3 && <div>step 3</div>}
          {currentProgressBarStep === 4 && <div>step 4</div>}
        </>
      </ProgressBar>
    </div>
  );
};

export default SoftwareComplianceForm;

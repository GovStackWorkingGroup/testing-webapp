import { useEffect, useRef, useState } from 'react';
import { toast } from 'react-toastify';
import { RiCheckboxCircleFill } from 'react-icons/ri';
import {
  COMPLIANCE_TESTING_RESULT_PAGE,
  SOFTWARE_ATTRIBUTES_STORAGE_NAME,
  softwareComplianceFormSteps,
} from '../../service/constants';
import BackToPageButton from '../../components/shared/buttons/BackToPageButton';
import useTranslations from '../../hooks/useTranslation';
import ProgressBar from '../../components/shared/ProgressBar';
import SoftwareAttributesForm, {
  FormValuesType,
  SoftwareAttributedRef,
} from '../../components/form/SoftwareAttributesForm';
import { saveSoftwareDraft } from '../../service/serviceAPI';
import { softwareAttributesDefaultValues } from '../../components/form/helpers';
import DeploymentComplianceForm from './Deployment ComplianceForm';

const SoftwareComplianceForm = () => {
  const [currentProgressBarStep, setCurrentProgressBarStep] =
    useState<number>(1);
  const [softwareAttributesFormValues, setSoftwareAttributesFormValues] =
    useState<FormValuesType>(softwareAttributesDefaultValues);
  const [isSoftwareAttributesFormValid, setIsSoftwareAttributesFormValid] =
    useState(false);
  const [goToNextStep, setGoToNextStep] = useState(false);
  const [renderFormError, setRenderFormError] = useState(false);

  const softwareAttributedRef = useRef<SoftwareAttributedRef>(null);
  const { format } = useTranslations();

  const handleStepChange = (currentStep: number) => {
    setCurrentProgressBarStep(currentStep);
  };

  const handleNextButton = () => {
    if (currentProgressBarStep === 1) {
      softwareAttributedRef.current?.validate();
    }
  };

  const handleSaveDraft = async (softwareData: FormValuesType) => {
    await saveSoftwareDraft(softwareData).then((response) => {
      if (response.status) {
        setGoToNextStep(true);
        toast.success(format('form.form_saved_success.message'), {
          icon: <RiCheckboxCircleFill className="success-toast-icon" />,
        });
      }
    });
  };

  const handleSaveInLocalStorage = (
    localStorageName: string,
    dataToSave: unknown
  ) => {
    localStorage.removeItem(localStorageName);
    localStorage.setItem(localStorageName, JSON.stringify(dataToSave));
  };

  useEffect(() => {
    if (isSoftwareAttributesFormValid && currentProgressBarStep === 1) {
      handleSaveInLocalStorage(
        SOFTWARE_ATTRIBUTES_STORAGE_NAME,
        softwareAttributesFormValues
      );
      handleSaveDraft(softwareAttributesFormValues);
    }
  }, [isSoftwareAttributesFormValid, currentProgressBarStep]);

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
        isCurrentFormValid={isSoftwareAttributesFormValid}
        goToNextStep={goToNextStep}
        renderFormError={renderFormError}
      >
        <>
          {currentProgressBarStep === 1 && (
            <SoftwareAttributesForm
              softwareAttributesFormValues={setSoftwareAttributesFormValues}
              isSoftwareAttributesFormValid={setIsSoftwareAttributesFormValid}
              customRef={softwareAttributedRef}
              onEdited={(hasError: boolean) => setRenderFormError(hasError)}
            />
          )}
          {currentProgressBarStep === 2 && <DeploymentComplianceForm />}
          {currentProgressBarStep === 3 && <div>step 3</div>}
          {currentProgressBarStep === 4 && <div>step 4</div>}
        </>
      </ProgressBar>
    </div>
  );
};

export default SoftwareComplianceForm;

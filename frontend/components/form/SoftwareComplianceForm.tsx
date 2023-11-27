import { useEffect, useRef, useState } from 'react';
import { toast } from 'react-toastify';
import { RiCheckboxCircleFill, RiErrorWarningFill } from 'react-icons/ri';
import { useRouter } from 'next/router';
import {
  COMPLIANCE_TESTING_RESULT_PAGE,
  SOFTWARE_ATTRIBUTES_STORAGE_NAME,
  softwareComplianceFormSteps,
} from '../../service/constants';
import BackToPageButton from '../shared/buttons/BackToPageButton';
import useTranslations from '../../hooks/useTranslation';
import ProgressBar from '../shared/ProgressBar';
import { saveSoftwareDraft } from '../../service/serviceAPI';
import { SoftwareDraftDetailsType } from '../../service/types';
import SoftwareAttributesForm, {
  FormValuesType,
  SoftwareAttributedRef,
} from './SoftwareAttributesForm';
import { softwareAttributesDefaultValues } from './helpers';

type SoftwareComplianceFormProps = {
  savedDraftDetail?: SoftwareDraftDetailsType | undefined;
  currentStep?: number | undefined;
};

const SoftwareComplianceForm = ({
  savedDraftDetail,
  currentStep,
}: SoftwareComplianceFormProps) => {
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
  const router = useRouter();

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
        localStorage.removeItem(SOFTWARE_ATTRIBUTES_STORAGE_NAME);

        router.push(`${response.data.link}/2`);

        return;
      }

      if (!response.status) {
        toast.error(format('form.form_saved_error.message'), {
          icon: <RiErrorWarningFill className="error-toast-icon" />,
        });
      }
    });
  };

  useEffect(() => {
    if (isSoftwareAttributesFormValid && currentProgressBarStep === 1) {
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
        changeStepTo={currentStep}
      >
        <>
          {currentProgressBarStep === 1 && (
            <SoftwareAttributesForm
              savedDraftDetail={savedDraftDetail}
              softwareAttributesFormValues={setSoftwareAttributesFormValues}
              isSoftwareAttributesFormValid={setIsSoftwareAttributesFormValid}
              customRef={softwareAttributedRef}
              onEdited={(hasError: boolean) => setRenderFormError(hasError)}
            />
          )}
          {currentProgressBarStep === 2 && <div></div>}
          {currentProgressBarStep === 3 && <div></div>}
          {currentProgressBarStep === 4 && <div></div>}
        </>
      </ProgressBar>
    </div>
  );
};

export default SoftwareComplianceForm;

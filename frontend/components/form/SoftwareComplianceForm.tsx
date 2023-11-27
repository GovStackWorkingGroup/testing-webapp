import { useEffect, useRef, useState } from 'react';
import { toast } from 'react-toastify';
import { RiCheckboxCircleFill, RiErrorWarningFill } from 'react-icons/ri';
import { useRouter } from 'next/router';
import {
  COMPLIANCE_TESTING_RESULT_PAGE,
  DEPLOYMENT_COMPLIANCE_STORAGE_NAME,
  SOFTWARE_ATTRIBUTES_STORAGE_NAME,
  softwareComplianceFormSteps,
} from '../../service/constants';
import BackToPageButton from '../shared/buttons/BackToPageButton';
import useTranslations from '../../hooks/useTranslation';
import ProgressBar from '../shared/ProgressBar';
import {
  saveSoftwareDraft,
  updateDraftDetails,
} from '../../service/serviceAPI';
import {
  SoftwareDraftDetailsType,
  SoftwareDraftToUpdateType,
} from '../../service/types';
import SoftwareAttributesForm, {
  FormValuesType,
  SoftwareAttributedRef,
} from './SoftwareAttributesForm';
import {
  deploymentComplianceDefaultValues,
  softwareAttributesDefaultValues,
} from './helpers';
import DeploymentComplianceForm, {
  DeploymentComplianceFormValuesType,
  DeploymentComplianceRef,
} from './DeploymentComplianceForm';

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
  const [deploymentComplianceFormValues, setDeploymentComplianceFormValues] =
    useState<DeploymentComplianceFormValuesType>(
      deploymentComplianceDefaultValues
    );
  const [isSoftwareAttributesFormValid, setIsSoftwareAttributesFormValid] =
    useState(false);
  const [isDeploymentComplianceFormValid, setIsDeploymentComplianceFormValid] =
    useState(false);
  const [goToNextStep, setGoToNextStep] = useState(false);
  const [renderFormError, setRenderFormError] = useState(false);
  const [isDraftSaved, setIsDraftSaved] = useState(false);

  const softwareAttributedRef = useRef<SoftwareAttributedRef>(null);
  const deploymentComplianceRef = useRef<DeploymentComplianceRef>(null);
  const { format } = useTranslations();
  const router = useRouter();

  const handleStepChange = (currentStep: number) => {
    setCurrentProgressBarStep(currentStep);
  };

  const handleNextButton = () => {
    if (currentProgressBarStep === 1) {
      softwareAttributedRef.current?.validate();
    }

    if (currentProgressBarStep === 2) {
      deploymentComplianceRef.current?.validate();
    }
  };

  const handleSaveDraftButton = () => {
    console.log('save button klikniety');
    deploymentComplianceRef.current?.validate();
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
        setIsDraftSaved(true);

        return;
      }

      if (!response.status) {
        toast.error(format('form.form_saved_error.message'), {
          icon: <RiErrorWarningFill className="error-toast-icon" />,
        });
      }
    });
  };

  const handleUpdateDraft = async () => {
    const updateData: SoftwareDraftToUpdateType = {};
    if (currentProgressBarStep === 2) {
      updateData.deploymentCompliance = {
        documentation: deploymentComplianceFormValues.documentation.value,
        deploymentInstructions:
          deploymentComplianceFormValues.deploymentInstructions.value,
      };
    }

    if (savedDraftDetail?.uniqueId) {
      await updateDraftDetails(savedDraftDetail?.uniqueId, updateData).then(
        (response) => {
          if (response.status) {
            setGoToNextStep(true);
            toast.success(format('form.form_saved_success.message'), {
              icon: <RiCheckboxCircleFill className="success-toast-icon" />,
            });
            localStorage.removeItem(SOFTWARE_ATTRIBUTES_STORAGE_NAME);
          }

          if (!response.status) {
            toast.error(format('form.form_saved_error.message'), {
              icon: <RiErrorWarningFill className="error-toast-icon" />,
            });
          }
        }
      );
    }
  };

  useEffect(() => {
    if (isSoftwareAttributesFormValid && currentProgressBarStep === 1) {
      handleSaveDraft(softwareAttributesFormValues);
    }
  }, [isSoftwareAttributesFormValid, currentProgressBarStep]);

  useEffect(() => {
    if (isDeploymentComplianceFormValid && currentProgressBarStep === 2) {
      handleUpdateDraft();
    }
  }, [isDeploymentComplianceFormValid, currentProgressBarStep]);

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
        isCurrentFormValid={
          isSoftwareAttributesFormValid || isDeploymentComplianceFormValid
        }
        goToNextStep={goToNextStep}
        renderFormError={renderFormError}
        changeStepTo={currentStep}
        isDraftSaved={isDraftSaved}
        onSaveButton={handleSaveDraftButton}
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
          {currentProgressBarStep === 2 && (
            <DeploymentComplianceForm
              savedDraftDetail={savedDraftDetail}
              deploymentComplianceFormValues={setDeploymentComplianceFormValues}
              isDeploymentComplianceFormValid={
                setIsDeploymentComplianceFormValid
              }
              customRef={deploymentComplianceRef}
              onEdited={(hasError: boolean) => setRenderFormError(hasError)}
            />
          )}
          {currentProgressBarStep === 3 && <div></div>}
          {currentProgressBarStep === 4 && <div></div>}
        </>
      </ProgressBar>
    </div>
  );
};

export default SoftwareComplianceForm;

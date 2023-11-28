import { useRef, useState } from 'react';
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
import ProgressBar, { ProgressBarRef } from '../shared/ProgressBar';
import {
  saveSoftwareDraft,
  updateDraftDetails,
  updateDraftDetailsStepOne,
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
  const [renderFormError, setRenderFormError] = useState(false);
  const [isDraftSaved, setIsDraftSaved] = useState(false);

  const softwareAttributedRef = useRef<SoftwareAttributedRef>(null);
  const deploymentComplianceRef = useRef<DeploymentComplianceRef>(null);
  const nextStepRef = useRef<ProgressBarRef>(null);

  const { format } = useTranslations();
  const router = useRouter();

  const handleStepChange = (currentStep: number) => {
    setCurrentProgressBarStep(currentStep);
  };

  const handleNextButton = () => {
    if (currentProgressBarStep === 1) {
      if (softwareAttributedRef.current?.validate()) {
        handleSaveDraft(softwareAttributesFormValues);
      }

      return;
    }

    if (currentProgressBarStep === 2) {
      if (deploymentComplianceRef.current?.validate()) {
        handleUpdateDraft().then(() => {
          nextStepRef.current?.goNext();
        });
      }

      return;
    }
  };

  const handleSaveDraftButton = () => {
    if (deploymentComplianceRef.current?.validate()) {
      handleUpdateDraft();
    }
  };

  const handleSaveDraft = async (softwareData: FormValuesType) => {
    if (savedDraftDetail) {
      await updateDraftDetailsStepOne(
        savedDraftDetail?.uniqueId,
        softwareData
      ).then((response) => {
        if (response.status) {
          toast.success(format('form.form_saved_success.message'), {
            icon: <RiCheckboxCircleFill className="success-toast-icon" />,
          });
          localStorage.removeItem(SOFTWARE_ATTRIBUTES_STORAGE_NAME);
          console.log('response.data', response.data);
          router.push(`${response.data.link}/2`);
          setIsDraftSaved(true);
          nextStepRef.current?.goNext();

          return;
        }

        if (!response.status) {
          toast.error(format('form.form_saved_error.message'), {
            icon: <RiErrorWarningFill className="error-toast-icon" />,
          });
        }
      });

      return;
    }

    if (!savedDraftDetail) {
      await saveSoftwareDraft(softwareData).then((response) => {
        if (response.status) {
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
    }
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
            toast.success(format('form.form_saved_success.message'), {
              icon: <RiCheckboxCircleFill className="success-toast-icon" />,
            });
            localStorage.removeItem(DEPLOYMENT_COMPLIANCE_STORAGE_NAME);
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
        renderFormError={renderFormError}
        changeStepTo={currentStep}
        isDraftSaved={isDraftSaved}
        onSaveButton={handleSaveDraftButton}
        customRef={nextStepRef}
      >
        <>
          {currentProgressBarStep === 1 && (
            <SoftwareAttributesForm
              savedDraftDetail={savedDraftDetail}
              softwareAttributesFormValues={setSoftwareAttributesFormValues}
              customRef={softwareAttributedRef}
              onEdited={(hasError: boolean) => setRenderFormError(hasError)}
            />
          )}
          {currentProgressBarStep === 2 && (
            <DeploymentComplianceForm
              savedDraftDetail={savedDraftDetail}
              deploymentComplianceFormValues={setDeploymentComplianceFormValues}
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

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
import { SoftwareDraftToUpdateType } from '../../service/types';
import SoftwareAttributesForm, {
  FormValuesType,
  SoftwareAttributedRef,
} from './SoftwareAttributesForm';
import IRSCompliance from './IRSCompliance';
import {
  deploymentComplianceDefaultValues,
  softwareAttributesDefaultValues,
} from './helpers';
import DeploymentComplianceForm, {
  DeploymentComplianceFormValuesType,
  DeploymentComplianceRef,
} from './DeploymentComplianceForm';

type SoftwareComplianceFormProps = {
  currentStep?: number | undefined;
};

const SoftwareComplianceForm = ({
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
  const { draftUUID } = router.query;

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
    if (draftUUID) {
      await updateDraftDetailsStepOne(draftUUID as string, softwareData).then(
        (response) => {
          if (response.status) {
            toast.success(format('form.form_saved_success.message'), {
              icon: <RiCheckboxCircleFill className="success-toast-icon" />,
            });
            localStorage.removeItem(SOFTWARE_ATTRIBUTES_STORAGE_NAME);

            setIsDraftSaved(true);
            nextStepRef.current?.goNext();

            return;
          }

          if (!response.status) {
            toast.error(format('form.form_saved_error.message'), {
              icon: <RiErrorWarningFill className="error-toast-icon" />,
            });
          }
        }
      );

      return;
    }

    if (!draftUUID) {
      await saveSoftwareDraft(softwareData).then((response) => {
        if (response.status) {
          toast.success(format('form.form_saved_success.message'), {
            icon: <RiCheckboxCircleFill className="success-toast-icon" />,
          });
          localStorage.removeItem(SOFTWARE_ATTRIBUTES_STORAGE_NAME);

          // router.replace only here because draftUUID is undefined
          router.replace({
            query: { draftUUID: response.data.uniqueId, formStep: 2 },
          });
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

    if (draftUUID) {
      await updateDraftDetails(draftUUID as string, updateData).then(
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
      <div className="back-to-btn-container">
        <BackToPageButton
          text={format('app.back_to_reports_list.label')}
          href={COMPLIANCE_TESTING_RESULT_PAGE}
        />
      </div>
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
              softwareAttributesFormValues={setSoftwareAttributesFormValues}
              customRef={softwareAttributedRef}
              onEdited={(hasError: boolean) => setRenderFormError(hasError)}
            />
          )}
          {currentProgressBarStep === 2 && (
            <DeploymentComplianceForm
              deploymentComplianceFormValues={setDeploymentComplianceFormValues}
              customRef={deploymentComplianceRef}
              onEdited={(hasError: boolean) => setRenderFormError(hasError)}
            />
          )}
          {currentProgressBarStep === 3 && <IRSCompliance />}
          {currentProgressBarStep === 4 && <div></div>}
        </>
      </ProgressBar>
    </div>
  );
};

export default SoftwareComplianceForm;

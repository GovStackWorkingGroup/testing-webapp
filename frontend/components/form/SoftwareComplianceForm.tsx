import { useRef, useState } from 'react';
import { toast } from 'react-toastify';
import { RiCheckboxCircleFill, RiErrorWarningFill } from 'react-icons/ri';
import { useRouter } from 'next/router';
import {
  COMPLIANCE_TESTING_RESULT_PAGE,
  DEPLOYMENT_COMPLIANCE_STORAGE_NAME,
  INTERFACE_COMPLIANCE_STORAGE_NAME,
  SOFTWARE_ATTRIBUTES_STORAGE_NAME,
  softwareComplianceFormSteps,
} from '../../service/constants';
import BackToPageButton from '../shared/buttons/BackToPageButton';
import useTranslations from '../../hooks/useTranslation';
import ProgressBar, { ProgressBarRef } from '../shared/ProgressBar';
import {
  saveSoftwareDraft,
  submitDraft,
  updateDraftDetailsStepOne,
  updateDraftDetailsStepThree,
  updateDraftDetailsStepTwo,
} from '../../service/serviceAPI';
import {
  ComplianceRequirementsType,
  SoftwareDraftToUpdateType,
} from '../../service/types';
import { IRSCFormRef } from '../shared/combined/SelectBBs';
import { IRSCRequirementsFormRef } from '../shared/combined/RequirementSpecificationSelectBB';
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
import EvaluationSummary from './EvaluationSummary';
import IRSForm from './IRSForm';
import FormSuccessComponent from './FormSuccessComponent';

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
  const [updatedBBs, setUpdatedBBs] = useState<
    ComplianceRequirementsType[] | undefined
  >();
  const [renderFormError, setRenderFormError] = useState(false);
  const [isDraftSaved, setIsDraftSaved] = useState(false);
  const [isFormSubmitted, setIsFormSubmitted] = useState(false);
  const [progressJiraLink, setProgressJiraLink] = useState('');
  const [softwareVersion, setSoftwareVersion] = useState('');

  const softwareAttributedRef = useRef<SoftwareAttributedRef>(null);
  const deploymentComplianceRef = useRef<DeploymentComplianceRef>(null);
  const IRSCInterfaceFormRef = useRef<IRSCFormRef>(null);
  const IRSCRequirementsFormRef = useRef<IRSCRequirementsFormRef>(null);
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
        handleUpdateDraft(true);
      }

      return;
    }

    if (currentProgressBarStep === 3) {
      IRSCRequirementsFormRef.current?.validate();
      IRSCInterfaceFormRef.current?.validate();
      if (
        IRSCInterfaceFormRef.current?.validate() &&
        IRSCRequirementsFormRef.current?.validate()
      ) {
        handleUpdateDraft(true);
      }

      return;
    }
  };

  const handleSaveDraftButton = () => {
    if (currentProgressBarStep === 2) {
      if (deploymentComplianceRef.current?.validate()) {
        handleUpdateDraft(false);
      }

      return;
    }

    if (currentProgressBarStep === 3) {
      if (
        IRSCInterfaceFormRef.current?.validate() &&
        IRSCRequirementsFormRef.current?.validate()
      ) {
        handleUpdateDraft(false);
      }

      return;
    }
  };

  const handleSaveDraft = async (softwareData: FormValuesType) => {
    setSoftwareVersion(softwareData.softwareVersion.value);
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

  const handleUpdateDraft = async (redirectToNextPage: boolean) => {
    if (currentProgressBarStep === 2) {
      const updateData: SoftwareDraftToUpdateType = {};
      updateData.deploymentCompliance = {
        documentation: deploymentComplianceFormValues.documentation.value,
        deploymentInstructions:
          deploymentComplianceFormValues.deploymentInstructions.value,
      };

      await updateDraftDetailsStepTwo(draftUUID as string, updateData).then(
        (response) => {
          if (response.status) {
            toast.success(format('form.form_saved_success.message'), {
              icon: <RiCheckboxCircleFill className="success-toast-icon" />,
            });
            localStorage.removeItem(DEPLOYMENT_COMPLIANCE_STORAGE_NAME);
            if (redirectToNextPage) {
              nextStepRef.current?.goNext();
            }
          }

          if (!response.status) {
            toast.error(format('form.form_saved_error.message'), {
              icon: <RiErrorWarningFill className="error-toast-icon" />,
            });
          }
        }
      );
    }

    if (currentProgressBarStep === 3) {
      await updateDraftDetailsStepThree(
        draftUUID as string,
        updatedBBs as ComplianceRequirementsType[],
        softwareVersion
      ).then((response) => {
        if (response.status) {
          toast.success(format('form.form_saved_success.message'), {
            icon: <RiCheckboxCircleFill className="success-toast-icon" />,
          });
          localStorage.removeItem(INTERFACE_COMPLIANCE_STORAGE_NAME);
          if (redirectToNextPage) {
            nextStepRef.current?.goNext();
          }
        }

        if (!response.status) {
          toast.error(format('form.form_saved_error.message'), {
            icon: <RiErrorWarningFill className="error-toast-icon" />,
          });
        }
      });
    }
  };

  const handleSubmitForm = async () => {
    if (draftUUID) {
      await submitDraft(draftUUID as string).then((response) => {
        if (response.status) {
          setIsFormSubmitted(true);
          setProgressJiraLink(response.data.link);

          return;
        }

        if (!response.status) {
          toast.error(format('form.form_submit_error.message'), {
            icon: <RiErrorWarningFill className="error-toast-icon" />,
          });
        }
      });
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
      {isFormSubmitted ? (
        <FormSuccessComponent progressJiraLink={progressJiraLink} />
      ) : (
        <ProgressBar
          steps={softwareComplianceFormSteps}
          currentStep={handleStepChange}
          onNextButton={handleNextButton}
          renderFormError={renderFormError}
          changeStepTo={currentStep}
          isDraftSaved={isDraftSaved}
          onSaveButton={handleSaveDraftButton}
          onSubmitButton={handleSubmitForm}
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
                deploymentComplianceFormValues={
                  setDeploymentComplianceFormValues
                }
                customRef={deploymentComplianceRef}
                onEdited={(hasError: boolean) => setRenderFormError(hasError)}
              />
            )}
            {currentProgressBarStep === 3 && (
              <IRSForm
                setUpdatedBBs={setUpdatedBBs}
                IRSCInterfaceFormRef={IRSCInterfaceFormRef}
                IRSCRequirementsFormRef={IRSCRequirementsFormRef}
                onEdited={(hasError: boolean) => setRenderFormError(hasError)}
              />
            )}
            {currentProgressBarStep === 4 && <EvaluationSummary />}
          </>
        </ProgressBar>
      )}
    </div>
  );
};

export default SoftwareComplianceForm;

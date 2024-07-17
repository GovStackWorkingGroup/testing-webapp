import classNames from 'classnames';
import { RefObject, useEffect, useImperativeHandle, useState } from 'react';
import { RiErrorWarningFill } from 'react-icons/ri';
import { useRouter } from 'next/router';
import useTranslations from '../../hooks/useTranslation';
import useGetDraftData from '../../hooks/useGetDraftDetail';
import Button from './buttons/Button';

export type ProgressBarRef = {
  goNext: () => void;
};

type ProgressBarProps = {
  steps: { label: string; step: number }[];
  children: React.ReactNode;
  currentStep: (step: number) => void;
  onNextButton: () => void;
  renderFormError: boolean;
  changeStepTo?: number | undefined;
  isDraftSaved: boolean;
  onSaveButton: () => void;
  onSubmitButton: () => void;
  customRef?: RefObject<ProgressBarRef>;
};

const ProgressBar = ({
  steps,
  children,
  currentStep,
  onNextButton,
  renderFormError,
  changeStepTo,
  isDraftSaved,
  onSaveButton,
  onSubmitButton,
  customRef,
}: ProgressBarProps) => {
  const [activeStep, setActiveStep] = useState(1);
  const [isNextButtonActive, setIsNextButtonActive] = useState(0);

  const { format } = useTranslations();

  const router = useRouter();

  const { draftUUID } = router.query;
  const { draftData } = useGetDraftData({
    draftUUID: (draftUUID as string) || undefined,
  });

  const expirationDate = draftData?.expirationDate.toString().split('T')[0];

  useImperativeHandle(customRef, () => ({
    goNext: nextStep,
  }));

  useEffect(() => {
    if (router.query.formStep) {
      currentStep(Number(router.query.formStep));
      setActiveStep(Number(router.query.formStep));

      return;
    }

    currentStep(activeStep);
  }, [activeStep, currentStep, router]);

  useEffect(() => {
    if (changeStepTo) {
      setActiveStep(changeStepTo);
    }
  }, [changeStepTo]);

  const nextStep = () => {
    if (router.query.draftUUID) {
      router.replace({
        query: { draftUUID: router.query.draftUUID, formStep: activeStep + 1 },
      });
      setActiveStep(activeStep + 1);

      return;
    }

    setActiveStep(activeStep + 1);
  };

  const prevStep = () => {
    setActiveStep(activeStep - 1);
    router.replace({
      query: { draftUUID: router.query.draftUUID, formStep: activeStep - 1 },
    });
  };

  const handleNextButton = () => {
    onNextButton();
    setIsNextButtonActive(isNextButtonActive + 1);
  };

  const handleSaveButton = () => {
    onSaveButton();
  };

  const handleSubmitButton = () => {
    onSubmitButton();
  };

  const totalSteps = steps.length;

  return (
    <div className="progress-bar-main-container">
      <div className="progress-bar-step-container">
        {steps.map(({ step, label }, indexKey) => (
          <div className="progress-bar-step-wrapper" key={step}>
            {activeStep > step && (
              <div className="progress-bar-step previous">
                <div className="progress-bar-step-count">{step}</div>
              </div>
            )}
            {activeStep === step && (
              <div
                className={classNames('progress-bar-step active', {
                  last: indexKey === steps.length - 1,
                })}
              >
                <div className="progress-bar-step-count">{step}</div>
              </div>
            )}
            {activeStep < step && (
              <div
                className={classNames('progress-bar-step', {
                  last: indexKey === steps.length - 1,
                })}
              >
                <div className="progress-bar-step-count">{step}</div>
              </div>
            )}
            <div className="progress-bar-step-label-container">
              <div className="progress-bar-step-label" key={step}>
                {format(label)}
              </div>
            </div>
          </div>
        ))}
      </div>
      <div className="progress-bar-body-container">
        <div>{children}</div>
      </div>
      <div className="progress-bar-buttons-container">
        <div>
          <div className="progress-bar-buttons-left-section">
            {activeStep > 1 && (
              <Button
                type="button"
                text={format('progress_bar.previous_step.label')}
                styles="secondary-button"
                onClick={() => prevStep()}
              ></Button>
            )}
          </div>
          <div className="progress-bar-buttons-mid-section">
            {activeStep > 1 && (
              <div>
                {format('form.expirationDate', { date: expirationDate })}
              </div>
            )}
          </div>
          <div className="progress-bar-buttons-right-section">
            {renderFormError && (
              <div className="progress-bar-error-container">
                <div>
                  <RiErrorWarningFill className="progress-bar-error-warning-icon" />
                  <p>{format('form.form_invalid.message')}</p>
                </div>
              </div>
            )}
            {activeStep > 1 && activeStep < totalSteps && (
              <Button
                type="button"
                text={format('progress_bar.save_draft.label')}
                styles="secondary-button"
                onClick={() => handleSaveButton()}
                showCheckIcon={isDraftSaved}
              ></Button>
            )}
            {activeStep !== totalSteps ? (
              <Button
                type="button"
                text={format('progress_bar.next.label')}
                styles="primary-button"
                onClick={() => handleNextButton()}
              ></Button>
            ) : (
              <Button
                type="button"
                text={format('progress_bar.submit_form.label')}
                styles="primary-button"
                onClick={() => handleSubmitButton()}
              ></Button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProgressBar;

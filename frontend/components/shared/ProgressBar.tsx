import classNames from 'classnames';
import { RefObject, useEffect, useImperativeHandle, useState } from 'react';
import { RiErrorWarningFill } from 'react-icons/ri';
import useTranslations from '../../hooks/useTranslation';
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
  customRef,
}: ProgressBarProps) => {
  const [activeStep, setActiveStep] = useState(1);
  const [isNextButtonActive, setIsNextButtonActive] = useState(0);

  const { format } = useTranslations();

  useImperativeHandle(customRef, () => ({
    goNext: nextStep,
  }));

  useEffect(() => {
    currentStep(activeStep);
  }, [activeStep, currentStep]);

  useEffect(() => {
    if (changeStepTo) {
      setActiveStep(changeStepTo);
    }
  }, [changeStepTo]);

  const nextStep = () => {
    setActiveStep(activeStep + 1);
  };

  const prevStep = () => {
    setActiveStep(activeStep - 1);
  };

  const handleNextButton = () => {
    onNextButton();
    setIsNextButtonActive(isNextButtonActive + 1);
  };

  const handleSaveButton = () => {
    onSaveButton();
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
          <div className="progress-bar-buttons-right-section">
            {renderFormError && (
              <div className="progress-bar-error-container">
                <div>
                  <RiErrorWarningFill className="progress-bar-error-warning-icon" />
                  <p>{format('form.form_invalid.message')}</p>
                </div>
              </div>
            )}
            {activeStep > 1 && (
              <Button
                type="button"
                text={format('progress_bar.save_draft.label')}
                styles="secondary-button"
                onClick={() => handleSaveButton()}
                showCheckIcon={isDraftSaved}
              ></Button>
            )}
            <Button
              type="button"
              text={format('progress_bar.next.label')}
              styles="primary-button"
              onClick={() => handleNextButton()}
              disabled={activeStep === totalSteps}
            ></Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProgressBar;

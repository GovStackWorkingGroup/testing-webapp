import classNames from 'classnames';
import { useEffect, useState } from 'react';
import { RiErrorWarningFill } from 'react-icons/ri';
import useTranslations from '../../hooks/useTranslation';
import Button from './buttons/Button';

type ProgressBarProps = {
  steps: { label: string; step: number }[];
  children: React.ReactNode;
  currentStep: (step: number) => void;
  onNextButton: () => void;
  isCurrentFormValid: boolean | undefined;
  goToNextStep: boolean;
  renderFormError: boolean;
};

const ProgressBar = ({
  steps,
  children,
  currentStep,
  onNextButton,
  isCurrentFormValid,
  goToNextStep,
  renderFormError,
}: ProgressBarProps) => {
  const [activeStep, setActiveStep] = useState(2);
  const [isNextButtonActive, setIsNextButtonActive] = useState(0);

  const { format } = useTranslations();

  useEffect(() => {
    currentStep(activeStep);
  }, [activeStep, currentStep]);

  const nextStep = () => {
    if (isCurrentFormValid) {
      setActiveStep(activeStep + 1);
    }
  };

  const prevStep = () => {
    setActiveStep(activeStep - 1);
  };

  const handleNextButton = () => {
    onNextButton();
    setIsNextButtonActive(isNextButtonActive + 1);
  };

  useEffect(() => {
    if (goToNextStep) {
      nextStep();
      // isNextButtonClicked(true);
    }
  }, [goToNextStep]);

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
            {renderFormError && isNextButtonActive > 0 && (
              <div className="progress-bar-error-container">
                <div>
                  <RiErrorWarningFill className="progress-bar-error-warning-icon" />
                  <p>{format('form.form_invalid.message')}</p>
                </div>
                {/* <RiCloseLine className="progress-bar-error-close-icon" /> */}
              </div>
            )}
            {activeStep > 1 && (
              <Button
                type="button"
                text={format('progress_bar.save_draft.label')}
                styles="secondary-button"
                onClick={prevStep}
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

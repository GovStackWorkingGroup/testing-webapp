import { useState } from 'react';

const ProgressBar = () => {
  const [activeStep, setActiveStep] = useState(1);
  const steps = [
    {
      label: 'Address',
      step: 1,
    },
    {
      label: 'Shipping',
      step: 2,
    },
    {
      label: 'Payment',
      step: 3,
    },
    {
      label: 'Summary',
      step: 4,
    },
  ];

  const nextStep = () => {
    setActiveStep(activeStep + 1);
  };

  const prevStep = () => {
    setActiveStep(activeStep - 1);
  };

  const totalSteps = steps.length;

  const width = `${(100 / (totalSteps - 1)) * (activeStep - 1)}%`;

  return (
    <div className="progress-bar-main-container">
      <div className="progress-bar-step-container" style={{ width }}>
        {steps.map(({ step, label }) => (
          <div className="progress-bar-step-wrapper" key={step}>
            <div className="progress-bar-step">
              {activeStep > step ? (
                <div className="progress-bar-check-mark">L</div>
              ) : (
                <div className="progress-bar-step-count">{step}</div>
              )}
            </div>
            <div className="progress-bar-step-label-container">
              <div className="progress-bar-step-label" key={step}>
                {label}
              </div>
            </div>
          </div>
        ))}
      </div>
      <div className="progress-bar-buttons-container">
        <button
          className="progress-bar-button"
          onClick={prevStep}
          disabled={activeStep === 1}
        >
          Previous
        </button>
        <button
          className="progress-bar-button"
          onClick={nextStep}
          disabled={activeStep === totalSteps}
        >
          Next
        </button>
      </div>
    </div>
  );
};

export default ProgressBar;

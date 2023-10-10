import { useCallback } from 'react';
import { RiCheckboxCircleLine, RiCloseCircleLine } from 'react-icons/ri';
import { useIntl } from 'react-intl';
import { TestsDetailsType } from '../service/types';

type Props = {
  testDetails: TestsDetailsType;
};

const TestStepsView = ({ testDetails }: Props) => {
  const { formatMessage } = useIntl();
  const format = useCallback(
    (id: string) => formatMessage({ id }),
    [formatMessage]
  );

  return (
    <div className='test-steps-container'>
      <p className='test-steps-scenario-label' data-testid='test-steps-scenario-label'>
        {format('app.scenario.label')}
      </p>
      <p className='test-steps-scenario-title' data-testid='test-steps-scenario-title'>{testDetails.scenario}</p>
      {testDetails.steps.map((step, idx) => (
        <div className='test-steps-result' key={`test-step-${idx}`}>
          <div className='test-steps-icon'>
            {step.result ? (
              <RiCheckboxCircleLine className='test-steps-passed-icon' />
            ) : (
              <RiCloseCircleLine className='test-steps-failed-icon' />
            )}
          </div>
          <div className='test-steps-description'>
            <p>{`${step.type} ${step.text}`}</p>
          </div>
        </div>
      ))}
    </div>
  );
};

export default TestStepsView;

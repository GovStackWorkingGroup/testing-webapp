import TestStepsView from '../../components/TestStepsView';
import { render } from '../test-utils/test-utils';
import {
  testFailedDetails,
  testPassedDetails,
} from './table/mockedData/ProductTable';

describe('Unit tests for TestStepsView component:', () => {
  const SCENARIO_LABEL_TEST_ID = 'test-steps-scenario-label';
  const SCENARIO_TITLE_TEST_ID = 'test-steps-scenario-title';

  it('should render the component when tests passed and match snapshot', () => {
    const { container } = render(
      <TestStepsView testDetails={testPassedDetails} />
    );

    expect(container).toMatchSnapshot();
  });

  it('should render the component when tests failed and match snapshot', () => {
    const { container } = render(
      <TestStepsView testDetails={testFailedDetails} />
    );

    expect(container).toMatchSnapshot();
  });

  it('should have corresponding values', () => {
    const { getByTestId } = render(
      <TestStepsView testDetails={testPassedDetails} />
    );

    expect(getByTestId(SCENARIO_LABEL_TEST_ID)).toHaveTextContent('Scenario:');
    expect(getByTestId(SCENARIO_TITLE_TEST_ID)).toHaveTextContent(
      'The user successfully creates record "John Smith" in the Digital Registries database.'
    );
  });
});

import TestResultTableRow from '../../../components/table/TestResultTableRow';
import { render } from '../../test-utils/test-utils';
import { endpointTestResult } from './mockedData/ProductTable';

describe('Unit tests for TestResultTableRow component:', () => {
  const TEST_PASSED_TEST_ID = 'bb-test-passed';
  const TEST_FAILED_TEST_ID = 'bb-test-failed';
  const TEST_ENDPOINT_TEST_ID = 'bb-test-endpoint';
  const TEST_CATEGORY_TEST_ID = 'bb-test-category';

  it('should render the TestResultTableRow component with no empty fileds and match snapshot', () => {
    const { container } = render(
      <TestResultTableRow bbTest={endpointTestResult} passCurrentBBTest={jest.fn()}/>
    );

    expect(container).toMatchSnapshot();
  });

  it('should render the TestResultTableRow component with empty fields and match snapshot', () => {
    const { container } = render(
      <TestResultTableRow
        bbTest={{
          endpoint: '',
          method: '',
          passed: true,
          uri: '',
          details: []
        }}
        passCurrentBBTest={jest.fn()}
      />
    );

    expect(container).toMatchSnapshot();
  });

  it('should have corresponding values', () => {
    const { getByTestId, queryByTestId } = render(
      <TestResultTableRow bbTest={endpointTestResult} passCurrentBBTest={jest.fn()}/>
    );

    expect(queryByTestId(TEST_FAILED_TEST_ID)).toBe(null);

    expect(getByTestId(TEST_PASSED_TEST_ID)).toHaveTextContent('Passed');
    expect(getByTestId(TEST_ENDPOINT_TEST_ID)).toHaveTextContent('/data/{someparameter}/method');
    expect(getByTestId(TEST_CATEGORY_TEST_ID)).toHaveTextContent('GET');
  });
});

import SubTableHeader from '../../../components/table/SubTableHeader';
import { render } from '../../test-utils/test-utils';

describe('Unit tests for SubTableHeader component:', () => {
  const BB_LABEL_TEST_ID = 'bb-label';
  const TEST_PASSED_LABEL_TEST_ID = 'test-passed-label';
  const TEST_FAILED_LABEL_TEST_ID = 'test-failed-label';
  const COMPATIBILITY_LABEL_TEST_ID = 'compatibility-label';

  it('should render the SubTableHeader component and match snapshot', () => {
    const { container } = render(<SubTableHeader />);

    expect(container).toMatchSnapshot();
  });

  it('schould have proper labels', () => {
    const { getByTestId } = render(<SubTableHeader />);

    expect(getByTestId(BB_LABEL_TEST_ID)).toHaveTextContent('Building Block');
    expect(getByTestId(TEST_PASSED_LABEL_TEST_ID)).toHaveTextContent('Tests Passed');
    expect(getByTestId(TEST_FAILED_LABEL_TEST_ID)).toHaveTextContent('Tests Failed');
    expect(getByTestId(COMPATIBILITY_LABEL_TEST_ID)).toHaveTextContent('Compatibility');
  });
});

import TestResultPage from '../../../../pages/[productName]/[buildingBlock]/[bbId]';
import { render } from '../../../test-utils/test-utils';

describe('Unit tests for TestResultPage component:', () => {
  const PAGE_LINK_TEST_ID = 'test-result-page-link';
  const PAGE_TITLE_HEADER_TEST_ID = 'test-result-page-title';

  it('should render the component and have corresponding values', () => {
    const { getByTestId } = render(<TestResultPage />);

    expect(getByTestId(PAGE_LINK_TEST_ID)).toHaveAttribute('href', '/');
    expect(getByTestId(PAGE_LINK_TEST_ID)).toHaveTextContent('Back to Products List');

    expect(getByTestId(PAGE_TITLE_HEADER_TEST_ID)).toHaveTextContent('Tests for');
  });
});

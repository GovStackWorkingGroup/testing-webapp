import InfiniteScrollCustomLoader from '../../components/InfiniteScrollLoader';
import { render } from '../test-utils/test-utils';

describe('Unit tests for InfiniteScrollCustomLoader component:', () => {
  const SCROLL_LOADER_TEST_ID = 'scroll-loader';

  it('should render the InfiniteScrollCustomLoader component and match snapshot', () => {
    const { container } = render(<InfiniteScrollCustomLoader />);

    expect(container).toMatchSnapshot();
  });

  it('should have proper value', () => {
    const { getByTestId } = render(<InfiniteScrollCustomLoader />);

    expect(getByTestId(SCROLL_LOADER_TEST_ID)).toHaveTextContent('Loading more data...');
  });
});

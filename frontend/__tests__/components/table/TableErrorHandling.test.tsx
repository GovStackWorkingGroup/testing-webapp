import TableErrorHandling from '../../../components/table/TableErrorHandling';
import { render } from '../../test-utils/test-utils';

describe('Unit tests for TableErrorHandling component:', () => {
  const MESSAGE_TEST_ID = 'table-error';

  it('should render the SubTable TableErrorHandling and match snapshot', () => {
    const { container } = render(<TableErrorHandling />);

    expect(container).toMatchSnapshot();
  });

  it('when have corresponding values', () => {
    const { getByTestId } = render(<TableErrorHandling />);

    expect(getByTestId(MESSAGE_TEST_ID)).toHaveTextContent(
      'Error fetching data. Please try again later.'
    );
  });
});

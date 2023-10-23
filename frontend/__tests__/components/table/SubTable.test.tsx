import SubTable from '../../../components/table/SubTable';
import { render } from '../../test-utils/test-utils';
import { mockedProduct } from './mockedData/ProductTable';

describe('Unit tests for SubTable component:', () => {
  it('should render the SubTable component and match snapshot', () => {

    const { container } = render(<SubTable product={mockedProduct} />);

    expect(container).toMatchSnapshot();
  });
});

import { act } from '@testing-library/react';
import ProductTable from '../../../components/table/ProductTable';
import { render } from '../../test-utils/test-utils';
import * as Api from '../../../service/serviceAPI';
import { mockedProduct } from './mockedData/ProductTable';

jest.mock('../../../service/serviceAPI', () => ({
  getData: jest.fn(() => Promise.resolve({ status: true, data: [] })),
  getProductListCount: jest.fn(() =>
    Promise.resolve({ status: true, data: 0 })
  ),
}));

const spyOnGetProductsList = jest.spyOn(Api, 'getData');

describe('Unit tests for ProductTable component:', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should render empty placeholder and match snapshot', async () => {
    spyOnGetProductsList.mockImplementationOnce(() =>
      Promise.resolve({ status: true, data: [] })
    );

    const { container } = render(<ProductTable />);

    await act(() => Promise.resolve());

    expect(spyOnGetProductsList).toHaveBeenCalledTimes(1);
    expect(container).toMatchSnapshot();
  });

  it('should render the ProductTable component with data', async () => {
    spyOnGetProductsList.mockImplementationOnce(() =>
      Promise.resolve({ status: true, data: [mockedProduct] })
    );

    const { getByTestId } = render(<ProductTable />);

    await act(() => Promise.resolve());

    expect(spyOnGetProductsList).toHaveBeenCalledTimes(1);
    expect(getByTestId(`product-table-row-${mockedProduct._id.testApp}`)).toBeDefined();
  });
});

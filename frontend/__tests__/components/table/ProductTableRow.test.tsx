import React from 'react';
import ProductTableRow from '../../../components/table/ProductTableRow';
import { render } from '../../test-utils/test-utils';
import { mockedProduct } from './mockedData/ProductTable';

jest.mock('react-tooltip', () => ({
  Tooltip: () => null
}));

const mockedContainerWidth = (clientWidth: number) =>
  // @ts-ignore
  jest.spyOn(React, 'useRef').mockImplementation((v) => {
    const ref = function (_: void) {
      // @ts-expect-error
      ref.current = { ..._, clientWidth };
    };

    ref(v);

    return ref;
  });

describe('Unit tests for ProductTableRow component:', () => {
  const REST_COUNT_TEST_ID = 'bb-rest-count';
  const LAST_UPDATE_TEST_ID = 'product-last-update';
  const OVERALL_COMPATIBILITY_TEST_ID = 'product-overall-compatibility';

  it('should render the ProductTableRow component and match snapshot', () => {
    const { container } = render(<ProductTableRow product={mockedProduct} />);

    expect(container).toMatchSnapshot();
  });

  it('when product compatibilities length is equal to 0.', async () => {
    const { container, queryByTestId } = render(
      <ProductTableRow product={{ ...mockedProduct, compatibilities: [] }} />
    );

    expect(queryByTestId(REST_COUNT_TEST_ID)).toBeNull();
    expect(container).toMatchSnapshot();
  });

  it('when container of items has width 40px and is not overflowing.', () => {
    mockedContainerWidth(40);

    const { queryByTestId } = render(
      <ProductTableRow product={mockedProduct} />
    );

    expect(queryByTestId(REST_COUNT_TEST_ID)).toBeNull();
  });

  it('when container of items has width 100px and is overflowing.', () => {
    mockedContainerWidth(100);

    const { getByTestId } = render(
      <ProductTableRow
        product={{
          ...mockedProduct,
          compatibilities: [
            ...mockedProduct.compatibilities,
            ...mockedProduct.compatibilities,
            ...mockedProduct.compatibilities,
            ...mockedProduct.compatibilities,
          ],
        }}
      />
    );

    expect(getByTestId(REST_COUNT_TEST_ID)).toHaveTextContent('+2');
  });

  it('when container of items has width 50px and is overflowing.', () => {
    mockedContainerWidth(50);

    const { getByTestId } = render(
      <ProductTableRow
        product={{
          ...mockedProduct,
          compatibilities: [
            ...mockedProduct.compatibilities,
            ...mockedProduct.compatibilities,
            ...mockedProduct.compatibilities,
            ...mockedProduct.compatibilities,
          ],
        }}
      />
    );

    expect(getByTestId(REST_COUNT_TEST_ID)).toHaveTextContent('+3');
  });

  it('should last update has proper value', () => {
    const { getByTestId } = render(
      <ProductTableRow
        product={{ ...mockedProduct }}
      />
    );

    expect(getByTestId(LAST_UPDATE_TEST_ID)).toHaveTextContent('2/12/2023');
  });

  it('should overall compatibility has proper value', () => {
    mockedContainerWidth(40);

    const { queryByTestId } = render(
      <ProductTableRow product={mockedProduct} />
    );

    expect(queryByTestId(OVERALL_COMPATIBILITY_TEST_ID)).toHaveTextContent('23%');
  });
});

import React, { useCallback, useEffect, useState } from 'react';
import { useIntl } from 'react-intl';
import InfiniteScroll from 'react-infinite-scroll-component';
import { getProductsList } from '../../service/serviceAPI';
import { ProductsType } from '../../service/types';
import { moreMockedProductList } from '../../service/mockedData';
import InfiniteScrollCustomLoader from '../InfiniteScrollLoader';
import ProductTableHeader from './ProductTableHeader';
import ProductTableRow from './ProductTableRow';

const ProductTable = () => {
  const [productsList, setProductsList] = useState<ProductsType[]>([]);
  const [hasMoreData, setHasMoreData] = useState<boolean>(true);
  const { formatMessage } = useIntl();
  const format = useCallback(
    (id: string) => formatMessage({ id }),
    [formatMessage]
  );

  useEffect(() => {
    const products = getProductsList();
    setProductsList(products);
  }, []);

  const productListLength = productsList.length;

  const handleLoadMoreData = () => {
    // mocked response
    setProductsList([...productsList, ...moreMockedProductList]);
    setHasMoreData(false);
  };

  return (
    <div className='table'>
      <div className='table-results-count'>
        <p>
          {productListLength}
          {productListLength === 1
            ? format('table.result.label')
            : format('table.result.plural.label')}
        </p>
      </div>
      <div className='table-body'>
        <ProductTableHeader />
        <div id='scrollableDiv' className='product-table-row-section'>
          <InfiniteScroll
            scrollableTarget='scrollableDiv'
            dataLength={40}
            next={handleLoadMoreData}
            hasMore={hasMoreData}
            loader={<InfiniteScrollCustomLoader />}
            style={{ overflowX: 'hidden' }}
          >
            {productsList.map((product, key) => (
              <ProductTableRow product={product} key={`product-${key}`} />
            ))}
          </InfiniteScroll>
        </div>
      </div>
    </div>
  );
};

export default ProductTable;

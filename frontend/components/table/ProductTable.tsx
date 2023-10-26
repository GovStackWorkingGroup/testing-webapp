import isEqual from 'lodash/isEqual';
import { useCallback, useEffect, useState } from 'react';
import InfiniteScroll from 'react-infinite-scroll-component';
import { useIntl } from 'react-intl';
import { getSoftwareListCount, getSoftwaresData } from '../../service/serviceAPI';
import { ProductsType } from '../../service/types';
import InfiniteScrollCustomLoader from '../InfiniteScrollLoader';
import ProductTableHeader from './ProductTableHeader';
import ProductTableRow from './ProductTableRow';
import TableErrorHandling from './TableErrorHandling';
import { SoftwaresTableSortByType } from './types';

const defaultSortBy = {
  testApp: { field: 'testApp', order: null },
  lastUpdate: { field: 'lastUpdate', order: null },
  overallCompatibility: { field: 'overallCompatibility', order: null }
} as SoftwaresTableSortByType;

const ProductTable = () => {
  const [productsList, setProductsList] = useState<ProductsType[]>([]);
  const [productListLength, setProductListLength] = useState<number>(0);
  const [error, setError] = useState<string | null>(null);
  const [sortBy, setSortBy] = useState<SoftwaresTableSortByType>(defaultSortBy);
  const [loading, setLoading] = useState(true);

  const { formatMessage } = useIntl();
  const format = useCallback((id: string) => formatMessage({ id }), [formatMessage]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [data, count] = await Promise.all([
          getSoftwaresData(0, sortBy),
          getSoftwareListCount()
        ]);

        if (data.status) {
          setProductsList(data.data);
        }

        if (count.status) {
          setProductListLength(count.data);
        }
      } catch {
        setError('dataFetchFail');
      } finally {
        setLoading(false); // set loading to false once data is fetched or error occurs
      }
    };

    fetchData();
  }, [sortBy]);

  const handleLoadMoreData = useCallback(async () => {
    try {
      const data = await getSoftwaresData(productsList.length, sortBy);

      if (data.status) {
        setProductsList((prev) => [...prev, ...data.data]);
      }
    } catch {
      setError('dataLoadFail');
    }
  }, [productsList, sortBy]);

  const handleSorting = (tableSortProperties: SoftwaresTableSortByType) => {
    if (!isEqual(tableSortProperties, sortBy)) {
      setSortBy(tableSortProperties);
    }
  };

  if (error) {
    return <TableErrorHandling />;
  }

  return (
    <div className='table'>
      <div className='table-results-count'>
        <p>{productListLength}</p>
        <p>{productListLength === 1 ? format('table.result.label') : format('table.result.plural.label')}</p>
      </div>
      <div className='table-body'>
        <ProductTableHeader handleSorting={handleSorting}/>
        <div id='scrollableDiv' className='product-table-row-section'>
          {loading ? (
            <div className="product-table-row-section">
              <InfiniteScrollCustomLoader />
            </div>
          ) : (
            <>
              <InfiniteScroll
                scrollableTarget='scrollableDiv'
                dataLength={productsList.length}
                next={handleLoadMoreData}
                hasMore={productListLength > productsList.length}
                loader={<InfiniteScrollCustomLoader />}
                style={{ overflowX: 'hidden' }}
              >
                {productsList.map((product, index) => (
                  <ProductTableRow product={product} key={index} />
                ))}
              </InfiniteScroll>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default ProductTable;

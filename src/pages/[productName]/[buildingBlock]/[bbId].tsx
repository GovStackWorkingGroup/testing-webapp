import Link from 'next/link';
import { useRouter } from 'next/router';
import { useCallback, useEffect, useState } from 'react';
import { FaQuoteLeft, FaQuoteRight } from 'react-icons/fa';
import { RiCloseLine } from 'react-icons/ri';
import { useIntl } from 'react-intl';
import TestStepsView from '../../../components/TestStepsView';
import TestSummary from '../../../components/TestSummary';
import TestResultTable from '../../../components/table/TestResultTable';
import { ResultTableSortByType } from '../../../components/table/types';
import { getBuildingBlockTestResults } from '../../../service/serviceAPI';
import {
  BuildingBlockEndpointTest,
  BuildingBlockTestSummary,
} from '../../../service/types';

const TestResultPage = () => {
  const [bbTestSummary, setBBTestSummary] = useState<BuildingBlockTestSummary>();
  const [currentBBTest, setCurrentBBTest] = useState<BuildingBlockEndpointTest>();
  const [sortBy, setSortBy] = useState<ResultTableSortByType>(
    {
      uri: { field: 'uri', order: null },
      name: { field: 'name', order: null },
      status: { field: 'status', order: null }
    }
  );

  const router = useRouter();
  const { productName, bbId } = router.query;

  const { formatMessage } = useIntl();
  const format = useCallback(
    (id: string) => formatMessage({ id }),
    [formatMessage]
  );

  const fetchData = useCallback(async () => {
    const [data] = await Promise.all([
      getBuildingBlockTestResults(bbId as string, sortBy)
    ]);
    if (data.status) {
      setBBTestSummary(data.data);
    }
  }, [bbId, sortBy]);

  useEffect(() => {
    if (bbId) {
      fetchData();
    }
  }, [bbId, fetchData]);

  const handleSorting = (tableSortProperties: ResultTableSortByType) => {
    setSortBy(tableSortProperties);
  };

  return (
    <main>
      <div className='test-result-page'>
        <div className='test-result-primary-section'>
          <div>
            <Link
              className='back-to-home-page-btn'
              href={'/'}
              data-testid='test-result-page-link'
            >
              {format('result_page.back_to_product_list')}
            </Link>
            <div
              className='test-result-title'
              data-testid='test-result-page-title'
            >
              <p>{format('result_page.title')}</p>
              <FaQuoteLeft className='quote' />
              <p>{productName}</p>
              <FaQuoteRight className='quote' />
            </div>
            <TestSummary bbSummary={bbTestSummary?.compatibilities} />
            <TestResultTable
              bbSummary={bbTestSummary}
              passCurrentBBTest={setCurrentBBTest}
              handleSorting={handleSorting}
            />
          </div>
        </div>
        {currentBBTest ? (
          <div className='test-result-second-section'>
            <div className='test-result-second-section-title'>
              <div className='test-result-second-section-text'>
                <p>{`${currentBBTest?.method} ${currentBBTest?.endpoint}`}</p>
              </div>
              <div className='close-icon'>
                <RiCloseLine onClick={() => setCurrentBBTest(undefined)} />
              </div>
            </div>
            <div className='test-result-second-section-body'>
              {currentBBTest.details?.map((testDetail, idx) => (
                <TestStepsView
                  testDetails={testDetail}
                  key={`testDetail-${idx}`}
                />
              ))}
            </div>
          </div>
        ) : null}
      </div>
    </main>
  );
};

export default TestResultPage;

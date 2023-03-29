import { useRouter } from 'next/router';
import React, { useCallback, useEffect, useState } from 'react';
import { useIntl } from 'react-intl';
import { FaQuoteLeft, FaQuoteRight } from 'react-icons/fa';
import Link from 'next/link';
import { RiCloseLine } from 'react-icons/ri';
import TestSummary from '../../../components/TestSummary';
import TestResultTable from '../../../components/table/TestResultTable';
import { getBuildingBlockTestResults } from '../../../service/serviceAPI';
import { BuildingBlockEndpointTest, BuildingBlockTestSummary } from '../../../service/types';

const TestResultPage = () => {
  const [bbTestSummary, setBBTestSummary] = useState<BuildingBlockTestSummary>();
  const [currentBBTest, setCurrentBBTest] = useState<BuildingBlockEndpointTest>();

  const router = useRouter();
  const { productName, bbId } = router.query;

  const { formatMessage } = useIntl();
  const format = useCallback(
    (id: string) => formatMessage({ id }),
    [formatMessage]
  );

  const fetchData = useCallback(async () => {
    const [data] = await Promise.all([
      getBuildingBlockTestResults(bbId as string),
    ]);
    if (data.status) {
      setBBTestSummary(data.data);
    }
  }, [bbId]);

  useEffect(() => {
    if (bbId) {
      fetchData();
    }
  }, [bbId, fetchData]);

  return (
    <main>
      <div className='test-result-page'>
        <div className='test-result-primary-section'>
          <Link
            className='back-to-home-page-btn'
            href={'/'}
            data-testid='test-result-page-link'
          >
            {format('result_page.back_to_product_list')}
          </Link>
          <div className='test-result-title' data-testid='test-result-page-title'>
            <p>{format('result_page.title')}</p>
            <FaQuoteLeft className='quote' />
            <p>{productName}</p>
            <FaQuoteRight className='quote' />
          </div>
          <TestSummary bbSummary={bbTestSummary?.compatibilities} />
          <TestResultTable bbSummary={bbTestSummary} passCurrentBBTest={setCurrentBBTest}/>
        </div>
        {currentBBTest ? (
          <div className='test-result-second-section'>
            <div className='test-result-second-section-title'>
              <div className='test-result-second-section-text'>
                <p>{currentBBTest?.method}</p>
                <p>{currentBBTest?.endpoint}</p>
              </div>
              <div className='close-icon'>
                <RiCloseLine onClick={() => setCurrentBBTest(undefined)}/>
              </div>
            </div>
          </div>
        ) : null}
      </div>
    </main>
  );
};

export default TestResultPage;

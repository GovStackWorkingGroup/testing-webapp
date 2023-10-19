import { useRouter } from 'next/router';
import { useCallback } from 'react';
import { useIntl } from 'react-intl';
import { BuildingBlockEndpointTest, BuildingBlockTestSummary } from '../../service/types';
import TableErrorHandling from './TableErrorHandling';
import TestResultTableHeader from './TestResultTableHeader';
import TestResultTableRow from './TestResultTableRow';
import { ResultTableSortByType } from './types';

type Props = {
  bbSummary: BuildingBlockTestSummary | undefined
  passCurrentBBTest: (value: BuildingBlockEndpointTest) => void
  handleSorting: (tableSortProperties: ResultTableSortByType) => void
}

const TestResultTable = ({ bbSummary, passCurrentBBTest, handleSorting }: Props) => {
  const router = useRouter();
  const { formatMessage } = useIntl();

  const format = useCallback(
    (id: string) => formatMessage({ id }),
    [formatMessage]
  );

  const { locale } = router;

  return (
    <div className='test-table-container'>
      <div className='test-table-last-update' data-testid='test-table-last-update'>
        <p>{format('test_table.last_update.label')}</p>
        <p>{bbSummary ? new Date(bbSummary?.compatibilities.saveTime).toLocaleDateString(locale) : '-'}</p>
      </div>
      <div className='test-table-result' data-testid='test-table-result'>
        {!bbSummary?.count ? <p>{'-'}</p> : <p>{bbSummary.count}</p>}
        <p>
          {bbSummary?.count === 1
            ? format('table.result.label')
            : format('table.result.plural.label')}
        </p>
      </div>
      <div className='test-table-table'>
        <TestResultTableHeader handleSorting={handleSorting} />
        {!bbSummary?.data ? <TableErrorHandling /> : (
          <div className='test-table-row-container'>
            {bbSummary.data.map((bbTest, idx) =>
              <TestResultTableRow
                bbTest={bbTest}
                key={`bbTest-${idx}`}
                passCurrentBBTest={() => passCurrentBBTest(bbTest)}
              />)}
          </div>
        )}
      </div>
    </div>
  );
};

export default TestResultTable;

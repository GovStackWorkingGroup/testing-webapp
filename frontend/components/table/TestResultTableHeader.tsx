import React, { useCallback, useEffect, useState } from 'react';
import { useIntl } from 'react-intl';
import { RiArrowDownSFill, RiArrowUpSFill } from 'react-icons/ri';
import classNames from 'classnames';
import { ResultTableColumnSortType, ResultTableSortByType, SortResultTableFieldType } from './types';

type Props = {
  handleSorting: (tableSortProperties: ResultTableSortByType) => void;
};

const TestResultTableHeader = ({ handleSorting }: Props) => {
  const [statusSort, setStatusSort] = useState<ResultTableColumnSortType>({ field: 'status',order: null });
  const [uriSort, setUriSort] = useState<ResultTableColumnSortType>({ field: 'uri', order: null });
  const [nameSort, setNameSort] = useState<ResultTableColumnSortType>({ field: 'name', order: null });

  const { formatMessage } = useIntl();
  const format = useCallback(
    (id: string) => formatMessage({ id }),
    [formatMessage]
  );

  useEffect(() => {
    handleSorting({ status: statusSort, uri: uriSort, name: nameSort });
  }, [statusSort, uriSort, nameSort]);

  const handleSortingChange = (field: SortResultTableFieldType) => {
    if (field === 'status') {
      setStatusSort({
        field: 'status',
        order: statusSort.order === 'asc' ? 'desc' : (statusSort.order === 'desc' ? null : 'asc'),
      });
    } else if (field === 'uri') {
      setUriSort({
        field: 'uri',
        order: uriSort.order === 'asc' ? 'desc' : (uriSort.order === 'desc' ? null : 'asc'),
      });
    } else if (field === 'name') {
      setNameSort({
        field: 'name',
        order: nameSort.order === 'asc' ? 'desc' : (nameSort.order === 'desc' ? null : 'asc'),
      });
    }
  };

  return (
    <div className='test-table-header'>
      <div onClick={() => handleSortingChange('status')} data-testid='header-status-label'>
        <p>{format('test_table.status.label')}</p>
        <div className='sort-icon'>
          <RiArrowUpSFill
            className={classNames('sort-icon-up', {
              'sort-icon-active': statusSort.order === 'asc',
            })}
          />
          <RiArrowDownSFill
            className={classNames('sort-icon-down', {
              'sort-icon-active': statusSort.order === 'desc',
            })}
          />
        </div>
      </div>
      <div onClick={() => handleSortingChange('uri')} data-testid='header-category-label'>
        <p>{format('test_table.category.label')}</p>
        <div className='sort-icon'>
          <RiArrowUpSFill
            className={classNames('sort-icon-up', {
              'sort-icon-active': uriSort.order === 'asc',
            })}
          />
          <RiArrowDownSFill
            className={classNames('sort-icon-down', {
              'sort-icon-active': uriSort.order === 'desc',
            })}
          />
        </div>
      </div>
      <div onClick={() => handleSortingChange('name')} data-testid='header-name-label'>
        <p>{format('test_table.name.label')}</p>
        <div className='sort-icon'>
          <RiArrowUpSFill
            className={classNames('sort-icon-up', {
              'sort-icon-active': nameSort.order === 'asc',
            })}
          />
          <RiArrowDownSFill
            className={classNames('sort-icon-down', {
              'sort-icon-active': nameSort.order === 'desc',
            })}
          />
        </div>
      </div>
    </div>
  );
};

export default TestResultTableHeader;

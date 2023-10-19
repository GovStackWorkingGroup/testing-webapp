import React, { useCallback, useEffect, useState } from 'react';
import { useIntl } from 'react-intl';
import {
  RiArrowDownSFill,
  RiArrowUpSFill,
} from 'react-icons/ri';
import classNames from 'classnames';
import { SoftwaresTablColumnSortType, SortSoftwareTableFieldType, SoftwaresTableSortByType } from './types';

type Props = {
  handleSorting: (tableSortProperties: SoftwaresTableSortByType) => void;
};

const ProductTableHeader = ({ handleSorting }: Props) => {
  const [softwareSort, setSoftwareSort] = useState<SoftwaresTablColumnSortType>({ field: 'testApp',order: null });
  const [dateSort, setDateSort] = useState<SoftwaresTablColumnSortType>({ field: 'lastUpdate', order: null });
  const [compatibilitySort, setCompatibilitySort] = useState<SoftwaresTablColumnSortType>(
    { field: 'overallCompatibility', order: null }
  );

  const { formatMessage } = useIntl();
  const format = useCallback(
    (id: string) => formatMessage({ id }),
    [formatMessage]
  );

  useEffect(() => {
    handleSorting({ testApp: softwareSort, lastUpdate: dateSort, overallCompatibility: compatibilitySort });
  }, [softwareSort, dateSort, compatibilitySort]);

  const handleSortingChange = (field: SortSoftwareTableFieldType) => {
    if (field === 'testApp') {
      setSoftwareSort({
        field: 'testApp',
        order: softwareSort.order === 'asc' ? 'desc' : (softwareSort.order === 'desc' ? null : 'asc'),
      });
    } else if (field === 'lastUpdate') {
      setDateSort({
        field: 'lastUpdate',
        order: dateSort.order === 'asc' ? 'desc' : (dateSort.order === 'desc' ? null : 'asc'),
      });
    } else if (field === 'overallCompatibility') {
      setCompatibilitySort({
        field: 'overallCompatibility',
        order: compatibilitySort.order === 'asc' ? 'desc' : (compatibilitySort.order === 'desc' ? null : 'asc'),
      });
    }
  };

  return (
    <div className='product-table-header'>
      <div></div>
      <div
        onClick={() => handleSortingChange('testApp')}
        data-testid='header-sort-software'
        className='cursor-pointer'
      >
        <p>{format('software_name.label')}</p>
        <div className='sort-icon'>
          <RiArrowUpSFill
            className={classNames('sort-icon-up', { 'sort-icon-active': softwareSort.order === 'asc' })}
          />
          <RiArrowDownSFill
            className={classNames('sort-icon-down', { 'sort-icon-active': softwareSort.order === 'desc' })}
          />
        </div>
      </div>
      <div>
        <p>{format('building_block.plural.label')}</p>
      </div>
      <div
        onClick={() => handleSortingChange('lastUpdate')}
        data-testid='header-sort-update'
        className='cursor-pointer'
      >
        <p>{format('table.last_update.label')}</p>
        <div className='sort-icon'>
          <RiArrowUpSFill
            className={classNames('sort-icon-up', { 'sort-icon-active': dateSort.order === 'asc' })}
          />
          <RiArrowDownSFill
            className={classNames('sort-icon-down', { 'sort-icon-active': dateSort.order === 'desc' })}
          />
        </div>
      </div>
      <div
        onClick={() => handleSortingChange('overallCompatibility')}
        data-testid='header-sort-compatibility'
        className='cursor-pointer'
      >
        <p>{format('table.overall_compatibility.label')}</p>
        <div className='sort-icon'>
          <RiArrowUpSFill
            className={classNames('sort-icon-up', { 'sort-icon-active': compatibilitySort.order === 'asc' })}
          />
          <RiArrowDownSFill
            className={classNames('sort-icon-down', { 'sort-icon-active': compatibilitySort.order === 'desc' })}
          />
        </div>
      </div>
      <div></div>
    </div>
  );
};

export default ProductTableHeader;

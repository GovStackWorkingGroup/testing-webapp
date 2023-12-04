import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { useTable, usePagination } from 'react-table';
import { useIntl } from 'react-intl';
import classNames from 'classnames';
import { FaRegCircleCheck, FaCircleCheck, FaCircleXmark, FaRegCircleXmark } from 'react-icons/fa6';
import { ComplianceRequirementsType } from '../../service/types';

export type RequirementType = {
  requirement: string,
  comment: string,
  status: number,
  fulfillment: number | null,
  _id: string
}

type IRSCTableType = {
  selectedData: ComplianceRequirementsType
}

const IRSCTable = ({ selectedData, setUpdatedData }: IRSCTableType) => {
  const { formatMessage } = useIntl();
  const format = useCallback((id: string) => formatMessage({ id }), [formatMessage]);

  const [data, setData] = useState<ComplianceRequirementsType>(selectedData);
  const [crossCuttings, setCrossCuttings] = useState<RequirementType[]>(selectedData?.requirements.crossCutting);

  const updateData = (cellId: string, type: string, value: string | number | null) => {
    if (type === 'fulfillment') {
      return data.requirements.crossCutting.map((item) =>
        item._id === cellId
          ? {
            ...item,
            fulfillment: value,
          }
          : item
      );
    }
    else if (type === 'comment') {
      return data.requirements.crossCutting.map((item) =>
        item._id === cellId
          ? {
            ...item,
            comment: value,
          }
          : item
      );
    }
  };

  const handleUpdateField = (cellId: string, type: string, value: string | number | null) => {

    const updatedCrossCuttings = updateData(cellId, type, value);

    const updatedData = {
      ...data,
      requirements: {
        ...data.requirements,
        crossCutting: updatedCrossCuttings,
      },
    };

    setData(updatedData);
  };

  useEffect(() =>setUpdatedData(data), [data]);

  const columns = useMemo(
    () => [
      {
        Header: () => format('form.header.requirement.label'),
        accessor: 'requirement',
      },
      {
        Header: format('form.header.comment.label'),
        accessor:'comment',
        Cell: ({ row }) => {
          const [comment, setComment] = useState<string>(row.values.comment);
          const [active, setActive] = useState(false);

          const counter = (
            <div className={classNames('irsc-table-comment-counter', { 'counter-active': active })}>
              {comment.length}/100
            </div>
          );

          return (
            <div style={{ position: 'relative' }}>
              <textarea
                name="comment"
                maxLength={100}
                value={comment}
                onChange={(event) =>  {
                  setComment(event.target.value);

                }}
                onBlur={(event) => {
                  handleUpdateField(row.original._id, 'comment', event.target.value);
                  setActive(false);
                }}
                onClick={() => setActive(true)}
              />
              {counter}
            </div>
          );
        }
      },
      {
        Header: format('form.header.fulfillment.label'),
        accessor: 'fulfillment',
        Cell: ({ row }) => {
          return (
            <div className='irsc-table-icons'>
              {row.values.fulfillment === 0 ?
                <FaCircleXmark
                  fill='#CF0B0B'
                  style={{ height: '24px', width: '24px' }}
                  onClick={() => handleUpdateField(row.original._id, 'fulfillment', null)}
                />
                : <FaRegCircleXmark
                  style={{ height: '24px', width: '24px' }}
                  onClick={() => handleUpdateField(row.original._id, 'fulfillment', 0)}
                />
              }
              {row.values.fulfillment === 1 ?
                <FaCircleCheck
                  fill='#048112'
                  style={{ height: '24px', width: '24px' }}
                  onClick={() => handleUpdateField(row.original._id, 'fulfillment', null)}
                />
                : <FaRegCircleCheck
                  style={{ height: '24px', width: '24px' }}
                  onClick={() => handleUpdateField(row.original._id, 'fulfillment', 1)}
                />
              }

            </div>
          );
        },
      }
    ],
    [data.requirements.crossCutting]
  );

  const {
    getTableProps,
    getTableBodyProps,
    headerGroups,
    prepareRow,
    page
  } = useTable(
    {
      columns,
      data: data.requirements.crossCutting,
    },
    usePagination
  );

  return (
    data.requirements.crossCutting?.length &&
      <div>
        <table {...getTableProps()} className='irsc-table-container'>
          <thead>
            {headerGroups.map(headerGroup => {
              return (
                <tr
                  key={headerGroup.id}
                  className='irsc-table-header'
                  {...headerGroup.getHeaderGroupProps()}>
                  {headerGroup.headers.map(column => (
                    <th key={column._id} {...column.getHeaderProps()}>{column.render('Header')}</th>
                  ))}
                </tr>
              );}
            )}
          </thead>
          <tbody {...getTableBodyProps()}>
            <tr>
              <td className='irsc-table-header-required' colSpan={3}>
                {format('form.required_label')}
              </td>
            </tr>
            {page.map((row) => {
              if (row.original.hasOwnProperty('displayCategory')) {
                return (
                  <tr className='irsc-table-rows' key={row.original.displayCategory}>
                    <td colSpan="100%">{row.original.displayCategory}</td>
                  </tr>
                );
              }

              prepareRow(row);

              return (
                <tr {...row.getRowProps()} className='irsc-table-rows'>
                  {row.cells.map(cell => {
                    return <td {...cell.getCellProps()}>{cell.render('Cell')}</td>;
                  })}
                </tr>
              );
            })}
          </tbody>
        </table>
        <div className="h-4" />
      </div>
  );
};

export default IRSCTable;

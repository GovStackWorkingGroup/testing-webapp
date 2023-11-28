import { useCallback, useEffect, useState } from 'react';
import {
  createColumnHelper,
  flexRender,
  getCoreRowModel,
  useReactTable,
} from '@tanstack/react-table';
import { useIntl } from 'react-intl';
import classNames from 'classnames';
import { FaRegCircleCheck, FaCircleCheck, FaCircleXmark, FaRegCircleXmark } from 'react-icons/fa6';

export type RequirementType = {
  _id: string;
  requirement: string
  comment: string | number | null
  fulfillment: number | null | string
}

type IRSCTableType = {
  selectedData: [RequirementType] | undefined
}

const IRSCTable = ({ selectedData }: IRSCTableType) => {
  const { formatMessage } = useIntl();
  const format = useCallback((id: string) => formatMessage({ id }), [formatMessage]);

  const columnHelper = createColumnHelper<RequirementType>();

  const [data, setData] = useState<[RequirementType] | undefined>();

  useEffect(() => setData(selectedData), [selectedData]);

  const updateData = (cellId: string, type: string, value: string | number | null) => {
    if (type === 'fulfillment') {
      data?.map((cell) => cell._id === cellId ? cell.fulfillment = value : cell);
    }
    else if (type === 'comment') {
      data?.map((cell) => cell._id === cellId ? cell.comment = value : cell);
    }

    console.log(data);
  };

  const columns = [
    columnHelper.accessor('requirement', {
      cell: cell => cell.renderValue(),
      header: () => <span>{format('form.header.requirement.label')}</span>,
    }),
    columnHelper.accessor(row => row.comment, {
      id: 'comment',
      cell: cell => {
        const [comment, setComment] = useState<string>(cell.row.original.comment);
        const [active, setActive] = useState(false);

        useEffect(() => updateData(cell.row.original._id, 'comment', comment), [comment]);

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
              onBlur={() => setActive(false)}
              onClick={() => setActive(true)}
            />
            {counter}
          </div>
        );
      },
      header: () => <span>{format('form.header.comment.label')}</span>,
    }),
    columnHelper.accessor(row => row.fulfillment, {
      id: 'fulfillment',
      cell: cell => {
        const [fulfillment, setFulfillment] = useState(cell.row.original.fulfillment);

        useEffect(() => updateData(cell.row.original._id, 'fulfillment', fulfillment), [fulfillment]);

        return (
          <div className='irsc-table-icons'>
            {fulfillment === 0 ?
              <FaCircleXmark
                fill='#CF0B0B'
                style={{ height: '24px', width: '24px' }}
                onClick={() => {setFulfillment(null);}}
              />
              : <FaRegCircleXmark
                style={{ height: '24px', width: '24px' }}
                onClick={() => {setFulfillment(0);}}
              />
            }
            {fulfillment === 1 ?
              <FaCircleCheck
                fill='#048112'
                style={{ height: '24px', width: '24px' }}
                onClick={() => {setFulfillment(null);}}
              />
              : <FaRegCircleCheck
                style={{ height: '24px', width: '24px' }}
                onClick={() => {setFulfillment(1);}}
              />
            }

          </div>
        );
      },
      header: () => <span>{format('form.header.fulfillment.label')}</span>,
    })
  ];

  const table = useReactTable({
    data,
    columns,
    getCoreRowModel: getCoreRowModel(),
  });

  console.log(data);

  return (
    data?.length &&
      <div>
        <table className='irsc-table-container'>
          <thead>
            {table.getHeaderGroups().map(headerGroup => (
              <tr className='irsc-table-header' key={headerGroup.id}>
                {headerGroup.headers.map(header => (
                  <th key={header.id}>
                    {header.isPlaceholder
                      ? null
                      : flexRender(
                        header.column.columnDef.header,
                        header.getContext()
                      )}
                  </th>
                ))}
              </tr>
            ))}
          </thead>
          <tbody>
            <tr>
              <td className='irsc-table-header-required' colSpan={3}>
                {format('form.required_label')}
              </td>
            </tr>
            {table.getRowModel().rows.map(row => (
              <tr key={row.id} className='irsc-table-rows'>
                {row.getVisibleCells().map(cell => (
                  <td key={cell.id}>
                    {flexRender(cell.column.columnDef.cell, cell.getContext())}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
        <div className="h-4" />
      </div>
  );
};

export default IRSCTable;

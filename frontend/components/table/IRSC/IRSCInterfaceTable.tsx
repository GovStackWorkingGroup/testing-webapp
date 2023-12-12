import React, { useEffect, useMemo, useState } from 'react';
import { useTable, Cell } from 'react-table';
import classNames from 'classnames';
import {
  FaRegCircleCheck,
  FaCircleCheck,
  FaCircleXmark,
  FaRegCircleXmark,
} from 'react-icons/fa6';
import {
  ComplianceRequirementsType,
  IRSCTableType,
  RequirementsType,
} from '../../../service/types';
import useTranslations from '../../../hooks/useTranslation';

const IRSCInterfaceTable = ({
  selectedData,
  setUpdatedData,
  isTableValid,
}: IRSCTableType) => {
  const [data, setData] = useState<ComplianceRequirementsType>(selectedData);

  const { format } = useTranslations();

  useEffect(() => setUpdatedData(data), [data]);

  const updateData = (
    cellId: string,
    type: string,
    value: string | number | null
  ) => {
    if (type === 'fulfillment') {
      return data.requirements.interface.map((item) =>
        item._id === cellId
          ? {
            ...item,
            fulfillment: value as number,
          }
          : item
      );
    } else if (type === 'comment') {
      return data.requirements.interface.map((item) =>
        item._id === cellId
          ? {
            ...item,
            comment: value as string,
          }
          : item
      );
    }
  };

  const handleUpdateField = (
    cellId: string,
    type: string,
    value: string | number | null
  ) => {
    let updatedCrossCuttings;
    if (type === 'fulfillment') {
      updatedCrossCuttings = updateData(cellId, type, value as number);
    }

    if (type === 'comment') {
      updatedCrossCuttings = updateData(cellId, type, value as string);
    }

    const updatedData = {
      ...data,
      requirements: {
        ...data.requirements,
        interface: updatedCrossCuttings,
      },
    };
    setData(updatedData as ComplianceRequirementsType);
  };

  const columns = useMemo(
    () => [
      {
        Header: () => format('form.header.requirement.label'),
        accessor: 'requirement',
      },
      {
        Header: format('form.header.comment.label'),
        accessor: 'comment',
        Cell: ({ row }: Cell<RequirementsType>) => {
          const [comment, setComment] = useState<string>(row.values.comment);
          const [active, setActive] = useState(false);

          const counter = (
            <div
              className={classNames('irsc-table-comment-counter', {
                'counter-active': active,
              })}
            >
              {comment.length}/100
            </div>
          );

          return (
            <div className="irsc-table-textarea">
              <textarea
                name="comment"
                maxLength={100}
                value={comment}
                onChange={(event) => {
                  setComment(event.target.value);
                }}
                onBlur={(event) => {
                  handleUpdateField(
                    row.original._id,
                    'comment',
                    event.target.value
                  );
                  setActive(false);
                }}
                onClick={() => setActive(true)}
                className="form-textarea"
              />
              {counter}
            </div>
          );
        },
      },
      {
        Header: format('form.header.fulfillment.label'),
        accessor: 'fulfillment',
        Cell: ({ row }) => {
          return (
            <div className="irsc-table-icons">
              {row.values.fulfillment === 0 ? (
                <FaCircleXmark
                  fill="#CF0B0B"
                  className="irsc-table-icon"
                  onClick={() =>
                    handleUpdateField(row.original._id, 'fulfillment', null)
                  }
                />
              ) : (
                <FaRegCircleXmark
                  className="irsc-table-icon"
                  onClick={() =>
                    handleUpdateField(row.original._id, 'fulfillment', 0)
                  }
                />
              )}
              {row.values.fulfillment === 1 ? (
                <FaCircleCheck
                  fill="#048112"
                  className="irsc-table-icon"
                  onClick={() =>
                    handleUpdateField(row.original._id, 'fulfillment', null)
                  }
                />
              ) : (
                <FaRegCircleCheck
                  className="irsc-table-icon"
                  onClick={() =>
                    handleUpdateField(row.original._id, 'fulfillment', 1)
                  }
                />
              )}
            </div>
          );
        },
      },
    ],
    [data.requirements.interface]
  );

  // @ts-ignore
  const { getTableProps, getTableBodyProps, headerGroups, prepareRow, rows } =
    useTable({
      // @ts-ignore
      columns,
      data: data.requirements.interface,
    });

  return data.requirements.interface?.length ? (
    <div className="irsc-table-container">
      <table {...getTableProps()} className="irsc-table">
        <thead>
          {headerGroups.map((headerGroup, indexKey) => {
            return (
              <tr
                {...headerGroup.getHeaderGroupProps()}
                key={`${headerGroup.id}}-${indexKey}`}
                className="irsc-table-header"
              >
                {headerGroup.headers.map((column, indexKey) => (
                  <th
                    {...column.getHeaderProps()}
                    key={`header-th-${indexKey}`}
                  >
                    {column.render('Header')}
                  </th>
                ))}
              </tr>
            );
          })}
        </thead>
        <tbody {...getTableBodyProps()}>
          {/* <tr>
            <td className="irsc-table-header-required" colSpan={3}>
              {format('form.required_label')}
            </td>
          </tr> */}
          {rows.some((item) => item.original.status === 0) && (
            <tr>
              <td className="irsc-table-header-required" colSpan={3}>
                {format('form.required_label')}
              </td>
            </tr>
          )}

          {rows.map((row: any, indexKey: number) => {
            prepareRow(row);
            if (row.original.status === 0) {
              return (
                <tr
                  {...row.getRowProps()}
                  key={`row-${indexKey}`}
                  className={`irsc-table-rows ${
                    !isTableValid &&
                    (row.values.fulfillment === undefined ||
                      row.values.fulfillment === null ||
                      row.values.fulfillment === -1)
                      ? 'irsc-invalid-row'
                      : ''
                  }`}
                >
                  {row.cells.map((cell: any, indexKey: number) => {
                    return (
                      <td {...cell.getCellProps()} key={`cell-td-${indexKey}`}>
                        {cell.render('Cell')}
                      </td>
                    );
                  })}
                </tr>
              );
            }
          })}
          {rows.some((item) => item.original.status === 1) && (
            <tr>
              <td className="irsc-table-header-required" colSpan={3}>
                {format('table.recommended_not_required.label')}
              </td>
            </tr>
          )}
          {rows.map((row: any, indexKey: number) => {
            prepareRow(row);
            if (row.original.status === 1) {
              return (
                <tr
                  {...row.getRowProps()}
                  key={`row-${indexKey}`}
                  className="irsc-table-rows"
                >
                  {row.cells.map((cell: any, indexKey: number) => {
                    return (
                      <td {...cell.getCellProps()} key={`cell-td-${indexKey}`}>
                        {cell.render('Cell')}
                      </td>
                    );
                  })}
                </tr>
              );
            }
          })}
          {}
          {rows.some((item) => item.original.status === 2) && (
            <tr>
              <td className="irsc-table-header-required" colSpan={3}>
                {format('table.optional_not_required.label')}
              </td>
            </tr>
          )}
          {rows.map((row: any, indexKey: number) => {
            prepareRow(row);
            if (row.original.status === 2) {
              return (
                <tr
                  {...row.getRowProps()}
                  key={`row-${indexKey}`}
                  className="irsc-table-rows"
                >
                  {row.cells.map((cell: any, indexKey: number) => {
                    return (
                      <td {...cell.getCellProps()} key={`cell-td-${indexKey}`}>
                        {cell.render('Cell')}
                      </td>
                    );
                  })}
                </tr>
              );
            }
          })}
        </tbody>
      </table>
    </div>
  ) : (
    <></>
  );
};

export default IRSCInterfaceTable;

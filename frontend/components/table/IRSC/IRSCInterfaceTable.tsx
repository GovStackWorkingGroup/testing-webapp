import React, { useEffect, useMemo, useState } from 'react';
import { useTable, Cell } from 'react-table';
import classNames from 'classnames';
import {
  FaRegCircleCheck,
  FaCircleCheck,
  FaCircleXmark,
  FaRegCircleXmark,
} from 'react-icons/fa6';
import { RiArrowDownSLine, RiArrowUpSLine } from 'react-icons/ri';
import {
  ComplianceRequirementsType,
  IRSCTableType,
  RequirementsType,
} from '../../../service/types';
import useTranslations from '../../../hooks/useTranslation';
import TableCells from '../../shared/TableCells';

const IRSCInterfaceTable = ({
  selectedData,
  setUpdatedData,
  isTableValid,
  readOnlyView = false,
}: IRSCTableType) => {
  const [data, setData] = useState<ComplianceRequirementsType>(selectedData);

  const { format } = useTranslations();

  const dataInterface = data.requirements.interface;

  const requiredNumber = dataInterface.filter(item => item.status === 0).length;
  const recommendedNumber = dataInterface.filter(item => item.status === 1).length;
  const optionalNumber = dataInterface.filter(item => item.status === 2).length;

  const [filledRequired, setFilledRequired] = useState<number>(0);
  const [filledRecommended, setFilledRecommended] = useState<number>(0);
  const [filledOptional, setFilledOptional] = useState<number>(0);

  const [isRequirementExpanded, setIsRequirementExpanded] = useState<boolean>(false);

  const handleRequirementExpand = () => setIsRequirementExpanded(!isRequirementExpanded);

  useEffect(() => {
    setUpdatedData(data);
    updateNumberOfFulfilledRequirements();
  }, [data]);

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
            fulfillment: value as number | null,
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

  const updateNumberOfFulfilledRequirements = () => {
    setFilledRequired(dataInterface.filter(item =>
      item.status === 0 && (item.fulfillment === 1)).length);
    setFilledRecommended(dataInterface.filter(item =>
      item.status === 1 && (item.fulfillment === 1)).length);
    setFilledOptional(dataInterface.filter(item =>
      item.status === 2 && (item.fulfillment === 1)).length);
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
              {comment.length}/250
            </div>
          );

          return (
            <div className="irsc-table-textarea">
              <textarea
                name="comment"
                maxLength={250}
                value={comment}
                onChange={(event) => {
                  setComment(event.target.value);
                }}
                onBlur={(event) => {
                  handleUpdateField(
                    row.original._id as string,
                    'comment',
                    event.target.value
                  );
                  setActive(false);
                }}
                onClick={() => setActive(true)}
                className="form-textarea"
                disabled={readOnlyView}
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
                  className={classNames('irsc-table-icon', {
                    'irsc-table-icon-disabled': readOnlyView,
                  })}
                  onClick={() => {
                    if (readOnlyView) {
                      return;
                    } else {
                      handleUpdateField(
                        row.original._id as string,
                        'fulfillment',
                        null
                      );
                    }
                  }}
                />
              ) : (
                !readOnlyView && (
                  <FaRegCircleXmark
                    className="irsc-table-icon"
                    onClick={() =>
                      handleUpdateField(
                        row.original._id as string,
                        'fulfillment',
                        0
                      )
                    }
                  />
                )
              )}
              {row.values.fulfillment === 1 ? (
                <FaCircleCheck
                  fill="#048112"
                  className={classNames('irsc-table-icon', {
                    'irsc-table-icon-disabled': readOnlyView,
                  })}
                  onClick={() => {
                    if (readOnlyView) {
                      return;
                    } else {
                      handleUpdateField(
                        row.original._id as string,
                        'fulfillment',
                        null
                      );
                    }
                  }}
                />
              ) : (
                !readOnlyView && (
                  <FaRegCircleCheck
                    className="irsc-table-icon"
                    onClick={() =>
                      handleUpdateField(
                        row.original._id as string,
                        'fulfillment',
                        1
                      )
                    }
                  />
                )
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
      data: data.requirements.interface ?? [],
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
          {rows.some((item) => item.original.status === 0) && (
            <tr>
              <td className="irsc-table-header-required" colSpan={3}>
                {`${format('form.required_label')} ${filledRequired}/${requiredNumber}`}
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
                    }
                  ${(!isRequirementExpanded) ? 'irsc-table-row-collapse' : ''}
                  `}
                >
                  <TableCells row={row}/>
                </tr>
              );
            }
          })}
          {rows.some((item) => item.original.status === 1) && (
            <tr>
              <td className={classNames(
                'irsc-table-header-required',
                { 'irsc-table-row-collapse': !isRequirementExpanded }
              )}
              colSpan={3}
              >
                {`${format('table.recommended_not_required.label')} ${filledRecommended}/${recommendedNumber}`}
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
                  className={classNames(
                    'irsc-table-rows',
                    { 'irsc-table-row-collapse': !isRequirementExpanded }
                  )}
                >
                  <TableCells row={row}/>
                </tr>
              );
            }
          })}
          {}
          {rows.some((item) => item.original.status === 2) && (
            <tr>
              <td className={classNames(
                'irsc-table-header-required',
                { 'irsc-table-row-collapse': !isRequirementExpanded }
              )}
              colSpan={3}
              >
                {`${format('table.optional_not_required.label')} ${filledOptional}/${optionalNumber}`}
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
                  className={classNames(
                    'irsc-table-rows',
                    { 'irsc-table-row-collapse': !isRequirementExpanded }
                  )}
                >
                  <TableCells row={row}/>
                </tr>
              );
            }
          })}
          <tr>
            <td
              colSpan={3}
              className="irsc-table-header-required irsc-table-collapse-expand"
              onClick={handleRequirementExpand}
            >
              {isRequirementExpanded
                ? <div className='irsc-table-collapse-expand-body'>
                  <span className='irsc-table-arrow'>
                    <RiArrowUpSLine/>
                  </span>
                  {format('table.collapse_requirements.label')}
                </div>
                : <div className='irsc-table-collapse-expand-body'>
                  <span className='irsc-table-arrow'>
                    <RiArrowDownSLine/>
                  </span>
                  {format('table.expand_requirements.label')}
                </div>
              }
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  ) : (
    <></>
  );
};

export default IRSCInterfaceTable;

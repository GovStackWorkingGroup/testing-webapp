import React, { useEffect, useMemo, useState } from 'react';
import { useTable, usePagination, Cell } from 'react-table';
import classNames from 'classnames';
import {
  FaRegCircleCheck,
  FaCircleCheck,
  FaCircleXmark,
  FaRegCircleXmark,
} from 'react-icons/fa6';
import { ComplianceRequirementsType } from '../../service/types';
import useTranslations from '../../hooks/useTranslation';
import { INTERFACE_COMPLIANCE_STORAGE_NAME } from '../../service/constants';

export type RequirementType = {
  requirement: string;
  comment: string;
  status: number;
  fulfillment: number | null;
  _id: string;
};

type IRSCTableType = {
  selectedData: ComplianceRequirementsType;
  setUpdatedData: (data: ComplianceRequirementsType) => void;
  isTableValid: boolean;
};

const IRSCTable = ({
  selectedData,
  setUpdatedData,
  isTableValid,
}: IRSCTableType) => {
  const [data, setData] = useState<ComplianceRequirementsType>(selectedData);
  const [savedInLocalStorage, setSavedInLocalStorage] = useState<
    ComplianceRequirementsType[] | null
  >(null);

  const { format } = useTranslations();

  useEffect(() => setUpdatedData(data), [data]);

  useEffect(() => {
    const savedIRSCInStorage = JSON.parse(
      localStorage.getItem(INTERFACE_COMPLIANCE_STORAGE_NAME as string) ||
        'null'
    );
    setSavedInLocalStorage(savedIRSCInStorage);
  }, []);

  const updateData = (
    cellId: string,
    type: string,
    value: string | number | null
  ) => {
    if (type === 'fulfillment') {
      return data.requirements.crossCutting.map((item) =>
        item._id === cellId
          ? {
            ...item,
            fulfillment: value as number,
          }
          : item
      );
    } else if (type === 'comment') {
      return data.requirements.crossCutting.map((item) =>
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
        crossCutting: updatedCrossCuttings,
      },
    };
    setData(updatedData as ComplianceRequirementsType);
    handleSaveInLocalStorage(updatedData as ComplianceRequirementsType);
  };

  const handleSaveInLocalStorage = (
    updatedData: ComplianceRequirementsType
  ) => {
    if (savedInLocalStorage) {
      const updatedLocalStorage = savedInLocalStorage?.map(
        (item: ComplianceRequirementsType) =>
          item?.bbKey === updatedData?.bbKey ? updatedData : item
      );

      localStorage.removeItem(INTERFACE_COMPLIANCE_STORAGE_NAME);
      localStorage.setItem(
        INTERFACE_COMPLIANCE_STORAGE_NAME,
        JSON.stringify(updatedLocalStorage)
      );

      return;
    }

    if (!savedInLocalStorage) {
      const updatedLocalStorage = [updatedData];

      localStorage.removeItem(INTERFACE_COMPLIANCE_STORAGE_NAME);
      localStorage.setItem(
        INTERFACE_COMPLIANCE_STORAGE_NAME,
        JSON.stringify(updatedLocalStorage)
      );
    }
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
        Cell: ({ row }: Cell<RequirementType>) => {
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
    [data.requirements.crossCutting]
  );

  // @ts-ignore
  const { getTableProps, getTableBodyProps, headerGroups, prepareRow, page } =
    useTable(
      {
        // @ts-ignore
        columns,
        data: data.requirements.crossCutting,
      },
      usePagination
    );

  return (
    data.requirements.crossCutting?.length && (
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
            <tr>
              <td className="irsc-table-header-required" colSpan={3}>
                {format('form.required_label')}
              </td>
            </tr>
            {page.map((row: any, indexKey: number) => {
              prepareRow(row);
              if (
                !isTableValid &&
                (row.values.fulfillment === undefined ||
                  row.values.fulfillment === null)
              ) {
                return (
                  <tr
                    {...row.getRowProps()}
                    key={`row-${indexKey}`}
                    className="irsc-table-rows irsc-invalid-row"
                  >
                    {row.cells.map((cell: any, indexKey: number) => {
                      return (
                        <td
                          {...cell.getCellProps()}
                          key={`cell-td-${indexKey}`}
                        >
                          {cell.render('Cell')}
                        </td>
                      );
                    })}
                  </tr>
                );
              }

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
            })}
          </tbody>
        </table>
      </div>
    )
  );
};

export default IRSCTable;

import Link from 'next/link';
import { RiArrowRightSLine, RiCheckFill } from 'react-icons/ri';
import { RiQuestionLine } from 'react-icons/ri';
import classNames from 'classnames';
import { useState } from 'react';
import { Cell, CellValue, CellValues, DataType } from '../../service/types';
import { COMPLIANCE_TESTING_DETAILS_PAGE } from '../../service/constants';
import BBImage from '../BuildingBlocksImage';
import useTranslations from '../../hooks/useTranslation';

type TableProps = {
  data: DataType;
  headers: string[];
  hasVerticalBorders?: boolean;
  handleOpenEvaluationSchemaModal?: (value: boolean) => void;
  isScrollX?: boolean;
  isEvaluationSchema?: boolean;
};

const Table = ({
  data,
  hasVerticalBorders = true,
  handleOpenEvaluationSchemaModal,
  headers,
  isScrollX = false,
  isEvaluationSchema = false,
}: TableProps) => {
  const [expandedRow, setExpandedRow] = useState<{ [key: string]: boolean }>(
    {}
  );
  const { format } = useTranslations();

  const formatDateIfDate = (value: Cell) => {
    if (typeof value === 'string') {
      const pattern = /^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}.\d{3}Z$/;
      if (pattern.test(value)) {
        const date = new Date(value);

        return date.toLocaleDateString();
      }

      if (!pattern.test(value)) {
        return value;
      }
    } else {
      return value;
    }
  };

  const handleExpandRows = (index: number, name: string) => {
    const compoundKey = `${index}-${name}`;
    setExpandedRow((prevExpanded) => ({
      ...prevExpanded,
      [compoundKey]: !prevExpanded[compoundKey],
    }));
  };

  return (
    <>
      <table
        className={classNames('main-table', { 'table-scroll-x': isScrollX })}
      >
        <thead>
          <tr>
            {headers?.map((header, indexKey) => {
              if (
                [
                  'table.deployment_compliance.label',
                  'table.requirement_specification_compliance.label',
                  'table.interface_compliance.label',
                  'table.compliance_level.label',
                ].includes(header) &&
                handleOpenEvaluationSchemaModal
              ) {
                return (
                  <th
                    key={`header-${header}-${indexKey}`}
                    className={`${
                      hasVerticalBorders ? '' : 'no-vertical-border'
                    }`}
                  >
                    <div className="th-header-with-icon">
                      <p>{format(header)}</p>
                      <RiQuestionLine
                        className="th-icon-question-mark cursor-pointer"
                        onClick={() => handleOpenEvaluationSchemaModal(true)}
                      />
                    </div>
                  </th>
                );
              }

              return (
                <th
                  key={`header-${header}-${indexKey}`}
                  className={`${
                    hasVerticalBorders ? '' : 'no-vertical-border'
                  }`}
                >
                  {format(header)}
                </th>
              );
            })}
          </tr>
        </thead>
        {data.rows.length ? (
          <tbody id="scrollableDiv">
            {data.rows?.map((row, rowIndexKey) => (
              <>
                {row.subHeader && (
                  <tr
                    key={`subheader-${row.subHeader}-${rowIndexKey}`}
                    className="tr-subheader"
                  >
                    <td colSpan={8}>
                      <Link
                        className="tr-subheader-container"
                        href={{
                          pathname: `${COMPLIANCE_TESTING_DETAILS_PAGE}${row.subHeader}`,
                        }}
                      >
                        <p>{row.subHeader}</p>
                        <div className="test-details-arrow">
                          <RiArrowRightSLine />
                        </div>
                      </Link>
                    </td>
                  </tr>
                )}
                <tr key={`row-${row}-${rowIndexKey}`}>
                  {row.cell.map((cell, indexKey) => {
                    if ('value' in cell) {
                      if (cell.value === 'checked') {
                        return (
                          <td
                            key={`details-cell-check-${cell.value}-${indexKey}`}
                            className={`${
                              hasVerticalBorders ? '' : 'no-vertical-border'
                            }`}
                          >
                            <RiCheckFill className="check-icon" />
                          </td>
                        );
                      }

                      if (
                        [
                          'In Review',
                          'Rejected',
                          'Approved',
                          -1,
                          1,
                          2,
                          true,
                        ].includes(cell.value)
                      ) {
                        return (
                          <td
                            key={`details-cell-status-${cell.value}-${indexKey}`}
                            className={`${
                              hasVerticalBorders ? '' : 'no-vertical-border'
                            }`}
                          >
                            {cell.value === 'In Review' && (
                              <p className="td-text-color-container status-in-review">
                                {cell.value}
                              </p>
                            )}
                            {cell.value === 'Rejected' && (
                              <p className="td-text-color-container status-rejected">
                                {cell.value}
                              </p>
                            )}
                            {cell.value === 'Approved' && (
                              <p className="td-text-color-container status-approved">
                                {cell.value}
                              </p>
                            )}
                            {cell.value === -1 && (
                              <p className="td-text-color-container status-na">
                                {format('table.N/A.label')}
                              </p>
                            )}
                            {cell.value === 1 && (
                              <p className="td-text-color-container status-level-one">
                                {format('table.level_1.label')}
                              </p>
                            )}
                            {cell.value === 2 && (
                              <p className="td-text-color-container status-level-two">
                                {format('table.level_2.label')}
                              </p>
                            )}
                            {cell.value === true && <RiCheckFill />}
                          </td>
                        );
                      }

                      if (
                        typeof cell.value === 'string' &&
                        cell.value.startsWith('bb-')
                      ) {
                        return (
                          <td
                            key={`details-cell-${cell.value}-${indexKey}`}
                            className={`${
                              hasVerticalBorders ? '' : 'no-vertical-border'
                            }`}
                          >
                            <div className="td-bb-image-name-container">
                              <BBImage imagePath={cell.value} />
                              <p>{format(cell.value)}</p>
                            </div>
                          </td>
                        );
                      }

                      return (
                        <td
                          key={`details-cell-${cell.value}-${indexKey}`}
                          className={`${
                            hasVerticalBorders ? '' : 'no-vertical-border'
                          }`}
                        >
                          {/* @ts-ignore */}
                          {formatDateIfDate(cell.value)}
                        </td>
                      );
                    }

                    if ('values' in cell) {
                      const doesValuesExistInsideValues = cell.values.some(
                        (cellItem) => 'values' in cellItem
                      );

                      return (
                        <td
                          className="td-row-details"
                          key={`divided-row-${cell}-${indexKey}`}
                        >
                          <table
                            className={classNames('inside-table border-top', {
                              'table-full-height': !doesValuesExistInsideValues && !isEvaluationSchema,
                            })}
                          >
                            <tbody
                              className={classNames({
                                'has-divided-inside-table':
                                  doesValuesExistInsideValues,
                              })}
                            >
                              {cell.values.map(
                                (item: CellValue | CellValues, indexKey) => {
                                  if (
                                    !isEvaluationSchema &&
                                    indexKey > 0 &&
                                    !expandedRow[
                                      `${rowIndexKey}-${
                                        'value' in row.cell[0] &&
                                        row.cell[0].value
                                      }`
                                    ]
                                  ) {
                                    return null;
                                  }

                                  if ('value' in item) {
                                    if (
                                      [-1, 1, 2].includes(item.value as number)
                                    ) {
                                      return (
                                        <tr
                                          key={`details-divided-cell-${item.value}-${indexKey}`}
                                        >
                                          <td>
                                            {(item.value as number) === -1 && (
                                              <p className="td-text-color-container status-na">
                                                {format('table.N/A.label')}
                                              </p>
                                            )}
                                            {(item.value as number) === 1 && (
                                              <p className="td-text-color-container status-level-one">
                                                {format('table.level_1.label')}
                                              </p>
                                            )}
                                            {(item.value as number) === 2 && (
                                              <p className="td-text-color-container status-level-two">
                                                {format('table.level_2.label')}
                                              </p>
                                            )}
                                          </td>
                                        </tr>
                                      );
                                    }

                                    return (
                                      <tr
                                        key={`details-divided-cell-values-${item.value}-${indexKey}`}
                                      >
                                        <td>{item.value}</td>
                                      </tr>
                                    );
                                  }

                                  if ('values' in item) {
                                    return (
                                      <td
                                        className="td-row-details without-borders"
                                        key={`divided-row-${cell}-${indexKey}`}
                                      >
                                        <table className="inside-table border-top">
                                          <tbody>
                                            {item.values.map(
                                              (item: CellValue, indexKey) => {
                                                if ('value' in item) {
                                                  if (
                                                    [-1, 1, 2].includes(
                                                      item.value as number
                                                    )
                                                  ) {
                                                    return (
                                                      <tr
                                                        key={`details-divided-cell-${item.value}-${indexKey}`}
                                                      >
                                                        <td>
                                                          {(item.value as number) ===
                                                            -1 && (
                                                            <p className="td-text-color-container status-na">
                                                              {format(
                                                                'table.N/A.label'
                                                              )}
                                                            </p>
                                                          )}
                                                          {(item.value as number) ===
                                                            1 && (
                                                            <p className="td-text-color-container status-level-one">
                                                              {format(
                                                                'table.level_1.label'
                                                              )}
                                                            </p>
                                                          )}
                                                          {(item.value as number) ===
                                                            2 && (
                                                            <p className="td-text-color-container status-level-two">
                                                              {format(
                                                                'table.level_2.label'
                                                              )}
                                                            </p>
                                                          )}
                                                        </td>
                                                      </tr>
                                                    );
                                                  }

                                                  return (
                                                    <tr
                                                      key={`details-divided-cell-values-${item.value}-${indexKey}`}
                                                    >
                                                      <td>{item.value}</td>
                                                    </tr>
                                                  );
                                                }
                                              }
                                            )}
                                          </tbody>
                                        </table>
                                      </td>
                                    );
                                  }
                                }
                              )}
                            </tbody>
                          </table>
                        </td>
                      );
                    }
                  })}
                </tr>
                {!isEvaluationSchema &&
                  'values' in row.cell[1] &&
                  row.cell[1].values.length > 1 && (
                  <div
                    className="table-expand-div"
                    onClick={() =>
                      handleExpandRows(
                        rowIndexKey,
                        'value' in row.cell[0]
                          ? (row.cell[0].value as string)
                          : ''
                      )
                    }
                  >
                    <p>
                      {expandedRow[
                          `${rowIndexKey}-${
                            'value' in row.cell[0] && row.cell[0].value
                          }`
                      ]
                        ? format('table.hide_older_versions.label')
                        : format('table.show_older_versions.label')}
                    </p>
                  </div>
                )}
              </>
            ))}
          </tbody>
        ) : (
          <tbody>
            <tr>
              <td colSpan={8}>
                <div className="td-no-data-message">
                  {format('table.no_data_available.message')}
                </div>
              </td>
            </tr>
          </tbody>
        )}
      </table>
    </>
  );
};

export default Table;

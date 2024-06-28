import Link from 'next/link';
import { RiCheckFill } from 'react-icons/ri';
import { RiQuestionLine } from 'react-icons/ri';
import classNames from 'classnames';
import { useState } from 'react';
import { RiArrowDownSLine, RiArrowUpSLine } from 'react-icons/ri';
import { FaExternalLinkAlt } from 'react-icons/fa';
import { CgExternal } from 'react-icons/cg';
import { FiExternalLink } from 'react-icons/fi';
import {
  Cell,
  CellValue,
  CellValues,
  DataRow,
  DataType,
} from '../../service/types';
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
  expandingRows?: boolean;
  evaluationSummaryTable?: boolean;
};

const Table = ({
  data,
  hasVerticalBorders = true,
  handleOpenEvaluationSchemaModal,
  headers,
  isScrollX = false,
  isEvaluationSchema = false,
  expandingRows = false,
  evaluationSummaryTable = false,
}: TableProps) => {
  const [expandedRow, setExpandedRow] = useState<{ [key: string]: boolean }>(
    {}
  );
  const [expandedSubHeaderRow, setExpandedSubHeaderRow] = useState<string[]>(
    []
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

  const handleExpandSubHeaderRows = (name: string) => {
    const updatedExpandedSubHeaderRow = [...expandedSubHeaderRow];
    const index = updatedExpandedSubHeaderRow.findIndex(
      (rowName) => rowName === name
    );
    if (index === -1) {
      setExpandedSubHeaderRow([...updatedExpandedSubHeaderRow, name]);

      return;
    }

    setExpandedSubHeaderRow(
      updatedExpandedSubHeaderRow.filter((rowName) => rowName !== name)
    );
  };

  // Return rows indexes which should be visible
  const findIndexesBySubHeaders = (rows: DataRow[], subHeaders: string[]) => {
    const resultIndexes = [];

    let foundSubHeader = false;
    for (let i = 0; i < rows.length; i++) {
      const row = rows[i];

      if (foundSubHeader && row.subHeader) {
        // Stop when a new subHeader is encountered
        foundSubHeader = false;
      }

      if (row.subHeader && subHeaders.includes(row.subHeader)) {
        foundSubHeader = true;
      }

      if (foundSubHeader) {
        // Add the index to the resultIndexes array
        resultIndexes.push(i);
      }
    }

    return resultIndexes;
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
                    className={classNames({ 'no-vertical-border': !hasVerticalBorders })}>
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
            {data.rows?.map((row, rowIndexKey) => {
              if (
                !findIndexesBySubHeaders(
                  data.rows,
                  expandedSubHeaderRow
                ).includes(rowIndexKey) &&
                expandingRows
              ) {
                return (
                  <>
                    {row.subHeader && (
                      <tr
                        key={`subheader-${row.subHeader}-${rowIndexKey}`}
                        className="tr-subheader"
                      >
                        <td colSpan={8}>
                          <div className="td-subheader">
                            {expandingRows && (
                              <div
                                className="details-arrow"
                                onClick={() =>
                                  handleExpandSubHeaderRows(
                                    row.subHeader as string
                                  )
                                }
                              >
                                <RiArrowDownSLine />
                              </div>
                            )}
                            <Link
                              className="tr-subheader-container"
                              href={{
                                pathname: `${COMPLIANCE_TESTING_DETAILS_PAGE}${row.subHeader}`,
                              }}
                            >
                              <p><FiExternalLink /> {row.subHeader}</p>
                            </Link>
                          </div>
                        </td>
                      </tr>
                    )}
                  </>
                );
              }

              return (
                <>
                  {row.subHeader && (
                    <tr
                      key={`subheader-x-${row.subHeader}-${rowIndexKey}`}
                      className="tr-subheader"
                    >
                      <td colSpan={8}>
                        <div className="td-subheader">
                          {expandingRows && (
                            <div
                              className="details-arrow"
                              onClick={() =>
                                handleExpandSubHeaderRows(
                                  row.subHeader as string
                                )
                              }
                            >
                              <RiArrowUpSLine />
                            </div>
                          )}
                          <Link
                            className="tr-subheader-container"
                            href={{
                              pathname: `${COMPLIANCE_TESTING_DETAILS_PAGE}${row.subHeader}`,
                            }}
                          >
                            <p>{row.subHeader}</p>
                          </Link>
                        </div>
                      </td>
                    </tr>
                  )}
                  <tr key={`row-${row}-${rowIndexKey}`} className="border">
                    {row.cell.map((cell, indexKey) => {
                      if ('value' in cell) {
                        if (cell.value === 'checked') {
                          return (
                            <td
                              key={`details-cell-check-${cell.value}-${indexKey}`}
                            >
                              <RiCheckFill className="check-icon" />
                            </td>
                          );
                        }

                        if (
                          [
                            'Draft',
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
                              className={classNames({
                                'no-vertical-border': !hasVerticalBorders,
                              })}
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
                                <p className="td-text-color-container status-na cursor-pointer"
                                  onClick={() => handleOpenEvaluationSchemaModal
                                    ? handleOpenEvaluationSchemaModal(true) : null}
                                >
                                  {format('table.N/A.label')}
                                </p>
                              )}
                              {cell.value === 1 && (
                                <p className="td-text-color-container status-level-one cursor-pointer"
                                  onClick={() => handleOpenEvaluationSchemaModal
                                    ? handleOpenEvaluationSchemaModal(true) : null}
                                >
                                  {format('table.level_1.label')}
                                </p>
                              )}
                              {cell.value === 2 && (
                                <p className="td-text-color-container status-level-two cursor-pointer"
                                  onClick={() => handleOpenEvaluationSchemaModal
                                    ? handleOpenEvaluationSchemaModal(true) : null}
                                >
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
                              className={classNames({
                                'no-vertical-border': !hasVerticalBorders,
                              })}
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
                            key={`details-cell-y-${cell.value}-${indexKey}`}
                            className={classNames(
                              'border',
                              {
                                'no-vertical-border': !hasVerticalBorders,
                              },
                              {
                                'evaluation-summary-table-td':
                                  evaluationSummaryTable,
                              }
                            )}
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
                              className={classNames('main-table', {
                                'table-full-height':
                                  !doesValuesExistInsideValues &&
                                  !isEvaluationSchema,
                              })}
                            >
                              <tbody
                                className={classNames({
                                  'has-divided-main-table':
                                    doesValuesExistInsideValues,
                                })}
                              >
                                {cell.values.map(
                                  (
                                    item: CellValue | CellValues,
                                    indexKey,
                                    all
                                  ) => {
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
                                        [-1, 1, 2].includes(
                                          item.value as number
                                        )
                                      ) {
                                        return (
                                          <tr
                                            key={`details-divided-cell-${item.value}-${indexKey}`}
                                          >
                                            <td className="border-none">
                                              {(item.value as number) ===
                                                -1 && (
                                                <p className="td-text-color-container status-na cursor-pointer"
                                                  onClick={() => handleOpenEvaluationSchemaModal
                                                    ? handleOpenEvaluationSchemaModal(true) : null}
                                                >
                                                  {format('table.N/A.label')}
                                                </p>
                                              )}
                                              {(item.value as number) === 1 && (
                                                <p
                                                  className="td-text-color-container status-level-one cursor-pointer"
                                                  onClick={() => handleOpenEvaluationSchemaModal
                                                    ? handleOpenEvaluationSchemaModal(true) : null}
                                                >
                                                  {format(
                                                    'table.level_1.label'
                                                  )} xx
                                                </p>
                                              )}
                                              {(item.value as number) === 2 && (
                                                <p className="td-text-color-container status-level-two cursor-pointer"
                                                  onClick={() => handleOpenEvaluationSchemaModal
                                                    ? handleOpenEvaluationSchemaModal(true) : null}
                                                >
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
                                          <td
                                            className={classNames(
                                              'border-none',
                                              {
                                                'border-bottom':
                                                  indexKey < all.length - 1,
                                              }
                                            )}
                                          >
                                            {item.value}
                                          </td>
                                        </tr>
                                      );
                                    }

                                    if ('values' in item) {
                                      return (
                                        <td
                                          className={classNames(
                                            'td-row-details border-none',

                                            {
                                              'evaluation-summary-table-td-divided':
                                                evaluationSummaryTable,
                                            },
                                            {
                                              'has-divided-main-table-border':
                                                doesValuesExistInsideValues &&
                                                indexKey === 1,
                                            }
                                          )}
                                          key={`divided-row-${cell}-${indexKey}`}
                                        >
                                          <table className="main-table">
                                            <tbody>
                                              {item.values.map(
                                                (
                                                  item: CellValue,
                                                  indexKey,
                                                  all
                                                ) => {
                                                  if ('value' in item) {
                                                    if (
                                                      [-1, 1, 2].includes(
                                                        item.value as number
                                                      )
                                                    ) {
                                                      return (
                                                        <tr
                                                          key={`details-divided-cell-x-${item.value}-${indexKey}`}
                                                        >
                                                          <td
                                                            className={classNames(
                                                              'border-none',
                                                              {
                                                                'border-bottom':
                                                                  indexKey <
                                                                  all.length -
                                                                    1,
                                                              }
                                                            )}
                                                          >
                                                            {(item.value as number) ===
                                                              -1 && (
                                                              <p className="td-text-color-container status-na
                                                              cursor-pointer"
                                                              onClick={() => handleOpenEvaluationSchemaModal
                                                                ? handleOpenEvaluationSchemaModal(true) : null}
                                                              >
                                                                {format(
                                                                  'table.N/A.label'
                                                                )}
                                                              </p>
                                                            )}
                                                            {(item.value as number) ===
                                                              1 && (
                                                              <p className="td-text-color-container status-level-one
                                                              cursor-pointer"
                                                              onClick={() => handleOpenEvaluationSchemaModal
                                                                ? handleOpenEvaluationSchemaModal(true) : null}
                                                              >
                                                                {format(
                                                                  'table.level_1.label'
                                                                )}
                                                              </p>
                                                            )}
                                                            {(item.value as number) ===
                                                              2 && (
                                                              <p className="td-text-color-container status-level-two
                                                               cursor-pointer"
                                                              onClick={() => handleOpenEvaluationSchemaModal
                                                                ? handleOpenEvaluationSchemaModal(true) : null}
                                                              >
                                                                {format(
                                                                  'table.level_2.label'
                                                                )}
                                                              </p>
                                                            )}
                                                          </td>
                                                        </tr>
                                                      );
                                                    }

                                                    if (
                                                      typeof item.value ===
                                                        'string' &&
                                                      item.value.startsWith(
                                                        'bb-'
                                                      )
                                                    ) {
                                                      return (
                                                        <tr
                                                          key={`details-divided-cell-y-${item.value}-${indexKey}`}
                                                        >
                                                          <td
                                                            key={`details-cell-x-${item.value}-${indexKey}`}
                                                            className={classNames(
                                                              'border-none',
                                                              {
                                                                'no-vertical-border':
                                                                  !hasVerticalBorders,
                                                              }
                                                            )}
                                                          >
                                                            <div className="td-bb-image-name-container">
                                                              <BBImage
                                                                imagePath={
                                                                  item.value
                                                                }
                                                              />
                                                              <p>
                                                                {format(
                                                                  item.value
                                                                )}
                                                              </p>
                                                            </div>
                                                          </td>
                                                        </tr>
                                                      );
                                                    }

                                                    return (
                                                      <tr
                                                        key={`details-divided-cell-values-x-${item.value}-${indexKey}`}
                                                      >
                                                        <td
                                                          className={classNames(
                                                            'border-none',
                                                            {
                                                              'border-bottom':
                                                                indexKey <
                                                                all.length - 1,
                                                            }
                                                          )}
                                                        >
                                                          <div className="cell-td">
                                                            {item.value}
                                                          </div>
                                                        </td>
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
                    <tr className="table-expand-tr border" key='table-expand-tr'>
                      <td colSpan={1}></td>
                      <td
                        colSpan={5}
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
                      </td>
                    </tr>
                  )}
                </>
              );
            })}
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

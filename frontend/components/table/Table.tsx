import Link from 'next/link';
import { RiArrowRightSLine, RiCheckFill } from 'react-icons/ri';
import { RiQuestionLine } from 'react-icons/ri';
import classNames from 'classnames';
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
};

const Table = ({
  data,
  hasVerticalBorders = true,
  handleOpenEvaluationSchemaModal,
  headers,
  isScrollX = false,
}: TableProps) => {
  const { format } = useTranslations();
  const formatDateIfDate = (value: Cell) => {
    if (typeof value === 'string') {
      const date = new Date(value);
      if (!isNaN(date.getTime())) {
        return date.toLocaleDateString();
      } else {
        return value;
      }
    } else {
      return value;
    }
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
            {data.rows?.map((row, indexKey) => (
              <>
                {row.subHeader && (
                  <tr
                    key={`subheader-${row.subHeader}-${indexKey}`}
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
                <tr key={`row-${row}-${indexKey}`}>
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
                            className={classNames('inside-table', {
                              'table-full-height': !doesValuesExistInsideValues,
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

import Link from 'next/link';
import { RiArrowRightSLine, RiCheckFill } from 'react-icons/ri';
import classNames from 'classnames';
import { Cell, DataRow } from '../../service/types';

type TableProps = {
  data: { headers: string[]; rows: DataRow[] } | Record<string, never>;
  hasVerticalBorders?: boolean;
  hasClassicPadding?: boolean;
};

const Table = ({
  data,
  hasVerticalBorders = true,
  hasClassicPadding = true,
}: TableProps) => {
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
    <div className="table-container">
      {data && (
        <table className="main-table">
          <thead>
            <tr>
              {data.headers?.map((header, indexKey) => (
                <th
                  key={`header-${header}-${indexKey}`}
                  className={`${
                    hasVerticalBorders ? '' : 'no-vertical-border'
                  } ${hasClassicPadding ? '' : 'th-custom-wider-padding'}`}
                >
                  {header}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
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
                          pathname: `softwareComplianceTesting/details/${row.subHeader}`,
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
                            key={`details-cell-check-${cell.value}-${indexKey}`}
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
                                N/A
                              </p>
                            )}
                            {cell.value === 1 && (
                              <p className="td-text-color-container status-level-one">
                                Level 1
                              </p>
                            )}
                            {cell.value === 2 && (
                              <p className="td-text-color-container status-level-two">
                                Level 2
                              </p>
                            )}
                            {cell.value === true && <RiCheckFill />}
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
                          {formatDateIfDate(cell.value)}
                        </td>
                      );
                    }

                    if ('values' in cell) {
                      return (
                        <td
                          className="td-row-details"
                          key={`divided-row-${cell}-${indexKey}`}
                        >
                          <table className="inside-table">
                            <tbody>
                              {cell.values.map((value) => (
                                <tr
                                  key={`details-divided-cell-${value}-${indexKey}`}
                                >
                                  <td>{value.value}</td>
                                </tr>
                              ))}
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
        </table>
      )}
    </div>
  );
};

export default Table;

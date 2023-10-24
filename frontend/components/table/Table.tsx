import { RiArrowRightSLine, RiCheckFill } from 'react-icons/ri';
type CellValue = {
  value: string;
};

type Cell = CellValue | { values: CellValue[] };

type DataRow = {
  cell: Cell[];
  subHeader?: string;
};
type TableProps = {
  data: { headers: string[]; rows: DataRow[] };
  hasVerticalBorders?: boolean;
  handleRedirect?: (value: string | undefined) => void;
};

const Table = ({
  data,
  hasVerticalBorders = true,
  handleRedirect,
}: TableProps) => {
  return (
    <table className="main-table">
      <thead>
        <tr>
          {data.headers.map((header, indexKey) => (
            <th
              key={`header-${header}-${indexKey}`}
              className={`${hasVerticalBorders ? '' : 'no-vertical-border'}`}
            >
              {header}
            </th>
          ))}
        </tr>
      </thead>
      <tbody>
        {data.rows.map((row, indexKey) => (
          <>
            {row.subHeader && handleRedirect && (
              <tr
                key={`subheader-${row.subHeader}-${indexKey}`}
                className="tr-subheader"
              >
                <td colSpan={5}>
                  <div
                    className="tr-subheader-container"
                    onClick={() => handleRedirect(row.subHeader)}
                  >
                    <p>{row.subHeader}</p>
                    <div className="test-details-arrow">
                      <RiArrowRightSLine />
                    </div>
                  </div>
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

                  return (
                    <td
                      key={`details-cell-${cell.value}-${indexKey}`}
                      className={`${
                        hasVerticalBorders ? '' : 'no-vertical-border'
                      }`}
                    >
                      {cell.value}
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
  );
};

export default Table;

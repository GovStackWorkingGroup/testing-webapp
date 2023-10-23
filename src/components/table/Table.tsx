import { RiCheckFill } from 'react-icons/ri';
type CellValue = {
  value: string;
};

type Cell = CellValue | { values: CellValue[] };

type DataRow = {
  cell: Cell[];
};
type TableProps = {
  data: { headers: string[]; rows: DataRow[] };
};

const Table = ({ data }: TableProps) => (
  <table className="main-table">
    <thead>
      <tr>
        {data.headers.map((header) => (
          <th key={`header-${header}`}>{header}</th>
        ))}
      </tr>
    </thead>
    <tbody>
      {data.rows.map((row) => (
        <tr key={`row-${row}`}>
          {row.cell.map((cell) => {
            if ('value' in cell) {
              if (cell.value === 'checked') {
                return (
                  <td key={`details-cell-${cell.value}`}>
                    <RiCheckFill className="check-icon" />
                  </td>
                );
              }

              return <td key={`details-cell-${cell.value}`}>{cell.value}</td>;
            }

            if ('values' in cell) {
              return (
                <td className="td-row-details" key={`divided-row-${cell}`}>
                  <table className="inside-table">
                    <tbody>
                      {cell.values.map((value) => (
                        <tr key={`details-divided-cell-${value}`}>
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
      ))}
    </tbody>
  </table>
);

export default Table;

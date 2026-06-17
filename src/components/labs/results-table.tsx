export function ResultsTable({
  columns,
  rows,
}: {
  columns: string[];
  rows: (string | number)[][];
}) {
  return (
    <div className="scrollbar-thin overflow-x-auto">
      <table className="w-full border-collapse text-left font-mono text-[13px]">
        <thead>
          <tr className="border-b border-line">
            {columns.map((col) => (
              <th
                key={col}
                className="whitespace-nowrap px-4 py-2.5 text-[11px] font-semibold uppercase tracking-wider text-muted"
              >
                {col}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {rows.map((row, i) => (
            <tr
              key={i}
              className="border-b border-line/60 transition-colors hover:bg-panel/40"
            >
              {row.map((cell, j) => (
                <td
                  key={j}
                  className="whitespace-nowrap px-4 py-2.5 text-text-secondary"
                >
                  {cell}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

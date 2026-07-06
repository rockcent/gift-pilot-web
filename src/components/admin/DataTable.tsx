import { ReactNode } from 'react';
import './DataTable.scss';

export interface Column<T> {
  key: string;
  title: string;
  render?: (row: T) => ReactNode;
  width?: number | string;
  align?: 'left' | 'center' | 'right';
}

export interface DataTableProps<T> {
  columns: Column<T>[];
  data: T[];
  rowKey: (row: T) => string;
  onRowClick?: (row: T) => void;
  empty?: ReactNode;
}

export function DataTable<T>({ columns, data, rowKey, onRowClick, empty }: DataTableProps<T>) {
  return (
    <div className="gp-admin-table">
      <table>
        <thead>
          <tr>
            {columns.map((c) => (
              <th key={c.key} style={{ width: c.width, textAlign: c.align ?? 'left' }}>{c.title}</th>
            ))}
          </tr>
        </thead>
        <tbody>
          {data.length === 0 ? (
            <tr>
              <td colSpan={columns.length} className="gp-admin-table__empty">
                {empty ?? '暂无数据'}
              </td>
            </tr>
          ) : (
            data.map((row) => (
              <tr key={rowKey(row)} onClick={() => onRowClick?.(row)} className={onRowClick ? 'gp-admin-table__row--click' : ''}>
                {columns.map((c) => (
                  <td key={c.key} style={{ textAlign: c.align ?? 'left' }}>
                    {c.render ? c.render(row) : (row as any)[c.key]}
                  </td>
                ))}
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  );
}

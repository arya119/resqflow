'use client';

import React from 'react';
import clsx from 'clsx';

export interface Column<T> {
  key: string;
  header: string;
  render?: (item: T) => React.ReactNode;
  align?: 'left' | 'center' | 'right';
  className?: string;
  width?: string;
}

interface DataTableProps<T> {
  columns: Column<T>[];
  data: T[];
  keyExtractor: (item: T) => string;
  onRowClick?: (item: T) => void;
  selectedId?: string;
  emptyMessage?: string;
  className?: string;
}

export function DataTable<T extends Record<string, unknown>>({
  columns,
  data,
  keyExtractor,
  onRowClick,
  selectedId,
  emptyMessage = 'No records found',
  className,
}: DataTableProps<T>) {
  return (
    <div className={clsx('w-full overflow-x-auto border border-outline-variant rounded-lg bg-surface', className)}>
      <table className="w-full text-left text-sm border-collapse">
        <thead className="bg-surface-container-low border-b border-outline-variant text-[11px] font-mono uppercase font-semibold text-outline">
          <tr>
            {columns.map((col) => (
              <th
                key={col.key}
                className={clsx(
                  'py-2.5 px-3 whitespace-nowrap',
                  col.align === 'right' ? 'text-right' : col.align === 'center' ? 'text-center' : 'text-left',
                  col.className
                )}
                style={{ width: col.width }}
              >
                {col.header}
              </th>
            ))}
          </tr>
        </thead>
        <tbody className="divide-y divide-outline-variant/60">
          {data.length === 0 ? (
            <tr>
              <td colSpan={columns.length} className="py-8 text-center text-on-surface-variant text-sm">
                {emptyMessage}
              </td>
            </tr>
          ) : (
            data.map((item) => {
              const id = keyExtractor(item);
              const isSelected = selectedId === id;
              return (
                <tr
                  key={id}
                  onClick={() => onRowClick && onRowClick(item)}
                  className={clsx(
                    'transition-colors text-on-surface',
                    onRowClick && 'cursor-pointer hover:bg-surface-container-low',
                    isSelected && 'bg-secondary-container/40'
                  )}
                >
                  {columns.map((col) => (
                    <td
                      key={col.key}
                      className={clsx(
                        'py-2.5 px-3 text-[13px]',
                        col.align === 'right' ? 'text-right' : col.align === 'center' ? 'text-center' : 'text-left',
                        col.className
                      )}
                    >
                      {col.render ? col.render(item) : String(item[col.key] ?? '')}
                    </td>
                  ))}
                </tr>
              );
            })
          )}
        </tbody>
      </table>
    </div>
  );
}

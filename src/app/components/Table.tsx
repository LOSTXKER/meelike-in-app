// src/app/components/Table.tsx
import React from 'react';

interface TableHeader {
    label: string;
    align?: 'left' | 'center' | 'right';
}

interface TableProps {
  headers: (string | TableHeader)[];
  children: React.ReactNode;
  footer?: React.ReactNode;
}

export default function Table({ headers, children, footer }: TableProps) {
  const getAlignmentClass = (align?: 'left' | 'center' | 'right') => {
    switch (align) {
      case 'center':
        return 'text-center';
      case 'right':
        return 'text-right';
      default:
        return 'text-left';
    }
  };

  return (
    <div className="overflow-x-auto">
        <table className="w-full text-sm">
            <thead className="text-xs text-brand-text-light dark:text-dark-text-light uppercase bg-brand-secondary-light/60 dark:bg-dark-border">
                <tr>
                    {headers.map((header, index) => {
                        const isObj = typeof header === 'object';
                        const label = isObj ? header.label : header;
                        const align = isObj ? header.align : 'left';
                        const isFirst = index === 0;
                        const isLast = index === headers.length - 1;

                        return (
                            <th 
                                key={label} 
                                scope="col" 
                                className={`p-3 ${getAlignmentClass(align)} ${isFirst ? 'rounded-l-lg' : ''} ${isLast ? 'rounded-r-lg' : ''}`}
                            >
                                {label}
                            </th>
                        );
                    })}
                </tr>
            </thead>
            <tbody>
                {children}
            </tbody>
        </table>
        {footer && <div className="pt-4">{footer}</div>}
    </div>
  );
}
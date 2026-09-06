import clsx from 'clsx';
import React from 'react';

export default function Loading({ size = 'md', className }) {
  return (
    <div className={clsx('text-center', className)}>
      <div
        className={clsx(
          'inline-block animate-spin rounded-full border-solid border-current border-r-transparent align-[-0.125em]',
          { 'h-2 w-2 border': size === 'xs' },
          { 'h-4 w-4 border-2': size === 'sm' },
          { 'h-8 w-8 border-4': size === 'md' },
          { 'h-16 w-16 border-8': size === 'lg' },
        )}
        role="status"
      >
        <span className="sr-only">Loading...</span>
      </div>
    </div>
  );
}

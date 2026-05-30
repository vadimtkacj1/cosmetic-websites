'use client';
import { twMerge } from 'tailwind-merge';
import { HTMLAttributes, ReactNode } from 'react';

interface ListProps extends HTMLAttributes<HTMLUListElement> {
  children: ReactNode;
  ordered?: boolean;
  gap?: string;
}

const List = ({
  children,
  ordered = false,
  gap = 'gap-2',
  className,
  ...props
}: ListProps) => {
  const Component = ordered ? 'ol' : 'ul'
  
  return (
    <Component
      className={twMerge(
        'flex flex-col',
        gap,
        ordered ? 'list-decimal list-inside' : 'list-none',
        className
      )}
      {...props}
    >
      {children}
    </Component>
  )
}

export default List
'use client';

import { HTMLAttributes, ReactNode, CSSProperties } from 'react';
import { twMerge } from 'tailwind-merge';

interface UlProps extends HTMLAttributes<HTMLUListElement> {
  children: ReactNode
  gap?: string
  font_family?: string
}

const Ul = ({
  children,
  gap = 'gap-[14px]',
  font_family,
  className,
  ...props
}: UlProps) => {
  const customStyles: CSSProperties = {
    ...(font_family && !font_family.startsWith('font-') && { fontFamily: font_family }),
  }

  return (
    <ul
      role="list"
      style={customStyles}
      className={twMerge(
        'flex flex-col',
        gap,
        font_family?.startsWith('font-') ? font_family : '',
        className
      )}
      {...props}
    >
      {children}
    </ul>
  )
}

export default Ul
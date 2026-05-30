'use client';
import NextLink from'next/link';
import { cva, type VariantProps } from 'class-variance-authority';
import { twMerge } from 'tailwind-merge';
import { AnchorHTMLAttributes, ReactNode, CSSProperties } from 'react';

const linkClasses = cva(
  'inline-flex items-center transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-offset-1',
  {
    variants: {
      variant: {
        default: 'text-text-primary hover:text-primary-background focus:ring-primary-background',
        header: 'text-header-link hover:text-header-linkHover focus:ring-header-linkHover',
        footer: 'text-footer-link hover:text-text-white focus:ring-text-white',
      },
    },
    defaultVariants: {
      variant: 'default',
    },
  }
)

interface LinkProps extends Omit<AnchorHTMLAttributes<HTMLAnchorElement>, 'href'>, VariantProps<typeof linkClasses> {
  href: string
  children?: ReactNode
  text_font_size?: string
  text_font_family?: string
  text_font_weight?: string
  text_line_height?: string
  text_color?: string
}

const Link = ({
  href,
  children,
  variant,
  text_font_size,
  text_font_family,
  text_font_weight,
  text_line_height,
  text_color,
  className,
  ...props
}: LinkProps) => {
  const customStyles: CSSProperties = {
    ...(text_font_family && !text_font_family.startsWith('font-') && { fontFamily: text_font_family }),
  }

  const styleClasses = [
    text_font_size,
    text_font_family?.startsWith('font-') ? text_font_family : '',
    text_font_weight,
    text_line_height,
    text_color,
  ].filter(Boolean).join(' ')

  return (
    <NextLink
      href={href}
      style={customStyles}
      className={twMerge(
        linkClasses({ variant }),
        styleClasses,
        className
      )}
      {...props}
    >
      {children}
    </NextLink>
  )
}

export default Link
'use client';
import { cva, type VariantProps } from 'class-variance-authority';
import { twMerge } from 'tailwind-merge';
import { InputHTMLAttributes, CSSProperties } from 'react';

const inputClasses = cva(
  'w-full transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-1 disabled:opacity-50 disabled:cursor-not-allowed',
  {
    variants: {
      variant: {
        default: 'border-input-border bg-input-background text-input-text placeholder:text-input-placeholder focus:ring-primary-background',
        outlined: 'border-2 border-border-secondary bg-input-background text-input-text placeholder:text-input-placeholder focus:ring-border-secondary',
      },
      inputSize: {
        small: 'text-sm px-3 py-1.5',
        medium: 'text-base px-4 py-2',
        large: 'text-lg px-6 py-3',
      },
    },
    defaultVariants: {
      variant: 'default',
      inputSize: 'medium',
    },
  }
)

interface EditTextProps extends Omit<InputHTMLAttributes<HTMLInputElement>, 'size'>, VariantProps<typeof inputClasses> {
  // Required parameters with defaults
  placeholder?: string;
  text_font_size?: string;
  text_font_family?: string;
  text_font_weight?: string;
  text_line_height?: string;
  text_text_align?: string;
  text_color?: string;
  
  // Optional parameters
  border_border?: string;
  layout_gap?: string;
  layout_width?: string;
  padding?: string;
  position?: string;
  margin?: string;
}

const EditText = ({
  // Required parameters with defaults
  placeholder = "Nail Art Design",
  text_font_size = "text-xl",
  text_font_family = "Nunito Sans",
  text_font_weight = "font-semibold",
  text_line_height = "leading-2xl",
  text_text_align = "left",
  text_color = "text-text-primary",
  
  // Optional parameters
  border_border,
  layout_gap,
  layout_width,
  padding,
  position,
  margin,
  
  // Standard React props
  variant,
  inputSize,
  disabled = false,
  className,
  type = 'text',
  ...props
}: EditTextProps) => {
  // Safe validation for optional parameters
  const hasValidBorder = border_border && typeof border_border === 'string' && border_border.trim() !== ''
  const hasValidGap = layout_gap && typeof layout_gap === 'string' && layout_gap.trim() !== ''
  const hasValidWidth = layout_width && typeof layout_width === 'string' && layout_width.trim() !== ''
  const hasValidPadding = padding && typeof padding === 'string' && padding.trim() !== ''
  const hasValidPosition = position && typeof position === 'string' && position.trim() !== ''
  const hasValidMargin = margin && typeof margin === 'string' && margin.trim() !== ''

  const optionalClasses = [
    hasValidBorder ? `border-[${border_border}]` : '',
    hasValidGap ? `gap-[${layout_gap}]` : '',
    hasValidWidth ? `w-[${layout_width}]` : '',
    hasValidPadding ? `p-[${padding}]` : '',
    hasValidPosition ? position : '',
    hasValidMargin ? `m-[${margin}]` : '',
  ].filter(Boolean).join(' ')

  // Build custom styles for non-Tailwind properties
  const customStyles: CSSProperties = {
    ...(text_font_family && !text_font_family.startsWith('font-') && { fontFamily: text_font_family }),
  }

  // Build Tailwind classes for styling
  const styleClasses = [
    text_font_size,
    text_font_family.startsWith('font-') ? text_font_family : '',
    text_font_weight,
    text_line_height,
    `text-${text_text_align}`,
    text_color,
  ].filter(Boolean).join(' ')

  return (
    <input
      type={type}
      placeholder={placeholder}
      disabled={disabled}
      style={customStyles}
      className={twMerge(
        inputClasses({ variant, inputSize }),
        styleClasses,
        optionalClasses,
        className
      )}
      aria-disabled={disabled}
      {...props}
    />
  )
}

export default EditText
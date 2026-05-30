'use client';
import { useInView } from '@/hooks/useInView';

type Direction = 'up' | 'down' | 'left' | 'right' | 'none';

interface RevealProps {
  children: React.ReactNode;
  className?: string;
  direction?: Direction;
  delay?: number;
  duration?: number;
  once?: boolean;
  as?: 'div' | 'section' | 'span' | 'li';
}

const hiddenTransform: Record<Direction, string> = {
  up: 'translate-y-8',
  down: '-translate-y-8',
  left: 'translate-x-8',
  right: '-translate-x-8',
  none: '',
};

export default function Reveal({
  children,
  className = '',
  direction = 'up',
  delay = 0,
  duration = 800,
  once = true,
  as: Tag = 'div',
}: RevealProps) {
  const { ref, inView } = useInView<HTMLDivElement>({ once });

  return (
    <Tag
      ref={ref as React.Ref<never>}
      className={`transition-all ease-out will-change-transform ${
        inView ? 'opacity-100 translate-x-0 translate-y-0' : `opacity-0 ${hiddenTransform[direction]}`
      } ${className}`}
      style={{ transitionDuration: `${duration}ms`, transitionDelay: `${delay}ms` }}
    >
      {children}
    </Tag>
  );
}

import type { ElementType, ReactNode } from 'react'
import { useInView } from '../hooks/useInView'

type Props = {
  as?: ElementType
  className?: string
  delay?: number
  children: ReactNode
}

/** A single quiet rise when the block first enters the viewport. */
export default function Reveal({ as: Tag = 'div', className = '', delay = 0, children }: Props) {
  const { ref, inView } = useInView<HTMLElement>(0.2)
  return (
    <Tag
      ref={ref}
      className={`reveal ${inView ? 'is-in' : ''} ${className}`}
      style={delay ? { transitionDelay: inView ? `${delay}ms` : '0ms' } : undefined}
    >
      {children}
    </Tag>
  )
}

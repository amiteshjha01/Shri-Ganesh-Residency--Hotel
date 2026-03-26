import { ReactNode } from 'react'

interface PageTransitionProps {
  children: ReactNode
  delay?: number
}

export default function PageTransition({ children, delay = 0 }: PageTransitionProps) {
  return (
    <div
      style={{
        animation: 'fadeIn 0.5s ease-out',
        animationDelay: `${delay}ms`
      }}
    >
      {children}
    </div>
  )
}

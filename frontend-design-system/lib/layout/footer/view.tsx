import React from 'react'
import { cn } from '../../theme'
import type { FooterProps } from './type'

export const view: React.FC<FooterProps> = ({ children, className }) => {
  return (
    <footer
      className={cn(
        'w-full border-t border-gray-200 bg-gray-100 py-12 text-center text-sm text-gray-600',
        className,
      )}
    >
      <div className='mx-auto max-w-7xl px-4 sm:px-6 lg:px-8'>
        {children || (
          <p>
            <strong>Bulma Design System</strong> by Alex. Built with Tailwind CSS
            &amp; TEA architecture.
          </p>
        )}
      </div>
    </footer>
  )
}

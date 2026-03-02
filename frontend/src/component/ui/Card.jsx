import React from 'react'

export function Card({
  children,
  className = '',
  noPadding = false,
  ...props
}) {
  return (
    <div
      className={`bg-white rounded-lg border border-slate-200 shadow-sm ${
        noPadding ? '' : 'p-6'
      } ${className}`}
      {...props}
    >
      {children}
    </div>
  )
}

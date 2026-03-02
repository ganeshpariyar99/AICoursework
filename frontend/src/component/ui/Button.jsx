import React from 'react'

export function Button({
  children,
  variant = 'primary',
  size = 'md',
  isLoading = false,
  className = '',
  disabled,
  ...props
}) {
  // Map variant/size to our CSS classes
  const variantClass = variant === 'primary' ? 'btn-primary' :
    variant === 'outline' ? 'btn-outline' : 'btn-primary';

  // Size classes could be handled if needed, for now using btn base padding
  const sizeClass = size === 'full' ? 'btn-full' : '';

  return (
    <button
      className={`btn ${variantClass} ${sizeClass} ${className}`}
      disabled={disabled || isLoading}
      {...props}
    >
      {isLoading && <span className="loader" style={{ marginRight: '8px' }}>...</span>}
      {children}
    </button>
  )
}

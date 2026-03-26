import React from 'react'

interface FormInputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string
  error?: string
  required?: boolean
}

export default function FormInput({
  label,
  error,
  required,
  id,
  type = 'text',
  placeholder,
  ...props
}: FormInputProps) {
  return (
    <div className="space-y-2">
      {label && (
        <label htmlFor={id} className="block text-sm font-semibold text-foreground">
          {label}
          {required && <span className="text-destructive ml-1">*</span>}
        </label>
      )}
      <input
        id={id}
        type={type}
        placeholder={placeholder}
        className={`w-full px-4 py-3 border rounded-md bg-background text-foreground focus:outline-none focus:ring-2 transition-all duration-200 ${
          error
            ? 'border-destructive focus:ring-destructive/50'
            : 'border-border focus:ring-primary/50 focus:border-primary'
        }`}
        {...props}
      />
      {error && <p className="text-xs text-destructive font-medium">{error}</p>}
    </div>
  )
}

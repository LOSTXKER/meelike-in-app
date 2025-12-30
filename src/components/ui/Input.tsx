'use client';

import { InputHTMLAttributes, TextareaHTMLAttributes, forwardRef } from 'react';

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  hint?: string;
}

export const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ label, error, hint, className = '', ...props }, ref) => {
    return (
      <div className="w-full">
        {label && (
          <label className="block text-sm font-medium text-brand-text-dark mb-1.5">
            {label}
            {props.required && <span className="text-brand-error ml-1">*</span>}
          </label>
        )}
        <input
          ref={ref}
          className={`
            w-full px-3 py-2 rounded-lg border transition-all outline-none
            bg-brand-surface border-brand-border text-brand-text-dark
            placeholder:text-brand-text-light
            focus:border-brand-primary focus:ring-2 focus:ring-brand-primary/20
            disabled:opacity-50 disabled:cursor-not-allowed
            ${error ? 'border-brand-error focus:border-brand-error focus:ring-brand-error/20' : ''}
            ${className}
          `}
          {...props}
        />
        {hint && !error && (
          <p className="mt-1 text-xs text-brand-text-light">{hint}</p>
        )}
        {error && (
          <p className="mt-1 text-xs text-brand-error">{error}</p>
        )}
      </div>
    );
  }
);

Input.displayName = 'Input';

interface TextareaProps extends TextareaHTMLAttributes<HTMLTextAreaElement> {
  label?: string;
  error?: string;
  hint?: string;
}

export const Textarea = forwardRef<HTMLTextAreaElement, TextareaProps>(
  ({ label, error, hint, className = '', ...props }, ref) => {
    return (
      <div className="w-full">
        {label && (
          <label className="block text-sm font-medium text-brand-text-dark mb-1.5">
            {label}
            {props.required && <span className="text-brand-error ml-1">*</span>}
          </label>
        )}
        <textarea
          ref={ref}
          className={`
            w-full px-3 py-2 rounded-lg border transition-all outline-none resize-none
            bg-brand-surface border-brand-border text-brand-text-dark
            placeholder:text-brand-text-light
            focus:border-brand-primary focus:ring-2 focus:ring-brand-primary/20
            disabled:opacity-50 disabled:cursor-not-allowed
            ${error ? 'border-brand-error focus:border-brand-error focus:ring-brand-error/20' : ''}
            ${className}
          `}
          rows={4}
          {...props}
        />
        {hint && !error && (
          <p className="mt-1 text-xs text-brand-text-light">{hint}</p>
        )}
        {error && (
          <p className="mt-1 text-xs text-brand-error">{error}</p>
        )}
      </div>
    );
  }
);

Textarea.displayName = 'Textarea';

interface SelectProps extends InputHTMLAttributes<HTMLSelectElement> {
  label?: string;
  error?: string;
  options: { value: string; label: string }[];
}

export const Select = forwardRef<HTMLSelectElement, SelectProps>(
  ({ label, error, options, className = '', ...props }, ref) => {
    return (
      <div className="w-full">
        {label && (
          <label className="block text-sm font-medium text-brand-text-dark mb-1.5">
            {label}
            {props.required && <span className="text-brand-error ml-1">*</span>}
          </label>
        )}
        <select
          ref={ref}
          className={`
            w-full px-3 py-2 rounded-lg border transition-all outline-none
            bg-brand-surface border-brand-border text-brand-text-dark
            focus:border-brand-primary focus:ring-2 focus:ring-brand-primary/20
            disabled:opacity-50 disabled:cursor-not-allowed
            ${error ? 'border-brand-error' : ''}
            ${className}
          `}
          {...props}
        >
          {options.map((opt) => (
            <option key={opt.value} value={opt.value}>
              {opt.label}
            </option>
          ))}
        </select>
        {error && (
          <p className="mt-1 text-xs text-brand-error">{error}</p>
        )}
      </div>
    );
  }
);

Select.displayName = 'Select';


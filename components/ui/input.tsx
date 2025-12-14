import React from 'react';

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  icon?: React.ReactNode;
  brandColor?: string;
}

export function Input({ label, error, icon, brandColor, className = '', ...props }: InputProps) {
  return (
    <div className="w-full">
      {label && (
        <label className="block mb-2 text-sm font-medium text-[#1F2937]">
          {label}
        </label>
      )}
      <div className="relative">
        {icon && (
          <div className="absolute left-3 top-1/2 -translate-y-1/2 text-[#9CA3AF]">
            {icon}
          </div>
        )}
        <input
          className={`w-full px-4 py-3 border-2 rounded-lg text-base transition-all duration-200 
            focus:outline-none focus:ring-4
            disabled:bg-[#F3F4F6] disabled:cursor-not-allowed
            ${icon ? 'pl-10' : ''}
            ${error ? 'border-[#EF4444] focus:border-[#EF4444] focus:ring-[#EF4444]/10' : ''}
            ${className}`}
          style={{
            borderColor: error ? '#EF4444' : brandColor ? `${brandColor}40` : '#E5E7EB',
            ...(props.style || {})
          }}
          onFocus={(e) => {
            if (!error && brandColor) {
              e.currentTarget.style.borderColor = brandColor;
              e.currentTarget.style.boxShadow = `0 0 0 4px ${brandColor}1a`;
            }
            props.onFocus?.(e);
          }}
          onBlur={(e) => {
            if (!error && brandColor) {
              e.currentTarget.style.borderColor = `${brandColor}40`;
              e.currentTarget.style.boxShadow = 'none';
            }
            props.onBlur?.(e);
          }}
          {...props}
        />
      </div>
      {error && (
        <p className="mt-1 text-sm text-[#EF4444]">{error}</p>
      )}
    </div>
  );
}

interface TextareaProps extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
  label?: string;
  error?: string;
  brandColor?: string;
}

export function Textarea({ label, error, brandColor, className = '', ...props }: TextareaProps) {
  return (
    <div className="w-full">
      {label && (
        <label className="block mb-2 text-sm font-medium text-[#1F2937]">
          {label}
        </label>
      )}
      <textarea
        className={`w-full px-4 py-3 border-2 rounded-lg text-base transition-all duration-200 
          focus:outline-none focus:ring-4
          disabled:bg-[#F3F4F6] disabled:cursor-not-allowed resize-vertical min-h-[120px]
          ${error ? 'border-[#EF4444] focus:border-[#EF4444] focus:ring-[#EF4444]/10' : ''}
          ${className}`}
        style={{
          borderColor: error ? '#EF4444' : brandColor ? `${brandColor}40` : '#E5E7EB',
          ...(props.style || {})
        }}
        onFocus={(e) => {
          if (!error && brandColor) {
            e.currentTarget.style.borderColor = brandColor;
            e.currentTarget.style.boxShadow = `0 0 0 4px ${brandColor}1a`;
          }
          props.onFocus?.(e);
        }}
        onBlur={(e) => {
          if (!error && brandColor) {
            e.currentTarget.style.borderColor = `${brandColor}40`;
            e.currentTarget.style.boxShadow = 'none';
          }
          props.onBlur?.(e);
        }}
        {...props}
      />
      {error && (
        <p className="mt-1 text-sm text-[#EF4444]">{error}</p>
      )}
    </div>
  );
}

interface SelectProps extends React.SelectHTMLAttributes<HTMLSelectElement> {
  label?: string;
  error?: string;
  options: { value: string; label: string }[];
  brandColor?: string;
}

export function Select({ label, error, options, brandColor, className = '', ...props }: SelectProps) {
  return (
    <div className="w-full">
      {label && (
        <label className="block mb-2 text-sm font-medium text-[#1F2937]">
          {label}
        </label>
      )}
      <select
        className={`w-full px-4 py-3 pr-10 border-2 rounded-lg text-base transition-all duration-200 
          focus:outline-none focus:ring-4
          disabled:bg-[#F3F4F6] disabled:cursor-not-allowed appearance-none bg-white
          ${error ? 'border-[#EF4444] focus:border-[#EF4444] focus:ring-[#EF4444]/10' : ''}
          ${className}`}
        style={{
          borderColor: error ? '#EF4444' : brandColor ? `${brandColor}40` : '#E5E7EB',
          backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 24 24' stroke='%236B7280'%3E%3Cpath stroke-linecap='round' stroke-linejoin='round' stroke-width='2' d='M19 9l-7 7-7-7'%3E%3C/path%3E%3C/svg%3E")`,
          backgroundRepeat: 'no-repeat',
          backgroundPosition: 'right 12px center',
          backgroundSize: '20px',
          ...(props.style || {})
        }}
        onFocus={(e) => {
          if (!error && brandColor) {
            e.currentTarget.style.borderColor = brandColor;
            e.currentTarget.style.boxShadow = `0 0 0 4px ${brandColor}1a`;
          }
          props.onFocus?.(e);
        }}
        onBlur={(e) => {
          if (!error && brandColor) {
            e.currentTarget.style.borderColor = `${brandColor}40`;
            e.currentTarget.style.boxShadow = 'none';
          }
          props.onBlur?.(e);
        }}
        {...props}
      >
        {options.map((option) => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>
      {error && (
        <p className="mt-1 text-sm text-[#EF4444]">{error}</p>
      )}
    </div>
  );
}




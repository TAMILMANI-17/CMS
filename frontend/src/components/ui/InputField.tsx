import React, { useState } from 'react';

interface InputFieldProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label: string;
  error?: string;
  required?: boolean;
}

export const InputField: React.FC<InputFieldProps> = ({
  label,
  error,
  required,
  className = '',
  type,
  ...props
}) => {
  const isPassword = type === 'password';
  const [showPassword, setShowPassword] = useState(false);
  const resolvedType = isPassword ? (showPassword ? 'text' : 'password') : type;

  return (
    <div className="mb-5">
      <label
        htmlFor={props.id}
        className="block text-sm font-semibold text-slate-900 mb-1"
      >
        {label}
        {required && <span className="text-red-500 ml-1">*</span>}
      </label>
      <div className="relative">
        <input
          {...props}
          type={resolvedType}
          className={`w-full px-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white text-slate-900 placeholder:text-slate-400 ${
            error ? 'border-red-500' : 'border-slate-300'
          } ${isPassword ? 'pr-10' : ''} ${className}`}
        />
        {isPassword && (
          <button
            type="button"
            onClick={() => setShowPassword((prev) => !prev)}
            className="absolute inset-y-0 right-2 flex items-center text-slate-500 hover:text-slate-700 text-sm"
            aria-label={showPassword ? 'Hide password' : 'Show password'}
          >
            {showPassword ? '🙈' : '👁️'}
          </button>
        )}
      </div>
      {error && <p className="mt-1 text-sm text-red-600">{error}</p>}
    </div>
  );
};


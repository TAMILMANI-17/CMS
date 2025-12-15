'use client';

import React, { useState } from 'react';
import { InputField } from '../ui/InputField';
import { SelectField } from '../ui/SelectField';
import { UserRole } from '@/src/types/auth.types';

interface AuthFormProps {
  mode: 'login' | 'signup';
  onSubmit: (data: any) => Promise<void>;
  isLoading?: boolean;
  error?: string | null;
}

export const AuthForm: React.FC<AuthFormProps> = ({
  mode,
  onSubmit,
  isLoading = false,
  error,
}) => {
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    username: '',
    email: '',
    password: '',
    confirmPassword: '',
    dateOfBirth: '',
    phoneNumber: '',
    country: '',
    state: '',
    city: '',
    pincode: '',
    role: UserRole.USER,
  });

  const [errors, setErrors] = useState<Record<string, string>>({});

  const validate = (): boolean => {
    const newErrors: Record<string, string> = {};

    if (mode === 'signup') {
      if (!formData.firstName.trim()) {
        newErrors.firstName = 'First name is required';
      }
      if (!formData.lastName.trim()) {
        newErrors.lastName = 'Last name is required';
      }
      if (!formData.username.trim()) {
        newErrors.username = 'Username is required';
      }
      if (!formData.email.trim()) {
        newErrors.email = 'Email is required';
      } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
        newErrors.email = 'Invalid email format';
      }
      if (!formData.password) {
        newErrors.password = 'Password is required';
      } else if (formData.password.length < 8) {
        newErrors.password = 'Password must be at least 8 characters';
      }
      if (formData.password !== formData.confirmPassword) {
        newErrors.confirmPassword = 'Passwords do not match';
      }
    } else {
      if (!formData.username.trim() && !formData.email.trim()) {
        newErrors.usernameOrEmail = 'Username or email is required';
      }
      if (!formData.password) {
        newErrors.password = 'Password is required';
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;

    try {
      if (mode === 'signup') {
        await onSubmit({
          firstName: formData.firstName,
          lastName: formData.lastName,
          username: formData.username,
          email: formData.email,
          password: formData.password,
          passwordConfirmation: formData.confirmPassword,
          dateOfBirth: formData.dateOfBirth || undefined,
          phoneNumber: formData.phoneNumber || undefined,
          location: {
            country: formData.country || undefined,
            state: formData.state || undefined,
            city: formData.city || undefined,
            pincode: formData.pincode || undefined,
          },
          role: formData.role,
        });
      } else {
        await onSubmit({
          usernameOrEmail: formData.username || formData.email,
          password: formData.password,
        });
      }
    } catch (err) {
      // Error handled by parent
    }
  };

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>,
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: '' }));
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {mode === 'signup' && (
        <>
          <div className="grid grid-cols-2 gap-4">
            <InputField
              label="First Name"
              name="firstName"
              value={formData.firstName}
              onChange={handleChange}
              error={errors.firstName}
              required
            />
            <InputField
              label="Last Name"
              name="lastName"
              value={formData.lastName}
              onChange={handleChange}
              error={errors.lastName}
              required
            />
          </div>
          <InputField
            label="Username"
            name="username"
            value={formData.username}
            onChange={handleChange}
            error={errors.username}
            required
          />
        </>
      )}

      {mode === 'login' ? (
        <InputField
          label="Username or Email"
          name="username"
          value={formData.username}
          onChange={handleChange}
          error={errors.usernameOrEmail}
          required
        />
      ) : (
        <InputField
          label="Email"
          name="email"
          type="email"
          value={formData.email}
          onChange={handleChange}
          error={errors.email}
          required
        />
      )}

      <InputField
        label="Password"
        name="password"
        type="password"
        value={formData.password}
        onChange={handleChange}
        error={errors.password}
        required
      />

      {mode === 'signup' && (
        <>
          <InputField
            label="Confirm Password"
            name="confirmPassword"
            type="password"
            value={formData.confirmPassword}
            onChange={handleChange}
            error={errors.confirmPassword}
            required
          />
          <InputField
            label="Date of Birth"
            name="dateOfBirth"
            type="date"
            value={formData.dateOfBirth}
            onChange={handleChange}
          />
          <InputField
            label="Phone Number"
            name="phoneNumber"
            type="tel"
            value={formData.phoneNumber}
            onChange={handleChange}
          />
          <div className="grid grid-cols-2 gap-4">
            <InputField
              label="Country"
              name="country"
              value={formData.country}
              onChange={handleChange}
            />
            <InputField
              label="State"
              name="state"
              value={formData.state}
              onChange={handleChange}
            />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <InputField
              label="City"
              name="city"
              value={formData.city}
              onChange={handleChange}
            />
            <InputField
              label="Pincode"
              name="pincode"
              value={formData.pincode}
              onChange={handleChange}
            />
          </div>
          <SelectField
            label="Role"
            name="role"
            value={formData.role}
            onChange={handleChange}
            required
            options={[
              { value: UserRole.USER, label: 'User' },
              { value: UserRole.EMPLOYEE, label: 'Employee' },
              { value: UserRole.ADMIN, label: 'Admin' },
              { value: UserRole.SUPER_ADMIN, label: 'Super Admin' },
            ]}
          />
        </>
      )}

      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded">
          {error}
        </div>
      )}

      <button
        type="submit"
        disabled={isLoading}
        className="w-full bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed"
      >
        {isLoading ? 'Loading...' : mode === 'login' ? 'Login' : 'Sign Up'}
      </button>
    </form>
  );
};


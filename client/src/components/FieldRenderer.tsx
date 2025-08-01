'use client';

import { formatCamelCase } from '@/utils/formatCamelCase';
import {
  TextField,
  TextareaField,
  SelectField,
  CheckboxField,
  FileField,
  MultiGroupSelectField,
  RadioField,
  PasswordField,
} from './FormFields';
import { ChangeEvent, useMemo } from 'react';
import { useFieldConfigContext } from '@/context/FieldConfigContext';
import { testIdContext } from '@/test/utils/testIdContext';

type FieldRendererProps<T> = {
  data: T;
  errors?: Partial<Record<keyof T, string>>;
  index?: number;
};

// Email validation regex
const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export function FieldRenderer<T extends Record<string, any>>({
  data,
  errors = {},
  index,
}: FieldRendererProps<T>) {
  const { fieldsConfig } = useFieldConfigContext<T>();
  const { FIELD_TEST_IDS } = testIdContext.getContext();

  // Function to get validation error for a field
  const getFieldError = useMemo(() => {
    return (key: string): string | undefined => {
      const existingError = errors?.[key as keyof T];
      if (existingError) return existingError;

      const value = data[key as keyof T];

      // Email validation
      if (key === 'email' || key.toLowerCase().includes('email')) {
        if (value && !EMAIL_REGEX.test(value)) {
          return 'Please enter a valid email address';
        }
      }

      // Password confirmation validation
      if (key === 'confirmPassword') {
        const password = data['password' as keyof T];
        const confirmPassword = data['confirmPassword' as keyof T];

        if (password && confirmPassword && password !== confirmPassword) {
          return 'Passwords do not match';
        }
      }

      return undefined;
    };
  }, [data, errors]);

  return (
    <>
      {Object.entries(fieldsConfig).map(([key, config]) => {
        if (!(key in data) || !config) return null;

        const value = data[key as keyof T];
        const error = getFieldError(key);
     const testId = FIELD_TEST_IDS[key as string];
 

        if (!config?.onChangeHandler && !config.fieldGroup?.onChangeHandler) {
          console.log('no change event handler field renderer config');
          return null;
        }

        const onChange =
          (config?.onChangeHandler as (e: any, index?: number) => void) ||
          ((e: any) => {});

        switch (config.type) {
          case 'textarea':
            
            return (
              <TextareaField
                key={key}
                name={key}
                label={formatCamelCase(key)}
                value={value}
                onChange={(e: any) => onChange(e, index)}
                error={error}
                testId={testId}
              />
            );

          // case 'select':
          //   return (
          //     <SelectField
          //       key={key}
          //       name={key}
          //       label={formatCamelCase(key)}
          //       value={value}
          //       options={config.options}
          //       onChange={(e: any) => onChange(e, index)}
          //       error={error}
          //       testId={testId}
          //     />
          //   );

          case 'double-select':
            if (!config.fieldGroup) {
              console.error('no field group');
              return null;
            }
            return (
              <MultiGroupSelectField
                key={key}
                groupData={data[key]}
                fieldGroup={config.fieldGroup}
                onChange={config.fieldGroup.onChangeHandler}
                testId={testId}
              />
            );

          case 'checkbox':
            return (
              <CheckboxField
                key={key}
                name={key}
                label={formatCamelCase(key)}
                checked={value}
                onChange={(e: any) => onChange(e, index)}
                error={error}
                testId={testId}
              />
            );

          case 'file':
            return (
              <FileField
                key={key}
                name={key}
                label={formatCamelCase(key)}
                onChange={(e: any) => onChange(e, index)}
                error={error}
                testId={testId}
              />
            );

          case 'radio':
            return (
              <RadioField
                key={key}
                name={key}
                label={formatCamelCase(key)}
                value={value}
                options={config.options || []}
                onChange={
                  onChange as (e: ChangeEvent<HTMLInputElement>) => void
                }
                error={error}
                testId={testId}
              />
            );

          case 'date':
            return (
              <TextField
                key={key}
                name={key}
                label={formatCamelCase(key)}
                value={value}
                onChange={(e: any) => onChange(e, index)}
                error={error}
                type="date"
                testId={testId}
              />
            );

          case 'password':
            return (
              <PasswordField
                key={key}
                name={key}
                label={formatCamelCase(key)}
                value={value}
                onChange={(e: any) => onChange(e, index)}
                error={error}
                testId={testId}
              />
            );

          case 'email':
            return (
              <TextField
                key={key}
                name={key}
                label={formatCamelCase(key)}
                value={value}
                onChange={(e: any) => onChange(e, index)}
                error={error}
                type="email"
                testId={testId}
              />
            );

          case 'text':
            console.log('text testId',testId)
          default:
            return (
              <TextField
                key={key}
                name={key}
                label={formatCamelCase(key)}
                value={value}
                onChange={(e: any) => onChange(e, index)}
                error={error}
                type="text"
                testId={testId}
              />
            );
        }
      })}
    </>
  );
}

'use client';

import { useAuth } from '@/hooks/useAuth';
import {
  ChangeHandler,
  FieldConfigInput,
  FieldGroupConfig,
  FieldsConfig,
} from '@/types/fields_config';
import React, {
  createContext,
  useState,
  useEffect,
  useContext,
  Dispatch,
  SetStateAction,
  useCallback,
} from 'react';

// Define the context value type
type FieldConfigContextValue<T = any> = {
  fieldsConfig: FieldsConfig<T>;
  setFieldsConfig: Dispatch<SetStateAction<FieldsConfig<T>>>;
  fieldConfigInput: FieldConfigInput<T> | null;
  setFieldConfigInput: Dispatch<SetStateAction<FieldConfigInput<T> | null>>;
  changeHandlers: ChangeHandler | null;
  setChangeHandlers: Dispatch<SetStateAction<ChangeHandler | null>>
  fieldGroup: FieldGroupConfig | null;
  setFieldGroup: Dispatch<SetStateAction<FieldGroupConfig | null>>;
  createFieldsConfig: (
    input: FieldConfigInput<T>,
    handlers?: Partial<ChangeHandler>,
    options?: Partial<
      Record<keyof T, string[] | { id: string | number; label: string }[]>
    >,
    groups?: Partial<Record<keyof T, FieldGroupConfig>>
  ) => void;
};

// Create the context with proper typing
const FieldConfigContext = createContext<FieldConfigContextValue | undefined>(
  undefined
);

export const FieldConfigProvider = <T = any,>({
  children,
}: {
  children: React.ReactNode;
}) => {
  

  const [fieldsConfig, setFieldsConfig] = useState<FieldsConfig<T>>(
    {} as FieldsConfig<T>
  );
  const [fieldConfigInput, setFieldConfigInput] =
    useState<FieldConfigInput<T> | null>(null);
  const [fieldGroup, setFieldGroup] = useState<FieldGroupConfig | null>(null);
  const [changeHandlers, setChangeHandlers] = useState<ChangeHandler | null>(null)

  // Function to create fields config from input and handlers
  const createFieldsConfig = useCallback(
    (
      input: FieldConfigInput<T>,
      handlers?: Partial<ChangeHandler>,
      options?: Partial<
        Record<keyof T, string[] | { id: string | number; label: string }[]>
      >,
      groups?: Partial<Record<keyof T, FieldGroupConfig>>
    ) => {
      const config: FieldsConfig<T> = {} as FieldsConfig<T>;

      Object.keys(input).forEach((key) => {
        const fieldKey = key as keyof T;
        const fieldType = input[fieldKey];

        config[fieldKey] = {
          type: fieldType,
          onChangeHandler: handlers?.[fieldType],
          options: options?.[fieldKey],
          fieldGroup: groups?.[fieldKey],
        };
      });

      setFieldsConfig(config);
    },
    [] // Keep empty since this function doesn't depend on any external values when called manually
  );

  // Auto-generate fields config when dependencies change
  useEffect(() => {
    if (fieldConfigInput && changeHandlers) {
      // Create a stable config object to avoid recreating on every render
      const config: FieldsConfig<T> = {} as FieldsConfig<T>;

      Object.keys(fieldConfigInput).forEach((key) => {
        const fieldKey = key as keyof T;
        const fieldType = fieldConfigInput[fieldKey];

        config[fieldKey] = {
          type: fieldType,
          onChangeHandler: changeHandlers[fieldType],
          options: undefined,
          fieldGroup: undefined,
        };
      });

      // Only update if the config has actually changed
      setFieldsConfig(prevConfig => {
        const hasChanged = JSON.stringify(prevConfig) !== JSON.stringify(config);
        return hasChanged ? config : prevConfig;
      });
    }
  }, [fieldConfigInput, changeHandlers]); // Removed createFieldsConfig from dependencies

  const value: FieldConfigContextValue<T> = {
    fieldsConfig,
    setFieldsConfig,
    fieldConfigInput,
    setFieldConfigInput,
    setChangeHandlers,
    changeHandlers,
    fieldGroup,
    setFieldGroup,
    createFieldsConfig,
  };

  return (
    <FieldConfigContext.Provider value={value}>
      {children}
    </FieldConfigContext.Provider>
  );
};

export const useFieldConfigContext = <
  T = any,
>(): FieldConfigContextValue<T> => {
  const context = useContext(FieldConfigContext);
  if (!context) {
    throw new Error(
      'useFieldConfigContext must be used within FieldConfigProvider'
    );
  }
  return context as FieldConfigContextValue<T>;
};
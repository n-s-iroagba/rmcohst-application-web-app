// shared/utils/formTestIdGenerator.ts

/**
 * Generate a test ID with proper formatting
 * @param elementType - HTML element type
 * @param identifier - Unique identifier
 */
const generateTestId = (elementType: string, identifier: string): string => {
  return `${elementType.replace(/[^a-zA-Z0-9]/g, '').toLowerCase()}-${identifier
    .replace(/\s+/g, '-')
    .replace(/[^a-zA-Z0-9-]/g, '')
    .toLowerCase()}`;
};

/**
 * Generate test IDs for form fields
 * @param formDefaultData - Object representing form structure
 * @param testIdBase - Base identifier for the form
 */
const generateFormInputTestIds = <T extends Record<string, any>>(
  formDefaultData: T,
  testIdBase: string
): { [K in keyof T]: string } => {
  const result: any = {};

  Object.keys(formDefaultData).forEach((key) => {
    const elementType =
      typeof formDefaultData[key] === 'string' ? 'input' : 'custom';
    result[key] = generateTestId(elementType, `${testIdBase}-${key}`);
  });

  return result;
};

/**
 * Generate test ID for form container
 * @param testIdBase - Base identifier for the form
 */
const generateFormContainerTestId = (testIdBase: string): string => {
  return generateTestId('form', testIdBase);
};

/**
 * Generate test ID for submit button
 * @param testIdBase - Base identifier for the form
 */
const generateSubmitButtonTestId = (testIdBase: string): string => {
  return generateTestId('button', `${testIdBase}-submit`);
};

/**
 * Generate test ID for form error message
 * @param testIdBase - Base identifier for the form
 */
const generateErrorTestId = (testIdBase: string): string => {
  return generateTestId('div', `${testIdBase}-error`);
};

/**
 * Generate all test IDs for a form component
 * @param formDefaultData - Object representing form structure
 * @param testIdBase - Base identifier for the form
 */
export const generateComponentFormTestIds = <T extends Record<string, any>>(
  formDefaultData: T,
  testIdBase: string
) => {
  return {
    FIELD_TEST_IDS: generateFormInputTestIds(formDefaultData, testIdBase),
    FORM_TEST_ID: generateFormContainerTestId(testIdBase),
    SUBMIT_BUTTON_TEST_ID: generateSubmitButtonTestId(testIdBase),
    FORM_ERROR_TEST_ID: generateErrorTestId(testIdBase),
  };
};

// Type helper for the return value
export type ComponentFormTestIds = ReturnType<
  typeof generateComponentFormTestIds
>;

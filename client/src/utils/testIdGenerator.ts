import { FieldConfig, FieldGroupConfig, FieldsConfig } from "@/types/fields_config"


/**
 * HTML element types for test ID generation
 */
export const ElementType = {
  // Text-based inputs
  INPUT_TEXT: 'input-text',
  INPUT_PASSWORD: 'input-password',
  INPUT_EMAIL: 'input-email',
  INPUT_URL: 'input-url',
  INPUT_TEL: 'input-tel',
  INPUT_SEARCH: 'input-search',
  INPUT_NUMBER: 'input-number',
  INPUT_DATE: 'input-date',
  INPUT_DATETIME_LOCAL: 'input-datetime-local',
  INPUT_MONTH: 'input-month',
  INPUT_WEEK: 'input-week',
  INPUT_TIME: 'input-time',
  TEXTAREA: 'textarea',
  
  // Selection inputs
  INPUT_CHECKBOX: 'input-checkbox',
  INPUT_RADIO: 'input-radio',
  SELECT: 'select',
  INPUT_RANGE: 'input-range',
  INPUT_COLOR: 'input-color',
  INPUT_FILE: 'input-file',
  
  // Buttons
  BUTTON: 'button',
  INPUT_BUTTON: 'input-button',
  INPUT_SUBMIT: 'input-submit',
  INPUT_RESET: 'input-reset',
  
  // Links and navigation
  A: 'a',
  NAV: 'nav',
  
  // Form containers
  FORM: 'form',
  FIELDSET: 'fieldset',
  
  // Generic containers and labels
  DIV: 'div',
  SPAN: 'span',
  LABEL: 'label',
  LEGEND: 'legend',
  OPTION: 'option',
  
  // Custom components
  CUSTOM: 'custom'
} as const;

type ElementType = typeof ElementType[keyof typeof ElementType];

/**
 * Field types supported by your form system
 */
 type FieldType =
  | 'text'
  | 'textarea'
  | 'select'
  | 'checkbox'
  | 'file'
  | 'double-select'
  | 'radio'
  | 'date'
  | 'password'
  | 'email'
  | 'number'

/**
 * Factory function to create test IDs based on a project configuration
 * @param config - Object containing action identifiers and their element types
 * @returns Object with test IDs matching the config keys
 */
export const createTestIdsFromConfig = <T extends Record<string, { action: string; element: string }>>(
  config: T
) => {
  const testIds = {} as { [K in keyof T]: string | ((index: number) => string) };
  
  for (const [key, { action, element }] of Object.entries(config)) {
    // Handle selection actions that need indexing
    if (key.startsWith('select') || element === ElementType.SELECT) {
      testIds[key as keyof T] = (index: number) => generateOptionTestId(action, index);
    } else {
      testIds[key as keyof T] = generateTestId(element, action);
    }
  }
  
  return testIds;
};

/**
 * Generate a test ID with proper formatting
 * @param elementType - HTML element type
 * @param identifier - Unique identifier
 * @param suffix - Optional suffix for variations
 */
export  const generateTestId = (
  elementType: ElementType | string, 
  identifier: string,
  suffix?: string
): string => {
  const cleanElementType = elementType.replace(/[^a-zA-Z0-9-]/g, '').toLowerCase()
  const cleanIdentifier = identifier
    .replace(/\s+/g, '-')
    .replace(/[^a-zA-Z0-9-]/g, '')
    .toLowerCase()
  
  const parts = [cleanElementType, cleanIdentifier]
  if (suffix) {
    parts.push(suffix.replace(/[^a-zA-Z0-9-]/g, '').toLowerCase())
  }
  
  return parts.join('-')
}

/**
 * Map FieldType to ElementType for test ID generation
 */
const mapFieldTypeToElementType = (fieldType: FieldType): ElementType => {
  const fieldTypeMap: Record<FieldType, ElementType> = {
    'text': 'input-text',
    'password': 'input-password',
    'email': 'input-email',
    'number': 'input-number',
    'date': 'input-date',
    'file': 'input-file',
    'checkbox': 'input-checkbox',
    'radio': 'input-radio',
    'textarea': 'textarea',
    'select': 'select',
    'double-select': 'select' // Treat double-select as select for test ID purposes
  }
  
  return fieldTypeMap[fieldType] || 'custom'
}

/**
 * Infer element type from form field configuration or value
 */
const inferElementType = (fieldConfig: FieldConfig | any): ElementType => {
  // Handle FieldConfig objects with type property
  if (typeof fieldConfig === 'object' && fieldConfig?.type) {
    if (typeof fieldConfig.type === 'string') {
      return mapFieldTypeToElementType(fieldConfig.type as FieldType)
    }
  }
  
  // Fallback inference based on value type for simple schemas
  if (typeof fieldConfig === 'string') return 'input-text'
  if (typeof fieldConfig === 'number') return 'input-number'
  if (typeof fieldConfig === 'boolean') return 'input-checkbox'
  if (Array.isArray(fieldConfig)) return 'select'
  
  return 'custom'
}

/**
 * Generate test IDs for form fields with enhanced typing
 */
const generateFormInputTestIds = <T>(
  fieldsConfig: FieldsConfig<T>,
  testIdBase: string
): { [K in keyof T]: string } => {
  const result: any = {}

  Object.keys(fieldsConfig).forEach((key) => {
    const fieldConfig = fieldsConfig[key as keyof T]
    const elementType = inferElementType(fieldConfig)
    result[key] = generateTestId(elementType, `${testIdBase}-${key}`)
  })

  return result
}

/**
 * Generate test IDs for form field labels
 */
const generateFormLabelTestIds = <T>(
  fieldsConfig: FieldsConfig<T>,
  testIdBase: string
): { [K in keyof T]: string } => {
  const result: any = {}

  Object.keys(fieldsConfig).forEach((key) => {
    result[key] = generateTestId('label', `${testIdBase}-${key}`)
  })

  return result
}

/**
 * Generate test IDs for form field error messages
 */
const generateFormFieldErrorTestIds = <T>(
  fieldsConfig: FieldsConfig<T>,
  testIdBase: string
): { [K in keyof T]: string } => {
  const result: any = {}

  Object.keys(fieldsConfig).forEach((key) => {
    result[key] = generateTestId('div', `${testIdBase}-${key}`, 'error')
  })

  return result
}

/**
 * Generate test IDs for form field help text
 */
const generateFormFieldHelpTestIds =  <T>(
  fieldsConfig: FieldsConfig<T>,
  testIdBase: string
): { [K in keyof T]: string } => {
  const result: any = {}

  Object.keys(fieldsConfig).forEach((key) => {
    result[key] = generateTestId('div', `${testIdBase}-${key}`, 'help')
  })

  return result
}
/**
 * Utility function to generate option-specific test IDs
 * @param identifier - Base identifier for the option group
 * @param index - Index of the specific option
 * @returns Formatted test ID for the option
 */
export const generateOptionTestId = (identifier: string, index: number): string => {
  return generateTestId(ElementType.OPTION, `${identifier}-${index}`);
};

/**
 * Utility function to generate indexed test IDs for dynamic elements
 * @param elementType - HTML element type
 * @param identifier - Base identifier
 * @param index - Index of the element
 * @returns Formatted test ID with index
 */
export const generateIndexedTestId = (
  elementType: string, 
  identifier: string, 
  index: number
): string => {
  return generateTestId(elementType, `${identifier}-${index}`);
};


/**
 * Generate test IDs for radio button groups
 */
 const generateRadioGroupTestIds = (
  radioName: string,
  options: Array<{ value: string | number; label: string }>,
  testIdBase: string
): Record<string, string> => {
  const result: Record<string, string> = {}
  
  // Container for radio group
  result[`${radioName}_group`] = generateTestId('div', `${testIdBase}-${radioName}`, 'group')
  
  // Individual radio buttons
  options.forEach((option) => {
    const optionKey = `${radioName}_${option.value}`
    result[optionKey] = generateTestId('input-radio', `${testIdBase}-${radioName}`, String(option.value))
  })
  
  return result
}

/**
 * Generate test IDs for field groups (dynamic groups)
 */
//  const generateFieldGroupTestIds = (
//   groupConfig: FieldGroupConfig,
//   testIdBase: string
// ): Record<string, string> => {
//   const result: Record<string, string> = {}
  
//   // Container for the entire field group
//   result[`${groupConfig.groupKey}_container`] = generateTestId('div', `${testIdBase}-${groupConfig.groupKey}`, 'container')
  
//   // Add button for the group
//   result[`${groupConfig.groupKey}_add_button`] = generateTestId('button', `${testIdBase}-${groupConfig.groupKey}`, 'add')
  
//   // Generate test IDs for each field in the group
//   groupConfig.fields.forEach((field, fieldIndex) => {
//     const fieldKey = `${groupConfig.groupKey}_${field.name}`
    
//     // Field container
//     result[`${fieldKey}_container`] = generateTestId('div', `${testIdBase}-${groupConfig.groupKey}-${field.name}`, 'container')
    
//     // Field label
//     result[`${fieldKey}_label`] = generateTestId('label', `${testIdBase}-${groupConfig.groupKey}-${field.name}`)
    
//     // Field input (assuming select based on options presence)
//     const elementType = field.options ? 'select' : 'input-text'
//     result[`${fieldKey}_input`] = generateTestId(elementType, `${testIdBase}-${groupConfig.groupKey}-${field.name}`)
    
//     // Remove button for each field group instance
//     result[`${fieldKey}_remove_button`] = generateTestId('button', `${testIdBase}-${groupConfig.groupKey}-${field.name}`, 'remove')
    
//     // Options for select fields
//     if (field.options) {
//       field.options.forEach((option) => {
//         result[`${fieldKey}_option_${option.id}`] = generateTestId('option', `${testIdBase}-${groupConfig.groupKey}-${field.name}`, String(option.id))
//       })
//     }
//   })
  
//   return result
// }

/**
 * Generate test ID for form container
 */
const generateFormContainerTestId = (testIdBase: string): string => {
  return generateTestId('form', testIdBase)
}

/**
 * Generate test ID for fieldset
 */
const generateFieldsetTestId = (testIdBase: string, fieldsetName: string): string => {
  return generateTestId('fieldset', `${testIdBase}-${fieldsetName}`)
}

/**
 * Generate test IDs for various button types
 */
const generateButtonTestIds = (testIdBase: string) => {
  return {
    SUBMIT: generateTestId('button', `${testIdBase}-submit`),
    RESET: generateTestId('button', `${testIdBase}-reset`),
    CANCEL: generateTestId('button', `${testIdBase}-cancel`),
    SAVE: generateTestId('button', `${testIdBase}-save`),
    DELETE: generateTestId('button', `${testIdBase}-delete`),
    EDIT: generateTestId('button', `${testIdBase}-edit`),
    NEXT: generateTestId('button', `${testIdBase}-next`),
    PREVIOUS: generateTestId('button', `${testIdBase}-previous`),
    ADD: generateTestId('button', `${testIdBase}-add`),
    REMOVE: generateTestId('button', `${testIdBase}-remove`)
  }
}

/**
 * Generate test IDs for navigation links
 */
 const generateNavigationTestIds = (testIdBase: string) => {
  return {
    NAV_CONTAINER: generateTestId('nav', testIdBase),
    HOME_LINK: generateTestId('a', `${testIdBase}-home`),
    BACK_LINK: generateTestId('a', `${testIdBase}-back`),
    FORWARD_LINK: generateTestId('a', `${testIdBase}-forward`),
    BREADCRUMB: generateTestId('nav', `${testIdBase}-breadcrumb`)
  }
}

/**
 * Generate test ID for form loading state
 */
const generateFormLoadingTestId = (testIdBase: string): string => {
  return generateTestId('div', `${testIdBase}-loading`)
}

/**
 * Generate test ID for form success message
 */
const generateFormSuccessTestId = (testIdBase: string): string => {
  return generateTestId('div', `${testIdBase}-success`)
}

/**
 * Generate test ID for form error message
 */
const generateFormErrorTestId = (testIdBase: string): string => {
  return generateTestId('div', `${testIdBase}-error`)
}

/**
 * Generate test ID for form warning message
 */
const generateFormWarningTestId = (testIdBase: string): string => {
  return generateTestId('div', `${testIdBase}-warning`)
}

/**
 * Generate comprehensive test IDs for a form component
 * @param FieldsConfig - Object representing form structure with field configurations
 * @param testIdBase - Base identifier for the form
 * @param options - Additional options for test ID generation
 */
 export const generateComponentFormTestIds = <T>(
  fieldsConfig: FieldsConfig<T>,
  testIdBase: string,
  options?: {
    includeLabels?: boolean
    includeFieldErrors?: boolean
    includeFieldHelp?: boolean
    includeNavigation?: boolean
    includeAllButtons?: boolean
  }
) => {
  const {
    includeLabels = true,
    includeFieldErrors = true,
    includeFieldHelp = false,
    includeNavigation = false,
    includeAllButtons = false
  } = options || {}

  const result = {
    // Core form elements
    FIELD_TEST_IDS: generateFormInputTestIds(fieldsConfig, testIdBase),
    FORM_TEST_ID: generateFormContainerTestId(testIdBase),
    
    // Basic buttons
    SUBMIT_BUTTON_TEST_ID: generateTestId('button', `${testIdBase}-submit`),
    
    // Form state messages
    FORM_ERROR_TEST_ID: generateFormErrorTestId(testIdBase),
    FORM_SUCCESS_TEST_ID: generateFormSuccessTestId(testIdBase),
    FORM_LOADING_TEST_ID: generateFormLoadingTestId(testIdBase),
    FORM_WARNING_TEST_ID: generateFormWarningTestId(testIdBase)
  }

  // Optional additions
  if (includeLabels) {
    Object.assign(result, {
      LABEL_TEST_IDS: generateFormLabelTestIds(fieldsConfig, testIdBase)
    })
  }

  if (includeFieldErrors) {
    Object.assign(result, {
      FIELD_ERROR_TEST_IDS: generateFormFieldErrorTestIds(fieldsConfig, testIdBase)
    })
  }

  if (includeFieldHelp) {
    Object.assign(result, {
      FIELD_HELP_TEST_IDS: generateFormFieldHelpTestIds(fieldsConfig, testIdBase)
    })
  }

  if (includeAllButtons) {
    Object.assign(result, {
      BUTTON_TEST_IDS: generateButtonTestIds(testIdBase)
    })
  }

  if (includeNavigation) {
    Object.assign(result, {
      NAVIGATION_TEST_IDS: generateNavigationTestIds(testIdBase)
    })
  }

  return result
}

/**
 * Generate test IDs for a multi-step form
 */
 const generateMultiStepFormTestIds = <T,U,V>(
  steps: Array<{ name: string; schema: FieldsConfig<T|U|V> }>,
  testIdBase: string
) => {
  const result: any = {
    FORM_TEST_ID: generateFormContainerTestId(testIdBase),
    STEP_INDICATOR_TEST_ID: generateTestId('div', `${testIdBase}-step-indicator`),
    NEXT_BUTTON_TEST_ID: generateTestId('button', `${testIdBase}-next`),
    PREVIOUS_BUTTON_TEST_ID: generateTestId('button', `${testIdBase}-previous`),
    SUBMIT_BUTTON_TEST_ID: generateTestId('button', `${testIdBase}-submit`)
  }

  steps.forEach((step, index) => {
    const stepBase = `${testIdBase}-step-${index + 1}-${step.name}`
    result[`STEP_${index + 1}_TEST_IDS`] = generateComponentFormTestIds(step.schema, stepBase)
    result[`STEP_${index + 1}_CONTAINER_TEST_ID`] = generateTestId('div', stepBase)
  })

  return result
}

/**
 * Utility function to create test ID selectors for testing frameworks
 */
 const createTestIdSelector = (testId: string): string => {
  return `[data-testid="${testId}"]`
}

/**
 * Utility function to create multiple test ID selectors
 */
 const createTestIdSelectors = (testIds: string[]): string => {
  return testIds.map(createTestIdSelector).join(', ')
}


import { ElementType, generateTestId } from "@/utils/testIdGenerator";



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
 * Configuration object that combines actions with their corresponding element types
 * Action defaults to key name unless explicitly specified
 * This allows for easy portability across projects by changing this single object
 */
export const ApplyConfig = {
  // Step 1: Start application
  startApplication: { element: ElementType.BUTTON },
  
  // Step 2: Select level
  selectLevel: { element: ElementType.SELECT },
  
  // Step 3: Search and select program
  clickFilterDropDown:{element:ElementType.BUTTON},
  searchProgram: { element: ElementType.INPUT_SEARCH },
  selectProgram: { element: ElementType.SELECT },
  
  // Step 4: Initiate payment
  initiatePayment: { element: ElementType.BUTTON },
  
  // Step 5: Navigate to dashboard
  navigateToDashboard: { element: ElementType.BUTTON },
  
  // Step 6: Complete application
  navigateToCompleteApplication: { element: ElementType.BUTTON },
  
  // Step 7: Display forms
  displaySSCQualificationForm: { element: ElementType.BUTTON },
  displayBiodataForm: { element: ElementType.BUTTON },
  
  // Additional form actions
  saveSSCQualification: { element: ElementType.BUTTON },
  saveBiodata: { element: ElementType.BUTTON },
  
  // Navigation elements
  navigateToPayments: { element: ElementType.A },
  

  submitApplication: {element: ElementType.BUTTON },
} as const;

/**
 * Factory function to create test IDs based on a project configuration
 * Action defaults to the key name unless explicitly specified
 * @param config - Object containing element types and optional custom actions
 * @returns Object with test IDs matching the config keys
 */
export const createTestIdsFromConfig = <T extends Record<string, { element: string; action?: string }>>(
  config: T
) => {
  const testIds = {} as { [K in keyof T]: string | ((index: number) => string) };
  type IsSelectElement<T> = T extends { element: typeof ElementType.SELECT } ? true : false;
  
  for (const [key, { element, action }] of Object.entries(config)) {
    // Use custom action or default to key name
    const actionName = action || key;
    
    // Handle selection actions that need indexing
    if (key.startsWith('select') || element === ElementType.SELECT) {
      testIds[key as keyof T] = (index: number) => generateOptionTestId(actionName, index);
    } else {
      testIds[key as keyof T] = generateTestId(element, actionName);
    }
  }
  
return testIds as {
    [K in keyof T]: IsSelectElement<T[K]> extends true 
      ? (index: number) => string 
      : string
  };
};

export const ApplicationTestIds = createTestIdsFromConfig(ApplyConfig);
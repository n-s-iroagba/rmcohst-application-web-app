import { createTestIdsFromConfig, ElementType } from "@/test/utils/testIdGenerator";



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
    clickFilterDropDown: { element: ElementType.BUTTON },
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


    submitApplication: { element: ElementType.BUTTON },
} as const;



export const ApplicationTestIds = createTestIdsFromConfig(ApplyConfig);
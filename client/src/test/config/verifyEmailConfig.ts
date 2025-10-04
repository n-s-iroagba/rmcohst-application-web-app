import { ElementType } from "../utils/testIdGenerator";

export const emailVerificationConfig = {
    emailVerificationInput: {
        element: ElementType.INPUT_TEXT, // or whatever your ElementType enum value is
        action: 'emailVerificationDigit', // custom action name
        iterable: true
    },
    // If you have other elements like submit button, container, etc.
    emailVerificationContainer: {
        element: ElementType.DIV,
        action: 'emailVerificationForm'
    },
    // Example submit button if you have one
    emailVerificationSubmit: {
        element: ElementType.BUTTON,
        action: 'submitEmailVerification'
    },
    emailVerificationResend: {
        element: ElementType.BUTTON,
        action: 'emailVerificationResend'
    }
};
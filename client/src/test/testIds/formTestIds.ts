
import { biodataFormConfig } from "../config/applicationFormconfig";
import { forgotPasswordFormConfig, loginFormConfig, resetPasswordFormConfig, signUpFormConfig } from "../config/loginFormConfig";
import { generateComponentFormTestIds } from "../utils/testIdGenerator";

export const loginFormTestIds = generateComponentFormTestIds(loginFormConfig, 'login-form')
export const signUpFormTestIds = generateComponentFormTestIds(signUpFormConfig, 'signup-form')
export const biodataFormTestIds = generateComponentFormTestIds(biodataFormConfig, 'biodata-form')
export const forgotPasswordTestIds = generateComponentFormTestIds(forgotPasswordFormConfig, 'forgotPassword-form')
export const resetPasswordTestIds = generateComponentFormTestIds(resetPasswordFormConfig, 'resetPassword-form')
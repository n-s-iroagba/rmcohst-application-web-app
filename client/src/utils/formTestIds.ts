
import { biodataFormConfig } from "./applicationFormconfig";
import { forgotPasswordFormConfig, loginFormConfig, resetPasswordFormConfig, signUpFormConfig } from "./loginFormConfig";
import { generateComponentFormTestIds } from "./testIdGenerator";

export const loginFormTestIds = generateComponentFormTestIds(loginFormConfig,'login-form')
export const signUpFormTestIds = generateComponentFormTestIds(signUpFormConfig,'signup-form')
export const biodataFormTestIds = generateComponentFormTestIds(biodataFormConfig,'biodata-form')
export const forgotPasswordTestIds = generateComponentFormTestIds(forgotPasswordFormConfig,'forgotPassword-form')
export const resetPasswordTestIds = generateComponentFormTestIds(resetPasswordFormConfig,'resetPassword-form')
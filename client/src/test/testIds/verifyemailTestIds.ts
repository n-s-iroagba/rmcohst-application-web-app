import { emailVerificationConfig } from "../config/verifyEmailConfig";
import { createTestIdsFromConfig } from "../utils/testIdGenerator";

export const emailVerificationTestIds = createTestIdsFromConfig(emailVerificationConfig);
// models/index.ts

// Import base models first (models without foreign keys or with minimal dependencies)
import User from './User'
import Role from './Role'
import Permission from './Permission'
import { Department } from './Department'
import AdmissionSession from './AdmissionSession'

// Import models with dependencies
import Program from './Program'
import ProgramSession from './ProgramSession'
import ProgramSpecificRequirement from './ProgramSpecificRequirement'
import { ProgramSSCRequirement } from './ProgramSSCRequirement'

// Import models with more complex dependencies
import { Application } from './Application'
import Biodata from './Biodata'
import ApplicantSSCQualification from './ApplicantSSCQualification'
import ApplicantProgramSpecificQualification from './ApplicantProgramSpecificQualification'

// Import junction tables
import RolePermission from './RolePermission'
import UserRole from './UserRole'

// Setup associations after all models are imported
import setupAssociations from './associations'
setupAssociations()

// Export all models
export {
  // Base models
  User,
  Role,
  Permission,
  Department,
  AdmissionSession,
  
  // Program-related models
  Program,
  ProgramSession,
  ProgramSpecificRequirement,
  ProgramSSCRequirement,
  
  // Application-related models
  Application,
  Biodata,
  ApplicantSSCQualification,
  ApplicantProgramSpecificQualification,
  
  // Junction tables
  RolePermission,
  UserRole,
}
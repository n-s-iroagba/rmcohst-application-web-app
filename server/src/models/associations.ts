// models/associations.ts

import AdmissionSession from './AdmissionSession'
import ApplicantProgramSpecificQualification from './ApplicantProgramSpecificQualification'
import ApplicantSSCQualification, { SSCQualification } from './ApplicantSSCQualification'
import { Application } from './Application'
import Biodata from './Biodata'
import { Department } from './Department'
import Permission from './Permission'
import Program from './Program'
import ProgramSession from './ProgramSession'
import ProgramSpecificRequirement from './ProgramSpecificRequirement'
import { ProgramSSCRequirement } from './ProgramSSCRequirement'
import Role from './Role'
import RolePermission from './RolePermission'
import Subject from './Subject'
import User from './User'

export default function setupAssociations() {
  // User-Role associations
  User.hasOne(Role, {
    as: 'role',
  })

  Role.hasMany(User, {
    foreignKey: 'roleId',
    as: 'users',
  })

  // Role-Permission associations
  Role.belongsToMany(Permission, {
    through: RolePermission,
    foreignKey: 'roleId',
    otherKey: 'permissionId',
    as: 'permissions',
  })

  Permission.belongsToMany(Role, {
    through: RolePermission,
    foreignKey: 'permissionId',
    otherKey: 'roleId',
    as: 'roles',
  })

  // Department-Program associations
  Department.hasMany(Program, {
    foreignKey: 'departmentId',
    as: 'programs',
    onDelete: 'RESTRICT',
    onUpdate: 'CASCADE',
  })

  Program.belongsTo(Department, {
    foreignKey: 'departmentId',
    as: 'department',
    onDelete: 'RESTRICT',
    onUpdate: 'CASCADE',
  })

  // Program-Session Many-to-Many associations
  Program.belongsToMany(AdmissionSession, {
    through: ProgramSession,
    foreignKey: 'programId',
    otherKey: 'sessionId',
    as: 'sessions',
  })

  AdmissionSession.belongsToMany(Program, {
    through: ProgramSession,
    foreignKey: 'sessionId',
    otherKey: 'programId',
    as: 'programs',
  })

  // Direct associations with junction table
  Program.hasMany(ProgramSession, {
    foreignKey: 'programId',
    as: 'programSessions',
  })

  ProgramSession.belongsTo(Program, {
    foreignKey: 'programId',
    as: 'program',
  })

  AdmissionSession.hasMany(ProgramSession, {
    foreignKey: 'sessionId',
    as: 'programSessions',
  })

  ProgramSession.belongsTo(AdmissionSession, {
    foreignKey: 'sessionId',
    as: 'session',
  })

  // Program-Specific Requirements associations
  Program.hasMany(ProgramSpecificRequirement, {
    foreignKey: 'programId',
    as: 'specificRequirements',
    onDelete: 'CASCADE',
    onUpdate: 'CASCADE',
  })

  ProgramSpecificRequirement.belongsTo(Program, {
    foreignKey: 'programId',
    as: 'program',
    onDelete: 'CASCADE',
    onUpdate: 'CASCADE',
  })

  // Program SSC Requirements associations
  Program.hasMany(ProgramSSCRequirement, {
    foreignKey: 'programId',
    as: 'sscRequirements',
    onDelete: 'CASCADE',
    onUpdate: 'CASCADE',
  })

  ProgramSSCRequirement.belongsTo(Program, {
    foreignKey: 'programId',
    as: 'program',
    onDelete: 'CASCADE',
    onUpdate: 'CASCADE',
  })

  // Application associations
  Application.belongsTo(User, {
    foreignKey: 'applicantUserId',
    as: 'user',
    onDelete: 'NO ACTION',
    onUpdate: 'CASCADE',
  })

  Application.belongsTo(User, {
    foreignKey: 'assignedOfficerId',
    as: 'assignedOfficer',
    onDelete: 'SET NULL',
    onUpdate: 'CASCADE',
  })

  Application.belongsTo(Program, {
    foreignKey: 'programId',
    as: 'program',
    onDelete: 'SET NULL',
    onUpdate: 'CASCADE',
  })

  Application.belongsTo(AdmissionSession, {
    foreignKey: 'sessionId',
    as: 'academicSession',
    onDelete: 'NO ACTION',
    onUpdate: 'CASCADE',
  })

  // Biodata associations
  Application.hasOne(Biodata, {
    foreignKey: 'applicationId',
    as: 'biodata',
    onDelete: 'CASCADE',
  })

  Biodata.belongsTo(Application, {
    foreignKey: 'applicationId',
    as: 'application',
    onDelete: 'CASCADE',
  })

  // SSC Qualification associations
  Application.hasOne(ApplicantSSCQualification, {
    foreignKey: 'applicationId',
    as: 'sscQualification',
    onDelete: 'CASCADE',
  })

  ApplicantSSCQualification.belongsTo(Application, {
    foreignKey: 'applicationId',
    as: 'application',
    onDelete: 'CASCADE',
  })

  // Program Specific Qualifications associations
  Application.hasMany(ApplicantProgramSpecificQualification, {
    foreignKey: 'applicationId',
    as: 'programSpecificQualifications',
    onDelete: 'CASCADE',
  })

  ApplicantProgramSpecificQualification.belongsTo(Application, {
    foreignKey: 'applicationId',
    as: 'application',
    onDelete: 'CASCADE',
  })

  SSCQualification.hasMany(Subject, {
    foreignKey: 'firstSubjectId',
    as: 'firstSubject',
  })
  SSCQualification.hasMany(Subject, {
    foreignKey: 'secondSubjectId',
    as: 'secondSubject',
  })
  SSCQualification.hasMany(Subject, {
    foreignKey: 'thirdSubjectId',
    as: 'thirdSubject',
  })
  SSCQualification.hasMany(Subject, {
    foreignKey: 'alternateThirdSubjectId',
    as: 'alternateThirdSubject',
  })
  SSCQualification.hasMany(Subject, {
    foreignKey: 'fourthSubjectId',
    as: 'fourthSubject',
  })

  SSCQualification.hasMany(Subject, {
    foreignKey: 'alternateFourthSubjectId',
    as: 'alternateFourthSubject',
  })
  SSCQualification.hasMany(Subject, {
    foreignKey: 'fifthSubjectId',
    as: 'fifthSubject',
  })

  //   CertificateFile.belongsTo(SSCQualification, {
  //     foreignKey: 'sscQualificationId',
  //     as: 'sscQualification'
  //   })

  // Reverse associations
  User.hasMany(Application, {
    foreignKey: 'applicantUserId',
    as: 'applications',
  })

  User.hasMany(Application, {
    foreignKey: 'assignedOfficerId',
    as: 'assignedApplications',
  })

  Program.hasMany(Application, {
    foreignKey: 'programId',
    as: 'applications',
  })

  AdmissionSession.hasMany(Application, {
    foreignKey: 'sessionId',
    as: 'applications',
  })
}


import { ProgramSpecificRequirementCreationDto } from "./program_specific_requirement";
import { SSCSubjectMinimumGradeCreationDto } from "./ssc_subject_minimum_grade";

export type ProgramLevel = 'OND' | 'HND' | 'Certificate';

export interface Program {
  id: string;
  departmentId: number;
    name: string;
    awardType: string;
    durationType: 'WEEK' | 'MONTH' | 'YEAR';
    duration: number;
    applicationFeeInNaira: number;
    acceptanceFeeInNaira: number;
    description?: string;
    isActive: boolean;
    createdAt: Date;
    updatedAt: Date;
}

export interface ProgramFilters {
  faculty?: string;
  department?: string;
  level?: ProgramLevel;
  searchTerm?: string;
}

export type ProgramCreationDto = {
    name: string;
    awardType: string;
    durationType: 'WEEK' | 'MONTH' | 'YEAR';
    duration: number;
    applicationFeeInNaira: number;
    acceptanceFeeInNaira: number;
    description?: string;
    isUsingPreexistingSSCRequirements:boolean
    isUsingPreexistingProgramSpecificRequirements:boolean
    sscRequirements?:SSCSubjectMinimumGradeCreationDto[]  
    programSpecificRequirements?: ProgramSpecificRequirementCreationDto[]

}
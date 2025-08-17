// src/repositories/ApplicationRepository.ts

import { fn, col } from 'sequelize'
import {
  ApplicantSSCQualification,
  Application,
  Biodata,
  ApplicantProgramSpecificQualification,
} from '../models'
import AdmissionSession from '../models/AdmissionSession'
import { Department } from '../models/Department'
import Program from '../models/Program'


import User from '../models/User'

import BaseRepository from './BaseRepository'
import { ApplicationCreationAttributes, ApplicationStatus } from '../models/Application'
import { FullApplication } from '../types/join-model.types'

interface ApplicationFilters {
  status?: string
  academicSessionId?: string
  StaffId?: string
  unassigned?: boolean
  page?: number
  limit?: number
}

class ApplicationRepository extends BaseRepository<Application> {
  constructor() {
    super(Application)
  }

  async createApplication(data: ApplicationCreationAttributes): Promise<Application> {
    return await this.create(data)
  }

  async findApplicationByUserAndSession(applicantUserId: number, sessionId: number): Promise<Application | null> {
    return await this.findOne({ applicantUserId, sessionId })
  }

  async findApplicationById(id: number | string): Promise<FullApplication | null> {
    const include = [
      { model: User, as: 'user' },
      { model: Program, as: 'program' },
      { model: AdmissionSession, as: 'academicSession' },
      { model: Biodata, as: 'biodata' },
      {
        model: ApplicantProgramSpecificQualification,
        as: 'programSpecificQualifications',
      },
      { model: ApplicantSSCQualification, as: 'sscQualification' },
    ]
    return await this.findById(id, { include }) as FullApplication | null
  }

  async findApplicationByUserId(userId: string): Promise<FullApplication | null> {
    const include = [
      { model: User, as: 'user' },
      { model: Program, as: 'program' },
      { model: AdmissionSession, as: 'academicSession' },
      { model: Biodata, as: 'biodata' },
      {
        model: ApplicantProgramSpecificQualification,
        as: 'programSpecificQualifications',
      },
      { model: ApplicantSSCQualification, as: 'sscQualification' },
    ]
    return await this.findOne({ applicantUserId: userId }, { include }) as FullApplication | null
  }

  async findAllApplicationsFiltered(filters: ApplicationFilters) {
    const { status, academicSessionId, StaffId, unassigned } = filters

    const whereClause: any = {}
    if (status) whereClause.status = status
    if (academicSessionId) whereClause.academicSessionId = academicSessionId

    if (unassigned) {
      whereClause.assignedOfficerId = null
    } else if (StaffId) {
      whereClause.assignedOfficerId = StaffId
    }

    const include = [
      { model: User, as: 'applicant', attributes: ['id', 'email', 'firstName', 'lastName'] },
      { model: Program, as: 'program', include: [{ model: Department, as: 'department' }] },
      { model: Biodata, as: 'biodata', attributes: ['firstName', 'lastName'] },
      { model: AdmissionSession, as: 'academicSession' },
      {
        model: User,
        as: 'assignedOfficer',
        
      },
    ]

    const options = {
      where: whereClause,
      include,
      order: [['updatedAt', 'DESC']] as any,
    }

    // Use findAndCountAll directly for complex queries
    const { count, rows } = await this.model.findAndCountAll(options)

    return {
      applications: rows,
      total: count,
    }
  }

  async updateApplicationById(id: string | number, updates: Partial<Application>): Promise<Application | null> {
    return await this.updateById(id, updates)
  }

  async getApplicationCountsByStatus(academicSessionId?: string) {
    const whereClause: any = {}
    if (academicSessionId) {
      whereClause.academicSessionId = academicSessionId
    }

    const counts = await this.model.findAll({
      attributes: ['status', [fn('COUNT', col('id')), 'count']],
      where: whereClause,
      group: ['status'],
      raw: true,
    })

    return counts as unknown as Array<{ status: ApplicationStatus; count: string }>
  }





}

export default new ApplicationRepository()
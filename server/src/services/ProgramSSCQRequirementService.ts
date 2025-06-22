// services/ProgramSSCRequirementService.ts
import { Op, Transaction } from 'sequelize'
import ProgramSSCRequirement from '../models/ProgramSSCRequirement'
import SSCSubjectMinimumGrade from '../models/SSCSubjectMinimumGrade'

import Grade from '../models/Grade'
import SSCSubject from '../models/SSCSubject'

interface MinimumSCCSubjectGrade {
  subjectId: number
  gradeId: number
  alternativeSubjectId?: number
}

class ProgramSSCRequirementService {
  // Bulk Create with associated subjects
  async createWithSubjects(
    sscSubjectRequirements: MinimumSCCSubjectGrade[],
    programId: number,
    maximumNumberOfSittings: number,
    qualificationTypes: string[]
  ): Promise<ProgramSSCRequirement> {
    try {
      const newRequirement = await ProgramSSCRequirement.create({
        maximumNumberOfSittings,
        programId,
        qualificationTypes,
      })
      const creationData = sscSubjectRequirements.map(requirement => ({
        ...requirement,
        programSSCRequirementId: newRequirement.id,
      }))
      await SSCSubjectMinimumGrade.bulkCreate(creationData)
      return newRequirement
    } catch (error) {
      throw error
    }
  }
  // Bulk Read with filters
  async getGetRequirements(
    filters: {
      programIds?: number[]
      qualificationTypes?: string[]

      limit?: number
      offset?: number
    } = {}
  ): Promise<ProgramSSCRequirement[]> {
    const whereClause: any = {}

    if (filters.programIds && filters.programIds.length > 0) {
      whereClause.programId = filters.programIds
    }

    if (filters.qualificationTypes && filters.qualificationTypes.length > 0) {
      whereClause.qualificationTypes = {
        [Op.overlap]: filters.qualificationTypes,
      }
    }

    const includeOptions = [
      {
        model: SSCSubjectMinimumGrade,
        as: 'sscSubjectMinimumGrades',
        attributes: ['subjectId', 'gradeId'],
        include: [
          { model: SSCSubject, as: 'subject' },
          { model: Grade, as: 'grade' },
        ],
      },
    ]
    try {
      return await ProgramSSCRequirement.findAll({
        where: whereClause,
        include: includeOptions,
        limit: filters.limit,
        offset: filters.offset,
        order: [['id', 'ASC']],
      })
    } catch (error) {
      throw error
    }
  }
}

export default new ProgramSSCRequirementService()

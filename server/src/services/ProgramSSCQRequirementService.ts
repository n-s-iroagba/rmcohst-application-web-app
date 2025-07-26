import { Op } from 'sequelize'
import {
  ProgramSSCRequirement,
  Grade,
  QualificationType,
  SubjectRequirement,
} from '../models/ProgramSSCRequirement'

// Request interfaces
export interface CreateSSCRequirementRequest {
  programId: number
  tag: string
  maximumSittings?: number
  qualificationTypes?: QualificationType[]
  subjects: {
    subjectId: number
    grade: string // Grade as string from request
    alternateSubjectId?: number
  }[]
}

export interface BulkCreateSSCRequirementRequest {
  requirements: CreateSSCRequirementRequest[]
}

export interface FetchAllSSCRequirementsQuery {
  page?: number
  limit?: number
  programId?: number
  tag?: string
}

export interface PaginatedResponse<T> {
  data: T[]
  pagination: {
    page: number
    limit: number
    total: number
    totalPages: number
    hasNext: boolean
    hasPrev: boolean
  }
}

export class ProgramSSCRequirementService {
  /**
   * Validate and convert grade string to Grade enum
   */
  private static validateGrade(gradeString: string): Grade {
    const grade = gradeString.toUpperCase() as Grade
    if (!Object.values(Grade).includes(grade)) {
      throw new Error(
        `Invalid grade: ${gradeString}. Must be one of: ${Object.values(Grade).join(', ')}`
      )
    }
    return grade
  }

  /**
   * Transform request subjects to model format
   */
  private static transformSubjects(
    subjects: CreateSSCRequirementRequest['subjects']
  ): SubjectRequirement[] {
    return subjects.map(subject => ({
      subjectId: subject.subjectId,
      grade: this.validateGrade(subject.grade),
      ...(subject.alternateSubjectId && { alternateSubjectId: subject.alternateSubjectId }),
    }))
  }

  /**
   * Validate subject IDs exist in database
   */
  private static async validateSubjectIds(subjectIds: number[]): Promise<void> {
    // Assuming you have a Subject model - replace with your actual Subject model
    // const Subject = require('./Subject'); // Import your Subject model

    // const existingSubjects = await Subject.findAll({
    //   where: { id: { [Op.in]: subjectIds } },
    //   attributes: ['id']
    // });

    // if (existingSubjects.length !== subjectIds.length) {
    //   const foundIds = existingSubjects.map(s => s.id);
    //   const missingIds = subjectIds.filter(id => !foundIds.includes(id));
    //   throw new Error(`Subject IDs not found: ${missingIds.join(', ')}`);
    // }

    // For now, just basic validation
    const invalidIds = subjectIds.filter(id => !Number.isInteger(id) || id <= 0)
    if (invalidIds.length > 0) {
      throw new Error(`Invalid subject IDs: ${invalidIds.join(', ')}`)
    }
  }

  /**
   * Create multiple SSC requirements
   */
  static async bulkCreate(data: BulkCreateSSCRequirementRequest): Promise<ProgramSSCRequirement[]> {
    try {
      const transformedData = await Promise.all(
        data.requirements.map(async req => {
          // Validate subjects
          const subjects = this.transformSubjects(req.subjects)
          const allSubjectIds = subjects
            .flatMap(s => [s.subjectId, s.alternateSubjectId])
            .filter(Boolean)
          await this.validateSubjectIds(allSubjectIds as number[])

          return {
            programId: req.programId,
            tag: req.tag,
            maximumSittings: req.maximumSittings || 2,
            qualificationTypes: req.qualificationTypes || [QualificationType.WAEC],
            subjects,
          }
        })
      )

      const created = await ProgramSSCRequirement.bulkCreate(transformedData, {
        validate: true,
        returning: true,
      })

      return created
    } catch (error) {
      throw new Error(`Bulk create failed`)
    }
  }

  /**
   * Fetch all SSC requirements with pagination
   */
  static async fetchAll(
    query: FetchAllSSCRequirementsQuery = {}
  ): Promise<PaginatedResponse<ProgramSSCRequirement>> {
    try {
      const page = Math.max(1, query.page || 1)
      const limit = Math.min(100, Math.max(1, query.limit || 10))
      const offset = (page - 1) * limit

      // Build where conditions
      const whereConditions: any = {}

      if (query.programId) {
        whereConditions.programId = query.programId
      }

      if (query.tag) {
        whereConditions.tag = { [Op.iLike]: `%${query.tag}%` }
      }

      const { count, rows } = await ProgramSSCRequirement.findAndCountAll({
        where: whereConditions,
        limit,
        offset,
        order: [['createdAt', 'DESC']],
        // Uncomment if you want to include related models
        // include: [
        //   {
        //     model: Program,
        //     as: 'program',
        //     attributes: ['id', 'name']
        //   }
        // ]
      })

      const totalPages = Math.ceil(count / limit)

      return {
        data: rows,
        pagination: {
          page,
          limit,
          total: count,
          totalPages,
          hasNext: page < totalPages,
          hasPrev: page > 1,
        },
      }
    } catch (error) {
      throw new Error(`Fetch all failed`)
    }
  }

  /**
   * Fetch one SSC requirement by ID
   */
  static async fetchOne(id: number): Promise<ProgramSSCRequirement | null> {
    try {
      if (!Number.isInteger(id) || id <= 0) {
        throw new Error('Invalid ID provided')
      }

      const requirement = await ProgramSSCRequirement.findByPk(id, {
        // Uncomment if you want to include related models
        // include: [
        //   {
        //     model: Program,
        //     as: 'program',
        //     attributes: ['id', 'name']
        //   }
        // ]
      })

      return requirement
    } catch (error) {
      throw new Error(`Fetch one failed`)
    }
  }

  /**
   * Delete SSC requirement by ID
   */
  static async delete(id: number): Promise<boolean> {
    try {
      if (!Number.isInteger(id) || id <= 0) {
        throw new Error('Invalid ID provided')
      }

      const requirement = await ProgramSSCRequirement.findByPk(id)

      if (!requirement) {
        return false // Not found
      }

      await requirement.destroy()
      return true
    } catch (error) {
      throw new Error(`Delete failed`)
    }
  }

  /**
   * Update SSC requirement by ID
   */
  static async update(
    id: number,
    data: Partial<CreateSSCRequirementRequest>
  ): Promise<ProgramSSCRequirement | null> {
    try {
      if (!Number.isInteger(id) || id <= 0) {
        throw new Error('Invalid ID provided')
      }

      const requirement = await ProgramSSCRequirement.findByPk(id)

      if (!requirement) {
        return null
      }

      const updateData: any = {}

      if (data.programId) updateData.programId = data.programId
      if (data.tag) updateData.tag = data.tag
      if (data.maximumSittings) updateData.maximumSittings = data.maximumSittings
      if (data.qualificationTypes) updateData.qualificationTypes = data.qualificationTypes

      if (data.subjects) {
        const subjects = this.transformSubjects(data.subjects)
        const allSubjectIds = subjects
          .flatMap(s => [s.subjectId, s.alternateSubjectId])
          .filter(Boolean)
        await this.validateSubjectIds(allSubjectIds as number[])
        updateData.subjects = subjects
      }

      await requirement.update(updateData)
      return requirement
    } catch (error) {
      throw new Error(`Update failed`)
    }
  }

  /**
   * Get requirements by program ID
   */
  static async getByProgramId(programId: number): Promise<ProgramSSCRequirement[]> {
    try {
      if (!Number.isInteger(programId) || programId <= 0) {
        throw new Error('Invalid program ID provided')
      }

      return await ProgramSSCRequirement.findAll({
        where: { programId },
        order: [['createdAt', 'DESC']],
      })
    } catch (error) {
      throw new Error(`Get by program ID failed`)
    }
  }
}

// Usage examples:
/*
// Bulk create
const bulkData = {
  requirements: [
    {
      programId: 1,
      tag: 'Engineering Requirements',
      maximumSittings: 2,
      qualificationTypes: [QualificationType.WAEC, QualificationType.NECO],
      subjects: [
        { subjectId: 1, grade: 'C6' },
        { subjectId: 2, grade: 'C6' },
        { subjectId: 3, grade: 'C6', alternateSubjectId: 4 },
        { subjectId: 5, grade: 'C6' },
        { subjectId: 6, grade: 'C6' }
      ]
    }
  ]
};

const created = await ProgramSSCRequirementService.bulkCreate(bulkData);

// Fetch all with pagination
const results = await ProgramSSCRequirementService.fetchAll({
  page: 1,
  limit: 10,
  programId: 1
});

// Fetch one
const requirement = await ProgramSSCRequirementService.fetchOne(1);

// Delete
const deleted = await ProgramSSCRequirementService.delete(1);
*/

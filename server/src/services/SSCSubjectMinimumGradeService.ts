// services/SSCSubjectMinimumGradeService.ts
import { Transaction,Op } from "sequelize";
import sequelize from "../config/database";
import SSCSubjectMinimumGrade from "../models/SSCSubjectMinimumGrade";
import ProgramSSCRequirement from "../models/ProgramSSCRequirement";

import SSCSubject from "../models/SSCSubject";
import Grade from "../models/Grade";


interface BulkCreateSSCSubjectMinimumGradeData {
  subjectId: number;
  gradeId: number;
  alternativeSubjectId?: number;
}

interface BulkUpdateSSCSubjectMinimumGradeData {
  id: number;
  subjectId?: number;
  gradeId?: number;
  alternativeSubjectId?: number;
}

class SSCSubjectMinimumGradeService {
  





  // Find by program qualification
  async findByProgramQualification(
    programQualificationId: number,

  ): Promise<SSCSubjectMinimumGrade[]> {
    const whereClause: any = {};
    
   
    return await SSCSubjectMinimumGrade.findAll({
      include: [
        {
          model: ProgramSSCRequirement,
          as: 'programSSCQualifications',
          where: { id: programQualificationId },
        },
        {
          model: SSCSubject,
          as: 'subject',
        },
        {
          model: Grade,
          as: 'grade',
        },
      ],
      where: whereClause,
    });
  }

  // Bulk upsert (create or update)
  async bulkUpsert(
    data: BulkCreateSSCSubjectMinimumGradeData[],
    transaction?: Transaction
  ): Promise<SSCSubjectMinimumGrade[]> {
    const t = transaction || await sequelize.transaction();
    
    try {
      const results: SSCSubjectMinimumGrade[] = [];
      
      for (const item of data) {
        const [record, created] = await SSCSubjectMinimumGrade.findOrCreate({
          where: {
            subjectId: item.subjectId,
            gradeId: item.gradeId,
          },
          defaults: item,
          transaction: t,
        });
        
        if (!created && item.alternativeSubjectId !== undefined) {
          // Update alternative subject if record exists
          await record.update(
            { alternativeSubjectId: item.alternativeSubjectId },
            { transaction: t }
          );
        }
        
        results.push(record);
      }
      
      if (!transaction) await t.commit();
      return results;
    } catch (error) {
      if (!transaction) await t.rollback();
      throw error;
    }
  }

  // Get statistics
  async getStatistics(): Promise<{
    totalSubjectMinimumGrades: number;
    subjectDistribution: { subjectId: number; count: number }[];
    gradeDistribution: { gradeId: number; count: number }[];
    alternativeSubjectsCount: number;
  }> {
    const total = await SSCSubjectMinimumGrade.count();
    
    const subjectDistribution = await SSCSubjectMinimumGrade.findAll({
      attributes: [
        'subjectId',
        [sequelize.fn('COUNT', sequelize.col('id')), 'count']
      ],
      group: ['subjectId'],
      raw: true,
    }) as any[];
    
    const gradeDistribution = await SSCSubjectMinimumGrade.findAll({
      attributes: [
        'gradeId',
        [sequelize.fn('COUNT', sequelize.col('id')), 'count']
      ],
      group: ['gradeId'],
      raw: true,
    }) as any[];
    
    const alternativeSubjectsCount = await SSCSubjectMinimumGrade.count({
      where: {
        alternativeSubjectId: {
          [Op.ne]: undefined,
        },



        
      },
    });

    return {
      totalSubjectMinimumGrades: total,
      subjectDistribution: subjectDistribution.map(item => ({
        subjectId: item.subjectId,
        count: parseInt(item.count),
      })),
      gradeDistribution: gradeDistribution.map(item => ({
        gradeId: item.gradeId,
        count: parseInt(item.count),
      })),
      alternativeSubjectsCount,
    };
  }
}

export default new SSCSubjectMinimumGradeService();
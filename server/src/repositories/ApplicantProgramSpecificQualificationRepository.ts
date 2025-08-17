// src/repositories/ApplicantProgramSpecificQualificationRepository.ts


import { where } from 'sequelize'
import { ApplicantProgramSpecificQualification } from '../models'
import { ApplicantProgramSpecificQualificationCreationAttributes } from '../models/ApplicantProgramSpecificQualification'
import BaseRepository from './BaseRepository'


class ApplicantProgramSpecificQualificationRepository extends BaseRepository<ApplicantProgramSpecificQualification> {
    constructor() {
        super(ApplicantProgramSpecificQualification)
    }

    async createApplicantProgramSpecificQualification(data: ApplicantProgramSpecificQualificationCreationAttributes): Promise<ApplicantProgramSpecificQualification> {
        return await this.create(data)
    }


  async findProgramSpecificQualificationsByApplication(applicationId:number):Promise<ApplicantProgramSpecificQualification[]>{
    return (await this.findAll({where:{applicationId}})).data
  }

    async updateApplicantProgramSpecificQualification(id: number, updates: Partial<ApplicantProgramSpecificQualification>): Promise<ApplicantProgramSpecificQualification | null> {
        return await this.updateById(id, updates)
    }

   
}

export default new ApplicantProgramSpecificQualificationRepository()
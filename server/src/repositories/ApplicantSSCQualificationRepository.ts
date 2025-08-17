// src/repositories/ApplicantSSCQualificationRepository.ts


import { ApplicantSSCQualification } from '../models'
import BaseRepository from './BaseRepository'


class ApplicantSSCQualificationRepository extends BaseRepository<ApplicantSSCQualification> {
    constructor() {
        super(ApplicantSSCQualification)
    }

    async createApplicantSSCQualification(data: {applicationId:number}): Promise<ApplicantSSCQualification> {
        return await this.create(data)
    }


  async findSSCQualificationByApplication(applicationId:number): Promise<ApplicantSSCQualification|null>{
    return this.findOne({applicationId})
  }

    async updateApplicantSSCQualification(id: number, updates: Partial<ApplicantSSCQualification>): Promise<ApplicantSSCQualification | null> {
        return await this.updateById(id, updates)
    }

   
}

export default new ApplicantSSCQualificationRepository()
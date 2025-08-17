// src/repositories/BiodataRepository.ts


import { Biodata } from '../models'
import { BiodataCreationAttributes } from '../models/Biodata'
import BaseRepository from './BaseRepository'


class BiodataRepository extends BaseRepository<Biodata> {
    constructor() {
        super(Biodata)
    }

    async createBiodata(data: BiodataCreationAttributes): Promise<Biodata> {
        return await this.create(data)
    }


   async findBiodataByApplication(applicationId:number):Promise<Biodata|null>{
          return await this.findOne({applicationId})
   }

    async updateBiodata(id: number, updates: Partial<Biodata>): Promise<Biodata | null> {
        return await this.updateById(id, updates)
    }

   
}

export default new BiodataRepository()
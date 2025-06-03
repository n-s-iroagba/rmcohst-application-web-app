
import Biodata from "../models/Biodata";
import { AppError } from "../utils/error/AppError";
import logger from "../utils/logger/logger";

class BiodataService {
  // CREATE
  static async createBiodata(data: {
    applicationId: number;
  }) {
    try {
      const biodata = await Biodata.create(data);
      logger.info('Created biodata', { id: biodata.id });
      return biodata;
    } catch (error) {
      logger.error('Failed to create biodata', { error });
      throw new AppError('Could not create biodata', 500);
    }
  }

  // READ ONE by applicationId
  static async getBiodataByApplicationId(applicationId: string) {
    try {
      const biodata = await Biodata.findOne({ where: { applicationId } });

      if (!biodata) {
        throw new AppError('Biodata not found for application', 404);
      }

      logger.info('Fetched biodata for application', { applicationId });
      return biodata;
    } catch (error) {
      logger.error('Failed to fetch biodata', { error, applicationId });
      throw error instanceof AppError ? error : new AppError('Error retrieving biodata', 500);
    }
  }

  // UPDATE
  static async updateBiodata(
    applicationId: string,
    updates: Partial<{
      firstName: string;
      middleName?: string | null;
      surname: string;
      gender: string;
      dateOfBirth: Date;
      maritalStatus: string;
      homeAddress: string;
      nationality: string;
      stateOfOrigin: string;
      lga: string;
      homeTown: string;
      phoneNumber: string;
      emailAddress: string;
      passportPhotograph: string;
      nextOfKinFullName: string;
      nextOfKinPhoneNumber: string;
      nextOfKinAddress: string;
      relationshipWithNextOfKin: string;
    }>
  ) {
    try {
      const biodata = await Biodata.findOne({ where: { applicationId } });
      if (!biodata) {
        throw new AppError('Biodata not found for application', 404);
      }

      await biodata.update(updates);
      logger.info('Updated biodata', { id: biodata.id });
      return biodata;
    } catch (error) {
      logger.error(`Failed to update biodata for application ${applicationId}`, { error });
      throw error instanceof AppError ? error : new AppError('Error updating biodata', 500);
    }
  }
}

export default BiodataService;

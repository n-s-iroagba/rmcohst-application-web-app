import { Optional, Model, DataTypes, HasManyGetAssociationsMixin } from "sequelize";

import { Application } from "./Application";
import sequelize from "../config/database";
import ApplicantSSCSubjectAndGrade from "./ApplicantSSCSubjectAndGrade";


// ApplicantSSCQualification Model
interface ApplicantSSCQualificationAttributes {
  id: number;
  applicationId: number;
  numberOfSittings: number;
  certificateTypes: string[];
  certificates: Buffer[]; // Base64 encoded files or file paths

  createdAt?: Date;
  updatedAt?: Date;
}

interface ApplicantSSCQualificationCreationAttributes {
  applicationId:number
}

class ApplicantSSCQualification extends Model<
  ApplicantSSCQualificationAttributes, 
  ApplicantSSCQualificationCreationAttributes
> implements ApplicantSSCQualificationAttributes {
  public id!: number;
  public applicationId!: number;
  public numberOfSittings!: number;
  public certificateTypes!: string[];
  public certificates!: Buffer[]; 
  public getApplicantSubjectAndGrades!:HasManyGetAssociationsMixin<ApplicantSSCSubjectAndGrade>

  public readonly createdAt!: Date;
  public readonly updatedAt!: Date;

  // Method to check if SSC qualification is complete  
  public isComplete(): boolean {
    return !!(
      this.numberOfSittings &&
      this.certificateTypes?.length > 0 &&
      this.certificates?.length > 0 &&
      this.certificateTypes.length === this.certificates.length // Ensure matching counts
    );
  }

  // Method to validate certificate types
  public hasValidCertificateTypes(): boolean {
    const validTypes = ['WAEC', 'NECO', 'GCE', 'NABTEB'];
    return this.certificateTypes.every(type => validTypes.includes(type));
  }

  // Method to get certificate count
  public getCertificateCount(): number {
    return this.certificates?.length || 0;
  }
}

ApplicantSSCQualification.init({
  id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true,
  },
  applicationId: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: Application,
      key: 'id',
    },
    onUpdate: 'CASCADE',
    onDelete: 'CASCADE',
  },
  numberOfSittings: {
    type: DataTypes.INTEGER,
    allowNull: true,
    validate: {
      min: 1,
      max: 2, 
    },
  },
  certificateTypes: {
    type: DataTypes.JSON,
    allowNull: true,
    validate: {
      isValidArray(value: any) {
        if (!Array.isArray(value) || value.length === 0) {
          throw new Error('Certificate types must be a non-empty array');
        }
        // Validate certificate types
        const validTypes = ['WAEC', 'NECO', 'GCE', 'NABTEB'];
        const invalidTypes = value.filter((type: string) => !validTypes.includes(type));
        if (invalidTypes.length > 0) {
          throw new Error(`Invalid certificate types: ${invalidTypes.join(', ')}`);
        }
      },
    },
  },
  certificates: {
    type: DataTypes.JSON,
    allowNull: false,
    validate: {
      isValidArray(value: any) {
        if (!Array.isArray(value) || value.length === 0) {
          throw new Error('Certificates must be a non-empty array');
        }
        // Validate that all certificates are strings (base64 or file paths)
        const invalidCertificates = value.filter((cert: any) => typeof cert !== 'string');
        if (invalidCertificates.length > 0) {
          throw new Error('All certificates must be strings (base64 encoded or file paths)');
        }
      },
      matchesCertificateTypes(value: string[]) {
        // @ts-ignore - this refers to the model instance
        if (this.certificateTypes && value.length !== this.certificateTypes.length) {
          throw new Error('Number of certificates must match number of certificate types');
        }
      }
    },
  },
}, {
  sequelize,
  tableName: 'applicant_ssc_qualifications',
  modelName: 'ApplicantSSCQualification',
  timestamps: true,
  indexes: [
    {
      fields: ['applicationId'],
    },
  ],
});

// Associations
Application.hasOne(ApplicantSSCQualification, {
  foreignKey: 'applicationId',
  as: 'sscQualification',
  onDelete: 'CASCADE',
});

ApplicantSSCQualification.belongsTo(Application, {
  foreignKey: 'applicationId',
  as: 'application',
});

export default ApplicantSSCQualification;
import { Model, DataTypes, HasManyGetAssociationsMixin, HasManyAddAssociationMixin, ForeignKey, Optional } from 'sequelize';
import sequelize from '../config/database';
import ProgramSSCSubject from './ProgramSSCSubject';
import Program from './Program';

// Attributes interface (all attributes in DB)
interface ProgramSSCQualificationAttributes {
  id: number;
  programId: ForeignKey<Program['id']>;
  acceptedCertificateTypes: string[];
  maximumNumberOfSittings: number | null;
  minimumGrade: string;
  createdAt?: Date;
  updatedAt?: Date;
}

// Creation attributes: omit id, createdAt, updatedAt because they are auto-managed
interface ProgramSSCQualificationCreationAttributes extends Optional<ProgramSSCQualificationAttributes, 'id' | 'createdAt' | 'updatedAt'> {}

class ProgramSSCQualification extends Model<
  ProgramSSCQualificationAttributes,
  ProgramSSCQualificationCreationAttributes
> {
  public id!: number;
  public programId!: ForeignKey<Program['id']>;
  public acceptedCertificateTypes!: string[];
  public maximumNumberOfSittings!: number | null;
 
  public minimumGrade!: string;

  public readonly createdAt!: Date;
  public readonly updatedAt!: Date;

  // Association mixins
  public getSubjects!: HasManyGetAssociationsMixin<ProgramSSCSubject>;
  public addSubject!: HasManyAddAssociationMixin<ProgramSSCSubject, number>;
}

ProgramSSCQualification.init({
  id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true,
  },
  programId: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
  acceptedCertificateTypes: {
    type: DataTypes.STRING,
    allowNull: false,
    get() {
      // cast as unknown first, then string
      const rawValue = this.getDataValue('acceptedCertificateTypes') as unknown as string | null;
      return rawValue ? rawValue.split(',') : [];
    },
    set(value: string[]) {
      this.setDataValue('acceptedCertificateTypes', value.join(',') as any);
    },
  },
  maximumNumberOfSittings: {
    type: DataTypes.INTEGER,
    allowNull: true,
  },
  minimumGrade: {
    type: DataTypes.STRING,
    allowNull: false,
  },
}, {
  sequelize,
  tableName: 'program_ssc_qualifications',
  modelName: 'ProgramSSCQualification',
  timestamps: true,  // ensure timestamps are enabled if not default
});


Program.hasOne(ProgramSSCQualification, {
  sourceKey: 'id',
  foreignKey: 'programId',
  as: 'sscQualification',
});

ProgramSSCQualification.belongsTo(Program, {
  foreignKey: 'programId',
  as: 'program',
});

export default ProgramSSCQualification;



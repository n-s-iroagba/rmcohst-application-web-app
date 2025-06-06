import { Model, DataTypes, Optional } from 'sequelize';
import sequelize from '../config/database';

interface AcademicSessionAttributes {
  id: number;
  sessionName: string;
  reportingDate: Date;

  isCurrent: boolean; 
}

interface AcademicSessionCreationAttributes extends Optional<AcademicSessionAttributes, 'id' | 'isCurrent'> {}

class AcademicSession extends Model<AcademicSessionAttributes, AcademicSessionCreationAttributes> implements AcademicSessionAttributes {
  public id!: number;
  public sessionName!: string;
  public reportingDate!: Date;

  public isCurrent!: boolean;

  public readonly createdAt!: Date;
  public readonly updatedAt!: Date;
}

AcademicSession.init(
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    sessionName: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
    },
    reportingDate: {
      type: DataTypes.DATEONLY,
      allowNull: false,
    },
    isCurrent: {
      type: DataTypes.BOOLEAN,
      defaultValue: false,
      allowNull: false,
    },
  },
  {
    sequelize,
    tableName: 'academic_sessions',
    modelName: 'AcademicSession',
  }
);

export default AcademicSession;

import { Model, DataTypes, Optional } from 'sequelize';
import sequelize from '../config/database';

interface ProgramSessionAttributes {
  id: number;
  programId: number;
  sessionId: number;
  createdAt: Date;
  updatedAt: Date;
}

interface ProgramSessionCreationAttributes extends Optional<ProgramSessionAttributes, 'id' | 'createdAt' | 'updatedAt'> {}

class ProgramSession extends Model<ProgramSessionAttributes, ProgramSessionCreationAttributes> implements ProgramSessionAttributes {
  public id!: number;
  public programId!: number;
  public sessionId!: number;
  public readonly createdAt!: Date;
  public readonly updatedAt!: Date;
}

ProgramSession.init({
  id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true,
  },
  programId: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: 'programs',
      key: 'id',
    },
    onUpdate: 'CASCADE',
    onDelete: 'CASCADE',
  },
  sessionId: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: 'academic_sessions',
      key: 'id',
    },
    onUpdate: 'CASCADE',
    onDelete: 'CASCADE',
  },
  createdAt: {
    type: DataTypes.DATE,
    allowNull: false,
  },
  updatedAt: {
    type: DataTypes.DATE,
    allowNull: false,
  },
}, {
  sequelize,
  tableName: 'program_sessions',
  modelName: 'ProgramSession',
  timestamps: true,
  indexes: [
    {
      fields: ['programId'],
    },
    {
      fields: ['sessionId'],
    },
    {
      fields: ['programId', 'sessionId'],
      unique: true,
      name: 'unique_program_session'
    },
  ],
});

export default ProgramSession;

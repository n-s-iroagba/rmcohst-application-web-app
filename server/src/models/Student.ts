// models/Student.ts
import { DataTypes, Model, Optional } from 'sequelize'
import sequelize from '../config/database'

interface StudentAttributes {
  id: number
  userId: number
  biodataId: number | null
  departmentId: number
  programId: number
  studentId: string // Unique student identifier
  academicSessionId: number
  level: string
  status: StudentStatus
  admissionDate: Date
  graduationDate?: Date
  cgpa?: number
  createdAt: Date
  updatedAt: Date
}

export enum StudentStatus {
  ACTIVE = 'ACTIVE',
  INACTIVE = 'INACTIVE',
  GRADUATED = 'GRADUATED',
  SUSPENDED = 'SUSPENDED',
  WITHDRAWN = 'WITHDRAWN',
}

export interface StudentCreationAttributes
  extends Optional<
    StudentAttributes,
    | 'id'
    | 'graduationDate'
    | 'cgpa'
    | 'createdAt'
    | 'updatedAt'
  > { }

class Student
  extends Model<StudentAttributes, StudentCreationAttributes>
  implements StudentAttributes {
  public id!: number
  public userId!: number
  public biodataId!: number
  public departmentId!: number
  public programId!: number
  public studentId!: string
  public academicSessionId!: number
  public level!: string
  public status!: StudentStatus
  public admissionDate!: Date
  public graduationDate?: Date
  public cgpa?: number

  public readonly createdAt!: Date
  public readonly updatedAt!: Date

  // Associations
  public biodata?: any
  public department?: any
  public program?: any
  public user?: any
  public academicSession?: any
}

Student.init(
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    userId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      unique: true,
      references: {
        model: 'users',
        key: 'id',
      },
      onUpdate: 'CASCADE',
      onDelete: 'CASCADE',
    },
    biodataId: {
      type: DataTypes.INTEGER,
      allowNull: true,
      references: {
        model: 'biodatas', // Adjust table name as needed
        key: 'id',
      },
      onUpdate: 'CASCADE',
      onDelete: 'SET NULL',
    },
    departmentId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'departments',
        key: 'id',
      },
      onUpdate: 'CASCADE',
      onDelete: 'RESTRICT',
    },
    programId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'Programs',
        key: 'id',
      },
      onUpdate: 'CASCADE',
      onDelete: 'RESTRICT',
    },
    studentId: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
      validate: {
        notEmpty: true,
        len: [1, 50],
      },
    },
    academicSessionId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'academic_sessions',
        key: 'id',
      },
      onUpdate: 'CASCADE',
      onDelete: 'RESTRICT',
    },
    level: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        notEmpty: true,
        isIn: [['100', '200', '300', '400', '500', '600']], // Adjust levels as needed
      },
    },
    status: {
      type: DataTypes.ENUM(
        'ACTIVE',
        'INACTIVE',
        'GRADUATED',
        'SUSPENDED',
        'WITHDRAWN'
      ),
      allowNull: false,
      defaultValue: StudentStatus.ACTIVE,
    },
    admissionDate: {
      type: DataTypes.DATE,
      allowNull: false,
    },
    graduationDate: {
      type: DataTypes.DATE,
      allowNull: true,
    },
    cgpa: {
      type: DataTypes.DECIMAL(3, 2),
      allowNull: true,
      validate: {
        min: 0.0,
        max: 5.0, // Adjust based on your grading system
      },
    },
    createdAt: {
      type: DataTypes.DATE,
      allowNull: false,
    },
    updatedAt: {
      type: DataTypes.DATE,
      allowNull: false,
    },
  },
  {
    sequelize,
    modelName: 'Student',
    tableName: 'Students',
    timestamps: true,
    indexes: [
      {
        unique: true,
        fields: ['userId'],
      },
      {
        unique: true,
        fields: ['studentId'],
      },
      {
        fields: ['departmentId'],
      },
      {
        fields: ['programId'],
      },
      {
        fields: ['academicSessionId'],
      },
      {
        fields: ['status'],
      },
      {
        fields: ['level'],
      },
    ],
  }
)

export default Student


import { 
  Model, 
  DataTypes, 
  Optional, 
  BelongsToGetAssociationMixin,
  BelongsToSetAssociationMixin,
  HasManyGetAssociationsMixin, 
  HasManyAddAssociationMixin,
  HasManyCountAssociationsMixin,
  ForeignKey 
} from 'sequelize';
import sequelize from '../config/database';
import Faculty from './Faculty';

interface DepartmentAttributes {
  id: number;
  facultyId: ForeignKey<Faculty['id']>;
  name: string;
  code: string;
  description?: string;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}

interface DepartmentCreationAttributes extends Optional<DepartmentAttributes, 'id' | 'description' | 'isActive' | 'createdAt' | 'updatedAt'> {}

class Department extends Model<DepartmentAttributes, DepartmentCreationAttributes> implements DepartmentAttributes {
  public id!: number;
  public facultyId!: ForeignKey<Faculty['id']>;
  public name!: string;
  public code!: string;
  public description?: string;
  public isActive!: boolean;
  public readonly createdAt!: Date;
  public readonly updatedAt!: Date;

  // Association methods
  public getFaculty!: BelongsToGetAssociationMixin<Faculty>;
  public setFaculty!: BelongsToSetAssociationMixin<Faculty, number>;
  
  public getPrograms!: HasManyGetAssociationsMixin<any>; // Program type will be available after import
  public addProgram!: HasManyAddAssociationMixin<any, number>;
  public countPrograms!: HasManyCountAssociationsMixin;
}

Department.init({
  id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true,
  },
  facultyId: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: 'faculties',
      key: 'id',
    },
    onUpdate: 'CASCADE',
    onDelete: 'RESTRICT', // Prevent deletion of faculty if it has departments
  },
  name: {
    type: DataTypes.STRING(100),
    allowNull: false,
  },
  code: {
    type: DataTypes.STRING(10),
    allowNull: false,
  },
  description: {
    type: DataTypes.TEXT,
    allowNull: true,
  },
  isActive: {
    type: DataTypes.BOOLEAN,
    allowNull: false,
    defaultValue: true,
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
  tableName: 'departments',
  modelName: 'Department',
  timestamps: true,
  indexes: [
    {
      fields: ['facultyId'],
    },
    {
      fields: ['name', 'facultyId'],
      unique: true, // Department name must be unique within a faculty
    },
    {
      fields: ['code', 'facultyId'],
      unique: true, // Department code must be unique within a faculty
    },
    {
      fields: ['isActive'],
    },
  ],
});

Faculty.hasMany(Department, {
  foreignKey: 'facultyId',
  as: 'departments'
});
Department.belongsTo(Faculty, {
  foreignKey: 'facultyId',
  as: 'faculty'
});


export default Department
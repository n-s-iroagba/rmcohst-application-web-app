Pimport { Model, DataTypes, Optional, ForeignKey } from 'sequelize'
import sequelize from '../config/database'
import { Application } from './Application'

interface ApplicationReceiptAttributes {
  id: number
  applicationId: ForeignKey<Application['id']>
  receiptID: string
  amountPaid: number
  dateOfPayment: Date
}

interface ApplicationReceiptCreationAttributes
  extends Optional<ApplicationReceiptAttributes, 'id'> {}

class ApplicationReceipt
  extends Model<ApplicationReceiptAttributes, ApplicationReceiptCreationAttributes>
  implements ApplicationReceiptAttributes
{
  public id!: number
  public applicationId!: ForeignKey<Application['id']>
  public receiptID!: string
  public amountPaid!: number
  public dateOfPayment!: Date

  public readonly createdAt!: Date
  public readonly updatedAt!: Date
}

ApplicationReceipt.init(
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    applicationId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      unique: true, // One-to-one relationship
      references: {
        model: Application,
        key: 'id',
      },
    },
    amountPaid: {
      type: DataTypes.DECIMAL(10, 2),
      allowNull: false,
    },
    dateOfPayment: {
      type: DataTypes.DATE,
      allowNull: false,
    },
    receiptID: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
  },
  {
    sequelize,
    tableName: 'ApplicationReceipts',
    modelName: 'ApplicationReceipt',
  }
)

Application.hasOne(ApplicationReceipt, {
  foreignKey: 'applicationId',
  as: 'ApplicationReceipt',
})

ApplicationReceipt.belongsTo(Application, {
  foreignKey: 'applicationId',
  as: 'application',
})

export default ApplicationReceipt

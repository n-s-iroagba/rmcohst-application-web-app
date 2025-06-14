// models/Payment.ts
import { DataTypes, Model, Optional } from "sequelize"
import sequelize from "../config/database"
import Application from "./Application"


interface PaymentAttributes {
  id: number
  applicationId: number
  amount: number

  isSuccessful:boolean

  failureReason?: string

  createdAt: Date
  updatedAt: Date
}

interface PaymentCreationAttributes extends Optional<PaymentAttributes, "id" | "failureReason"|"createdAt" | "updatedAt"> {}

class Payment extends Model<PaymentAttributes, PaymentCreationAttributes> implements PaymentAttributes {
  public id!: number
  public applicationId!: number
  public amount!: number
  public isSuccessful!:boolean
  public failureReason?: string
  public readonly createdAt!: Date
  public readonly updatedAt!: Date

  // Association methods
  public getApplication!: () => Promise<any>
  public setApplication!: (application: any) => Promise<void>
}

Payment.init(
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
              model: 'Applications',
              key: 'id',
          },
          onUpdate: 'CASCADE',
          onDelete: 'CASCADE',
      },
      amount: {
          type: DataTypes.DECIMAL(10, 2),
          allowNull: false,
          validate: {
              min: 0.01,
          },
      },


      failureReason: {
          type: DataTypes.TEXT,
          allowNull: true,
      },

      createdAt: {
          type: DataTypes.DATE,
          allowNull: false,
      },
      updatedAt: {
          type: DataTypes.DATE,
          allowNull: false,
      },
      isSuccessful: {
        type: DataTypes.BOOLEAN,
        allowNull: false,
      }
  },
  {
    sequelize,
    modelName: 'Payment',
    tableName: 'Payments',
    timestamps: true,
  })

  Application.hasOne(Payment, {
  foreignKey: 'applicationId',
  as: 'payment',
  onDelete: 'CASCADE',
})

Payment.belongsTo(Application, {
  foreignKey: 'applicationId',
  as: 'application',
  onDelete: 'CASCADE',
})

export default Payment

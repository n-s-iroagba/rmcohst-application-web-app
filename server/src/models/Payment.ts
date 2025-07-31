// models/Payment.ts
import { DataTypes, Model, Optional } from 'sequelize'
import sequelize from '../config/database'
import { Application } from './Application'

interface PaymentAttributes {
  id: number
  sessionId:number
  applicantUserId: number
  programId:number
  amount: number
  applicationId:number
  status:'PAID'|'FAILED'|'PENDING'
  webhookEvent:string
  paidAt:Date
  reference:string
  createdAt: Date
  updatedAt: Date
}

interface PaymentCreationAttributes
  extends Optional<PaymentAttributes, 'id'  | 'createdAt' | 'updatedAt'|'webhookEvent'|'applicationId'> {}

class Payment
  extends Model<PaymentAttributes, PaymentCreationAttributes>
  implements PaymentAttributes
{
  public id!: number
  applicantUserId!:number
  sessionId!:number
  programId!:number
  applicationId!: number
  reference!: string
  paidAt!: Date
  amount!: number
  status!:'PAID'|'FAILED'|'PENDING'
  webhookEvent!:string

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

    amount: {
      type: DataTypes.DECIMAL(10, 2),
      allowNull: false,
      validate: {
        min: 0.01,
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

    sessionId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'academic_sessions',
        key: 'id',
      },
    },
    programId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'Programs',
        key: 'id',
      },
      onUpdate: 'CASCADE',
      onDelete: 'CASCADE',
    },
    applicantUserId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'users',
        key: 'id',
      },
    },
    applicationId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'Applications',
        key: 'id',
      },
    },
    reference: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    status: {
      type: DataTypes.ENUM('FAILED','PAID','PENDING'),
      allowNull: false,
    },
    webhookEvent: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    paidAt: {
      type: DataTypes.DATE,
      allowNull: true,

    }
  },
  {
    sequelize,
    modelName: 'Payment',
    tableName: 'Payments',
    timestamps: true,
  }
)

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

// models/Payment.ts
import { DataTypes, Model, Optional } from 'sequelize'
import sequelize from '../config/database'
import { Application } from './Application'
export enum PaymentStatus {
  PENDING = 'PENDING',
  PAID = 'PAID',
  FAILED = 'FAILED',
  CANCELLED = 'CANCELLED',
}
export enum PaymentType {
  APPLICATION_FEE = 'application-fee',
  ACCEPTANCE_FEE = 'acceptance-fee',
}
interface PaymentAttributes {
  id: number
  sessionId: number
  applicantUserId: number
  programId: number
  amount: number
  applicationId: number | null
  status: PaymentStatus
  paymentType: PaymentType
  paidAt?: Date
  cancelledAt?: Date
  receiptFileId?: string
  receiptLink?: string
  receiptGeneratedAt?: Date
  reference: string
  createdAt: Date
  updatedAt: Date
}

export interface PaymentCreationAttributes
  extends Optional<
    PaymentAttributes,
    | 'id'
    | 'createdAt'
    | 'updatedAt'
    | 'applicationId'
    | 'paidAt'
    | 'receiptFileId'
    | 'receiptGeneratedAt'
    | 'receiptLink'
    | 'cancelledAt'
  > {}

class Payment
  extends Model<PaymentAttributes, PaymentCreationAttributes>
  implements PaymentAttributes
{
  public id!: number
  applicantUserId!: number
  sessionId!: number
  programId!: number
  applicationId!: number | null
  reference!: string
  paidAt!: Date
  cancelledAt?: Date
  amount!: number
  receiptFileId?: string
  receiptLink?: string
  receiptGeneratedAt?: Date
  status!: PaymentStatus
  paymentType!: PaymentType

  public readonly createdAt!: Date
  public readonly updatedAt!: Date
}

Payment.init(
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    receiptFileId: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    receiptLink: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    receiptGeneratedAt: {
      type: DataTypes.DATE,
      allowNull: true,
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
      allowNull: true,
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
      type: DataTypes.ENUM('FAILED', 'PAID', 'PENDING', 'CANCELLED'),
      allowNull: false,
    },
    paymentType: {
      type: DataTypes.ENUM('application-fee', 'acceptance-fee'),
      allowNull: true,
    },
    paidAt: {
      type: DataTypes.DATE,
      allowNull: true,
    },
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

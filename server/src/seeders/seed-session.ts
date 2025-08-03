// src/seeders/seedAdmissionSessions.ts

import sequelize from '../config/database'
import AdmissionSession from '../models/AdmissionSession'

async function seedAdmissionSessions() {
  try {
    await sequelize.authenticate()
    console.log('✅ Connected to the database.')

    // Sync the model (optional: force: true will drop the table and recreate it)
    await AdmissionSession.sync({ alter: true })

    // Seed data
    const sessions = [
      {
        name: '2023/2024 Academic Session',
        applicationStartDate: new Date('2023-10-01'),
        applicationEndDate: new Date('2024-03-01'),
        isCurrent: false,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        name: '2024/2025 Academic Session',
        applicationStartDate: new Date('2024-09-15'),
        applicationEndDate: new Date('2025-02-15'),
        isCurrent: true,
        createdAt: new Date(),
        updatedAt: new Date(),
      }
    ]

    // Insert data
    await AdmissionSession.bulkCreate(sessions, { ignoreDuplicates: true })
    console.log('✅ Admission sessions seeded successfully.')

    await sequelize.close()
    console.log('🔌 Database connection closed.')
  } catch (error) {
    console.error('❌ Error seeding admission sessions:', error)
    process.exit(1)
  }
}

seedAdmissionSessions()

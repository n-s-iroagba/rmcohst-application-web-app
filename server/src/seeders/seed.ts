import sequelize from '../config/database'
import AdmissionSession from '../models/AdmissionSession'

async function seedAdmissionSessions() {
  try {
    await sequelize.authenticate()
    console.log('✅ Connected to the database.')

    await AdmissionSession.sync() // Use sync({ force: true }) if you want to drop and recreate

    const sessions = [
      {
        name: '2023/2024 Session',
        applicationStartDate: new Date('2023-10-01'),
        applicationEndDate: new Date('2024-03-31'),
        isCurrent: false,
      },
      {
        name: '2024/2025 Session',
        applicationStartDate: new Date('2024-09-01'),
        applicationEndDate: new Date('2025-02-28'),
        isCurrent: true,
      },
    ]

    for (const session of sessions) {
      const [record, created] = await AdmissionSession.findOrCreate({
        where: { name: session.name },
        defaults: session,
      })

      if (created) {
        console.log(`✅ Created session: ${session.name}`)
      } else {
        console.log(`ℹ️ Session already exists: ${session.name}`)
      }
    }

    console.log('🎉 Admission sessions seeded successfully.')
    process.exit(0)
  } catch (err) {
    console.error('❌ Error seeding admission sessions:', err)
    process.exit(1)
  }
}

seedAdmissionSessions()

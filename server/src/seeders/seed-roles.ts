import { Sequelize } from 'sequelize'
import { Role } from '../models'

/**
 * Seed script to insert default roles into the roles table.
 */
async function seedRoles(sequelize: Sequelize) {
  try {
    await sequelize.authenticate()
    console.info('✅ Connected to the database.')

    const roles = [
      {
        name: 'applicant',
        description: 'User applying for admission',
      },
      {
        name: 'admin',
        description: 'System administrator with full permissions',
      },
      {
        name: 'head-of-admissions',
        description: 'Oversees all admission processes',
      },
      {
        name: 'admissions-officer',
        description: 'Handles day-to-day admission operations',
      },
    ]

    for (const role of roles) {
      const [instance, created] = await Role.findOrCreate({
        where: { name: role.name },
        defaults: role,
      })

      if (created) {
        console.info(`✅ Role "${role.name}" was created.`)
      } else {
        console.info(`ℹ️ Role "${role.name}" already exists.`)
      }
    }

    console.info('🎉 Roles seeding completed.')
    process.exit(0)
  } catch (error) {
    console.error('❌ Failed to seed roles:', error)
    process.exit(1)
  }
}

// Execute if run directly
if (require.main === module) {
  import('../config/database')
    .then(({ default: sequelize }) => seedRoles(sequelize))
    .catch(err => {
      console.error('❌ Failed to load sequelize instance:', err)
      process.exit(1)
    })
}
//npx ts-node src/seeders/seed-roles.ts

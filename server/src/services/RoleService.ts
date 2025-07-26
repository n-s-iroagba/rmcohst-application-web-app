import { User } from '../models'
import Role from '../models/Role'
import UserRole from '../models/UserRole'
import { RoleWithPermissions, UserWithRoles } from './RbacService'
import logger from '../utils/logger'

/**
 * Service for managing roles and role assignments.
 */
class RoleService {
  /**
   * Create a new role in the system.
   * @param name - The unique name of the role.
   * @param description - Optional description of the role.
   * @returns The newly created Role instance.
   * @throws Error if role creation fails.
   */
  async createRole(name: string, description: string = ''): Promise<Role> {
    try {
      const role = await Role.create({ name, description })
      logger.info(`Role created: ${name}`)
      return role
    } catch (error) {
      logger.error('Failed to create role', { name, error })
      throw new Error(`Failed to create role: ${error instanceof Error ? error.message : error}`)
    }
  }

  /**
   * Assign a role to a user by role ID.
   * @param userId - The ID of the user.
   * @param roleId - The ID of the role.
   * @returns The created UserRole instance.
   * @throws Error if assignment fails.
   */
  async assignRoleToUser(userId: number, roleId: number): Promise<UserRole> {
    try {
      const userRole = await UserRole.create({ userId, roleId })
      logger.info(`Assigned roleId ${roleId} to userId ${userId}`)
      return userRole
    } catch (error) {
      logger.error('Failed to assign role to user', { userId, roleId, error })
      throw new Error(`Failed to assign role to user: ${error instanceof Error ? error.message : error}`)
    }
  }

  /**
   * Get a role by its name.
   * @param roleName - The name of the role.
   * @returns The Role instance if found, or null.
   * @throws Error if the query fails.
   */
  async getRoleByName(roleName: string): Promise<Role | null> {
    try {
      const role = await Role.findOne({ where: { name: roleName } })
      if (role) {
        logger.info(`Role found with name: ${roleName}`)
      } else {
        logger.warn(`Role not found with name: ${roleName}`)
      }
      return role
    } catch (error) {
      logger.error('Failed to get role by name', { roleName, error })
      throw new Error(`Failed to get role by name: ${error instanceof Error ? error.message : error}`)
    }
  }

  /**
   * Assign a role to a user by role name.
   * @param userId - The user ID.
   * @param roleName - The role name.
   * @returns The UserRole instance or null if role not found.
   * @throws Error if assignment fails.
   */
  async assignRoleByNameToUser(userId: number, roleName: string): Promise<UserRole | null> {
    try {
      const role = await this.getRoleByName(roleName)
      if (!role) {
        logger.warn(`Role '${roleName}' does not exist, cannot assign to user ${userId}`)
        return null
      }

      const [userRole] = await UserRole.findOrCreate({
        where: { userId, roleId: role.id },
        defaults: { userId, roleId: role.id },
      })

      logger.info(`Assigned role '${roleName}' (id: ${role.id}) to user ${userId}`)
      return userRole
    } catch (error) {
      logger.error('Failed to assign role by name to user', { userId, roleName, error })
      throw new Error(`Failed to assign role by name to user: ${error instanceof Error ? error.message : error}`)
    }
  }

  /**
   * Remove a role from a user.
   * @param userId - The user ID.
   * @param roleId - The role ID.
   * @returns True if deletion was successful, false otherwise.
   * @throws Error if removal fails.
   */
  async removeRoleFromUser(userId: number, roleId: number): Promise<boolean> {
    try {
      const deletedCount = await UserRole.destroy({ where: { userId, roleId } })
      logger.info(`Removed roleId ${roleId} from userId ${userId}, deletedCount: ${deletedCount}`)
      return deletedCount > 0
    } catch (error) {
      logger.error('Failed to remove role from user', { userId, roleId, error })
      throw new Error(`Failed to remove role from user: ${error instanceof Error ? error.message : error}`)
    }
  }

  /**
   * Get all roles assigned to a user.
   * @param userId - The user ID.
   * @returns Array of Role instances.
   * @throws Error if retrieval fails.
   */
  async getUserRoles(userId: number): Promise<RoleWithPermissions[]> {
    try {
      const user = (await User.findByPk(userId, {
        include: [
          {
            model: Role,
            through: { attributes: [] }, // omit junction table columns
          },
        ],
      })) as UserWithRoles | null

      if (!user) {
        logger.warn(`User with id ${userId} not found when fetching roles`)
        return []
      }

      logger.info(`Retrieved roles for userId ${userId}, count: ${user.roles?.length}`)
      return user.roles ||[]
    } catch (error) {
      logger.error('Failed to get user roles', { userId, error })
      throw new Error(`Failed to get user roles: ${error instanceof Error ? error.message : error}`)
    }
  }

  /**
   * Get all users who have a specific role.
   * @param roleId - The role ID.
   * @returns Array of User instances.
   * @throws Error if retrieval fails.
   */
  async getUsersWithRole(roleId: number): Promise<User[]> {
    try {
      const users = await User.findAll({
        include: [
          {
            model: Role,
            where: { id: roleId },
            through: { attributes: [] },
          },
        ],
      })
      logger.info(`Retrieved users with roleId ${roleId}, count: ${users.length}`)
      return users
    } catch (error) {
      logger.error('Failed to get users with role', { roleId, error })
      throw new Error(`Failed to get users with role: ${error instanceof Error ? error.message : error}`)
    }
  }

  /**
   * Check if a user has a specific role.
   * @param userId - The user ID.
   * @param roleName - The role name.
   * @returns True if user has the role, false otherwise.
   * @throws Error if check fails.
   */
  async userHasRole(userId: number, roleName: string): Promise<boolean> {
    try {
      const count = await UserRole.count({
        include: [
          {
            model: Role,
            where: { name: roleName },
          },
        ],
        where: { userId },
      })
      const hasRole = count > 0
      logger.info(`User ${userId} has role '${roleName}': ${hasRole}`)
      return hasRole
    } catch (error) {
      logger.error('Failed to check user role', { userId, roleName, error })
      throw new Error(`Failed to check user role: ${error instanceof Error ? error.message : error}`)
    }
  }

  /**
   * Retrieve all roles in the system.
   * @returns Array of Role instances.
   * @throws Error if retrieval fails.
   */
  async getAllRoles(): Promise<Role[]> {
    try {
      const roles = await Role.findAll()
      logger.info(`Retrieved all roles, count: ${roles.length}`)
      return roles
    } catch (error) {
      logger.error('Failed to get all roles', { error })
      throw new Error(`Failed to get all roles: ${error instanceof Error ? error.message : error}`)
    }
  }

  /**
   * Update a role's information.
   * @param roleId - The role ID.
   * @param updates - Partial updates to apply.
   * @returns The updated Role instance or null if not found.
   * @throws Error if update fails.
   */
  async updateRole(roleId: number, updates: Partial<Role>): Promise<Role | null> {
    try {
      const [affectedCount] = await Role.update(updates, { where: { id: roleId } })
      if (affectedCount === 0) {
        logger.warn(`Role update attempted but no role found with id: ${roleId}`)
        return null
      }
      const updatedRole = await Role.findByPk(roleId)
      logger.info(`Role updated successfully, id: ${roleId}`)
      return updatedRole
    } catch (error) {
      logger.error('Failed to update role', { roleId, updates, error })
      throw new Error(`Failed to update role: ${error instanceof Error ? error.message : error}`)
    }
  }

  /**
   * Delete a role by ID.
   * @param roleId - The role ID.
   * @returns True if deletion was successful, false otherwise.
   * @throws Error if deletion fails.
   */
  async deleteRole(roleId: number): Promise<boolean> {
    try {
      const deletedCount = await Role.destroy({ where: { id: roleId } })
      logger.info(`Role deleted, id: ${roleId}, deletedCount: ${deletedCount}`)
      return deletedCount > 0
    } catch (error) {
      logger.error('Failed to delete role', { roleId, error })
      throw new Error(`Failed to delete role: ${error instanceof Error ? error.message : error}`)
    }
  }
}

export default RoleService

// services/permissionService.ts
import { Role, Permission, RolePermission, UserRole } from '../models'
import NodeCache from 'node-cache'
import { RoleWithPermissions } from './RbacService'

// Cache configuration
const permissionCache = new NodeCache({ stdTTL: 300, checkperiod: 60 })

interface UserRoleWithRolesAndPermissions extends UserRole {
  role: RoleWithPermissions
}

class PermissionService {
  /**
   * Create a new permission
   */
  async createPermission(name: string, description: string = ''): Promise<Permission> {
    return Permission.create({ name, description })
  }

  /**
   * Assign a permission to a role
   */
  async assignPermissionToRole(roleId: number, permissionId: number): Promise<RolePermission> {
    return RolePermission.create({ roleId, permissionId })
  }

  /**
   * Assign a permission to a role by names
   */
  async assignPermissionByNameToRole(
    roleName: string,
    permissionName: string
  ): Promise<RolePermission | null> {
    const [role, permission] = await Promise.all([
      Role.findOne({ where: { name: roleName } }),
      Permission.findOne({ where: { name: permissionName } }),
    ])

    if (!role || !permission) return null

    return RolePermission.findOrCreate({
      where: { roleId: role.id, permissionId: permission.id },
      defaults: { roleId: role.id, permissionId: permission.id },
    }).then(([rolePermission]) => rolePermission)
  }

  /**
   * Remove a permission from a role
   */
  async removePermissionFromRole(roleId: number, permissionId: number): Promise<boolean> {
    const result = await RolePermission.destroy({
      where: { roleId, permissionId },
    })
    return result > 0
  }

  /**
   * Get all permissions for a role
   */
  async getRolePermissions(roleId: number): Promise<Permission[]> {
    const role = (await Role.findByPk(roleId, {
      include: [
        {
          model: Permission,
          through: { attributes: [] }, // Hide junction attributes
        },
      ],
    })) as RoleWithPermissions

    return role?.permissions || []
  }

  /**
   * Get all permissions for a user (direct and through roles)
   */
  async getUserPermissions(userId: number): Promise<Permission[]> {
    const cacheKey = `user-perms-${userId}`
    const cached = permissionCache.get<Permission[]>(cacheKey)

    if (cached) {
      return cached
    }

    // Get all roles for the user
    const userRoles = (await UserRole.findAll({
      where: { userId },
      include: [
        {
          model: Role,
          include: [
            {
              model: Permission,
              through: { attributes: [] },
            },
          ],
        },
      ],
    })) as UserRoleWithRolesAndPermissions[]

    // Flatten permissions
    const permissions = userRoles.flatMap(userRole => userRole.role?.permissions || [])

    // Remove duplicates
    const uniquePermissions = permissions.reduce((acc, permission) => {
      if (!acc.some(p => p.id === permission.id)) {
        acc.push(permission)
      }
      return acc
    }, [] as Permission[])

    permissionCache.set(cacheKey, uniquePermissions)
    return uniquePermissions
  }

  /**
   * Check if a user has a specific permission
   */
  async userHasPermission(userId: number, permissionName: string): Promise<boolean> {
    const cacheKey = `perm-check-${userId}-${permissionName}`
    const cached = permissionCache.get<boolean>(cacheKey)

    if (typeof cached === 'boolean') {
      return cached
    }

    const permissions = await this.getUserPermissions(userId)
    const hasPermission = permissions.some(p => p.name === permissionName)

    permissionCache.set(cacheKey, hasPermission)
    return hasPermission
  }

  /**
   * Get all permissions in the system
   */
  async getAllPermissions(): Promise<Permission[]> {
    return Permission.findAll()
  }

  /**
   * Update a permission's information
   */
  async updatePermission(
    permissionId: number,
    updates: Partial<Permission>
  ): Promise<Permission | null> {
    const [affectedCount] = await Permission.update(updates, {
      where: { id: permissionId },
    })
    if (affectedCount === 0) return null
    return Permission.findByPk(permissionId)
  }

  /**
   * Delete a permission
   */
  async deletePermission(permissionId: number): Promise<boolean> {
    const result = await Permission.destroy({ where: { id: permissionId } })
    return result > 0
  }

  /**
   * Clear permission cache for a user
   */
  clearUserPermissionCache(userId: number): void {
    const keys = permissionCache.keys()
    keys.forEach(key => {
      if (key.startsWith(`user-perms-${userId}`) || key.startsWith(`perm-check-${userId}`)) {
        permissionCache.del(key)
      }
    })
  }
}

export default new PermissionService()

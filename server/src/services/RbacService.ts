// services/rbacService.ts

import { Permission, Role, User } from '../models'
import { UserWithRole } from '../types/join-model.types'



class RbacService {
  // Fetch all role with their permissions
  async getAllroleWithPermissions(): Promise<Role[]> {
    return await Role.findAll({
      include: [
        {
          model: Permission,
          attributes: ['id', 'name'],
          through: { attributes: [] }, // Hide junction table attributes
        },
      ],
      order: [['name', 'ASC']],
    })
  }

  // Fetch a specific role by ID with its permissions
  async getRoleByIdWithPermissions(roleId: number): Promise<Role | null> {
    return await Role.findByPk(roleId, {
      include: [
        {
          model: Permission,
          attributes: ['id', 'name'],
          through: { attributes: [] },
        },
      ],
    })
  }

  // Fetch all permissions
  async getAllPermissions(): Promise<Permission[]> {
    return await Permission.findAll({
      attributes: ['id', 'name'],
      order: [['name', 'ASC']],
    })
  }

  // Fetch a user with their role and permissions (eager loading)
  async getUserWithRoleAndPermissions(userId: number): Promise<UserWithRole | null> {
    return (await User.findByPk(userId, {
      attributes: ['id', 'username', 'email'],
      include: [
        {
          model: Role,
          attributes: ['id', 'name'],
          through: { attributes: [] },
          as: 'role',
          include: [
            {
              model: Permission,
              attributes: ['id', 'name'],
              through: { attributes: [] },
              as: 'permissions',
            },
          ],
        },
      ],
    })) as UserWithRole | null
  }

  // Get all permissions for a specific user (flat list)
  async getUserPermissions(userId: number): Promise<Permission[]> {
    const user = await this.getUserWithRoleAndPermissions(userId)
    if (!user || !user.role) return []

    return user.role.reduce((permissions: Permission[], role) => {
      if (role.permissions) {
        return [...permissions, ...role.permissions]
      }
      return permissions
    }, [])
  }

  // Check if user has a specific permission
  async userHasPermission(userId: number, permissionName: string): Promise<boolean> {
    const permissions = await this.getUserPermissions(userId)
    return permissions.some(perm => perm.name === permissionName)
  }

  // Get role that have a specific permission
  async getroleWithPermission(permissionName: string): Promise<Role[]> {
    return await Role.findAll({
      include: [
        {
          model: Permission,
          where: { name: permissionName },
          attributes: [],
          through: { attributes: [] },
        },
      ],
    })
  }

  // Get users with a specific role
  async getUsersWithRole(roleName: string): Promise<User[]> {
    return await User.findAll({
      attributes: ['id', 'username', 'email'],
      include: [
        {
          model: Role,
          where: { name: roleName },
          attributes: [],
          through: { attributes: [] },
        },
      ],
    })
  }
}

export default new RbacService()

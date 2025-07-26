// services/rbacService.ts

import { Permission, Role, User } from '../models'

export interface UserWithRoles extends User {
  roles?: RoleWithPermissions[]
}

export interface RoleWithPermissions extends Role {
  permissions?: Permission[]
}

class RbacService {
  // Fetch all roles with their permissions
  async getAllRolesWithPermissions(): Promise<Role[]> {
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

  // Fetch a user with their roles and permissions (eager loading)
  async getUserWithRolesAndPermissions(userId: number): Promise<UserWithRoles | null> {
    return (await User.findByPk(userId, {
      attributes: ['id', 'username', 'email'],
      include: [
        {
          model: Role,
          attributes: ['id', 'name'],
          through: { attributes: [] },
          as: 'roles',
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
    })) as UserWithRoles | null
  }

  // Get all permissions for a specific user (flat list)
  async getUserPermissions(userId: number): Promise<Permission[]> {
    const user = await this.getUserWithRolesAndPermissions(userId)
    if (!user || !user.roles) return []

    return user.roles.reduce((permissions: Permission[], role) => {
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

  // Get roles that have a specific permission
  async getRolesWithPermission(permissionName: string): Promise<Role[]> {
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

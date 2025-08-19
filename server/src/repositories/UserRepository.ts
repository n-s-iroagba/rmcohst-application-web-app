// src/repositories/UserRepository.ts

import { Role } from '../models'
import User, { UserCreationAttributes } from '../models/User'
import { UserWithRole } from '../types/join-model.types'
import BaseRepository from './BaseRepository'

class UserRepository extends BaseRepository<User> {
  constructor() {
    super(User)
  }

  async createUser(userData: UserCreationAttributes): Promise<User> {
    return await this.create(userData)
  }

  async findUserByEmail(email: string): Promise<UserWithRole | null> {
    const include = [
      {
        model: Role,
        as: 'role',
      },
    ]
    return await this.findOne({ email }, { include }) as UserWithRole | null
  }

  async findUserById(id: string | number): Promise<UserWithRole | null> {
    const include = [
      {
        model: Role,
        as: 'role',
      },
    ]
    return await this.findById(id, { include }) as UserWithRole | null
  }
  async findUserByGoogleId(googleId: string | number): Promise<UserWithRole | null> {
    const include = [
      {
        model: Role,
        as: 'role',
      },
    ]
    return await this.findOne({ googleId }, { include }) as UserWithRole | null
  }
  async findUserByResetToken(hashedToken: string): Promise<UserWithRole | null> {
    const include = [
      {
        model: Role,
        as: 'role',
      },
    ]
    return await this.findOne({ passwordResetToken: hashedToken }, { include }) as UserWithRole | null
  }

  async findUserByVerificationToken(token: string): Promise<User | null> {
    return await this.findOne({ verificationToken: token })
  }

  async updateUserById(id: string | number, updates: Partial<User>): Promise<User | null> {
    return await this.updateById(id, updates)
  }

  async getAllUsers(): Promise<User[]> {
    const result = await this.findAll()
    return result.data
  }
}

export default new UserRepository()
import { NotFoundError } from '@/shared/domain/erros/not-found-error'
import { PrismaService } from '@/shared/infrastructure/database/prisma/prisma.service'
import { UserEntity } from '@/users/domain/entities/user.entity'
import {
  SearchParams,
  SearchResults,
  UserRepository,
} from '@/users/domain/repositories/user.repository'
import { UserModelMapper } from '../models/user-model.mapper'

export class UserPrismaRepository implements UserRepository {
  constructor(private prismaService: PrismaService) { }
  sortableFields: string[] = ['name', 'createAt']
  async findByEmail(email: string): Promise<UserEntity> {
    try {
      const user = await this.prismaService.user.findUnique({
        where: { email },
      })
      return UserModelMapper.toEntity(user)
    } catch {
      throw new NotFoundError(`UserModel not found using email ${email}`)
    }
  }
  emailExist(email: string): Promise<void> {
    throw new Error('Method not implemented.')
  }
  search(props: SearchParams): Promise<SearchResults> {
    throw new Error('Method not implemented.')
  }
  insert(entities: UserEntity): Promise<void> {
    throw new Error('Method not implemented.')
  }
  findById(id: string): Promise<UserEntity> {
    throw new Error('Method not implemented.')
  }
  findAll(): Promise<UserEntity[]> {
    throw new Error('Method not implemented.')
  }
  update(entity: UserEntity): Promise<void> {
    throw new Error('Method not implemented.')
  }
  delete(id: string): Promise<void> {
    throw new Error('Method not implemented.')
  }
}

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
  constructor(private prismaService: PrismaService) {}
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
  async search(props: SearchParams): Promise<SearchResults> {
    const sortable = this.sortableFields?.includes(props.sort) || false
    const orderByField = sortable ? props.sort : 'createdAt'
    const orderByDir = sortable ? props.sortDir : 'desc'

    const count = await this.prismaService.user.count({
      ...(props.filter && {
        where: {
          name: {
            contains: props.filter,
            mode: 'insensitive',
          },
        },
      }),
    })
    const models = await this.prismaService.user.findMany({
      ...(props.filter && {
        where: {
          name: {
            contains: props.filter,
            mode: 'insensitive',
          },
        },
      }),
      orderBy: {
        [orderByField]: orderByDir,
      },
      skip: props.page && props.page > 0 ? (props.page - 1) * props.perPage : 1,
      take: props.perPage && props.perPage > 0 ? props.perPage : 15,
    })

    return new SearchResults({
      items: models.map(model => UserModelMapper.toEntity(model)),
      total: count,
      currentPage: props.page,
      perPage: props.perPage,
      sort: orderByField,
      sortDir: orderByDir,
      filter: props.filter,
    })
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

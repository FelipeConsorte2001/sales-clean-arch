import { CategoryEntity } from '@/category/domain/entities/category.entity'
import {
  CategoryRepository,
  SearchParams,
  SearchResults,
} from '@/category/domain/repositories/category.repository'
import { ConflictError } from '@/shared/domain/erros/conflict-error'
import { NotFoundError } from '@/shared/domain/erros/not-found-error'
import { PrismaService } from '@/shared/infrastructure/database/prisma/prisma.service'
import { CategoryModelMapper } from '../models/category-model.mapper'

export class CategoryPrismaRepository implements CategoryRepository {
  constructor(private prismaService: PrismaService) {}
  sortableFields: string[] = ['name', 'createAt']
  async categoryExist(name: string): Promise<void> {
    const category = await this.prismaService.category.findUnique({
      where: { name: name.toLowerCase() },
    })
    if (category) throw new ConflictError('Category name already used')
  }
  async search(props: SearchParams): Promise<SearchResults> {
    const sortable = this.sortableFields?.includes(props.sort) || false
    const orderByField = sortable ? props.sort : 'createdAt'
    const orderByDir = sortable ? props.sortDir : 'desc'
    const count = await this.prismaService.category.count({
      ...(props.filter && {
        where: {
          name: {
            contains: props.filter,
            mode: 'insensitive',
          },
        },
      }),
    })

    const models = await this.prismaService.category.findMany({
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
      items: models.map(model => CategoryModelMapper.toEntity(model)),
      total: count,
      currentPage: props.page,
      perPage: props.perPage,
      sort: orderByField,
      sortDir: orderByDir,
      filter: props.filter,
    })
  }

  async insert(entities: CategoryEntity): Promise<void> {
    await this.prismaService.category.create({ data: entities.toJSON() })
  }
  async findById(id: string): Promise<CategoryEntity> {
    return this._get(id)
  }
  async findAll(): Promise<CategoryEntity[]> {
    const models = await this.prismaService.category.findMany()
    return models.map(model => CategoryModelMapper.toEntity(model))
  }
  update(entity: CategoryEntity): Promise<void> {
    throw new Error('Method not implemented.')
  }
  async delete(id: string): Promise<void> {
    await this._get(id)
    await this.prismaService.category.delete({ where: { id } })
  }
  protected async _get(id: string): Promise<CategoryEntity> {
    try {
      const user = await this.prismaService.category.findUnique({
        where: { id },
      })
      return CategoryModelMapper.toEntity(user)
    } catch {
      throw new NotFoundError(`CategoryModel not found using ID ${id}`)
    }
  }
}

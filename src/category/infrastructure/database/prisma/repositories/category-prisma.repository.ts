import { CategoryEntity } from '@/category/domain/entities/category.entity'
import {
  CategoryRepository,
  SearchParams,
  SearchResults,
} from '@/category/domain/repositories/category.repository'
import { ConflictError } from '@/shared/domain/erros/conflict-error'
import { PrismaService } from '@/shared/infrastructure/database/prisma/prisma.service'

export class CategoryPrismaRepository implements CategoryRepository {
  constructor(private prismaService: PrismaService) {}
  sortableFields: string[] = ['name', 'createAt']
  async categoryExist(name: string): Promise<void> {
    const category = await this.prismaService.category.findUnique({
      where: { name: name.toLowerCase() },
    })
    if (category) throw new ConflictError('Category name already used')
  }
  search(props: SearchParams): Promise<SearchResults> {
    throw new Error('Method not implemented.')
  }
  async insert(entities: CategoryEntity): Promise<void> {
    await this.prismaService.category.create({ data: entities.toJSON() })
  }
  findById(id: string): Promise<CategoryEntity> {
    throw new Error('Method not implemented.')
  }
  findAll(): Promise<CategoryEntity[]> {
    throw new Error('Method not implemented.')
  }
  update(entity: CategoryEntity): Promise<void> {
    throw new Error('Method not implemented.')
  }
  delete(id: string): Promise<void> {
    throw new Error('Method not implemented.')
  }
}

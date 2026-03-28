import { CategoryEntity } from '@/category/domain/entities/category.entity'

export type CategoryOutput = {
  id: string
  name: string
  createdAt: Date
  updatedAt: Date
}
export class CategoryOutputMapper {
  static toOutput(entity: CategoryEntity): CategoryOutput {
    return entity.toJSON()
  }
}

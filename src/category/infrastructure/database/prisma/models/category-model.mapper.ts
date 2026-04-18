import { CategoryEntity } from '@/category/domain/entities/category.entity'
import { ValidationError } from '@/shared/domain/erros/validation-error'
import { Category } from '@prisma/client'

export class CategoryModelMapper {
  static toEntity(model: Category) {
    const data = {
      name: model?.name,
      id: model?.id,
      createdAt: model?.createdAt,
      updatedAt: model?.updatedAt,
    }
    try {
      return new CategoryEntity(data, model.id)
    } catch {
      throw new ValidationError('An Entity not be loaded')
    }
  }
}

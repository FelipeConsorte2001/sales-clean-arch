import { CategoryRepository } from '@/category/domain/repositories/category.repository'
import { UseCase as DefaultUseCase } from '@/shared/application/usecases/use-case'
import { CategoryOutput, CategoryOutputMapper } from '../dtos/category-output'

export type GetCategoryInput = {
  id: string
}
export type Output = CategoryOutput

export class GetCategoryUseCase implements DefaultUseCase<
  GetCategoryInput,
  Output
> {
  constructor(private categoryRepository: CategoryRepository) {}
  async execute(input: GetCategoryInput): Promise<CategoryOutput> {
    const entity = await this.categoryRepository.findById(input.id)
    return CategoryOutputMapper.toOutput(entity)
  }
}

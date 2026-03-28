import { CategoryRepository } from '@/category/domain/repositories/category.repository'
import { UseCase as DefaultUseCase } from '@/shared/application/usecases/use-case'
import { CategoryOutput } from '../dtos/category-output'

export type CreateCategoryInput = {
  name: string
}
export type Output = CategoryOutput

export class CreateCategoryUseCase
  implements DefaultUseCase<CreateCategoryInput, Promise<Output>>
{
  constructor(private categoryRepository: CategoryRepository) {}
  async execute(input: CreateCategoryInput): Promise<Output> {}
}

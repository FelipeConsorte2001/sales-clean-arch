import { CategoryEntity } from '@/category/domain/entities/category.entity'
import { CategoryRepository } from '@/category/domain/repositories/category.repository'
import { BadRequestError } from '@/shared/application/erros/bad-request-error'
import { UseCase as DefaultUseCase } from '@/shared/application/usecases/use-case'
import { CategoryOutput, CategoryOutputMapper } from '../dtos/category-output'

export type CreateCategoryInput = {
  name: string
}
export type Output = CategoryOutput

export class CreateUseCase implements DefaultUseCase<
  CreateCategoryInput,
  Promise<Output>
> {
  constructor(private categoryRepository: CategoryRepository) {}
  async execute(input: CreateCategoryInput): Promise<Output> {
    if (!input.name) throw new BadRequestError('Input data not provided')

    await this.categoryRepository.categoryExist(input.name)

    const entity = new CategoryEntity({ name: input.name })

    await this.categoryRepository.insert(entity)

    return CategoryOutputMapper.toOutput(entity)
  }
}

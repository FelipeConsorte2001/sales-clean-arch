import { CategoryRepository } from '@/category/domain/repositories/category.repository'
import { UseCase as DefaultUseCase } from '@/shared/application/usecases/use-case'

export type DeleteCategoryInput = { id: string }
export type Output = void

export class DeleteCategoryUseCase implements DefaultUseCase<
  DeleteCategoryInput,
  Promise<Output>
> {
  constructor(private categoryRepository: CategoryRepository) {}
  async execute(input: DeleteCategoryInput): Promise<Promise<Output>> {
    await this.categoryRepository.delete(input.id)
  }
}

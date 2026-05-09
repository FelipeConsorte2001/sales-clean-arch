import {
  CategoryRepository,
  SearchParams,
  SearchResults,
} from '@/category/domain/repositories/category.repository'
import {
  PaginationOutput,
  PaginationOutputMapper,
} from '@/shared/application/dtos/pagination-output'
import { SearchInput } from '@/shared/application/dtos/search-input'
import { UseCase as DefaultUseCase } from '@/shared/application/usecases/use-case'

import { CategoryOutput, CategoryOutputMapper } from '../dtos/category-output'
export type ListCategoryInput = SearchInput
export type Output = PaginationOutput<CategoryOutput>

export class ListCategoryUseCase implements DefaultUseCase<
  ListCategoryInput,
  Promise<Output>
> {
  constructor(private categoryRepository: CategoryRepository) {}
  async execute(input: ListCategoryInput): Promise<Output> {
    const params = new SearchParams(input)
    const searchResult = await this.categoryRepository.search(params)
    return this.toOutput(searchResult)
  }

  private toOutput(searchResult: SearchResults): Output {
    const items = searchResult.items.map(item =>
      CategoryOutputMapper.toOutput(item),
    )
    return PaginationOutputMapper.toOutput(items, searchResult)
  }
}

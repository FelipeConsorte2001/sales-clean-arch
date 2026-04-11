import {
  SearchParams as DefaultSearchParams,
  SearchResult as DefaultSearchResult,
  SearchableRepositoryInterface,
} from '@/shared/domain/repositories/searchable-repository-contracts'
import { CategoryEntity } from '../entities/category.entity'

export type Filter = string
export class SearchResults extends DefaultSearchResult<
  CategoryEntity,
  Filter
> {}
export class SearchParams extends DefaultSearchParams<Filter> {}

export interface CategoryRepository
  extends SearchableRepositoryInterface<
    CategoryEntity,
    Filter,
    SearchParams,
    SearchResults
  > {
  categoryExist(name: string): Promise<void>
}

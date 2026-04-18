import {
  SearchParams as DefaultSearchParams,
  SearchResult as DefaultSearchResult,
  SearchableRepositoryInterface,
} from '@/shared/domain/repositories/searchable-repository-contracts'
import { UserEntity } from '../entities/user.entity'

export type Filter = string
export class SearchResults extends DefaultSearchResult<UserEntity, Filter> {}
export class SearchParams extends DefaultSearchParams<Filter> {}

export interface UserRepository extends SearchableRepositoryInterface<
  UserEntity,
  Filter,
  SearchParams,
  SearchResults
> {
  findByEmail(email: string): Promise<UserEntity>
  emailExist(email: string): Promise<void>
}

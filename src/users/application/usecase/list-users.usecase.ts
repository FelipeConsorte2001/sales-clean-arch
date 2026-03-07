import {
  PaginationOutput,
  PaginationOutputMapper,
} from '@/shared/application/dtos/pagination-output'
import { SearchInput } from '@/shared/application/dtos/search-input'
import { UseCase as DefaultUseCase } from '@/shared/application/usecases/use-case'
import {
  SearchParams,
  SearchResults,
  UserRepository,
} from '@/users/domain/repositories/user.repository'
import { UserOutput, UserOutputMapper } from '../dtos/user-output'

export type ListUsersInput = SearchInput
export type Output = PaginationOutput<UserOutput>
export class ListUserUseCase
  implements DefaultUseCase<ListUsersInput, Promise<Output>>
{
  constructor(private userRepository: UserRepository) {}
  async execute(input: ListUsersInput): Promise<Output> {
    const params = new SearchParams(input)
    const searchResult = await this.userRepository.search(params)
    return this.toOutput(searchResult)
  }
  private toOutput(searchResult: SearchResults): Output {
    const items = searchResult.items.map(item =>
      UserOutputMapper.toOutput(item),
    )
    return PaginationOutputMapper.toOutput(items, searchResult)
  }
}

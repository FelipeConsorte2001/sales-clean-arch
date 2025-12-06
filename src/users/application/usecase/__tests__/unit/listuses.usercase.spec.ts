import { UserEntity } from '@/users/domain/entities/user.entity'
import {
  SearchResults,
  UserRepository,
} from '@/users/domain/repositories/user.repository'
import { UserDataBuilder } from '@/users/domain/testing/helpers/user-data-builder'
import { ListUserUseCase } from '../../list-users.usecase'

const MockUserRepository = {
  search: jest.fn(),
} as any as UserRepository
const mockUserRepository: UserRepository = {
  search: jest.fn(),
} as any
describe('ListUsersUseCase unit tests', () => {
  let repository: typeof MockUserRepository
  let sut: ListUserUseCase

  beforeEach(() => {
    repository = MockUserRepository
    sut = new ListUserUseCase(repository)
    jest.clearAllMocks()
  })
  it('toOutput method', async () => {
    let result = new SearchResults({
      items: [] as any,
      total: 1,
      currentPage: 1,
      perPage: 2,
      sort: null,
      sortDir: null,
      filter: null,
    })
    let output = sut['toOutput'](result)
    expect(output).toStrictEqual({
      items: [],
      total: 1,
      currentPage: 1,
      lastPage: 1,
      perPage: 2,
    })
    const entity = new UserEntity(UserDataBuilder({}))
    result = new SearchResults({
      items: [entity],
      total: 1,
      currentPage: 1,
      perPage: 2,
      sort: null,
      sortDir: null,
      filter: null,
    })
    output = sut['toOutput'](result)
    expect(output).toStrictEqual({
      items: [entity.toJSON()],
      total: 1,
      currentPage: 1,
      lastPage: 1,
      perPage: 2,
    })
  })
  it('Should return the users orderded by createdAt', async () => {
    const createdAt = new Date()
    const items = [
      new UserEntity(UserDataBuilder({ createdAt })),
      new UserEntity(
        UserDataBuilder({ createdAt: new Date(createdAt.getTime() + 1) }),
      ),
    ]

    const mockSearchResults = new SearchResults({
      items: [items[1], items[0]],
      total: 2,
      currentPage: 1,
      perPage: 15,
      sort: 'createdAt',
      sortDir: 'desc',
      filter: null,
    })

    ;(repository.search as jest.Mock).mockResolvedValue(mockSearchResults)
    const output = await sut.execute({})
    expect(output).toStrictEqual({
      items: [...items].reverse().map(item => item.toJSON()),
      total: 2,
      currentPage: 1,
      lastPage: 1,
      perPage: 15,
    })
  })

  it('Should return the users using pagination, sort and filter', async () => {
    const items = [
      new UserEntity(UserDataBuilder({ name: 'a' })),
      new UserEntity(UserDataBuilder({ name: 'AA' })),
      new UserEntity(UserDataBuilder({ name: 'Aa' })),
      new UserEntity(UserDataBuilder({ name: 'b' })),
      new UserEntity(UserDataBuilder({ name: 'c' })),
    ]
    let mockSearchResults = new SearchResults({
      items: [items[1], items[2]],
      total: 3,
      currentPage: 1,
      perPage: 2,
      sort: 'name',
      sortDir: 'asc',
      filter: 'a',
    })
    ;(repository.search as jest.Mock).mockResolvedValue(mockSearchResults)
    let output = await sut.execute({
      page: 1,
      perPage: 2,
      sort: 'name',
      sortDir: 'asc',
      filter: 'a',
    })
    expect(output).toStrictEqual({
      items: [items[1].toJSON(), items[2].toJSON()],
      total: 3,
      currentPage: 1,
      lastPage: 2,
      perPage: 2,
    })
    mockSearchResults = new SearchResults({
      items: [items[0]],
      total: 3,
      currentPage: 2,
      perPage: 2,
      sort: 'name',
      sortDir: 'asc',
      filter: 'a',
    })
    ;(repository.search as jest.Mock).mockResolvedValue(mockSearchResults)

    output = await sut.execute({
      page: 2,
      perPage: 2,
      sort: 'name',
      sortDir: 'asc',
      filter: 'a',
    })
    expect(output).toStrictEqual({
      items: [items[0].toJSON()],
      total: 3,
      currentPage: 2,
      lastPage: 2,
      perPage: 2,
    })

    mockSearchResults = new SearchResults({
      items: [items[0], items[2], items[1]],
      total: 3,
      currentPage: 1,
      perPage: 3,
      sort: 'name',
      sortDir: 'asc',
      filter: 'a',
    })
    ;(repository.search as jest.Mock).mockResolvedValue(mockSearchResults)

    output = await sut.execute({
      page: 1,
      perPage: 3,
      sort: 'name',
      sortDir: 'desc',
      filter: 'a',
    })
    expect(output).toStrictEqual({
      items: [items[0].toJSON(), items[2].toJSON(), items[1].toJSON()],
      total: 3,
      currentPage: 1,
      lastPage: 1,
      perPage: 3,
    })
  })
})

import { CategoryEntity } from '@/category/domain/entities/category.entity'
import { SearchResults } from '@/category/domain/repositories/category.repository'
import { CategoryDataBuilder } from '@/category/domain/testing/helpers/category-data-builder'
import { ListCategoryUseCase } from '../../list-category.usecase'

describe('Category unit tests', () => {
  let sut: ListCategoryUseCase
  let repository: any

  beforeEach(() => {
    repository = {
      execute: jest.fn(),
      search: jest.fn(),
      items: [],
      toJSON: jest.fn(),
    }
    sut = new ListCategoryUseCase(repository)
    repository.items = []
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
    const entity = new CategoryEntity(CategoryDataBuilder({}))
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

  it('Should return the categories orderded by createdAt', async () => {
    const createdAt = new Date()
    const items = [
      new CategoryEntity(CategoryDataBuilder({ createdAt })),
      new CategoryEntity(
        CategoryDataBuilder({ createdAt: new Date(createdAt.getTime() + 1) }),
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
      new CategoryEntity(CategoryDataBuilder({ name: 'a' })),
      new CategoryEntity(CategoryDataBuilder({ name: 'AA' })),
      new CategoryEntity(CategoryDataBuilder({ name: 'Aa' })),
      new CategoryEntity(CategoryDataBuilder({ name: 'b' })),
      new CategoryEntity(CategoryDataBuilder({ name: 'c' })),
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

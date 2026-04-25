import { CategoryEntity } from '@/category/domain/entities/category.entity'
import { CategoryDataBuilder } from '@/category/domain/testing/helpers/category-data-builder'
import { NotFoundError } from '@/shared/domain/erros/not-found-error'
import { GetCategoryUseCase } from '../../get-category.usecase'
describe('Category unit tests', () => {
  let sut: GetCategoryUseCase
  let repository: any

  beforeEach(() => {
    repository = {
      execute: jest.fn(),
      findById: jest.fn(),
      items: [],
      toJSON: jest.fn(),
    }
    sut = new GetCategoryUseCase(repository)
    repository.items = []
    jest.clearAllMocks()
  })

  it('Should get a category', async () => {
    const items = [new CategoryEntity(CategoryDataBuilder({}))]
    const spy = jest.spyOn(repository, 'findById').mockResolvedValue(items[0])
    repository.items = items
    const result = await sut.execute({ id: items[0]._id })
    expect(spy).toHaveBeenCalledTimes(1)
    jest.spyOn(repository, 'toJSON').mockResolvedValue(items[0])
    expect(result).toMatchObject({
      id: items[0].id,
      name: items[0].name,
      createdAt: items[0].createdAt,
      updatedAt: items[0].updatedAt,
    })
  })

  it('Should throws error when entity not found', async () => {
    jest
      .spyOn(repository, 'findById')
      .mockRejectedValue(new NotFoundError('Entity not found'))
    await expect(() => sut.execute({ id: 'iii' })).rejects.toThrow(
      new NotFoundError('Entity not found'),
    )
  })
})

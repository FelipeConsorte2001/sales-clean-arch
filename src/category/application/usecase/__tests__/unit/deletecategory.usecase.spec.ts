import { CategoryEntity } from '@/category/domain/entities/category.entity'
import { CategoryDataBuilder } from '@/category/domain/testing/helpers/category-data-builder'
import { NotFoundError } from '@/shared/domain/erros/not-found-error'
import { DeleteCategoryUseCase } from '../../deleted.usecase'
describe('DeleteCategoryUseCase unit tests', () => {
  let sut: DeleteCategoryUseCase
  let repository: any

  beforeEach(() => {
    repository = {
      delete: jest.fn(),
    }
    sut = new DeleteCategoryUseCase(repository)
    jest.clearAllMocks()
  })

  it('Should throws error when entity not found', async () => {
    jest
      .spyOn(repository, 'delete')
      .mockRejectedValue(new NotFoundError(`Entity not found`))
    await expect(() => sut.execute({ id: 'fake id' })).rejects.toThrow(
      new NotFoundError(`Entity not found`),
    )
  })

  it('Should be able to delete user profile', async () => {
    const spy = jest.spyOn(repository, 'delete').mockResolvedValue(undefined)
    const items = [new CategoryEntity(CategoryDataBuilder({}))]
    await sut.execute({ id: items[0]._id })
    expect(spy).toHaveBeenCalledTimes(1)
    expect(spy).toHaveBeenCalledWith(items[0]._id)
  })
})

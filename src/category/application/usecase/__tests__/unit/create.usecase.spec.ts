import { CategoryRepository } from '@/category/domain/repositories/category.repository'
import { CategoryDataBuilder } from '@/category/domain/testing/helpers/category-data-builder'
import { BadRequestError } from '@/shared/application/erros/bad-request-error'
import { HashProvider } from '@/shared/application/provider/hash-provider'
import { ConflictError } from '@/shared/domain/erros/conflict-error'
import { bcryptjsHashProvider } from '@/users/infrastructure/providers/bcryptjs-hash.provider'
import { CreateCategoryUseCase } from '../../create.usecase'

const MockCategoryRepository = {
  execute: jest.fn(),
  insert: jest.fn(),
  categoryExist: jest.fn(),
} as any as CategoryRepository
describe('Category unit tests', () => {
  let sut: CreateCategoryUseCase
  let repository: typeof MockCategoryRepository
  let hashProvider: HashProvider

  beforeEach(() => {
    repository = MockCategoryRepository
    hashProvider = new bcryptjsHashProvider()
    sut = new CreateCategoryUseCase(repository)
    jest.clearAllMocks()
  })

  it('Should create a category', async () => {
    const spy = jest.spyOn(repository, 'insert').mockResolvedValue(undefined)
    jest.spyOn(repository, 'categoryExist').mockResolvedValue(undefined)
    const props = CategoryDataBuilder({})
    const result = await sut.execute({
      name: props.name,
    })

    expect(result.id).toBeDefined()
    expect(result.createdAt).toBeInstanceOf(Date)
    expect(spy).toHaveBeenCalledTimes(1)
  })
  it('Should not be able to register with same category twice', async () => {
    const props = CategoryDataBuilder({ name: 'aa' })

    jest
      .spyOn(repository, 'categoryExist')
      .mockRejectedValue(new ConflictError('Category name already used'))
    await expect(() => sut.execute(props)).rejects.toBeInstanceOf(ConflictError)
  })

  it('Should return erro when name not provider', async () => {
    const props = Object.assign(CategoryDataBuilder({}), { name: null })
    await expect(() => sut.execute(props)).rejects.toBeInstanceOf(
      BadRequestError,
    )
  })
})

import { NotFoundError } from '@/shared/domain/erros/not-found-error'
import { UserEntity } from '@/users/domain/entities/user.entity'
import { UserRepository } from '@/users/domain/repositories/user.repository'
import { UserDataBuilder } from '@/users/domain/testing/helpers/user-data-builder'
import { GetUserUseCase } from '../../get-user.use.case'

const MockUserRepository = {
  execute: jest.fn(),
  findById: jest.fn(),
  items: [],
} as any as UserRepository
describe('GetUserUsercase unit tests', () => {
  let sut: GetUserUseCase
  let repository: any

  beforeEach(() => {
    repository = {
      findById: jest.fn(),
      items: [],
      toJSON: jest.fn(),
    }
    sut = new GetUserUseCase(repository)
    jest.clearAllMocks()
  })

  it('Should throws error when entity not found', async () => {
    await jest
      .spyOn(repository, 'findById')
      .mockRejectedValue(new NotFoundError(`Entity not found`))
    await expect(() => sut.execute({ id: 'fake id' })).rejects.toThrow(
      new NotFoundError(`Entity not found`),
    )
  })

  it('Should be able to get user profile', async () => {
    const items = [new UserEntity(UserDataBuilder({}))]
    const spy = jest.spyOn(repository, 'findById').mockResolvedValue(items[0])
    repository.items = items
    const result = await sut.execute({ id: items[0]._id })
    expect(spy).toHaveBeenCalledTimes(1)
    await jest.spyOn(repository, 'toJSON').mockResolvedValue(items[0])
    expect(result).toMatchObject({
      id: items[0].id,
      name: items[0].name,
      email: items[0].email,
      password: items[0].password,
      createdAt: items[0].createdAt,
    })
  })
})

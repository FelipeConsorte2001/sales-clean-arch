import { BadRequestError } from '@/shared/application/erros/bad-request-error'
import { NotFoundError } from '@/shared/domain/erros/not-found-error'
import { UserEntity } from '@/users/domain/entities/user.entity'
import { UserDataBuilder } from '@/users/domain/testing/helpers/user-data-builder'
import { UpdateUserUseCase } from '../../update-user.usecase'

describe('UserUsercase unit tests', () => {
  let sut: UpdateUserUseCase
  let repository: any

  beforeEach(() => {
    repository = {
      update: jest.fn(),
      findById: jest.fn(),
    }
    sut = new UpdateUserUseCase(repository)
  })

  it('Should throws error when entity not found', async () => {
    jest
      .spyOn(repository, 'findById')
      .mockRejectedValue(new NotFoundError(`Entity not found`))
    await expect(() =>
      sut.execute({ id: 'fake id', name: 'fake' }),
    ).rejects.toThrow(new NotFoundError(`Entity not found`))
  })
  it('Should throws error when name not found', async () => {
    await expect(() => sut.execute({ id: 'fake id' } as any)).rejects.toThrow(
      new BadRequestError(`Name not provided`),
    )
  })

  it('Should update a user', async () => {
    const items = [new UserEntity(UserDataBuilder({}))]
    const spy = jest.spyOn(repository, 'findById').mockResolvedValue(items[0])

    const newName = 'new name'
    jest.spyOn(repository, 'update').mockResolvedValue({
      id: items[0].id,
      name: newName,
      email: items[0].email,
      password: items[0].password,
      createdAt: items[0].createdAt,
    })
    const result = await sut.execute({ id: items[0]._id, name: newName })
    expect(spy).toHaveBeenCalledTimes(1)
    expect(result).toMatchObject({
      id: items[0].id,
      name: newName,
      email: items[0].email,
      password: items[0].password,
      createdAt: items[0].createdAt,
    })
  })
})

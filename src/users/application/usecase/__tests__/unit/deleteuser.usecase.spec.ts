import { NotFoundError } from '@/shared/domain/erros/not-found-error'
import { UserEntity } from '@/users/domain/entities/user.entity'
import { UserDataBuilder } from '@/users/domain/testing/helpers/user-data-builder'
import { DeleteUserUseCase } from '../../delete.usescase'

describe('DeleteUserUsercase unit tests', () => {
  let sut: DeleteUserUseCase
  let repository: any

  beforeEach(() => {
    repository = {
      delete: jest.fn(),
    }
    sut = new DeleteUserUseCase(repository)
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
    const items = [new UserEntity(UserDataBuilder({}))]
    await sut.execute({ id: items[0]._id })
    expect(spy).toHaveBeenCalledTimes(1)
    expect(spy).toHaveBeenCalledWith(items[0]._id)
  })
})

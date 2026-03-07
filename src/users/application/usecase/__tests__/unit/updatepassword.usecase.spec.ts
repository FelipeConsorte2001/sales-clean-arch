import { InvalidPasswordError } from '@/shared/application/erros/invalid-password-error'
import { HashProvider } from '@/shared/application/provider/hash-provider'
import { NotFoundError } from '@/shared/domain/erros/not-found-error'
import { UserOutputMapper } from '@/users/application/dtos/user-output'
import { UserEntity } from '@/users/domain/entities/user.entity'
import { UserRepository } from '@/users/domain/repositories/user.repository'
import { UserDataBuilder } from '@/users/domain/testing/helpers/user-data-builder'
import { UpdatePasswordUseCase } from '../../update-password.usecase'

const MockUserRepository = {
  execute: jest.fn(),
  findById: jest.fn(),
  update: jest.fn(),
} as any as UserRepository

const MockHahProvider = {
  generateHash: jest.fn(),
  compareHash: jest.fn(),
} as any as HashProvider
describe('Update passwaord unit tests', () => {
  let sut: UpdatePasswordUseCase
  let repository: typeof MockUserRepository
  let hashProvider: typeof MockHahProvider

  beforeEach(() => {
    repository = MockUserRepository
    hashProvider = MockHahProvider
    sut = new UpdatePasswordUseCase(repository, hashProvider)

    jest.clearAllMocks()
  })

  it('Should throws error when entity not found', async () => {
    jest
      .spyOn(repository, 'findById')
      .mockRejectedValue(new NotFoundError(`Entity not found`))
    await expect(async () => {
      await sut.execute({
        id: 'fake id',
        password: 'password',
        oldPassword: 'oldpassowrd',
      })
    }).rejects.toThrow(new NotFoundError(`Entity not found`))
  })

  it('Should throws error when oldpassword is not provided', async () => {
    const entity = new UserEntity(UserDataBuilder({}))
    jest.spyOn(repository, 'findById').mockResolvedValue(entity)
    await expect(() =>
      sut.execute({
        id: entity._id,
        password: 'password',
        oldPassword: '',
      }),
    ).rejects.toThrow(
      new InvalidPasswordError(`Old password and new password is required`),
    )
  })

  it('Should throws error when new password is not proveided', async () => {
    const entity = new UserEntity(UserDataBuilder({}))
    jest.spyOn(repository, 'findById').mockResolvedValue(entity)

    await expect(() =>
      sut.execute({
        id: entity._id,
        password: '',
        oldPassword: '12521',
      }),
    ).rejects.toThrow(
      new InvalidPasswordError(`Old password and new password is required`),
    )
  })

  it('Should throws error when old passwors does not match', async () => {
    const hashPassoword = await hashProvider.generateHash('1234')
    const entity = new UserEntity(UserDataBuilder({ password: hashPassoword }))
    jest.spyOn(repository, 'findById').mockResolvedValue(entity)

    await expect(() =>
      sut.execute({
        id: entity._id,
        password: '12sss',
        oldPassword: '1234555',
      }),
    ).rejects.toThrow(new InvalidPasswordError(`Old password does not match`))
  })

  it('Should update a password', async () => {
    const oldPasswordHash = 'old_hash'
    const newPasswordHash = 'new_hash'
    const entity = new UserEntity(
      UserDataBuilder({ password: oldPasswordHash }),
    )

    const findSpy = jest.spyOn(repository, 'findById').mockResolvedValue(entity)
    const compareSpy = jest
      .spyOn(hashProvider, 'compareHash')
      .mockResolvedValue(true)
    const generateSpy = jest
      .spyOn(hashProvider, 'generateHash')
      .mockResolvedValue(newPasswordHash)
    const updateSpy = jest.spyOn(repository, 'update').mockResolvedValue()

    const result = await sut.execute({
      id: entity._id,
      password: 'new_password_raw',
      oldPassword: 'old_password_raw',
    })

    expect(findSpy).toHaveBeenCalledWith(entity._id)
    expect(compareSpy).toHaveBeenCalledWith('old_password_raw', oldPasswordHash)
    expect(generateSpy).toHaveBeenCalledWith('new_password_raw')

    expect(updateSpy).toHaveBeenCalledWith(
      expect.objectContaining({
        password: newPasswordHash,
      }),
    )

    expect(result).toEqual(UserOutputMapper.toOutput(entity))
  })
})

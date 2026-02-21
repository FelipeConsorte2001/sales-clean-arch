import { BadRequestError } from '@/shared/application/erros/bad-request-error'

import { InvalidCredentialsError } from '@/shared/application/erros/invalid-credentials-error'
import { HashProvider } from '@/shared/application/provider/hash-provider'
import { NotFoundError } from '@/shared/domain/erros/not-found-error'
import { UserEntity } from '@/users/domain/entities/user.entity'
import { UserRepository } from '@/users/domain/repositories/user.repository'
import { UserDataBuilder } from '@/users/domain/testing/helpers/user-data-builder'
import { bcryptjsHashProvider } from '@/users/infrastructure/providers/bcryptjs-hash.provider'
import { SigninUseCase } from '../../sign-in.usecase'

const MockUserRepository = {
  execute: jest.fn(),
  findByEmail: jest.fn(),
  insert: jest.fn(),
} as any as UserRepository
describe('Signin unit tests', () => {
  let sut: SigninUseCase
  let repository: typeof MockUserRepository
  let hashProvider: HashProvider

  beforeEach(() => {
    repository = MockUserRepository
    hashProvider = new bcryptjsHashProvider()
    sut = new SigninUseCase(repository, hashProvider)
    jest.clearAllMocks()
  })

  it('Should authenticate a user', async () => {
    const hashPassword = await hashProvider.generateHash('1234')
    const entity = new UserEntity(
      UserDataBuilder({ password: hashPassword, email: 'a@a.com' }),
    )
    const spy = jest.spyOn(repository, 'findByEmail').mockResolvedValue(entity)

    const result = await sut.execute({
      email: entity.email,
      password: '1234',
    })
    expect(result).toStrictEqual(entity.toJSON())
    expect(spy).toHaveBeenCalledTimes(1)
  })

  it('Should throws error when email not provided', async () => {
    const props = { email: null, password: '1234' }
    await expect(() => sut.execute(props)).rejects.toBeInstanceOf(
      BadRequestError,
    )
  })

  it('Should throws error when password not provider', async () => {
    const props = { password: null, email: '1234@a.com' }
    await expect(() => sut.execute(props)).rejects.toBeInstanceOf(
      BadRequestError,
    )
  })

  it('Should not be able to authenticate with wrong email', async () => {
    jest
      .spyOn(repository, 'findByEmail')
      .mockRejectedValue(new NotFoundError(`Entity not found`))
    const props = { password: '1234', email: 'a@a.com' }
    await expect(() => sut.execute(props)).rejects.toBeInstanceOf(NotFoundError)
  })
  it('Should not be able to authenticate with wrong password', async () => {
    const hashPassword = await hashProvider.generateHash('1234')
    const entity = new UserEntity(
      UserDataBuilder({ password: hashPassword, email: 'a@a.com' }),
    )
    jest.spyOn(repository, 'findByEmail').mockResolvedValue(entity)
    const props = { password: 'fake', email: 'a@a.com' }
    await expect(() => sut.execute(props)).rejects.toBeInstanceOf(
      InvalidCredentialsError,
    )
  })
})

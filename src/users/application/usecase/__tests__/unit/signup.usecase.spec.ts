import { ConflictError } from '@/shared/domain/erros/conflict-error'
import { UserRepository } from '@/users/domain/repositories/user.repository'
import { UserDataBuilder } from '@/users/domain/testing/helpers/user-data-builder'
import { BadRequestError } from '../../../erros/bad-request-error'
import { SignupUseCase } from '../../sign-up.usecase'

const MockUserRepository = {
  execute: jest.fn(),
  emailExist: jest.fn(),
  insert: jest.fn(),
} as any as UserRepository

describe('Signup unit tests', () => {
  let sut: SignupUseCase
  let repository: typeof MockUserRepository

  beforeEach(() => {
    repository = MockUserRepository
    sut = new SignupUseCase(repository)
    jest.clearAllMocks()
  })

  it('Should create a user', async () => {
    const spy = jest.spyOn(repository, 'insert').mockResolvedValue(undefined)
    await jest.spyOn(repository, 'emailExist').mockResolvedValue(undefined)
    const props = UserDataBuilder({})
    const result = await sut.execute({
      name: props.name,
      email: props.email,
      password: props.password,
      cpf: props.cpf,
      phone: props.phone,
      typeUser: props.typeUser,
    })
    expect(result.id).toBeDefined()
    expect(result.createdAt).toBeInstanceOf(Date)
    expect(spy).toHaveBeenCalledTimes(1)
  })

  it('Should not be able to register with same email twice', async () => {
    const props = UserDataBuilder({ email: 'a@a.com' })

    await jest
      .spyOn(repository, 'emailExist')
      .mockRejectedValue(new ConflictError('Email address already used'))
    await expect(() => sut.execute(props)).rejects.toBeInstanceOf(ConflictError)
  })

  it('Should throws error when name not provider', async () => {
    const props = Object.assign(UserDataBuilder({}), { name: null })
    await expect(() => sut.execute(props)).rejects.toBeInstanceOf(
      BadRequestError,
    )
  })
  it('Should throws error when email not provided', async () => {
    const props = Object.assign(UserDataBuilder({}), { email: null })
    await expect(() => sut.execute(props)).rejects.toBeInstanceOf(
      BadRequestError,
    )
  })

  it('Should throws error when password not provider', async () => {
    const props = Object.assign(UserDataBuilder({}), { password: null })
    await expect(() => sut.execute(props)).rejects.toBeInstanceOf(
      BadRequestError,
    )
  })
})

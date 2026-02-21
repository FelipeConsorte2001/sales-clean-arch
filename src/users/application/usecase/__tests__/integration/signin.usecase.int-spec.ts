import { BadRequestError } from '@/shared/application/erros/bad-request-error'
import { InvalidCredentialsError } from '@/shared/application/erros/invalid-credentials-error'
import { HashProvider } from '@/shared/application/provider/hash-provider'
import { NotFoundError } from '@/shared/domain/erros/not-found-error'
import { DatabaseModule } from '@/shared/infrastructure/database/database.module'
import { setupPrismaTests } from '@/shared/infrastructure/database/prisma/testing/setup-prisma/setup-prisma-tests'
import { UserEntity } from '@/users/domain/entities/user.entity'
import { UserDataBuilder } from '@/users/domain/testing/helpers/user-data-builder'
import { UserPrismaRepository } from '@/users/infrastructure/database/prisma/repositories/user-prisma.repository'
import { bcryptjsHashProvider } from '@/users/infrastructure/providers/bcryptjs-hash.provider'
import { Test, TestingModule } from '@nestjs/testing'
import { PrismaClient } from '@prisma/client'
import { SigninUseCase } from '../../sign-in.usecase'

describe('SigninUsecase integration tests', () => {
  const prismaService = new PrismaClient()
  let sut: SigninUseCase
  let repository: UserPrismaRepository
  let hashProvider: HashProvider

  let module: TestingModule

  beforeAll(async () => {
    setupPrismaTests()
    module = await Test.createTestingModule({
      imports: [DatabaseModule.forTests(prismaService)],
    }).compile()
    repository = new UserPrismaRepository(prismaService as any)
    hashProvider = new bcryptjsHashProvider()
  })

  beforeEach(async () => {
    sut = new SigninUseCase(repository, hashProvider)
    await prismaService.user.deleteMany()
  })

  afterAll(async () => {
    await module.close()
  })
  it('should throws error user not found by email', async () => {
    const entity = new UserEntity(UserDataBuilder({}))
    await expect(() =>
      sut.execute({
        email: entity.email,
        password: '1234',
      }),
    ).rejects.toBeInstanceOf(NotFoundError)
  })
  it('should not be able to authenticate with wrong password', async () => {
    const hashPassword = await hashProvider.generateHash('1234')
    const entity = new UserEntity(
      UserDataBuilder({ email: 'a@a.com', password: hashPassword }),
    )
    await prismaService.user.create({ data: entity.toJSON() })

    await expect(() =>
      sut.execute({
        email: 'a@a.com',
        password: 'fake',
      }),
    ).rejects.toBeInstanceOf(InvalidCredentialsError)
  })

  it('should throws error when email not provided', async () => {
    await expect(() =>
      sut.execute({
        email: null,
        password: '1234',
      }),
    ).rejects.toBeInstanceOf(BadRequestError)
  })
  it('should throws error when password not provided', async () => {
    await expect(() =>
      sut.execute({
        email: 'a@a.com',
        password: null,
      }),
    ).rejects.toBeInstanceOf(BadRequestError)
  })
  it('should authenticate a user', async () => {
    const hashPassword = await hashProvider.generateHash('1234')
    const entity = new UserEntity(
      UserDataBuilder({ email: 'a@a.com', password: hashPassword }),
    )
    await prismaService.user.create({ data: entity.toJSON() })
    const output = await sut.execute({ email: 'a@a.com', password: '1234' })
    expect(output).toMatchObject(entity.toJSON())
  })
})

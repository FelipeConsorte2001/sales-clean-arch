import { InvalidPasswordError } from '@/shared/application/erros/invalid-password-error'
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
import { UpdatePasswordUseCase } from '../../update-password.usecase'

describe('Updatepassword integration tests', () => {
  const prismaService = new PrismaClient()
  let sut: UpdatePasswordUseCase
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
    sut = new UpdatePasswordUseCase(repository, hashProvider)
    await prismaService.user.deleteMany()
  })

  afterAll(async () => {
    await module.close()
  })
  it('should throws error user not found', async () => {
    const entity = new UserEntity(UserDataBuilder({}))
    const props = {
      id: entity._id,
      oldPassword: 'OldPassqord',
      password: 'Newpassword',
    }
    await expect(() => sut.execute(props)).rejects.toThrow(
      new NotFoundError(`UserModel not found using ID ${entity._id}`),
    )
  })
  it('should throws error when old passwors not provided', async () => {
    const entity = new UserEntity(UserDataBuilder({}))
    await prismaService.user.create({ data: entity.toJSON() })
    await expect(
      sut.execute({
        id: entity._id,
        oldPassword: '',
        password: 'Newpassword',
      }),
    ).rejects.toThrow(
      new InvalidPasswordError('Old password and new password is required'),
    )
  })
  it('should throws error when new passwors not provided', async () => {
    const entity = new UserEntity(UserDataBuilder({}))
    await prismaService.user.create({ data: entity.toJSON() })
    await expect(() =>
      sut.execute({
        id: entity._id,
        oldPassword: 'oldPassword',
        password: '',
      }),
    ).rejects.toThrow(
      new InvalidPasswordError('Old password and new password is required'),
    )
  })
  it('should update a password', async () => {
    const oldPassword = await hashProvider.generateHash('1234')
    const entity = new UserEntity(UserDataBuilder({ password: oldPassword }))
    await prismaService.user.create({ data: entity.toJSON() })
    const output = await sut.execute({
      id: entity._id,
      oldPassword: '1234',
      password: '4321',
    })
    const result = await hashProvider.compareHash('4321', output.password)
    expect(result).toBeTruthy()
  })
})

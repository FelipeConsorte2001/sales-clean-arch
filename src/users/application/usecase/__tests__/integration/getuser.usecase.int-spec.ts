import { NotFoundError } from '@/shared/domain/erros/not-found-error'
import { DatabaseModule } from '@/shared/infrastructure/database/database.module'
import { setupPrismaTests } from '@/shared/infrastructure/database/prisma/testing/setup-prisma/setup-prisma-tests'
import { UserEntity } from '@/users/domain/entities/user.entity'
import { UserDataBuilder } from '@/users/domain/testing/helpers/user-data-builder'
import { UserPrismaRepository } from '@/users/infrastructure/database/prisma/repositories/user-prisma.repository'
import { Test, TestingModule } from '@nestjs/testing'
import { PrismaClient } from '@prisma/client'
import { GetUserUseCase } from '../../get-user.usecase'

describe('SignupUsecase integration tests', () => {
  const prismaService = new PrismaClient()
  let sut: GetUserUseCase
  let repository: UserPrismaRepository

  let module: TestingModule

  beforeAll(async () => {
    setupPrismaTests()
    module = await Test.createTestingModule({
      imports: [DatabaseModule.forTests(prismaService)],
    }).compile()
    repository = new UserPrismaRepository(prismaService as any)
  })

  beforeEach(async () => {
    sut = new GetUserUseCase(repository)
    await prismaService.user.deleteMany()
  })

  afterAll(async () => {
    await module.close()
  })
  it('should get a user', async () => {
    const entity = new UserEntity(UserDataBuilder({}))
    const model = await prismaService.user.create({ data: entity.toJSON() })
    const output = await sut.execute({ id: entity._id })
    expect(output).toMatchObject(model)
  })
  it('should show throws error when entity notFound', async () => {
    const id = 'id'
    await expect(() => sut.execute({ id })).rejects.toThrow(
      new NotFoundError(`UserModel not found using ID ${id}`),
    )
  })
})

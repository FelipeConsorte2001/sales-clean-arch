import { NotFoundError } from '@/shared/domain/erros/not-found-error'
import { DatabaseModule } from '@/shared/infrastructure/database/database.module'
import { setupPrismaTests } from '@/shared/infrastructure/database/prisma/testing/setup-prisma/setup-prisma-tests'
import { UserEntity } from '@/users/domain/entities/user.entity'
import { UserDataBuilder } from '@/users/domain/testing/helpers/user-data-builder'
import { UserPrismaRepository } from '@/users/infrastructure/database/prisma/repositories/user-prisma.repository'
import { Test, TestingModule } from '@nestjs/testing'
import { PrismaClient } from '@prisma/client'
import { UpdateUserUseCase } from '../../update-user.usecase'

describe('Updatuser integration tests', () => {
  const prismaService = new PrismaClient()
  let sut: UpdateUserUseCase
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
    sut = new UpdateUserUseCase(repository)
    await prismaService.user.deleteMany()
  })

  afterAll(async () => {
    await module.close()
  })
  it('should show throws error when entity notFound', async () => {
    const id = 'id'
    const name = 'fake name'
    await expect(() => sut.execute({ id, name })).rejects.toThrow(
      new NotFoundError(`UserModel not found using ID ${id}`),
    )
  })

  it('should update a user', async () => {
    const entity = new UserEntity(UserDataBuilder({}))
    await prismaService.user.create({ data: entity.toJSON() })
    const name = 'fake name'
    const output = await sut.execute({ id: entity._id, name })
    expect(output.name).toBe(name)
  })
})

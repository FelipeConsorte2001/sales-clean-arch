import { CategoryPrismaRepository } from '@/category/infrastructure/database/prisma/repositories/category-prisma.repository'
import { DatabaseModule } from '@/shared/infrastructure/database/database.module'
import { setupPrismaTests } from '@/shared/infrastructure/database/prisma/testing/setup-prisma/setup-prisma-tests'
import { Test, TestingModule } from '@nestjs/testing'
import { PrismaClient } from '@prisma/client'
import { CreateUseCase } from '../../create.usecase'

describe('CreateUseCase integration tests', () => {
  const prismaService = new PrismaClient()
  let sut: CreateUseCase
  let repository: CategoryPrismaRepository

  let module: TestingModule

  beforeAll(async () => {
    setupPrismaTests()
    module = await Test.createTestingModule({
      imports: [DatabaseModule.forTests(prismaService)],
    }).compile()
    repository = new CategoryPrismaRepository(prismaService as any)
  })

  beforeEach(async () => {
    sut = new CreateUseCase(repository)
    await prismaService.category.deleteMany()
  })

  afterAll(async () => {
    await module.close()
  })
  it('should create a user', async () => {
    const props = {
      name: 'aaa',
    }
    const output = await sut.execute(props)
    expect(output.id).toBeDefined()
    expect(output.createdAt).toBeInstanceOf(Date)
  })
})

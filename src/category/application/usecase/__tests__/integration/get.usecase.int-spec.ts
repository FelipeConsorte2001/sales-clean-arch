import { CategoryEntity } from '@/category/domain/entities/category.entity'
import { CategoryDataBuilder } from '@/category/domain/testing/helpers/category-data-builder'
import { CategoryPrismaRepository } from '@/category/infrastructure/database/prisma/repositories/category-prisma.repository'
import { NotFoundError } from '@/shared/domain/erros/not-found-error'
import { DatabaseModule } from '@/shared/infrastructure/database/database.module'
import { setupPrismaTests } from '@/shared/infrastructure/database/prisma/testing/setup-prisma/setup-prisma-tests'
import { Test, TestingModule } from '@nestjs/testing'
import { PrismaClient } from '@prisma/client'
import { GetCategoryUseCase } from '../../get-category.usecase'

describe('GetUseCase integraion tests', () => {
  const prismaService = new PrismaClient()
  let sut: GetCategoryUseCase
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
    sut = new GetCategoryUseCase(repository)
    await prismaService.category.deleteMany()
  })

  afterAll(async () => {
    await module.close()
  })

  it('Should get a category', async () => {
    const entity = new CategoryEntity(CategoryDataBuilder({}))
    const model = await prismaService.category.create({ data: entity.toJSON() })
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

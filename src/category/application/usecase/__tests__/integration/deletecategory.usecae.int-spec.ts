import { CategoryEntity } from '@/category/domain/entities/category.entity'
import { CategoryDataBuilder } from '@/category/domain/testing/helpers/category-data-builder'
import { CategoryPrismaRepository } from '@/category/infrastructure/database/prisma/repositories/category-prisma.repository'
import { NotFoundError } from '@/shared/domain/erros/not-found-error'
import { DatabaseModule } from '@/shared/infrastructure/database/database.module'
import { setupPrismaTests } from '@/shared/infrastructure/database/prisma/testing/setup-prisma/setup-prisma-tests'
import { Test, TestingModule } from '@nestjs/testing'
import { PrismaClient } from '@prisma/client'
import { DeleteCategoryUseCase } from '../../deleted.usecase'

describe('DeleteUseCase integration tests', () => {
  const prismaService = new PrismaClient()
  let sut: DeleteCategoryUseCase
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
    sut = new DeleteCategoryUseCase(repository)
    await prismaService.category.deleteMany()
  })
  afterAll(async () => {
    await module.close()
  })

  it('should show throws error when entity notFound', async () => {
    const id = 'id'
    await expect(() => sut.execute({ id })).rejects.toThrow(
      new NotFoundError(`CategoryModel not found using ID ${id}`),
    )
  })

  it('should delete a entity', async () => {
    const entity = new CategoryEntity(CategoryDataBuilder({}))
    await prismaService.category.create({ data: entity.toJSON() })
    await sut.execute({ id: entity._id })
    const output = await prismaService.category.findUnique({
      where: { id: entity._id },
    })
    expect(output).toBeNull()

    const models = await prismaService.category.findMany()
    expect(models).toHaveLength(0)
  })
})

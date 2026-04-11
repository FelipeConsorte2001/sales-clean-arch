import { CategoryEntity } from '@/category/domain/entities/category.entity'
import { CategoryDataBuilder } from '@/category/domain/testing/helpers/category-data-builder'
import { ConflictError } from '@/shared/domain/erros/conflict-error'
import { DatabaseModule } from '@/shared/infrastructure/database/database.module'
import { setupPrismaTests } from '@/shared/infrastructure/database/prisma/testing/setup-prisma/setup-prisma-tests'
import { Test } from '@nestjs/testing'
import { PrismaClient } from '@prisma/client'
import { CategoryPrismaRepository } from '../../category-prisma.repository'

describe('CategoryPrismaRepository integration tests', () => {
  const prismaService = new PrismaClient()
  let sut: CategoryPrismaRepository

  beforeAll(async () => {
    setupPrismaTests()
    await Test.createTestingModule({
      imports: [DatabaseModule.forTests(prismaService)],
    }).compile()
  })

  beforeEach(async () => {
    sut = new CategoryPrismaRepository(prismaService as any)
    await prismaService.category.deleteMany()
  })

  it('Should insert a new entity', async () => {
    const entity = new CategoryEntity(CategoryDataBuilder({}))
    await sut.insert(entity)
    const result = await prismaService.category.findUnique({
      where: {
        id: entity._id,
      },
    })
    expect(result).toStrictEqual(entity.toJSON())
  })

  it('should throws a error a entity found by name', async () => {
    const entity = new CategoryEntity(
      CategoryDataBuilder({ name: 'a@a.com'.toLocaleLowerCase() }),
    )
    await prismaService.category.create({
      data: entity.toJSON(),
    })
    await expect(() => sut.categoryExist(entity.name)).rejects.toThrow(
      new ConflictError(`Category name already used`),
    )
  })

  it('should not finds a entity by name', async () => {
    expect.assertions(0)
    await sut.categoryExist('aa'.toLocaleLowerCase())
  })
})

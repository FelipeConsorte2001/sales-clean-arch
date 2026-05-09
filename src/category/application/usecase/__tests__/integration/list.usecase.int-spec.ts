import { CategoryEntity } from '@/category/domain/entities/category.entity'
import { CategoryDataBuilder } from '@/category/domain/testing/helpers/category-data-builder'
import { CategoryPrismaRepository } from '@/category/infrastructure/database/prisma/repositories/category-prisma.repository'
import { DatabaseModule } from '@/shared/infrastructure/database/database.module'
import { setupPrismaTests } from '@/shared/infrastructure/database/prisma/testing/setup-prisma/setup-prisma-tests'
import { Test, TestingModule } from '@nestjs/testing'
import { PrismaClient } from '@prisma/client'
import { ListCategoryUseCase } from '../../list-category.usecase'

describe('ListUseCase integration tests', () => {
  const prismaService = new PrismaClient()
  let sut: ListCategoryUseCase
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
    sut = new ListCategoryUseCase(repository)
    await prismaService.category.deleteMany()
  })

  afterAll(async () => {
    await prismaService.category.deleteMany()
    await module.close()
  })

  it('should return throws the users orded by created at', async () => {
    const createAt = new Date()
    const entities: CategoryEntity[] = []
    const arrage = Array(3).fill(CategoryDataBuilder({}))

    arrage.forEach((element, index) => {
      entities.push(
        new CategoryEntity({
          ...element,
          name: element?.name?.toLowerCase(),
          createdAt: new Date(createAt.getTime() + index),
        }),
      )
    })
    await prismaService.category.createMany({
      data: entities.map(item => item.toJSON()),
    })
    const output = await sut.execute({})
    expect(output).toStrictEqual({
      items: entities.reverse().map(item => item.toJSON()),
      total: 3,
      currentPage: 1,
      perPage: 15,
      lastPage: 1,
    })
  })

  it('should return output using filter, sort and paginate', async () => {
    const createAt = new Date()
    const entities: CategoryEntity[] = []
    const arrage = ['test', 'a', 'b']

    arrage.forEach((element, index) => {
      entities.push(
        new CategoryEntity({
          ...CategoryDataBuilder({ name: element }),
          createdAt: new Date(createAt.getTime() + index),
        }),
      )
    })
    await prismaService.category.createMany({
      data: entities.map(item => item.toJSON()),
    })

    let output = await sut.execute({
      page: 1,
      perPage: 2,
      sort: 'name',
      sortDir: 'asc',
      filter: 'test',
    })
    expect(output).toMatchObject({
      items: [entities[0].toJSON()],
      total: 1,
      currentPage: 1,
      perPage: 2,
      lastPage: 1,
    })
    output = await sut.execute({
      page: 1,
      perPage: 1,
      sort: 'name',
      sortDir: 'asc',
      filter: 'test',
    })
    expect(output).toMatchObject({
      items: [entities[0].toJSON()],
      total: 1,
      currentPage: 1,
      perPage: 1,
      lastPage: 1,
    })
  })
})

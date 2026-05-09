import { CategoryEntity } from '@/category/domain/entities/category.entity'
import {
  SearchParams,
  SearchResults,
} from '@/category/domain/repositories/category.repository'
import { CategoryDataBuilder } from '@/category/domain/testing/helpers/category-data-builder'
import { ConflictError } from '@/shared/domain/erros/conflict-error'
import { NotFoundError } from '@/shared/domain/erros/not-found-error'
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

  it('should finds a entity by id', async () => {
    const entity = new CategoryEntity(CategoryDataBuilder({}))
    const newCategory = await prismaService.category.create({
      data: entity.toJSON(),
    })
    const output = await sut.findById(newCategory.id)
    expect(output.toJSON()).toStrictEqual(entity.toJSON())
  })
  it('should throws error when entity not found', async () => {
    const fakeId = 'fakeId'
    await expect(() => sut.findById(fakeId)).rejects.toThrow(
      new NotFoundError(`CategoryModel not found using ID ${fakeId}`),
    )
  })

  describe('search method test', () => {
    it('should apply only pagination when the other params are null', async () => {
      const createAt = new Date()
      const entities: CategoryEntity[] = []
      const arrage = Array(16).fill(CategoryDataBuilder({}))
      arrage.forEach((element, index) => {
        entities.push(
          new CategoryEntity({
            ...element,
            createdAt: new Date(createAt.getTime() + index),
          }),
        )
      })
      await prismaService.category.createMany({
        data: entities.map(item => item.toJSON()),
      })

      const searchOutput = await sut.search(new SearchParams())

      expect(searchOutput).toBeInstanceOf(SearchResults)
      expect(searchOutput.total).toBe(16)
      expect(searchOutput.items.length).toBe(15)
      expect(
        searchOutput.items.forEach(item =>
          expect(item).toBeInstanceOf(CategoryEntity),
        ),
      )
    })
    it('should search using filter, sort and paginate', async () => {
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

      const searchOutputPage1 = await sut.search(
        new SearchParams({
          page: 1,
          perPage: 2,
          sort: 'name',
          sortDir: 'asc',
          filter: 'test',
        }),
      )
      expect(searchOutputPage1.items[0].toJSON()).toMatchObject(
        entities[0].toJSON(),
      )
    })
  })
})

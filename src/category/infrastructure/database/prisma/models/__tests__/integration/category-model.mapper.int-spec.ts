import { CategoryEntity } from '@/category/domain/entities/category.entity'
import { ValidationError } from '@/shared/domain/erros/validation-error'
import { setupPrismaTests } from '@/shared/infrastructure/database/prisma/testing/setup-prisma/setup-prisma-tests'
import { Category, PrismaClient } from '@prisma/client'
import { CategoryModelMapper } from '../../category-model.mapper'

describe('CategoryModelMapper integration tests', () => {
  let prismaService: PrismaClient
  let props: any

  beforeAll(async () => {
    setupPrismaTests()
    prismaService = new PrismaClient()
    await prismaService.$connect()
  })

  beforeEach(async () => {
    await prismaService.category.deleteMany()
    props = {
      id: 'd4255494-f981-4d26-a2a1-35d3f5b8d36a',
      name: 'test category',
      createdAt: new Date(),
      updatedAt: new Date(),
    }
  })

  afterAll(async () => {
    await prismaService.$disconnect()
  })

  it('should throws error when user model is invalid', async () => {
    const model: Category = Object.assign(props, { name: null })
    expect(() => CategoryModelMapper.toEntity(model)).toThrow(ValidationError)
  })

  it('should convert a user model to a user entity', async () => {
    const model: Category = await prismaService.category.create({ data: props })
    const sut = CategoryModelMapper.toEntity(model)
    expect(sut).toBeInstanceOf(CategoryEntity)
    expect(sut.toJSON()).toStrictEqual(props)
  })
})

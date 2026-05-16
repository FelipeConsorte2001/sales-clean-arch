import { CategoryModule } from '@/category/category.module'
import { CategoryEntity } from '@/category/domain/entities/category.entity'
import { CategoryRepository } from '@/category/domain/repositories/category.repository'
import { CategoryDataBuilder } from '@/category/domain/testing/helpers/category-data-builder'
import { applyGlobalConfig } from '@/global-config'
import { DatabaseModule } from '@/shared/infrastructure/database/database.module'
import { setupPrismaTests } from '@/shared/infrastructure/database/prisma/testing/setup-prisma/setup-prisma-tests'
import { EnvConfigModule } from '@/shared/infrastructure/env-config/env-config.module'
import { INestApplication } from '@nestjs/common'
import { Test, TestingModule } from '@nestjs/testing'
import { PrismaClient } from '@prisma/client'
import { instanceToPlain } from 'class-transformer'
import request from 'supertest'
import { CategoryController } from '../../category.controller'

describe('CategoryController e2e tests', () => {
  let module: TestingModule
  let app: INestApplication
  let repository: CategoryRepository
  let entity: CategoryEntity
  const prismaService = new PrismaClient()
  beforeAll(async () => {
    setupPrismaTests()
    module = await Test.createTestingModule({
      imports: [
        EnvConfigModule,
        CategoryModule,
        DatabaseModule.forTests(prismaService),
      ],
    }).compile()
    app = module.createNestApplication()
    applyGlobalConfig(app)
    await app.init()
    repository = module.get<CategoryRepository>('CategoryRepository')
    repository = module.get<CategoryRepository>('CategoryRepository')
  })

  beforeEach(async () => {
    await prismaService.category.deleteMany()
    entity = new CategoryEntity(CategoryDataBuilder({}))
    await repository.insert(entity)
  })
  describe('GET /users', () => {
    it('should should return the users ordered by createdAt', async () => {
      const createdAt = new Date()
      const entities: CategoryEntity[] = []
      const arrange = Array(3).fill(CategoryDataBuilder({}))
      arrange.forEach((element, index) => {
        entities.push(
          new CategoryEntity({
            ...element,
            createdAt: new Date(createdAt.getTime() + index),
          }),
        )
      })
      await prismaService.category.deleteMany()
      await prismaService.category.createMany({
        data: entities.map(item => item.toJSON()),
      })
      const serachParams = {}
      const queryParams = new URLSearchParams(serachParams).toString()

      const res = await request(app.getHttpServer())
        .get(`/category?${queryParams}`)
        .expect(200)
      expect(Object.keys(res.body)).toStrictEqual(['data', 'meta'])
      expect(res.body).toStrictEqual({
        data: [...entities]
          .reverse()
          .map(item =>
            instanceToPlain(CategoryController.categoryToResponse(item)),
          ),
        meta: { total: 3, currentPage: 1, perPage: 15, lastPage: 1 },
      })
    })
    it('should return a error with 422 code when query params is invalid', async () => {
      const res = await request(app.getHttpServer())
        .get(`/category?fake=10`)
        .expect(422)
      expect(res.body.error).toBe('Unprocessable Entity')
      expect(res.body.message).toEqual(['property fake should not exist'])
    })
  })
})

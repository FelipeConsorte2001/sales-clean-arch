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
  let app: INestApplication
  let module: TestingModule
  let repository: CategoryRepository
  const prismaService = new PrismaClient()
  let entity: CategoryEntity

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
  })

  beforeEach(async () => {
    entity = new CategoryEntity(CategoryDataBuilder({}))
    await repository.insert(entity)
  })
  afterAll(async () => {
    await prismaService.category.deleteMany()
  })

  describe('GET /category/:id', () => {
    it('Should get a category by id', async () => {
      const res = await request(app.getHttpServer())
        .get(`/category/${entity._id}`)
        .expect(200)

      const presenter = CategoryController.categoryToResponse(entity.toJSON())
      const serialized = instanceToPlain(presenter)
      expect(res.body.data).toStrictEqual(serialized)
    })

    it('should return a error with 404 code when throw notFoundError with invalid id', async () => {
      await request(app.getHttpServer())
        .get(`/category/fake`)
        .expect(404)
        .expect({
          statusCode: 404,
          error: 'Not Found',
          message: 'UserModel not found using ID fake',
        })
    })
  })
})

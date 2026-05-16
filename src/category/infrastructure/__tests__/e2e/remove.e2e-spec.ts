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
import request from 'supertest'

describe('Category delete e2e tests', () => {
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
    await prismaService.category.deleteMany()
    entity = new CategoryEntity(CategoryDataBuilder({}))
    await repository.insert(entity)
  })

  it('should remove a category', async () => {
    await request(app.getHttpServer())
      .delete(`/category/${entity._id}`)
      .expect(204)
      .expect({})
  })
  it('should return a error with 404 code when throw notFoundError with invalid id', async () => {
    await request(app.getHttpServer())
      .delete(`/category/fake`)
      .expect(404)
      .expect({
        statusCode: 404,
        error: 'Not Found',
        message: 'CategoryModel not found using ID fake',
      })
  })
})

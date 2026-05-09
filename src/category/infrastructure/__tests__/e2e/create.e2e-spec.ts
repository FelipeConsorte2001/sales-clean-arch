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
import { CategoryModule } from '../../category.module'
import { CreateCategoryDto } from '../../dtos/createCategory.dto'

describe('Category create e2e tests', () => {
  let app: INestApplication
  let module: TestingModule
  let repository: CategoryRepository
  let categoryCreateDto: CreateCategoryDto
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
  })

  beforeEach(async () => {
    categoryCreateDto = {
      name: 'new',
    }
    await prismaService.category.deleteMany()
  })

  describe('POST /category', () => {
    it('Should create a user', async () => {
      const res = await request(app.getHttpServer())
        .post('/category')
        .send(categoryCreateDto)
        .expect(201)

      expect(Object.keys(res.body)).toStrictEqual(['data'])
      const category = await repository.findById(res.body.data.id)
      const presenter = CategoryController.categoryToResponse(category.toJSON())
      const seralized = instanceToPlain(presenter)
      expect(res.body.data).toStrictEqual(seralized)
    })

    it('should return a error with 422 code when the request body is invalid', async () => {
      const res = await request(app.getHttpServer())
        .post('/category')
        .send({})
        .expect(422)
      expect(res.body.error).toBe('Unprocessable Entity')
      expect(res.body.message).toEqual([
        'name should not be empty',
        'name must be a string',
      ])
    })

    it('should return a error with 422 code when the name field is invalid', async () => {
      delete categoryCreateDto.name
      const res = await request(app.getHttpServer())
        .post('/category')
        .send(categoryCreateDto)
        .expect(422)
      expect(res.body.error).toBe('Unprocessable Entity')
      expect(res.body.message).toEqual([
        'name should not be empty',
        'name must be a string',
      ])
    })

    it('should return a error with 422 code with invalid field provided', async () => {
      const res = await request(app.getHttpServer())
        .post('/category')
        .send(Object.assign(categoryCreateDto, { xpto: 'fake' }))
        .expect(422)

      expect(res.body.error).toBe('Unprocessable Entity')
      expect(res.body.message).toEqual(['property xpto should not exist'])
    })

    it('should return a error with 409 code when the category already exist', async () => {
      const entity = new CategoryEntity(
        CategoryDataBuilder({
          name: 'new',
        }),
      )
      await repository.insert(entity)
      const res = await request(app.getHttpServer())
        .post('/category')
        .send({ name: entity.name })
        .expect(409)

      expect(res.body.error).toBe('Conflict')
      expect(res.body.message).toEqual('Category name already used')
    })

    it('should return ignore cameCase', async () => {
      const entity = new CategoryEntity(
        CategoryDataBuilder({
          name: 'A',
        }),
      )
      await repository.insert(entity)
      const res = await request(app.getHttpServer())
        .post('/category')
        .send({ name: 'a' })
        .expect(409)

      expect(res.body.error).toBe('Conflict')
      expect(res.body.message).toEqual('Category name already used')
    })
  })
})

import { applyGlobalConfig } from '@/global-config'
import { DatabaseModule } from '@/shared/infrastructure/database/database.module'
import { setupPrismaTests } from '@/shared/infrastructure/database/prisma/testing/setup-prisma/setup-prisma-tests'
import { EnvConfigModule } from '@/shared/infrastructure/env-config/env-config.module'
import { UserEntity } from '@/users/domain/entities/user.entity'
import { UserRepository } from '@/users/domain/repositories/user.repository'
import { UserDataBuilder } from '@/users/domain/testing/helpers/user-data-builder'
import { INestApplication } from '@nestjs/common'
import { Test, TestingModule } from '@nestjs/testing'
import { PrismaClient } from '@prisma/client'
import { instanceToPlain } from 'class-transformer'
import request from 'supertest'
import { UsersController } from '../../users.controller'
import { UsersModule } from '../../users.module'

describe('UsersController e2e tests', () => {
  let module: TestingModule
  let app: INestApplication
  let repository: UserRepository
  let entity: UserEntity
  const prismaService = new PrismaClient()
  beforeAll(async () => {
    setupPrismaTests()
    module = await Test.createTestingModule({
      imports: [
        EnvConfigModule,
        UsersModule,
        DatabaseModule.forTests(prismaService),
      ],
    }).compile()
    app = module.createNestApplication()
    applyGlobalConfig(app)
    await app.init()
    repository = module.get<UserRepository>('UserRepository')
  })

  beforeEach(async () => {
    await prismaService.user.deleteMany()
    entity = new UserEntity(UserDataBuilder({ email: 'a@a.com' }))
    await repository.insert(entity)
  })
  describe('GET /users', () => {
    it('should should return the users ordered by createdAt', async () => {
      const createdAt = new Date()
      const entities: UserEntity[] = []
      const arrange = Array(3).fill(UserDataBuilder({}))
      arrange.forEach((element, index) => {
        entities.push(
          new UserEntity({
            ...element,
            email: `a${index}@a.com`,
            createdAt: new Date(createdAt.getTime() + index),
            cpf: `${element.cpf + index}`,
          }),
        )
      })
      await prismaService.user.deleteMany()
      await prismaService.user.createMany({
        data: entities.map(item => item.toJSON()),
      })
      const serachParams = {}
      const queryParams = new URLSearchParams(serachParams).toString()

      const res = await request(app.getHttpServer())
        .get(`/users?${queryParams}`)
        .expect(200)
      expect(Object.keys(res.body)).toStrictEqual(['data', 'meta'])
      expect(res.body).toStrictEqual({
        data: [...entities]
          .reverse()
          .map(item => instanceToPlain(UsersController.userToResponse(item))),
        meta: { total: 3, currentPage: 1, perPage: 15, lastPage: 1 },
      })
    })
    it('should return a error with 422 code when query params is invalid', async () => {
      const res = await request(app.getHttpServer())
        .get(`/users?fake=10`)
        .expect(422)
      expect(res.body.error).toBe('Unprocessable Entity')
      expect(res.body.message).toEqual(['property fake should not exist'])
    })
  })
})

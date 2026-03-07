import { applyGlobalConfig } from '@/global-config'
import { HashProvider } from '@/shared/application/provider/hash-provider'
import { DatabaseModule } from '@/shared/infrastructure/database/database.module'
import { setupPrismaTests } from '@/shared/infrastructure/database/prisma/testing/setup-prisma/setup-prisma-tests'
import { EnvConfigModule } from '@/shared/infrastructure/env-config/env-config.module'
import { UserEntity } from '@/users/domain/entities/user.entity'
import { UserRepository } from '@/users/domain/repositories/user.repository'
import { UserDataBuilder } from '@/users/domain/testing/helpers/user-data-builder'
import { INestApplication } from '@nestjs/common'
import { Test, TestingModule } from '@nestjs/testing'
import { PrismaClient } from '@prisma/client'
import request from 'supertest'
import { bcryptjsHashProvider } from '../../providers/bcryptjs-hash.provider'
import { UsersModule } from '../../users.module'

describe('UsersController e2e tests', () => {
  let app: INestApplication
  let module: TestingModule
  let repository: UserRepository
  const prismaService = new PrismaClient()
  let entity: UserEntity
  let hashPassword: string
  let accessToken: string
  let hashProvider: HashProvider

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
    hashProvider = new bcryptjsHashProvider()
    hashPassword = await hashProvider.generateHash('1234')
  })

  beforeEach(async () => {
    await prismaService.user.deleteMany()
    entity = new UserEntity(
      UserDataBuilder({ email: 'a@a.com', password: hashPassword }),
    )
    await repository.insert(entity)
    const loginResponse = await request(app.getHttpServer())
      .post('/users/login')
      .send({ email: 'a@a.com', password: '1234' })
      .expect(200)
    accessToken = loginResponse.body.accessToken
  })

  describe('DELETE /users/:id', () => {
    it('should remove a user', async () => {
      await request(app.getHttpServer())
        .delete(`/users/${entity._id}`)
        .set('Authorization', `Bearer ${accessToken}`)
        .expect(204)
        .expect({})
    })
    it('should return a error with 404 code when throw notFoundError with invalid id', async () => {
      await request(app.getHttpServer())
        .delete(`/users/fake`)
        .set('Authorization', `Bearer ${accessToken}`)
        .expect(404)
        .expect({
          statusCode: 404,
          error: 'Not Found',
          message: 'UserModel not found using ID fake',
        })
    })

    it('should return a error with 401 code when user is unauthorized', async () => {
      await request(app.getHttpServer())
        .delete(`/users/${entity._id}`)
        .expect(401)
        .expect({
          statusCode: 401,
          message: 'Unauthorized',
        })
    })
  })
})

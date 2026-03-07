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
import { SinginDto } from '../../dtos/signin.dto'
import { bcryptjsHashProvider } from '../../providers/bcryptjs-hash.provider'
import { UsersModule } from '../../users.module'

describe('UsersController e2e tests', () => {
  let app: INestApplication
  let module: TestingModule
  let repository: UserRepository
  let signinDto: SinginDto
  let hashProvider: HashProvider
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
    hashProvider = new bcryptjsHashProvider()
  })

  beforeEach(async () => {
    signinDto = {
      email: 'a@a.com',
      password: 'TestPassword123',
    }
    await prismaService.user.deleteMany()
  })

  describe('POST /users/login', () => {
    it('should authenticate a user', async () => {
      const passwordHash = await hashProvider.generateHash(signinDto.password)
      const entity = new UserEntity({
        ...UserDataBuilder({}),
        createdAt: new Date(),
        updatedAt: new Date(),
        email: signinDto.email,
        password: passwordHash,
      })
      await repository.insert(entity)

      const res = await request(app.getHttpServer())
        .post('/users/login')
        .send(signinDto)
        .expect(200)
      //  it will use when the autehtication be ready
      // expect(Object.keys(res.body)).toStrictEqual(['accessToken'])
      // expect(typeof res.body.accessToken).toEqual('string')
      expect(entity.name).toStrictEqual(res.body.data.name)
    })

    it('should return a error with 422 code when the request body is invalid', async () => {
      const res = await request(app.getHttpServer())
        .post('/users/login')
        .send({})
        .expect(422)
      expect(res.body.error).toBe('Unprocessable Entity')
      expect(res.body.message).toEqual([
        'email must be an email',
        'email should not be empty',
        'email must be a string',
        'password should not be empty',
        'password must be a string',
      ])
    })

    it('should return a error with 422 code when the email field is invalid', async () => {
      delete signinDto.email
      const res = await request(app.getHttpServer())
        .post('/users/login')
        .send(signinDto)
        .expect(422)
      expect(res.body.error).toBe('Unprocessable Entity')
      expect(res.body.message).toEqual([
        'email must be an email',
        'email should not be empty',
        'email must be a string',
      ])
    })

    it('should return a error with 422 code when the password field is invalid', async () => {
      delete signinDto.password
      const res = await request(app.getHttpServer())
        .post('/users/login')
        .send(signinDto)
        .expect(422)
      expect(res.body.error).toBe('Unprocessable Entity')
      expect(res.body.message).toEqual([
        'password should not be empty',
        'password must be a string',
      ])
    })

    it('should return a error with 404 code when email not found', async () => {
      const email = 'b@b.com'
      const res = await request(app.getHttpServer())
        .post('/users/login')
        .send({ email: email, password: 'fake' })
        .expect(404)
      expect(res.body.error).toBe('Not Found')
      expect(res.body.message).toEqual(
        `UserModel not found using email ${email}`,
      )
    })

    it('should return a error with 400 code when email not found', async () => {
      const passwordHash = await hashProvider.generateHash(signinDto.password)
      const entity = new UserEntity({
        ...UserDataBuilder({}),
        email: signinDto.email,
        password: passwordHash,
      })
      await repository.insert(entity)

      await request(app.getHttpServer())
        .post('/users/login')
        .send({ email: signinDto.email, password: 'fake' })
        .expect(400)
        .expect({
          statusCode: 400,
          error: 'Bad Request',
          message: 'Invalid data not provided',
        })
    })
  })
})

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
import { UpdatePasswordDto } from '../../dtos/update-password.dto'
import { bcryptjsHashProvider } from '../../providers/bcryptjs-hash.provider'
import { UsersModule } from '../../users.module'

describe('UsersController e2e tests', () => {
  let app: INestApplication
  let module: TestingModule
  let repository: UserRepository
  let updatePasswordDto: UpdatePasswordDto
  const prismaService = new PrismaClient()
  let hashProvider: HashProvider
  let entity: UserEntity

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
    const oldPassword = 'oldPassword'
    updatePasswordDto = {
      oldPassword: oldPassword,
      password: 'newPassword',
    }
    await prismaService.user.deleteMany()
    const hashPassword = await hashProvider.generateHash(oldPassword)
    entity = new UserEntity(
      UserDataBuilder({ email: 'a@a.com', password: hashPassword }),
    )
    await repository.insert(entity)
    await request(app.getHttpServer())
      .post('/users/login')
      .send({ email: 'a@a.com', password: oldPassword })
      .expect(200)
  })

  describe('PATCH /users', () => {
    it('should update a password', async () => {
      const res = await request(app.getHttpServer())
        .patch(`/users/${entity._id}`)

        .send(updatePasswordDto)
        .expect(200)
      expect(Object.keys(res.body)).toStrictEqual(['data'])
      const user = await repository.findById(res.body.data.id)
      const checkNewPassword = await hashProvider.compareHash(
        'newPassword',
        user.password,
      )

      expect(checkNewPassword).toBeTruthy()
    })

    it('should return a error with 422 code when the request body is invalid', async () => {
      const res = await request(app.getHttpServer())
        .patch(`/users/fakeId`)

        .send({})
        .expect(422)
      expect(res.body.error).toBe('Unprocessable Entity')
      expect(res.body.message).toEqual([
        'password should not be empty',
        'password must be a string',
        'oldPassword should not be empty',
        'oldPassword must be a string',
      ])
    })

    it('should return a error with 404 code when throw Not Foud error with invalid', async () => {
      const res = await request(app.getHttpServer())
        .patch(`/users/fakeId`)

        .send(updatePasswordDto)
        .expect(404)
      expect(res.body.error).toBe('Not Found')
      expect(res.body.message).toEqual('UserModel not found using ID fakeId')
    })

    it('should return a error with 422 code when the password field is invalid', async () => {
      delete updatePasswordDto.password
      const res = await request(app.getHttpServer())
        .patch(`/users/${entity._id}`)

        .send(updatePasswordDto)
        .expect(422)
      expect(res.body.error).toBe('Unprocessable Entity')
      expect(res.body.message).toEqual([
        'password should not be empty',
        'password must be a string',
      ])
    })

    it('should return a error with 422 code when the oldPassword field is invalid', async () => {
      delete updatePasswordDto.oldPassword
      const res = await request(app.getHttpServer())
        .patch(`/users/${entity._id}`)

        .send(updatePasswordDto)
        .expect(422)
      expect(res.body.error).toBe('Unprocessable Entity')
      expect(res.body.message).toEqual([
        'oldPassword should not be empty',
        'oldPassword must be a string',
      ])
    })
    it('should return a error with 422 code when password does not match', async () => {
      updatePasswordDto.oldPassword = 'fake'
      await request(app.getHttpServer())
        .patch(`/users/${entity._id}`)

        .send(updatePasswordDto)
        .expect(422)
        .expect({
          statusCode: 422,
          error: 'Unprocessable Entity',
          message: 'Old password does not match',
        })
    })
  })
})

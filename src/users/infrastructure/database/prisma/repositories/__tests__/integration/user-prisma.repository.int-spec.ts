import { ConflictError } from '@/shared/domain/erros/conflict-error'
import { NotFoundError } from '@/shared/domain/erros/not-found-error'
import { DatabaseModule } from '@/shared/infrastructure/database/database.module'
import { setupPrismaTests } from '@/shared/infrastructure/database/prisma/testing/setup-prisma/setup-prisma-tests'
import { UserEntity } from '@/users/domain/entities/user.entity'
import {
  SearchParams,
  SearchResults,
} from '@/users/domain/repositories/user.repository'
import { UserDataBuilder } from '@/users/domain/testing/helpers/user-data-builder'
import { Test } from '@nestjs/testing'
import { PrismaClient } from '@prisma/client'
import { UserPrismaRepository } from '../../user-prisma.repository'

describe('UserPrismaRepository integration tests', () => {
  const prismaService = new PrismaClient()
  let sut: UserPrismaRepository

  beforeAll(async () => {
    setupPrismaTests()
    await Test.createTestingModule({
      imports: [DatabaseModule.forTests(prismaService)],
    }).compile()
  })

  beforeEach(async () => {
    sut = new UserPrismaRepository(prismaService as any)
    await prismaService.user.deleteMany()
  })

  it('should throws error on delete when a entity not found', async () => {
    const entity = new UserEntity(UserDataBuilder({}))
    await expect(() => sut.delete(entity.id)).rejects.toThrow(
      new NotFoundError(`UserModel not found using ID ${entity._id}`),
    )
  })

  it('should delete a entity', async () => {
    const entity = new UserEntity(UserDataBuilder({}))
    await prismaService.user.create({ data: entity.toJSON() })
    await sut.delete(entity._id)
    const output = await prismaService.user.findUnique({
      where: { id: entity._id },
    })
    expect(output).toBeNull()
  })

  it('should throws error when email not found', async () => {
    const email = 'email@email.com'
    await expect(() => sut.findByEmail(email)).rejects.toThrow(
      new NotFoundError(`UserModel not found using email ${email}`),
    )
  })
  it('should finds a entity by email', async () => {
    const entity = new UserEntity(UserDataBuilder({ email: 'a@a.com' }))
    await prismaService.user.create({
      data: entity.toJSON(),
    })
    const output = await sut.findByEmail(entity.email)
    expect(output.toJSON()).toStrictEqual(entity.toJSON())
  })

  it('should throws a error a entity found by email', async () => {
    const entity = new UserEntity(UserDataBuilder({ email: 'a@a.com' }))
    await prismaService.user.create({
      data: entity.toJSON(),
    })
    await expect(() => sut.emailExist(entity.email)).rejects.toThrow(
      new ConflictError(`Email address already used`),
    )
  })
  it('should not finds a entity by email', async () => {
    expect.assertions(0)
    await sut.emailExist('a@a.com')
  })

  describe('search method test', () => {
    it('should apply only pagination when the other params are null', async () => {
      const createAt = new Date()
      const entities: UserEntity[] = []
      const arrage = Array(16).fill(UserDataBuilder({}))
      arrage.forEach((element, index) => {
        entities.push(
          new UserEntity({
            ...element,
            email: `test${index}@gmail.com`,
            createdAt: new Date(createAt.getTime() + index),
            cpf: `${element.cpf + index}`,
          }),
        )
      })
      await prismaService.user.createMany({
        data: entities.map(item => item.toJSON()),
      })

      const searchOutput = await sut.search(new SearchParams())
      const items = searchOutput.items

      expect(searchOutput).toBeInstanceOf(SearchResults)
      expect(searchOutput.total).toBe(16)
      expect(searchOutput.items.length).toBe(15)
      expect(
        searchOutput.items.forEach(item =>
          expect(item).toBeInstanceOf(UserEntity),
        ),
      )
      items.reverse().forEach((items, index) => {
        expect(`test${index + 1}@gmail.com`).toBe(items.email)
      })
    })
    it('should search using filter, sort and paginate', async () => {
      const createAt = new Date()
      const entities: UserEntity[] = []
      const arrage = ['test', 'a', 'TEST', 'b', 'TeSt']

      arrage.forEach((element, index) => {
        entities.push(
          new UserEntity({
            ...UserDataBuilder({ name: element }),
            createdAt: new Date(createAt.getTime() + index),
          }),
        )
      })
      await prismaService.user.createMany({
        data: entities.map(item => item.toJSON()),
      })

      const searchOutputPage1 = await sut.search(
        new SearchParams({
          page: 1,
          perPage: 2,
          sort: 'name',
          sortDir: 'asc',
          filter: 'TEST',
        }),
      )
      const searchOutputPage2 = await sut.search(
        new SearchParams({
          page: 2,
          perPage: 2,
          sort: 'name',
          sortDir: 'asc',
          filter: 'TEST',
        }),
      )

      expect(searchOutputPage1.items[0].toJSON()).toMatchObject(
        entities[0].toJSON(),
      )
      expect(searchOutputPage1.items[1].toJSON()).toMatchObject(
        entities[4].toJSON(),
      )
      expect(searchOutputPage2.items[0].toJSON()).toMatchObject(
        entities[2].toJSON(),
      )
    })
  })
})

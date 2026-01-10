import { DatabaseModule } from '@/shared/infrastructure/database/database.module'
import { setupPrismaTests } from '@/shared/infrastructure/database/prisma/testing/setup-prisma/setup-prisma-tests'
import { UserPrismaRepository } from '@/users/infrastructure/database/prisma/repositories/user-prisma.repository'
import { Test, TestingModule } from '@nestjs/testing'
import { PrismaClient } from '@prisma/client'
import { SignupUseCase } from '../../sign-up.usecase'

describe('SignupUsecase integration tests', () => {
  const prismaService = new PrismaClient()
  let sut: SignupUseCase
  let repository: UserPrismaRepository

  let module: TestingModule

  beforeAll(async () => {
    setupPrismaTests()
    module = await Test.createTestingModule({
      imports: [DatabaseModule.forTests(prismaService)],
    }).compile()
    repository = new UserPrismaRepository(prismaService as any)
  })

  beforeEach(async () => {
    sut = new SignupUseCase(repository)
    await prismaService.user.deleteMany()
  })

  afterAll(async () => {
    await module.close()
  })
  it('should create a user', async () => {
    const props = {
      name: 'test name',
      email: 'a@a.com',
      password: '123',
      phone: '(11)9876-3123',
      typeUser: 1,
      cpf: '123-456-678-99',
    }
    const output = await sut.execute(props)
    expect(output.id).toBeDefined()
    expect(output.createdAt).toBeInstanceOf(Date)
  })
})

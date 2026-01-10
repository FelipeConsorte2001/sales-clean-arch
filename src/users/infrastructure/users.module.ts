import { PrismaService } from '@/shared/infrastructure/database/prisma/prisma.service'
import { Module } from '@nestjs/common'
import { ListUserUseCase } from '../application/usecase/list-users.usecase'
import { SignupUseCase } from '../application/usecase/sign-up.usecase'
import { UserRepository } from '../domain/repositories/user.repository'
import { UserPrismaRepository } from './database/prisma/repositories/user-prisma.repository'
import { UsersController } from './users.controller'

@Module({
  controllers: [UsersController],
  providers: [
    {
      provide: 'PrismaService',
      useClass: PrismaService,
    },
    {
      provide: 'UserRepository',
      useFactory: (prismaService: PrismaService) => {
        return new UserPrismaRepository(prismaService)
      },
      inject: ['PrismaService'],
    },
    {
      provide: ListUserUseCase,
      useFactory: (userRepository: UserRepository) => {
        return new ListUserUseCase(userRepository)
      },
      inject: ['UserRepository'],
    },
    {
      provide: SignupUseCase,
      useFactory: (userRepository: UserRepository) => {
        return new SignupUseCase(userRepository)
      },
      inject: ['UserRepository'],
    },
  ],
})
export class UsersModule {}

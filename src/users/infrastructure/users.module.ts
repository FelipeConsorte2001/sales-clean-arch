import { HashProvider } from '@/shared/application/provider/hash-provider'
import { PrismaService } from '@/shared/infrastructure/database/prisma/prisma.service'
import { Module } from '@nestjs/common'
import { DeleteUserUseCase } from '../application/usecase/delete.usescase'
import { GetUserUseCase } from '../application/usecase/get-user.usecase'
import { ListUserUseCase } from '../application/usecase/list-users.usecase'
import { SigninUseCase } from '../application/usecase/sign-in.usecase'
import { SignupUseCase } from '../application/usecase/sign-up.usecase'
import { UpdatePasswordUseCase } from '../application/usecase/update-password.usecase'
import { UpdateUserUseCase } from '../application/usecase/update-user.usecase'
import { UserRepository } from '../domain/repositories/user.repository'
import { UserPrismaRepository } from './database/prisma/repositories/user-prisma.repository'
import { bcryptjsHashProvider } from './providers/bcryptjs-hash.provider'
import { UsersController } from './users.controller'

@Module({
  controllers: [UsersController],
  providers: [
    {
      provide: 'PrismaService',
      useClass: PrismaService,
    },
    {
      provide: 'HashProvider',
      useClass: bcryptjsHashProvider,
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
    {
      provide: UpdatePasswordUseCase,
      useFactory: (
        userRepository: UserRepository,
        hashProvider: HashProvider,
      ) => {
        return new UpdatePasswordUseCase(userRepository, hashProvider)
      },
      inject: ['UserRepository', 'HashProvider'],
    },
    {
      provide: SigninUseCase,
      useFactory: (
        userRepository: UserRepository,
        hashProvider: HashProvider,
      ) => {
        return new SigninUseCase(userRepository, hashProvider)
      },
      inject: ['UserRepository', 'HashProvider'],
    },
    {
      provide: GetUserUseCase,
      useFactory: (userRepository: UserRepository) => {
        return new GetUserUseCase(userRepository)
      },
      inject: ['UserRepository'],
    },
    {
      provide: DeleteUserUseCase,
      useFactory: (userRepository: UserRepository) => {
        return new DeleteUserUseCase(userRepository)
      },
      inject: ['UserRepository'],
    },
    {
      provide: UpdateUserUseCase,
      useFactory: (userRepository: UserRepository) => {
        return new UpdateUserUseCase(userRepository)
      },
      inject: ['UserRepository'],
    },
  ],
})
export class UsersModule {}

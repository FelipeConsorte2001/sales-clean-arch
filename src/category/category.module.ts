import { AuthModule } from '@/auth/infrastructure/auth.module'
import { CategoryRepository } from '@/category/domain/repositories/category.repository'
import { PrismaService } from '@/shared/infrastructure/database/prisma/prisma.service'
import { bcryptjsHashProvider } from '@/users/infrastructure/providers/bcryptjs-hash.provider'
import { Module } from '@nestjs/common'
import { CreateUseCase } from './application/usecase/create.usecase'
import { DeleteCategoryUseCase } from './application/usecase/deleted.usecase'
import { GetCategoryUseCase } from './application/usecase/get-category.usecase'
import { ListCategoryUseCase } from './application/usecase/list-category.usecase'
import { CategoryController } from './infrastructure/category.controller'
import { CategoryPrismaRepository } from './infrastructure/database/prisma/repositories/category-prisma.repository'

@Module({
  imports: [AuthModule],
  controllers: [CategoryController],
  providers: [
    {
      provide: 'PrismaService',
      useClass: PrismaService,
    },
    {
      provide: 'CategoryRepository',
      useFactory: (prismaService: PrismaService) => {
        return new CategoryPrismaRepository(prismaService)
      },
      inject: ['PrismaService'],
    },
    {
      provide: 'HashProvider',
      useClass: bcryptjsHashProvider,
    },
    {
      provide: CreateUseCase,
      useFactory: (categoryRepository: CategoryRepository) => {
        return new CreateUseCase(categoryRepository)
      },
      inject: ['CategoryRepository'],
    },
    {
      provide: GetCategoryUseCase,
      useFactory: (categoryRepository: CategoryRepository) => {
        return new GetCategoryUseCase(categoryRepository)
      },
      inject: ['CategoryRepository'],
    },
    {
      provide: GetCategoryUseCase,
      useFactory: (categoryRepository: CategoryRepository) => {
        return new GetCategoryUseCase(categoryRepository)
      },
      inject: ['CategoryRepository'],
    },
    {
      provide: ListCategoryUseCase,
      useFactory: (categoryRepository: CategoryRepository) => {
        return new ListCategoryUseCase(categoryRepository)
      },
      inject: ['CategoryRepository'],
    },
    {
      provide: DeleteCategoryUseCase,
      useFactory: (categoryRepository: CategoryRepository) => {
        return new DeleteCategoryUseCase(categoryRepository)
      },
      inject: ['CategoryRepository'],
    },
  ],
})
export class CategoryModule {}

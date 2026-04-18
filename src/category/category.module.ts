import { AuthModule } from '@/auth/infrastructure/auth.module'
import { CategoryRepository } from '@/category/domain/repositories/category.repository'
import { PrismaService } from '@/shared/infrastructure/database/prisma/prisma.service'
import { bcryptjsHashProvider } from '@/users/infrastructure/providers/bcryptjs-hash.provider'
import { Module } from '@nestjs/common'
import { CreateCategoryUseCase } from './application/usecase/create.usecase'
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
      provide: CreateCategoryUseCase,
      useFactory: (categoryRepository: CategoryRepository) => {
        return new CreateCategoryUseCase(categoryRepository)
      },
      inject: ['CategoryRepository'],
    },
  ],
})
export class CategoryModule {}

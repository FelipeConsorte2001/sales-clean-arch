import { Module } from '@nestjs/common'
import { CategoryController } from './infrastructure/category.controller'

@Module({
  controllers: [CategoryController],
})
export class CategoryModule {}

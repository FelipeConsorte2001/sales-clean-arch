import { Body, Controller, HttpCode, Inject, Post } from '@nestjs/common'
import { ApiResponse, ApiTags } from '@nestjs/swagger'
import { CategoryOutput } from '../application/dtos/category-output'
import { CreateCategoryUseCase } from '../application/usecase/create.usecase'
import { CreateCategoryDto } from './dtos/createCategory.dto'
import { CategoryPresenter } from './presenters/category.presenter'

@Controller('category')
@ApiTags('users')
export class CategoryController {
  @Inject(CreateCategoryUseCase)
  private createCategoryUseCase: CreateCategoryUseCase

  static categoryToResponse(output: CategoryOutput) {
    return new CategoryPresenter(output)
  }
  @ApiResponse({
    status: 422,
    description: 'body has invalid data',
  })
  @HttpCode(201)
  @Post('')
  async createCategory(@Body() createCategoryDto: CreateCategoryDto) {
    const output = await this.createCategoryUseCase.execute(createCategoryDto)
    return CategoryController.categoryToResponse(output)
  }
}

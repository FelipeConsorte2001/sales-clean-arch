import {
  Body,
  Controller,
  Get,
  HttpCode,
  Inject,
  Param,
  Post,
  Query,
} from '@nestjs/common'
import { ApiResponse, ApiTags } from '@nestjs/swagger'
import { CategoryOutput } from '../application/dtos/category-output'
import { CreateUseCase } from '../application/usecase/create.usecase'
import { GetCategoryUseCase } from '../application/usecase/get-category.usecase'
import {
  ListCategoryUseCase,
  Output,
} from '../application/usecase/list-category.usecase'
import { CreateCategoryDto } from './dtos/createCategory.dto'
import { ListCategoriesDto } from './dtos/list-categories.dto'
import {
  CategoryCollectionPresenter,
  CategoryPresenter,
} from './presenters/category.presenter'

@Controller('category')
@ApiTags('category')
export class CategoryController {
  @Inject(CreateUseCase)
  private CreateUseCase: CreateUseCase

  @Inject(GetCategoryUseCase)
  private GetCategoryUseCase: GetCategoryUseCase

  @Inject(ListCategoryUseCase)
  private ListCategoryUseCase: ListCategoryUseCase

  static categoryToResponse(output: CategoryOutput) {
    return new CategoryPresenter(output)
  }

  static listCategoriesToResponse(output: Output) {
    return new CategoryCollectionPresenter(output)
  }

  @ApiResponse({
    status: 422,
    description: 'body has invalid data',
  })
  @HttpCode(201)
  @Post('')
  async createCategory(@Body() createCategoryDto: CreateCategoryDto) {
    const output = await this.CreateUseCase.execute(createCategoryDto)
    return CategoryController.categoryToResponse(output)
  }

  @ApiResponse({
    status: 404,
    description: 'id did not find',
  })
  @ApiResponse({
    status: 401,
    description: 'access unathorizathe',
  })
  @HttpCode(200)
  @Get(':id')
  async findOne(@Param('id') id: string) {
    const output = await this.GetCategoryUseCase.execute({ id })
    return CategoryController.categoryToResponse(output)
  }

  @ApiResponse({
    status: 404,
    description: 'id did not find',
  })
  @ApiResponse({
    status: 401,
    description: 'access unathorizathe',
  })
  @HttpCode(200)
  @Get()
  async find(@Query() searchParams: ListCategoriesDto) {
    const output = await this.ListCategoryUseCase.execute(searchParams)
    return CategoryController.listCategoriesToResponse(output)
  }
}

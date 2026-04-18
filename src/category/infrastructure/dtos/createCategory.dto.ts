import { CreateCategoryInput } from '@/category/application/usecase/create.usecase'
import { ApiProperty } from '@nestjs/swagger'
import { IsNotEmpty, IsString } from 'class-validator'

export class CreateCategoryDto implements CreateCategoryInput {
  @ApiProperty({ description: 'Category name' })
  @IsString()
  @IsNotEmpty()
  name: string
}

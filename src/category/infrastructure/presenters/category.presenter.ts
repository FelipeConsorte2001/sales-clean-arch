import { CategoryOutput } from '@/category/application/dtos/category-output'
import { ApiProperty } from '@nestjs/swagger'
import { Transform } from 'class-transformer'

export class CategoryPresenter {
  @ApiProperty({ description: 'name of category' })
  name: string

  @ApiProperty({ description: 'identify of category' })
  id: string

  @ApiProperty({ description: 'data create of user' })
  @Transform(({ value }: { value: Date }) => value.toISOString())
  createdAt: Date

  constructor(output: CategoryOutput) {
    this.name = output.name
    this.id = output.id
    this.createdAt = output.createdAt
  }
}

import { CategoryOutput } from '@/category/application/dtos/category-output'
import { Output as OutputListCategoryCollection } from '@/category/application/usecase/list-category.usecase'
import { CollectionPresenter } from '@/shared/infrastructure/presenters/collection.presenter'
import { ApiProperty } from '@nestjs/swagger'
import { Transform } from 'class-transformer'

export class CategoryPresenter {
  @ApiProperty({ description: 'name of category' })
  name: string

  @ApiProperty({ description: 'identify of category' })
  id: string

  @ApiProperty({ description: 'data create of category' })
  @Transform(({ value }: { value: Date }) => value.toISOString())
  createdAt: Date

  @ApiProperty({ description: 'data update of category' })
  @Transform(({ value }: { value: Date }) => value.toISOString())
  updatedAt: Date

  constructor(output: CategoryOutput) {
    this.name = output.name
    this.id = output.id
    this.createdAt = output.createdAt
    this.updatedAt = output.updatedAt
  }
}

export class CategoryCollectionPresenter extends CollectionPresenter {
  data: CategoryPresenter[]
  constructor(output: OutputListCategoryCollection) {
    const { items, ...paginationProps } = output
    super(paginationProps)
    this.data = items.map(item => new CategoryPresenter(item))
  }
}

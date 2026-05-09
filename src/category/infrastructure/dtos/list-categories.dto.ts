import { ListCategoryInput } from '@/category/application/usecase/list-category.usecase'
import { SortDirection } from '@/shared/domain/repositories/searchable-repository-contracts'
import { ApiPropertyOptional } from '@nestjs/swagger'
import { Transform } from 'class-transformer'
import { IsOptional } from 'class-validator'

export class ListCategoriesDto implements ListCategoryInput {
  @ApiPropertyOptional({ description: 'return page' })
  @IsOptional()
  page?: number

  @ApiPropertyOptional({ description: 'quantity per page' })
  @IsOptional()
  perPage?: number

  @ApiPropertyOptional({ description: 'sort data by name or created_at' })
  @IsOptional()
  sort?: string

  @ApiPropertyOptional({ description: 'dir of data by desc or asc' })
  @IsOptional()
  sortDir?: SortDirection

  @ApiPropertyOptional({ description: 'data used to filter the result' })
  @Transform(({ value }) => value?.toLowerCase())
  @IsOptional()
  filter?: string
}

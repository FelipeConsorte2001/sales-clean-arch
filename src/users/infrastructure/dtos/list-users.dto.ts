import { SortDirection } from '@/shared/domain/repositories/searchable-repository-contracts'
import { ListUsersInput } from '@/users/application/usecase/list-users.usecase'
import { ApiPropertyOptional } from '@nestjs/swagger'
import { IsOptional } from 'class-validator'

export class ListUsersDto implements ListUsersInput {
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
  @IsOptional()
  filter?: string
}

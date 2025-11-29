import { CollectionPresenter } from '@/shared/infrastructure/presenters/collection.presenter'
import { UserOutput } from '@/users/application/dtos/user-output'
import { Output as outputListUserUseCase } from '@/users/application/usecase/list-users.usecase'
import { ApiProperty } from '@nestjs/swagger'
import { Transform } from 'class-transformer'

export class UserPresenter {
  @ApiProperty({ description: 'identify of user' })
  id: string

  @ApiProperty({ description: 'name of user' })
  name: string

  @ApiProperty({ description: 'email of user' })
  email: string

  @ApiProperty({ description: 'cpf of user' })
  cpf: string

  @ApiProperty({ description: 'number of user' })
  typeUser: number

  @ApiProperty({ description: 'phone of user' })
  phone: string

  @ApiProperty({ description: 'data create of user' })
  @Transform(({ value }: { value: Date }) => value.toISOString())
  createdAt: Date

  @ApiProperty({ description: 'data update of user' })
  @Transform(({ value }: { value: Date }) => value.toISOString())
  updatedAt: Date

  constructor(output: UserOutput) {
    this.id = output.id
    this.name = output.name
    this.email = output.email
    this.createdAt = output.createdAt
    this.updatedAt = output.updatedAt
    this.cpf = output.cpf
    this.phone = output.phone
    this.typeUser = output.typeUser
  }
}

export class UserCollectionPresenter extends CollectionPresenter {
  data: UserPresenter[]
  constructor(output: outputListUserUseCase) {
    const { items, ...paginationProps } = output
    super(paginationProps)
    this.data = items.map(item => new UserPresenter(item))
  }
}

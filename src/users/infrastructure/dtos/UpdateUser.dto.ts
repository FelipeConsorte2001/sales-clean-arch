import { UpdateUserInput } from '@/users/application/usecase/update-user.usecase'
import { ApiProperty } from '@nestjs/swagger'
import { IsNotEmpty, IsString } from 'class-validator'

export class UpdateUserDto implements Omit<UpdateUserInput, 'id'> {
  @ApiProperty({ description: 'Username' })
  @IsString()
  @IsNotEmpty()
  name: string
}

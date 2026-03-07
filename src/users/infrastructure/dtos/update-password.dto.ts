import { UpdatePasswordInput } from '@/users/application/usecase/update-password.usecase'
import { ApiProperty } from '@nestjs/swagger'
import { IsNotEmpty, IsString } from 'class-validator'

export class UpdatePasswordDto implements Omit<UpdatePasswordInput, 'id'> {
  @ApiProperty({ description: 'User password' })
  @IsString()
  @IsNotEmpty()
  password: string

  @ApiProperty({ description: 'User password' })
  @IsString()
  @IsNotEmpty()
  oldPassword: string
}

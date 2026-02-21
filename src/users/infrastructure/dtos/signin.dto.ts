import { SigninInput } from '@/users/application/usecase/sign-in.usecase'
import { ApiProperty } from '@nestjs/swagger'
import { IsEmail, IsNotEmpty, IsString } from 'class-validator'

export class SinginDto implements SigninInput {
  @ApiProperty({ description: 'User email' })
  @IsString()
  @IsNotEmpty()
  @IsEmail()
  email: string

  @ApiProperty({ description: 'User password' })
  @IsString()
  @IsNotEmpty()
  password: string
}

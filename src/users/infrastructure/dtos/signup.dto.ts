import { SignupUpInput } from '@/users/application/usecase/sign-up.usecase'
import { ApiProperty } from '@nestjs/swagger'
import { IsEmail, IsNotEmpty, IsNumber, IsString } from 'class-validator'

export class SingupDto implements SignupUpInput {
  @ApiProperty({ description: 'User phone' })
  @IsString()
  @IsNotEmpty()
  phone: string

  @ApiProperty({ description: 'User cpf' })
  @IsString()
  @IsNotEmpty()
  cpf: string

  @ApiProperty({ description: 'Profile of user' })
  @IsNumber()
  @IsNotEmpty()
  typeUser: number

  @ApiProperty({ description: 'Username' })
  @IsString()
  @IsNotEmpty()
  name: string

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

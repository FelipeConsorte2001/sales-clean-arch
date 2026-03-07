import { ClassValidatorFields } from '@/shared/domain/entities/validators/class-validator-fields'
import {
  IsDate,
  IsEmail,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
  MaxLength,
} from 'class-validator'
import { UserProps } from '../entities/user.entity'

export class UserRules {
  @MaxLength(255)
  @IsString()
  @IsNotEmpty()
  name: string

  @MaxLength(255)
  @IsString()
  @IsNotEmpty()
  @IsEmail()
  email: string

  @MaxLength(100)
  @IsString()
  @IsNotEmpty()
  password: string

  @IsDate()
  @IsOptional()
  createdAt?: Date

  @IsDate()
  @IsOptional()
  updatedAt?: Date

  @MaxLength(255)
  @IsString()
  @IsNotEmpty()
  cpf: string

  @MaxLength(255)
  @IsString()
  @IsNotEmpty()
  phone: string

  @IsNumber()
  @IsNotEmpty()
  typeUser: number

  constructor({
    email,
    name,
    password,
    createdAt,
    updatedAt,
    cpf,
    phone,
    typeUser,
  }: UserProps) {
    Object.assign(this, {
      email,
      name,
      password,
      createdAt,
      updatedAt,
      cpf,
      phone,
      typeUser,
    })
  }
}
export class UserValidator extends ClassValidatorFields<UserRules> {
  validate(data: UserProps): boolean {
    return super.validate(new UserRules(data ?? ({} as UserProps)))
  }
}

export class UserValidatorFactory {
  static create(): UserValidator {
    return new UserValidator()
  }
}

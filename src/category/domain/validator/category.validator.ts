import { ClassValidatorFields } from '@/shared/domain/entities/validators/class-validator-fields'
import {
  IsDate,
  IsNotEmpty,
  IsOptional,
  IsString,
  MaxLength,
} from 'class-validator'
import { CategoryProps } from '../entities/category.entity'

export class CategoryRules {
  @MaxLength(255)
  @IsString()
  @IsNotEmpty()
  name: string

  @IsDate()
  @IsOptional()
  createdAt?: Date

  @IsDate()
  @IsOptional()
  updatedAt?: Date

  constructor({ name, createdAt, updatedAt }: CategoryProps) {
    Object.assign(this, {
      name,
      createdAt,
      updatedAt,
    })
  }
}

export class CategoryValidator extends ClassValidatorFields<CategoryRules> {
  validate(data: CategoryProps): boolean {
    return super.validate(new CategoryRules(data ?? ({} as CategoryProps)))
  }
}
export class CategoryValidatorFactory {
  static create(): CategoryValidator {
    return new CategoryValidator()
  }
}

import { Entity } from '@/shared/domain/entities/entity'
import { EntintyValidationError } from '@/shared/domain/erros/validation-error'
import { CategoryValidatorFactory } from '../validator/category.validator'

export type CategoryProps = {
  name: string
  createdAt?: Date
  updatedAt?: Date
}

export class CategoryEntity extends Entity<CategoryProps> {
  constructor(
    public readonly props: CategoryProps,
    id?: string,
  ) {
    props.name = props.name?.trim().toLocaleLowerCase()
    CategoryEntity.validate(props)
    super(props, id)
    this.props.createdAt = this.props.createdAt ?? new Date()
    this.props.updatedAt = this.props.updatedAt ?? new Date()
  }

  get name() {
    return this.props.name
  }

  private set name(value: string) {
    this.props.name = value
  }
  get createdAt() {
    return this.props.createdAt
  }

  get updatedAt() {
    return this.props.updatedAt
  }

  static validate(props: CategoryProps) {
    const validator = CategoryValidatorFactory.create()
    const isValid = validator.validate(props)
    if (!isValid) throw new EntintyValidationError(validator.errors)
  }
}

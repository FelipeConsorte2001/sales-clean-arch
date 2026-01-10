import { Entity } from '@/shared/domain/entities/entity'
import { EntintyValidationError } from '@/shared/domain/erros/validation-error'
import { UserValidatorFactory } from '../validator/user.validator'

export type UserProps = {
  name: string
  email: string
  cpf: string
  typeUser: number
  phone: string
  password: string
  createdAt?: Date
  updatedAt?: Date
}

export class UserEntity extends Entity<UserProps> {
  constructor(
    public readonly props: UserProps,
    id?: string,
  ) {
    UserEntity.validate(props)
    super(props, id)
    this.props.createdAt = this.props.createdAt ?? new Date()
    this.props.updatedAt = this.props.updatedAt ?? new Date()
  }

  update(value: string): void {
    UserEntity.validate({ ...this.props, name: value })

    this.name = value
  }

  updatePassord(value: string): void {
    UserEntity.validate({ ...this.props, password: value })
    this.password = value
  }

  get name() {
    return this.props.name
  }

  private set name(value: string) {
    this.props.name = value
  }

  get email() {
    return this.props.email
  }
  get cpf() {
    return this.props.cpf
  }

  get typeUser() {
    return this.props.typeUser
  }

  get phone() {
    return this.props.phone
  }

  get password() {
    return this.props.password
  }

  private set password(value: string) {
    this.props.password = value
  }
  get createdAt() {
    return this.props.createdAt
  }

  get updatedAt() {
    return this.props.updatedAt
  }

  static validate(props: UserProps) {
    const validator = UserValidatorFactory.create()
    const isValid = validator.validate(props)
    if (!isValid) throw new EntintyValidationError(validator.errors)
  }
}

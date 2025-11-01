export type UserProps = {
  name: string
  email: string
  cpf: string
  typeUser: number
  phone: string
  password: string
  createdAt: Date
  updatedAt: Date
}

export class UserEntity {
  constructor(public readonly props: UserProps) {
    this.props.createdAt = this.props.createdAt ?? new Date()
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
}

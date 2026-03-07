import { UserEntity } from '@/users/domain/entities/user.entity'

export type UserOutput = {
  id: string
  name: string
  email: string
  cpf: string
  typeUser: number
  phone: string
  password: string
  createdAt: Date
  updatedAt: Date
}
export class UserOutputMapper {
  static toOutput(entity: UserEntity): UserOutput {
    return entity.toJSON()
  }
}

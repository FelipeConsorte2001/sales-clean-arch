import { ValidationError } from '@/shared/domain/erros/validation-error'
import { UserEntity } from '@/users/domain/entities/user.entity'
import { User } from '@prisma/client'
export class UserModelMapper {
  static toEntity(model: User) {
    const data = {
      name: model.name,
      email: model.email,
      password: model.password,
      cpf: model.cpf,
      phone: model.phone,
      typeUser: model.typeUser,
      createdAt: model.createdAt,
      updatedAt: model.updatedAt,
    }

    try {
      return new UserEntity(data, model.id)
    } catch {
      throw new ValidationError('An Entity not be loaded')
    }
  }
}

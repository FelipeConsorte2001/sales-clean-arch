import { InvalidPasswordError } from '@/shared/application/erros/invalid-password-error'
import { HashProvider } from '@/shared/application/provider/hash-provider'
import { UseCase as DefaultUseCase } from '@/shared/application/usecases/use-case'
import { UserRepository } from '@/users/domain/repositories/user.repository'
import { UserOutput, UserOutputMapper } from '../dtos/user-output'

export type UpdatePasswordInput = {
  password: string
  oldPassword: string
  id: string
}
export type Output = UserOutput
export class UpdatePasswordUseCase
  implements DefaultUseCase<UpdatePasswordInput, Promise<Output>>
{
  constructor(
    private userRepository: UserRepository,
    private hashProvider: HashProvider,
  ) {}
  async execute(input: UpdatePasswordInput): Promise<Output> {
    const entity = await this.userRepository.findById(input.id)
    if (!input.password || !input.oldPassword)
      throw new InvalidPasswordError(
        'Old password and new password is required',
      )
    const checkOldPassword = await this.hashProvider.compareHash(
      input.oldPassword,
      entity.password,
    )
    if (!checkOldPassword)
      throw new InvalidPasswordError('Old password does not match')
    const hashPassword = await this.hashProvider.generateHash(input.password)
    entity.updatePassord(hashPassword)
    await this.userRepository.update(entity)
    return UserOutputMapper.toOutput(entity)
  }
}

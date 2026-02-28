import { UseCase as DefaultUseCase } from '@/shared/application/usecases/use-case'
import { UserRepository } from '@/users/domain/repositories/user.repository'
import { UserOutput, UserOutputMapper } from '../dtos/user-output'

export type GetUserInput = {
  id: string
}
export type Output = UserOutput
export class GetUserUseCase
  implements DefaultUseCase<GetUserInput, Promise<Output>>
{
  constructor(private userRepository: UserRepository) {}
  async execute(input: GetUserInput): Promise<Output> {
    const entity = await this.userRepository.findById(input.id)
    return UserOutputMapper.toOutput(entity)
  }
}

import { UseCase as DefaultUseCase } from '@/shared/application/usecases/use-case'
import { UserRepository } from '@/users/domain/repositories/user.repository'

export type DeleteUserInput = {
  id: string
}
export type Output = void
export class DeleteUserUseCase implements DefaultUseCase<
  DeleteUserInput,
  Promise<Output>
> {
  constructor(private userRepository: UserRepository) {}
  async execute(input: DeleteUserInput): Promise<Output> {
    await this.userRepository.delete(input.id)
  }
}

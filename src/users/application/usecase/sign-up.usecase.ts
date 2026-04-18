import { UseCase as DefaultUseCase } from '@/shared/application/usecases/use-case'
import { UserEntity } from '@/users/domain/entities/user.entity'
import { UserRepository } from '@/users/domain/repositories/user.repository'
import { UserOutput, UserOutputMapper } from '../dtos/user-output'
import { BadRequestError } from '../erros/bad-request-error'

export type SignupUpInput = {
  name: string
  email: string
  phone: string
  cpf: string
  password: string
  typeUser: number
}
export type Output = UserOutput
export class SignupUseCase implements DefaultUseCase<
  SignupUpInput,
  Promise<Output>
> {
  constructor(private userRepository: UserRepository) {}
  async execute(input: SignupUpInput): Promise<Output> {
    const { name, email, password, phone, cpf } = input

    if (!email || !name || !password || !phone || !cpf)
      throw new BadRequestError('Input data not provided')

    await this.userRepository.emailExist(email)

    const entity = new UserEntity({
      cpf: input.cpf,
      email: input.email,
      name: input.name,
      password: input.password,
      phone: input.phone,
      typeUser: input.typeUser,
    })
    await this.userRepository.insert(entity)
    return UserOutputMapper.toOutput(entity)
  }
}

import { faker } from '@faker-js/faker'
import fakerBr from 'faker-br'

import { UserProps } from '../../entities/user.entity'
export type Props = {
  name?: string
  email?: string
  cpf?: string
  typeUser?: number
  phone?: string
  password?: string
  createdAt?: Date
  updatedAt?: Date
}
export function UserDataBuilder(props: Props): UserProps {
  return {
    name: props.name ?? faker.person.firstName(),
    email: props.email ?? faker.internet.email(),
    cpf: props.cpf ?? fakerBr.br.cpf(),
    password: props.password ?? faker.internet.password(),
    phone: props.phone ?? faker.phone.number(),
    typeUser: props.typeUser ?? faker.helpers.arrayElement([1, 2]),
    createdAt: props.createdAt ?? new Date(),
    updatedAt: props.updatedAt ?? new Date(),
  }
}

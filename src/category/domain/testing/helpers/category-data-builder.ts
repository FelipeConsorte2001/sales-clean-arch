import { faker } from '@faker-js/faker'
import { CategoryProps } from '../../entities/category.entity'

export type CategoryPropsBuilder = {
  name?: string
  createdAt?: Date
  updatedAt?: Date
}

export function CategoryDataBuilder(
  props: CategoryPropsBuilder,
): CategoryProps {
  return {
    name: props.name ?? faker.commerce.product(),
    createdAt: props.createdAt ?? new Date(),
    updatedAt: props.updatedAt ?? new Date(),
  }
}

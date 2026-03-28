import { CategoryDataBuilder } from '@/category/domain/testing/helpers/category-data-builder'
import { EntintyValidationError } from '@/shared/domain/erros/validation-error'
import { CategoryEntity } from '../../category.entity'

describe('CategoryEntity integration tests', () => {
  describe('Contructor method', () => {
    it('Should throw an error when creating a user with invalid createdAt', () => {
      let props = {
        ...CategoryDataBuilder({}),
        createdAt: '' as any,
      }
      expect(() => new CategoryEntity(props)).toThrow(EntintyValidationError)
      props = {
        ...CategoryDataBuilder({}),
        createdAt: 10 as any,
      }
      expect(() => new CategoryEntity(props)).toThrow(EntintyValidationError)
    })
  })
})

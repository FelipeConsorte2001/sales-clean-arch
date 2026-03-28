import { CategoryProps } from '@/category/domain/entities/category.entity'
import { CategoryDataBuilder } from '@/category/domain/testing/helpers/category-data-builder'
import {
  CategoryRules,
  CategoryValidator,
  CategoryValidatorFactory,
} from '../../category.validator'

let sut: CategoryValidator
let props: CategoryProps
describe('CategoryValidation unit tests', () => {
  beforeEach(() => {
    sut = CategoryValidatorFactory.create()
    props = CategoryDataBuilder({})
  })

  it('Valid case for category validator class', () => {
    const props = CategoryDataBuilder({})
    const isValid = sut.validate(props)
    expect(isValid).toBeTruthy()
    expect(sut.validatedData).toStrictEqual(new CategoryRules(props))
  })

  describe('name field', () => {
    it('should invalidate cases for name field', () => {
      let isValid = sut.validate(null as any)
      expect(isValid).toBeFalsy()
      expect(sut.errors['name']).toStrictEqual([
        'name should not be empty',
        'name must be a string',
        'name must be shorter than or equal to 255 characters',
      ])

      isValid = sut.validate({ ...CategoryDataBuilder({}), name: '' as string })
      expect(isValid).toBeFalsy()
      expect(sut.errors['name']).toStrictEqual(['name should not be empty'])

      isValid = sut.validate({ ...CategoryDataBuilder({}), name: 444 as any })
      expect(isValid).toBeFalsy()
      expect(sut.errors['name']).toStrictEqual([
        'name must be a string',
        'name must be shorter than or equal to 255 characters',
      ])

      isValid = sut.validate({
        ...CategoryDataBuilder({}),
        name: 'a'.repeat(256),
      })
      expect(isValid).toBeFalsy()
      expect(sut.errors['name']).toStrictEqual([
        'name must be shorter than or equal to 255 characters',
      ])
    })
  })
  describe('createdAt field', () => {
    it('should invalidate cases for createdAt field', () => {
      let isValid = sut.validate({ ...props, createdAt: 10 as any })

      expect(isValid).toBeFalsy()
      expect(sut.errors['createdAt']).toStrictEqual([
        'createdAt must be a Date instance',
      ])

      isValid = sut.validate({
        ...CategoryDataBuilder({}),
        createdAt: '2023' as any,
      })
      expect(isValid).toBeFalsy()
      expect(sut.errors['createdAt']).toStrictEqual([
        'createdAt must be a Date instance',
      ])
    })
  })
})

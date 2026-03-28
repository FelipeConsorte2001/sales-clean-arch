import { CategoryDataBuilder } from '@/category/domain/testing/helpers/category-data-builder'
import { CategoryEntity, CategoryProps } from '../../category.entity'

describe('CategoryEntity unit tests', () => {
  let props: CategoryProps
  let sut: CategoryEntity

  beforeEach(() => {
    CategoryEntity.validate = jest.fn()
    props = CategoryDataBuilder({})
    sut = new CategoryEntity(props)
  })

  it('contructor method', () => {
    expect(CategoryEntity.validate).toHaveBeenCalled()
    expect(sut.props.name).toEqual(props.name)
    expect(sut.props.createdAt).toBeInstanceOf(Date)
    expect(sut.props.updatedAt).toEqual(props.updatedAt)
  })

  it('getter of name field', () => {
    expect(sut.name).toBeDefined()
    expect(sut.name).toEqual(props.name)
    expect(typeof sut.props.name).toEqual('string')
  })
  it('setter of name field', () => {
    sut['name'] = 'other name'
    expect(sut.props.name).toEqual('other name')
    expect(typeof sut.props.name).toEqual('string')
  })
})

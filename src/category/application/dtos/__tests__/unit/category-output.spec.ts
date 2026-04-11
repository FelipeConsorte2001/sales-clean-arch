import { CategoryEntity } from '@/category/domain/entities/category.entity'
import { CategoryDataBuilder } from '@/category/domain/testing/helpers/category-data-builder'
import { CategoryOutputMapper } from '../../category-output'

describe('CategoryOutput unit tests', () => {
  it('should convert a category in output', async () => {
    const entity = new CategoryEntity(CategoryDataBuilder({}))
    const spyToJson = jest.spyOn(entity, 'toJSON')
    const sut = CategoryOutputMapper.toOutput(entity)
    expect(spyToJson).toHaveBeenCalled()
    expect(sut).toStrictEqual(entity.toJSON())
  })
})

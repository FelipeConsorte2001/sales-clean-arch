import { instanceToPlain } from 'class-transformer'
import { randomUUID } from 'node:crypto'
import { CategoryPresenter } from '../../category.presenter'
describe('CategoriesPresenter unit tests', () => {
  const createdAt = new Date()
  const updatedAt = new Date()
  let sut: CategoryPresenter
  const props = {
    id: String(randomUUID()),
    name: 'test name',
    createdAt,
    updatedAt,
  }

  beforeEach(() => {
    sut = new CategoryPresenter(props)
  })

  describe('constructor', () => {
    it('Should set values', () => {
      expect(sut.id).toEqual(props.id)
      expect(sut.name).toEqual(props.name)
      expect(sut.createdAt).toEqual(props.createdAt)
    })
    it('Should create data', () => {
      const output = instanceToPlain(sut)
      expect(output).toStrictEqual({
        id: props.id,
        name: 'test name',
        createdAt: createdAt.toISOString(),
      })
    })
  })
})

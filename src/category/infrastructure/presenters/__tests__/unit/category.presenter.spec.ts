import { PaginationPresenter } from '@/shared/infrastructure/presenters/pagination.presenter'
import { instanceToPlain } from 'class-transformer'
import { randomUUID } from 'node:crypto'
import {
  CategoryCollectionPresenter,
  CategoryPresenter,
} from '../../category.presenter'
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
        updatedAt: updatedAt.toISOString(),
      })
    })
  })
})
describe('CategoriesCollection unit tests', () => {
  const createdAt = new Date()
  const updatedAt = new Date()
  const props = {
    id: randomUUID(),
    name: 'test name',
    createdAt,
    updatedAt,
  }

  describe('constructor', () => {
    it('Should set values', () => {
      const sut = new CategoryCollectionPresenter({
        items: [props],
        currentPage: 1,
        perPage: 2,
        lastPage: 1,
        total: 1,
      })

      expect(sut.meta).toBeInstanceOf(PaginationPresenter)
      expect(sut.meta).toStrictEqual(
        new PaginationPresenter({
          currentPage: 1,
          perPage: 2,
          lastPage: 1,
          total: 1,
        }),
      )
      expect(sut.data).toStrictEqual([new CategoryPresenter(props)])
    })
    it('Should create data', () => {
      let sut = new CategoryCollectionPresenter({
        items: [props],
        currentPage: 1,
        perPage: 2,
        lastPage: 1,
        total: 1,
      })
      let output = instanceToPlain(sut)
      expect(output).toStrictEqual({
        data: [
          {
            createdAt: createdAt.toISOString(),
            updatedAt: updatedAt.toISOString(),
            name: 'test name',
            id: props.id,
          },
        ],
        meta: { currentPage: 1, perPage: 2, lastPage: 1, total: 1 },
      })

      sut = new CategoryCollectionPresenter({
        items: [props],
        currentPage: '1' as any,
        perPage: '2' as any,
        lastPage: '1' as any,
        total: '1' as any,
      })
      output = instanceToPlain(sut)
      expect(output).toStrictEqual({
        data: [
          {
            createdAt: createdAt.toISOString(),
            updatedAt: updatedAt.toISOString(),
            name: 'test name',
            id: props.id,
          },
        ],
        meta: { currentPage: 1, perPage: 2, lastPage: 1, total: 1 },
      })
    })
  })
})

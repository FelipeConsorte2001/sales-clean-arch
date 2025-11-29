import { instanceToPlain } from 'class-transformer'
import { PaginationPresenter } from '../../pagination.presenter'
describe('PaginationPresenter unit tests', () => {
  describe('constructor', () => {
    it('Should set values', () => {
      const props = {
        currentPage: 1,
        perPage: 2,
        lastPage: 1,
        total: 1,
      }
      const sut = new PaginationPresenter(props)
      expect(sut.currentPage).toEqual(props.currentPage)
      expect(sut.perPage).toEqual(props.perPage)
      expect(sut.lastPage).toEqual(props.lastPage)
      expect(sut.total).toEqual(props.total)
    })
    it('Should set values', () => {
      const props = {
        currentPage: '1' as any,
        perPage: '2' as any,
        lastPage: '1' as any,
        total: '1' as any,
      }
      const sut = new PaginationPresenter(props)
      expect(sut.currentPage).toEqual(String(props.currentPage))
      expect(sut.perPage).toEqual(String(props.perPage))
      expect(sut.lastPage).toEqual(String(props.lastPage))
      expect(sut.total).toEqual(String(props.total))
    })

    it('Should create data', () => {
      let sut = new PaginationPresenter({
        currentPage: 1,
        perPage: 2,
        lastPage: 1,
        total: 1,
      })
      let output = instanceToPlain(sut)
      expect(output).toStrictEqual({
        currentPage: 1,
        perPage: 2,
        lastPage: 1,
        total: 1,
      })
      sut = new PaginationPresenter({
        currentPage: '1' as any,
        perPage: '2' as any,
        lastPage: '1' as any,
        total: '1' as any,
      })
      output = instanceToPlain(sut)
      expect(output).toStrictEqual({
        currentPage: 1,
        perPage: 2,
        lastPage: 1,
        total: 1,
      })
    })
  })
})

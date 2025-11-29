import { PaginationPresenter } from '@/shared/infrastructure/presenters/pagination.presenter'
import { instanceToPlain } from 'class-transformer'
import { randomUUID } from 'crypto'
import { UserCollectionPresenter, UserPresenter } from '../../user.presenter'
describe('UsersPresenter unit tests', () => {
  const createdAt = new Date()
  const updatedAt = new Date()
  let sut: UserPresenter
  const props = {
    id: randomUUID(),
    name: 'test name',
    email: 'a@a.com',
    createdAt,
    updatedAt,
    password: 'fake',
    cpf: '123.123.123-00',
    typeUser: 1,
    phone: '(11)96788-1475',
  }

  beforeEach(() => {
    sut = new UserPresenter(props)
  })

  describe('constructor', () => {
    it('Should set values', () => {
      expect(sut.id).toEqual(props.id)
      expect(sut.name).toEqual(props.name)
      expect(sut.email).toEqual(props.email)
      expect(sut.createdAt).toEqual(props.createdAt)
      expect(sut.updatedAt).toEqual(props.updatedAt)
      expect(sut.cpf).toEqual(props.cpf)
      expect(sut.typeUser).toEqual(props.typeUser)
      expect(sut.phone).toEqual(props.phone)
    })
    it('Should create data', () => {
      const output = instanceToPlain(sut)
      expect(output).toStrictEqual({
        cpf: props.cpf,
        createdAt: createdAt.toISOString(),
        email: 'a@a.com',
        id: props.id,
        name: 'test name',
        phone: props.phone,
        typeUser: 1,
        updatedAt: updatedAt.toISOString(),
      })
    })
  })
})
describe('UsersCollection unit tests', () => {
  const createdAt = new Date()
  const updatedAt = new Date()
  const props = {
    id: randomUUID(),
    name: 'test name',
    email: 'a@a.com',
    createdAt,
    updatedAt,
    password: 'fake',
    cpf: '123.123.123-00',
    typeUser: 1,
    phone: '(11)96788-1475',
  }

  describe('constructor', () => {
    it('Should set values', () => {
      const sut = new UserCollectionPresenter({
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
      expect(sut.data).toStrictEqual([new UserPresenter(props)])
    })
    it('Should create data', () => {
      let sut = new UserCollectionPresenter({
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
            cpf: props.cpf,
            createdAt: createdAt.toISOString(),
            email: 'a@a.com',
            id: props.id,
            name: 'test name',
            phone: props.phone,
            typeUser: 1,
            updatedAt: updatedAt.toISOString(),
          },
        ],
        meta: { currentPage: 1, perPage: 2, lastPage: 1, total: 1 },
      })

      sut = new UserCollectionPresenter({
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
            cpf: props.cpf,
            createdAt: createdAt.toISOString(),
            email: 'a@a.com',
            id: props.id,
            name: 'test name',
            phone: props.phone,
            typeUser: 1,
            updatedAt: updatedAt.toISOString(),
          },
        ],
        meta: { currentPage: 1, perPage: 2, lastPage: 1, total: 1 },
      })
    })
  })
})

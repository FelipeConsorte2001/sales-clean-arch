import { EntintyValidationError } from '@/shared/domain/erros/validation-error'
import { UserDataBuilder } from '@/users/domain/testing/helpers/user-data-builder'
import { UserEntity, UserProps } from '../../user.entity'

describe('UserEntinty intregarion tests', () => {
  describe('Constructor method', () => {
    it('Should throw an error when creating a user with invalid email', () => {
      let props: UserProps = {
        ...UserDataBuilder({}),
        name: null,
      }
      expect(() => new UserEntity(props)).toThrow(EntintyValidationError)
      props = {
        ...UserDataBuilder({}),
        name: '',
      }
      expect(() => new UserEntity(props)).toThrow(EntintyValidationError)
      props = {
        ...UserDataBuilder({}),
        name: 'aa'.repeat(256),
      }
      expect(() => new UserEntity(props)).toThrow(EntintyValidationError)
      props = {
        ...UserDataBuilder({}),
        name: 10 as any,
      }
      expect(() => new UserEntity(props)).toThrow(EntintyValidationError)
    })
    it('Should throw an error when creating a user with invalid email', () => {
      let props: UserProps = {
        ...UserDataBuilder({}),
        email: null,
      }
      expect(() => new UserEntity(props)).toThrow(EntintyValidationError)
      props = {
        ...UserDataBuilder({}),
        email: '',
      }
      expect(() => new UserEntity(props)).toThrow(EntintyValidationError)
      props = {
        ...UserDataBuilder({}),
        email: 'aa'.repeat(256),
      }
      expect(() => new UserEntity(props)).toThrow(EntintyValidationError)
      props = {
        ...UserDataBuilder({}),
        email: 10 as any,
      }
      expect(() => new UserEntity(props)).toThrow(EntintyValidationError)
    })
    it('Should throw an error when creating a user with invalid password', () => {
      let props: UserProps = {
        ...UserDataBuilder({}),
        password: null,
      }
      expect(() => new UserEntity(props)).toThrow(EntintyValidationError)
      props = {
        ...UserDataBuilder({}),
        password: '',
      }
      expect(() => new UserEntity(props)).toThrow(EntintyValidationError)
      props = {
        ...UserDataBuilder({}),
        password: 'aa'.repeat(101),
      }
      expect(() => new UserEntity(props)).toThrow(EntintyValidationError)
      props = {
        ...UserDataBuilder({}),
        password: 10 as any,
      }
      expect(() => new UserEntity(props)).toThrow(EntintyValidationError)
    })

    it('Should throw an error when creating a user with invalid createdAt', () => {
      let props = {
        ...UserDataBuilder({}),
        createdAt: '' as any,
      }
      expect(() => new UserEntity(props)).toThrow(EntintyValidationError)
      props = {
        ...UserDataBuilder({}),
        createdAt: 10 as any,
      }
      expect(() => new UserEntity(props)).toThrow(EntintyValidationError)
    })
    it('Should a valid user', () => {
      expect.assertions(0)
      const props: UserProps = {
        ...UserDataBuilder({}),
      }
      new UserEntity(props)
    })
  })

  describe('Update method', () => {
    it('Should throw an error when updating a user with invalid name', () => {
      const entinty = new UserEntity(UserDataBuilder({}))

      expect(() => entinty.update(null)).toThrow(EntintyValidationError)
      expect(() => entinty.update('')).toThrow(EntintyValidationError)
      expect(() => entinty.update(10 as any)).toThrow(EntintyValidationError)
      expect(() => entinty.update('aa'.repeat(256))).toThrow(
        EntintyValidationError,
      )
    })
    it('Should a valid user', () => {
      expect.assertions(0)
      const props: UserProps = {
        ...UserDataBuilder({}),
      }
      const entinty = new UserEntity(props)
      entinty.update('other name')
    })
  })
  describe('UpdatePassoword method', () => {
    it('Should a invalid user ussing password field', () => {
      const entinty = new UserEntity(UserDataBuilder({}))

      expect(() => entinty.updatePassord(null)).toThrow(EntintyValidationError)
      expect(() => entinty.updatePassord('')).toThrow(EntintyValidationError)
      expect(() => entinty.updatePassord(10 as any)).toThrow(
        EntintyValidationError,
      )
      expect(() => entinty.updatePassord('aa'.repeat(101))).toThrow(
        EntintyValidationError,
      )
    })
    it('Should a valid user', () => {
      expect.assertions(0)
      const props: UserProps = {
        ...UserDataBuilder({}),
      }
      const entinty = new UserEntity(props)
      entinty.updatePassord('other password')
    })
  })
})

import * as libClassValidator from 'class-validator'
import { ClassValidatorFields } from '../../class-validator-fields'

class StubClassValidatorFields extends ClassValidatorFields<{
  field: string
}> {}

describe('ClassValidatorFileds unit tests', () => {
  it('Should initialize erros and validatedData variables with null', () => {
    const sut = new StubClassValidatorFields()
    expect(sut.errors).toBeNull()
    expect(sut.validatedData).toBeNull()
  })

  it('Should validate with erros', () => {
    const spyValidateSync = jest.spyOn(libClassValidator, 'validateSync')
    const sut = new StubClassValidatorFields()
    spyValidateSync.mockReturnValue([
      { property: 'field', constraints: { isRequired: 'test error' } },
    ])
    expect(sut.validate(null)).toBeFalsy()
    expect(spyValidateSync).toHaveBeenCalled()
    expect(sut.validatedData).toBeNull()
    expect(sut.errors).toStrictEqual({ field: ['test error'] })
  })

  it('Should validate without erros', () => {
    const spyValidateSync = jest.spyOn(libClassValidator, 'validateSync')
    const sut = new StubClassValidatorFields()
    spyValidateSync.mockReturnValue([])
    expect(sut.validate({ field: 'value' })).toBeTruthy()
    expect(spyValidateSync).toHaveBeenCalled()
    expect(sut.validatedData).toStrictEqual({ field: 'value' })
    expect(sut.errors).toBeNull()
  })
})

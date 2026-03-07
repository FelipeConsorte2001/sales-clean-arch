import { IsNotEmpty, IsNumber, IsString, MaxLength } from 'class-validator'
import { ClassValidatorFields } from '../../class-validator-fields'

class StubRules {
  @MaxLength(255)
  @IsString()
  @IsNotEmpty()
  name: string

  @IsNumber()
  @IsNotEmpty()
  prince: number
  constructor(data: any) {
    Object.assign(this, data)
  }
}

class StubClassValidatorFields extends ClassValidatorFields<StubRules> {
  validate(data: any): boolean {
    return super.validate(new StubRules(data))
  }
}

describe('ClassValidatorFileds intregation tests', () => {
  it('Should validate with erros', () => {
    const validator = new StubClassValidatorFields()
    expect(validator.validate(null)).toBe(false)
    expect(validator.errors).toStrictEqual({
      name: [
        'name should not be empty',
        'name must be a string',
        'name must be shorter than or equal to 255 characters',
      ],
      prince: [
        'prince should not be empty',
        'prince must be a number conforming to the specified constraints',
      ],
    })
  })

  it('Should validate without erros', () => {
    const validator = new StubClassValidatorFields()
    const data = new StubRules({ name: 'value', prince: 5 })
    expect(validator.validate(data)).toBeTruthy()
    expect(validator.validatedData).toStrictEqual(data)
  })
})

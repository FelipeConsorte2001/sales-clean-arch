import { FieldsErrors } from '../entities/validators/validator-fields.interface'

export class ValidationError extends Error {}

export class EntintyValidationError extends Error {
  constructor(public error: FieldsErrors) {
    super('Entity Validation Error')
    this.name = 'EntintyValidationError'
  }
}

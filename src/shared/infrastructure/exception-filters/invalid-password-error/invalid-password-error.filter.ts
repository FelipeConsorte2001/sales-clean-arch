import { InvalidPasswordError } from '@/shared/application/erros/invalid-password-error'
import { ValidationError } from '@/shared/domain/erros/validation-error'
import { ArgumentsHost, Catch, ExceptionFilter } from '@nestjs/common'
import { FastifyReply } from 'fastify'

@Catch(InvalidPasswordError)
export class InvalidPasswordErrorFilter implements ExceptionFilter {
  catch(exception: ValidationError, host: ArgumentsHost) {
    const ctx = host.switchToHttp()
    const response = ctx.getResponse<FastifyReply>()

    response.status(422).send({
      statusCode: 422,
      error: 'Unprocessable Entity',
      message: exception.message,
    })
  }
}

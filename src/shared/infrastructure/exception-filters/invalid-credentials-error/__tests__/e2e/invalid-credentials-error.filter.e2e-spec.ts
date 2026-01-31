import { InvalidCredentialsError } from '@/shared/application/erros/invalid-credentials-error'
import { Controller, Get, INestApplication } from '@nestjs/common'
import { Test, TestingModule } from '@nestjs/testing'
import request from 'supertest'
import { InvalidCredentialsErrorFilter } from '../../invalid-credentials-error.filter'

@Controller('stub')
class StubController {
  @Get()
  index() {
    throw new InvalidCredentialsError('Invalid credentials')
  }
}
describe('InvalidCredentialsErrorFilter', () => {
  let app: INestApplication
  let module: TestingModule

  beforeAll(async () => {
    module = await Test.createTestingModule({
      controllers: [StubController],
    }).compile()
    app = module.createNestApplication()
    app.useGlobalFilters(new InvalidCredentialsErrorFilter())
    await app.init()
  })

  it('should be defined', async () => {
    expect(new InvalidCredentialsErrorFilter()).toBeDefined()
  })

  it('should catch a InvalidPasswordError', () => {
    return request(app.getHttpServer()).get('/stub').expect(400).expect({
      statusCode: 400,
      error: 'Bad Request',
      message: 'Invalid credentials',
    })
  })
})

import { Body, Controller, Get, Inject, Post, Query } from '@nestjs/common'

import { ApiResponse, ApiTags, getSchemaPath } from '@nestjs/swagger'
import { UserOutput } from '../application/dtos/user-output'
import {
  ListUserUseCase,
  Output,
} from '../application/usecase/list-users.usecase'
import { SignupUseCase } from '../application/usecase/sign-up.usecase'
import { ListUsersDto } from './dtos/list-users.dto'
import { SingupDto } from './dtos/signup.dto'
import {
  UserCollectionPresenter,
  UserPresenter,
} from './presenters/user.presenter'

@Controller('users')
@ApiTags('users')
export class UsersController {
  @Inject(ListUserUseCase)
  private listUsersUseCase: ListUserUseCase

  @Inject(SignupUseCase)
  private signupUseCase: SignupUseCase

  static userToResponse(output: UserOutput) {
    return new UserPresenter(output)
  }

  static listUsersToResponse(output: Output) {
    return new UserCollectionPresenter(output)
  }

  @ApiResponse({
    status: 200,
    schema: {
      type: 'object',
      properties: {
        meta: {
          type: 'object',
          properties: {
            total: {
              type: 'number',
            },
            currentPage: {
              type: 'number',
            },
            lastPage: {
              type: 'number',
            },
            perPage: {
              type: 'number',
            },
          },
        },
        data: {
          type: 'array',
          items: { $ref: getSchemaPath(UserPresenter) },
        },
      },
    },
  })
  @ApiResponse({
    status: 422,
    description: 'consult params invalid',
  })
  @ApiResponse({
    status: 401,
    description: 'access unathorizathe',
  })
  @Get()
  async search(@Query() searchParams: ListUsersDto) {
    const output = await this.listUsersUseCase.execute(searchParams)
    return UsersController.listUsersToResponse(output)
  }

  @ApiResponse({
    status: 422,
    description: 'body has invalid data',
  })
  @ApiResponse({
    status: 409,
    description: 'email conflict',
  })
  @Post()
  async create(@Body() singupDto: SingupDto) {
    const output = await this.signupUseCase.execute(singupDto)
    return UsersController.userToResponse(output)
  }
}

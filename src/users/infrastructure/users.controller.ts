import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  Inject,
  Param,
  Patch,
  Post,
  Query,
} from '@nestjs/common'

import { ApiResponse, ApiTags, getSchemaPath } from '@nestjs/swagger'
import { UserOutput } from '../application/dtos/user-output'
import { DeleteUserUseCase } from '../application/usecase/delete.usescase'
import { GetUserUseCase } from '../application/usecase/get-user.usecase'
import {
  ListUserUseCase,
  Output,
} from '../application/usecase/list-users.usecase'
import { SigninUseCase } from '../application/usecase/sign-in.usecase'
import { SignupUseCase } from '../application/usecase/sign-up.usecase'
import { UpdatePasswordUseCase } from '../application/usecase/update-password.usecase'
import { ListUsersDto } from './dtos/list-users.dto'
import { SinginDto } from './dtos/signin.dto'
import { SingupDto } from './dtos/signup.dto'
import { UpdatePasswordDto } from './dtos/update-password.dto'
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

  @Inject(UpdatePasswordUseCase)
  private upatePasswordUserCase: UpdatePasswordUseCase

  @Inject(SigninUseCase)
  private signinUseCase: SigninUseCase

  @Inject(GetUserUseCase)
  private getUserUseCase: GetUserUseCase

  @Inject(DeleteUserUseCase)
  private deleteUserUseCase: DeleteUserUseCase

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
    status: 404,
    description: 'id did not find',
  })
  @ApiResponse({
    status: 401,
    description: 'access unathorizathe',
  })
  @Get(':id')
  async findOne(@Param('id') id: string) {
    const output = await this.getUserUseCase.execute({ id })
    return UsersController.userToResponse(output)
  }
  @ApiResponse({
    status: 204,
    description: 'exclusion confirmation response',
  })
  @ApiResponse({
    status: 404,
    description: 'id did not find',
  })
  @ApiResponse({
    status: 401,
    description: 'access unathorizathe',
  })
  @HttpCode(204)
  @Delete(':id')
  async remove(@Param('id') id: string) {
    await this.deleteUserUseCase.execute({ id })
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

  @ApiResponse({
    status: 422,
    description: 'body has invalid data',
  })
  @ApiResponse({
    status: 404,
    description: 'id did not find',
  })
  @Patch(':id')
  async updatePassword(
    @Param('id') id: string,
    @Body() updatePasswordDto: UpdatePasswordDto,
  ) {
    const output = await this.upatePasswordUserCase.execute({
      id,
      ...updatePasswordDto,
    })
    return UsersController.userToResponse(output)
  }
  @ApiResponse({
    status: 422,
    description: 'body has invalid data',
  })
  @ApiResponse({
    status: 404,
    description: 'email did not find',
  })
  @ApiResponse({
    status: 400,
    description: 'invalid credentials',
  })
  @HttpCode(200)
  @Post('login')
  async login(@Body() singinDto: SinginDto) {
    const output = await this.signinUseCase.execute(singinDto)
    return output
  }
}

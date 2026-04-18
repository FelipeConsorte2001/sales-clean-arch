import { Module } from '@nestjs/common'
import { AuthModule } from './auth/infrastructure/auth.module'
import { CategoryModule } from './category/category.module'
import { DatabaseModule } from './shared/infrastructure/database/database.module'
import { EnvConfigModule } from './shared/infrastructure/env-config/env-config.module'
import { UsersModule } from './users/infrastructure/users.module'

@Module({
  imports: [
    EnvConfigModule.forRoot(),
    UsersModule,
    DatabaseModule,
    AuthModule,
    CategoryModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}

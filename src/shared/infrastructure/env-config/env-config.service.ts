import { Injectable } from '@nestjs/common'
import { ConfigService } from '@nestjs/config'
import { EnvConfig } from './env-config.interface'

@Injectable()
export class EnvConfigService implements EnvConfig {
  constructor(private configService: ConfigService) {}
  getNodeEnv(): string {
    return this.configService.get<string>('NODE_ENV')
  }
  getJwtSecret(): string {
    return this.configService.get<string>('JWT_SECRET')
  }
  getJwtExpiresInSeconds(): number {
    return Number(this.configService.get<number>('JWT_EXPIRES_IN'))
  }

  getAppPort(): number {
    return Number(this.configService.get<number>('PORT'))
  }
}

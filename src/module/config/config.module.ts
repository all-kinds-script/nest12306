import { Module } from '@nestjs/common'
import { ConfigService } from './config.service'
import { TxtService } from './txt.service'

@Module({
    providers: [ConfigService, TxtService],
})
export class ConfigModule {}

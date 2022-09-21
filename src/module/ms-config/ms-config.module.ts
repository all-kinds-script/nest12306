import { Module } from '@nestjs/common'
import { TxtService } from './txt.service'
import { MsConfigService } from './ms-config.service'

@Module({
    providers: [MsConfigService, TxtService],
})
export class MsConfigModule {}

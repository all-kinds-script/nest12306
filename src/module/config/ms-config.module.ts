import { Module } from '@nestjs/common'

import { MsConfigService } from './ms-config.service'
import { CdnConfigService } from './cdn-config.service'
import { StationsConfigService } from './stations-config.service'
import { AxiosModule } from '@/module/axios/axios.module'
import { ConfigModule, ConfigService } from '@nestjs/config'

@Module({
    imports: [AxiosModule, ConfigModule],
    providers: [MsConfigService, CdnConfigService, StationsConfigService, ConfigService],
    exports: [StationsConfigService, CdnConfigService],
})
export class MsConfigModule {}

import { Module } from '@nestjs/common'

import { MsConfigService } from './ms-config.service'
import { CdnConfigService } from './cdn-config.service'
import { StationsConfigService } from './stations-config.service'
import { AxiosModule } from '@/module/axios/axios.module'

@Module({
    imports: [AxiosModule],
    providers: [MsConfigService, CdnConfigService, StationsConfigService],
    exports: [StationsConfigService, CdnConfigService],
})
export class MsConfigModule {}

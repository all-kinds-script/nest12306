import { Module } from '@nestjs/common'
import { QueryService } from './query.service'
import { AxiosModule } from '@/module/axios/axios.module'
import { StationsConfigService } from '@/module/config/stations-config.service'
import { MsConfigService } from '@/module/config/ms-config.service'
import { Ms12306Module } from '@/module/ms12306/ms12306.module'
import { MsConfigModule } from '@/module/config/ms-config.module'

@Module({
    imports: [AxiosModule, MsConfigModule],
    providers: [QueryService],
})
export class QueryModule {}

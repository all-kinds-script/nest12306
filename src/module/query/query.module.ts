import { Module } from '@nestjs/common'
import { QueryService } from './query.service'
import { AxiosModule } from '@/module/axios/axios.module'
import { StationsConfigService } from '@/module/config/stations-config.service'

@Module({
    imports: [AxiosModule],
    providers: [QueryService, StationsConfigService],
})
export class QueryModule {}

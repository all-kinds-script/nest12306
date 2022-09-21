import { Module } from '@nestjs/common'
import { QueryService } from './query.service'
import { TxtService } from '@/module/ms-config/txt.service'
import { AxiosModule } from '@/module/axios/axios.module'

@Module({
    imports: [AxiosModule],
    providers: [QueryService, TxtService],
})
export class QueryModule {}

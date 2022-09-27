import { Module } from '@nestjs/common'
import { MsLoginService } from './ms-login.service'
import { AxiosModule } from '@/module/axios/axios.module'
import AxiosQueryService from '@/module/axios/axios-query.service'

@Module({
    imports: [AxiosModule],
    providers: [MsLoginService, AxiosQueryService],
})
export class MsLoginModule {}

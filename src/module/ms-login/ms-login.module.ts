import { Module } from '@nestjs/common'
import { MsLoginService } from './ms-login.service'
import { AxiosModule } from '@/module/axios/axios.module'

@Module({
    imports: [AxiosModule],
    providers: [MsLoginService],
})
export class MsLoginModule {}

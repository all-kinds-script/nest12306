import { Module } from '@nestjs/common'
import { MsUserService } from './ms-user.service'
import { AxiosModule } from '@/module/axios/axios.module'
import { MsLoginModule } from '@/module/ms-login/ms-login.module'

@Module({
    imports: [AxiosModule, MsLoginModule],
    providers: [MsUserService],
})
export class MsUserModule {}

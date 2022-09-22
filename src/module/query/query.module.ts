import { Module } from '@nestjs/common'
import { QueryService } from './query.service'
import { AxiosModule } from '@/module/axios/axios.module'
import { MsConfigModule } from '@/module/config/ms-config.module'
import { EmailService } from '@/module/email/email.service'

@Module({
    imports: [AxiosModule, MsConfigModule],
    providers: [QueryService, EmailService],
})
export class QueryModule {}

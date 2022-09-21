import { Module } from '@nestjs/common'
import { AxiosService } from './axios.service'
import { HttpModule } from '@nestjs/axios'
import { ConfigModule, ConfigService } from '@nestjs/config'

import { AxiosCdnService } from '@/module/axios/axios-cdn.service'
import { CdnConfigService } from '@/module/config/cdn-config.service'

@Module({
    imports: [
        HttpModule.registerAsync({
            imports: [ConfigModule],
            inject: [ConfigService],
            useFactory: (config: ConfigService) => config.get('axios'),
        }),
    ],
    providers: [AxiosService, CdnConfigService, AxiosCdnService],
    exports: [AxiosService, AxiosCdnService, CdnConfigService],
})
export class AxiosModule {}

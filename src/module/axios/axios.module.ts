import { Module } from '@nestjs/common'
import { HttpModule } from '@nestjs/axios'
import { ConfigModule, ConfigService } from '@nestjs/config'

import { AxiosCdnService } from '@/module/axios/axios-cdn.service'
import { CdnConfigService } from '@/module/config/cdn-config.service'
import { AxiosCookieService } from './axios-cookie.service'
import AxiosQrLoginService from '@/module/axios/axios-qr-login.service'
import AxiosCommonService from '@/module/axios/axios-common.service'
import AxiosQueryService from '@/module/axios/axios-query.service'
import AxiosMsUser from '@/module/axios/axios-ms-user'
import { AxiosInterceptorService } from '@/module/axios/axios-interceptor.service'

@Module({
    imports: [
        HttpModule.registerAsync({
            imports: [ConfigModule],
            inject: [ConfigService],
            useFactory: (config: ConfigService) => config.get('axios'),
        }),
    ],
    providers: [
        AxiosCookieService,
        CdnConfigService,
        AxiosCdnService,
        AxiosQrLoginService,
        AxiosCommonService,
        AxiosQueryService,
        AxiosMsUser,
        AxiosInterceptorService,
    ],
    exports: [
        AxiosCdnService,
        CdnConfigService,
        AxiosQrLoginService,
        AxiosQueryService,
        AxiosCommonService,
        HttpModule,
        AxiosCookieService,
        AxiosInterceptorService,
    ],
})
export class AxiosModule {}

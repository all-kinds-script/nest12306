import { Module } from '@nestjs/common'
import { HttpModule } from '@nestjs/axios'
import { ConfigModule, ConfigService } from '@nestjs/config'

import { QueryService } from '@/module/query/query.service'
import { TxtService } from '@/module/config/txt.service'

import { Ms12306Controller } from './ms12306.controller'
import { Ms12306Service } from './ms12306.service'
import { AxiosService } from './axios.service'

@Module({
    imports: [
        HttpModule.registerAsync({
            imports: [ConfigModule],
            inject: [ConfigService],
            useFactory: (config: ConfigService) => config.get('axios'),
        }),
    ],
    controllers: [Ms12306Controller],
    providers: [Ms12306Service, TxtService, AxiosService, QueryService],
})
export class Ms12306Module {}

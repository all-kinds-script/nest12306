import { Module } from '@nestjs/common'
import { Ms12306Controller } from './ms12306.controller'
import { Ms12306Service } from './ms12306.service'
import { LoadTxtService } from './loadTxt.service'
import { HttpModule } from '@nestjs/axios'
import { AxiosService } from '@/module/ms12306/axios.service'
import { QueryService } from '@/module/ms12306/query.service'
import { ConfigModule, ConfigService } from '@nestjs/config'

@Module({
    imports: [
        HttpModule.registerAsync({
            imports: [ConfigModule],
            inject: [ConfigService],
            useFactory: (config: ConfigService) => config.get('axios'),
        }),
    ],
    controllers: [Ms12306Controller],
    providers: [Ms12306Service, LoadTxtService, AxiosService, QueryService],
})
export class Ms12306Module {}

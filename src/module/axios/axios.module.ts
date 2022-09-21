import { Module } from '@nestjs/common'
import { AxiosService } from './axios.service'
import { HttpModule } from '@nestjs/axios'
import { ConfigModule, ConfigService } from '@nestjs/config'

@Module({
    imports: [
        HttpModule.registerAsync({
            imports: [ConfigModule],
            inject: [ConfigService],
            useFactory: (config: ConfigService) => config.get('axios'),
        }),
    ],
    providers: [AxiosService],
    exports: [AxiosService],
})
export class AxiosModule {}

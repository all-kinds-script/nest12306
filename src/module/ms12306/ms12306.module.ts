import { Module } from '@nestjs/common'

import { Ms12306Controller } from './ms12306.controller'
import { Ms12306Service } from './ms12306.service'

@Module({
    imports: [],
    controllers: [Ms12306Controller],
    providers: [Ms12306Service],
    exports: [Ms12306Service],
})
export class Ms12306Module {}

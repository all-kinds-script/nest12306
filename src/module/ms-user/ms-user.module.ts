import { Module } from '@nestjs/common'
import { MsUserService } from './ms-user.service'

@Module({
    providers: [MsUserService],
})
export class MsUserModule {}

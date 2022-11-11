import { Injectable } from '@nestjs/common'
import AxiosUserService from '@/module/axios/axios-user.service'
import { MsLoginService } from '@/module/ms-login/ms-login.service'
import { statSync, writeFileSync } from 'fs'
import { USER_PASSENGERS_PATH } from '@/config/constant/path'

@Injectable()
export class MsUserService {
    constructor(private readonly axiosUserService: AxiosUserService, private readonly msLoginService: MsLoginService) {}

    public async getPassengersInfo() {
        const isLogin = await this.msLoginService.qrLogin()
        if (isLogin) {
            const passengersInfo = await this.axiosUserService.getPassengersInfo()

            const format = JSON.stringify(passengersInfo, null, '\t')
            writeFileSync(USER_PASSENGERS_PATH, format)
            return passengersInfo
        }
    }
}

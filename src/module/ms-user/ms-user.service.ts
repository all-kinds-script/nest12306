import { Injectable } from '@nestjs/common'
import AxiosUserService from '@/module/axios/axios-user.service'
import { MsLoginService } from '@/module/ms-login/ms-login.service'

@Injectable()
export class MsUserService {
    constructor(private readonly axiosUserService: AxiosUserService, private readonly msLoginService: MsLoginService) {
        // this.getPassengersInfo()
    }

    public async getPassengersInfo() {
        const isLogin = await this.msLoginService.qrLogin()
        if (isLogin) {
            await this.axiosUserService.getPassengersInfo()
        }
    }
}

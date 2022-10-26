import { Injectable } from '@nestjs/common'
import AxiosUserService from '@/module/axios/axios-user.service'
import { MsLoginService } from '@/module/ms-login/ms-login.service'

@Injectable()
export class MsUserService {
    constructor(private readonly axiosUserService: AxiosUserService, private readonly msLoginService: MsLoginService) {
        this.getPassengersInfo()
    }

    public async getPassengersInfo() {
        // await this.msLoginService.qrLogin()
        // await this.axiosUserService.getPassengersInfo()
    }
}

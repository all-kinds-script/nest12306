import { Injectable } from '@nestjs/common'
import { HttpService } from '@nestjs/axios'
import { MsLoginService } from '@/module/ms-login/ms-login.service'

@Injectable()
export default class AxiosUserService {
    constructor(private readonly axios: HttpService) {}

    async getPassengersInfo() {
        const res = this.axios.post('/otn/confirmPassenger/getPassengerDTOs', {})
        console.log((await res.toPromise()).data)
    }
}

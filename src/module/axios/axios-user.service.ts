import { Injectable } from '@nestjs/common'
import { HttpService } from '@nestjs/axios'

@Injectable()
export default class AxiosUserService {
    constructor(private readonly axios: HttpService) {}

    getPassengersInfo(): Promise<boolean> {
        return new Promise(async (resolve, reject) => {
            const res = this.axios.post('/otn/confirmPassenger/getPassengerDTOs', {})
            const data = (await res.toPromise()).data.data

            console.log(data)

            if (data.normal_passengers) {
                resolve(data.normal_passengers)
                console.log(data.normal_passengers)
            } else {
                resolve(false)
            }
        })
    }
}

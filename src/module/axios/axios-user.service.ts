import { Injectable } from '@nestjs/common'
import { HttpService } from '@nestjs/axios'
import { writeFileSync } from 'fs'
import { USER_PASSENGERS_PATH } from '@/config/constant/path'

@Injectable()
export default class AxiosUserService {
    constructor(private readonly axios: HttpService) {}

    getPassengersInfo(): Promise<boolean> {
        return new Promise(async (resolve, reject) => {
            const res = this.axios.post('/otn/confirmPassenger/getPassengerDTOs', {})
            const data = (await res.toPromise()).data.data

            if (data.normal_passengers) {
                // 写入文件
                const format = JSON.stringify(data.normal_passengers, null, '\t')
                writeFileSync(USER_PASSENGERS_PATH, format)

                resolve(data.normal_passengers)
            } else {
                resolve(false)
            }
        })
    }
}

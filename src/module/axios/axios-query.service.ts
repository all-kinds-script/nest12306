import { Injectable } from '@nestjs/common'
import { firstValueFrom } from 'rxjs'
import { HttpService } from '@nestjs/axios'

@Injectable()
export default class AxiosQueryService {
    constructor(private readonly axios: HttpService) {}

    // 获取查票的类型 及 获取用户信息时候需要调用一次获取 Ukey 头才能获取用户信息
    async initTicketsType(): Promise<string> {
        const res = await firstValueFrom(
            this.axios.get('/otn/leftTicket/init', {
                headers: {},
            })
        )

        const reg = /var CLeftTicketUrl = '(.*?)';/gims
        const match = res.data.matchAll(reg)

        let apiType
        for (const item of match) apiType = item[1]

        return apiType
    }

    // 查票
    async queryTickets(type: string, leftDate: string, fromStation: string, arriveStation: string): Promise<any> {
        // queryX queryZ

        return await firstValueFrom(
            this.axios.get(`/otn/${type}`, {
                params: {
                    'leftTicketDTO.train_date': leftDate,
                    'leftTicketDTO.from_station': fromStation,
                    'leftTicketDTO.to_station': arriveStation,
                    purpose_codes: 'ADULT',
                },
                maxRedirects: 0,
            })
        )
    }
}

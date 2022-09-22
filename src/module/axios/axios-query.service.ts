import { Injectable } from '@nestjs/common'
import { Observable } from 'rxjs'
import { HttpService } from '@nestjs/axios'

@Injectable()
export default class AxiosQueryService {
    constructor(private readonly axios: HttpService) {}

    // 获取查票的类型
    initTicketsType(): Observable<string> {
        const rx = this.axios.get('/otn/leftTicket/init', {
            headers: {},
        })

        return new Observable((observer) => {
            rx.subscribe({
                next(res) {
                    const reg = /var CLeftTicketUrl = '(.*?)';/gims
                    const match = res.data.matchAll(reg)

                    let apiType
                    for (const item of match) apiType = item[1]

                    observer.next(apiType)
                },
                error(err) {
                    console.log(err)
                },
            })
        })
    }

    // 查票
    queryTickets(type: string, leftDate: string, fromStation: string, arriveStation: string): Observable<any> {
        // queryX queryZ
        const rx = this.axios.get(`/otn/${type}`, {
            params: {
                'leftTicketDTO.train_date': leftDate,
                'leftTicketDTO.from_station': fromStation,
                'leftTicketDTO.to_station': arriveStation,
                purpose_codes: 'ADULT',
            },
            maxRedirects: 0,
        })

        return new Observable((observer) => {
            rx.subscribe({
                next(res) {
                    observer.next(res)
                },
                error(err) {
                    console.log(err.data)
                },
            })
        })
    }
}

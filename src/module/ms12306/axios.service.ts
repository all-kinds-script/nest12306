import { Injectable } from '@nestjs/common'
import { HttpService } from '@nestjs/axios'
import { map, Observable } from 'rxjs'
import { AxiosResponse } from 'axios'
import { Buffer } from 'buffer'
import chalk from 'chalk'

@Injectable()
export class AxiosService {
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
    queryTickets(type: string, leftDate: string, fromStation: string, arriveStation: string): Observable<string> {
        // queryX queryZ
        const rx = this.axios.get(`/otn/${type}`, {
            params: {
                'leftTicketDTO.train_date': leftDate,
                'leftTicketDTO.from_station': fromStation,
                'leftTicketDTO.to_station': arriveStation,
                purpose_codes: 'ADULT',
            },
        })

        return new Observable((observer) => {
            rx.subscribe({
                next(res) {
                    observer.next(res.data)
                },
                error(err) {
                    console.log(err)
                },
            })
        })
    }

    // 获取加密后的浏览器特征 ID
    // Observable<AxiosResponse<string>>
    getBrowserDeviceId(): Observable<string> {
        const rx = this.axios.get('https://12306-rail-id-v2.pjialin.com', {
            baseURL: '',
            headers: {},
        })

        return new Observable((observer) => {
            rx.pipe(map((res) => res.data.id)).subscribe({
                next(id) {
                    const decodeId = Buffer.from(id, 'base64')
                    const decode = decodeId.toString()
                    observer.next(decode)
                },
                error(err) {
                    observer.error(err)
                },
                complete() {
                    observer.complete()
                },
            })
        })
    }

    // 获取到期时间 设备ID 字段头信息
    getExpAndDeviceId(url: string): Observable<AxiosResponse<string>> {
        const rx = this.axios.get(url, {
            baseURL: '',
            headers: {},
        })

        return new Observable((observer) => {
            rx.subscribe((res) => {
                const data = res.data
                if (data.indexOf('callbackFunction') >= 0) {
                    const json = data.substring(18, data.length - 2)
                    const object = JSON.parse(json)

                    // this.axios.defaults.headers.common['RAIL_EXPIRATION'] = object['exp']
                    // this.axios.defaults.headers.common['RAIL_DEVICEID'] = object['dfp']
                }
            })
        })
    }
}
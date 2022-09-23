import { Injectable } from '@nestjs/common'
import { concatMap, map, Observable, of } from 'rxjs'
import { Buffer } from 'buffer'
import { HttpService } from '@nestjs/axios'

@Injectable()
export default class AxiosCommonService {
    constructor(private readonly axios: HttpService) {}

    // 根据浏览器标识 获取 到期时间 设备ID 字段头信息 转为 cookie 信息
    refreshCookie() {
        return this.getBrowserDeviceId().pipe(concatMap((value) => this.getExpAndDeviceIdToCookie(value)))
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
    getExpAndDeviceIdToCookie(url: string): Observable<{ RAIL_EXPIRATION: string; RAIL_DEVICEID: string }> {
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

                    const RAIL_EXPIRATION = `RAIL_EXPIRATION=${object['exp']};`
                    const RAIL_DEVICEID = `RAIL_DEVICEID=${object['dfp']};`

                    this.axios.axiosRef.defaults.headers.common['cookie'] = `${RAIL_EXPIRATION}${RAIL_DEVICEID}`

                    observer.next({ RAIL_EXPIRATION, RAIL_DEVICEID })
                }
            })
        })
    }
}

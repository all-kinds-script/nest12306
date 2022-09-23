import { CACHE_MANAGER, Inject, Injectable } from '@nestjs/common'
import { firstValueFrom } from 'rxjs'
import { Buffer } from 'buffer'
import { HttpService } from '@nestjs/axios'
import { Cache } from 'cache-manager'

@Injectable()
export default class AxiosCommonService {
    constructor(private readonly axios: HttpService, @Inject(CACHE_MANAGER) private readonly cacheManage: Cache) {}

    // 根据浏览器标识 获取 到期时间 设备ID 字段头信息 转为 cookie 信息
    async refreshCookie(): Promise<any> {
        const id = await this.getBrowserDeviceId()
        return await this.getExpAndDeviceIdToCookie(id)
    }

    // 获取加密后的浏览器特征 ID
    // Observable<AxiosResponse<string>>
    async getBrowserDeviceId(): Promise<any> {
        const res = await firstValueFrom(
            this.axios.get('https://12306-rail-id-v2.pjialin.com', {
                baseURL: '',
                headers: {},
            })
        )

        const id = res.data.id
        const decodeId = Buffer.from(id, 'base64')

        return decodeId.toString()
    }

    // 获取到期时间 设备ID 字段头信息
    async getExpAndDeviceIdToCookie(url: string): Promise<any> {
        const res = await firstValueFrom(
            this.axios.get(url, {
                baseURL: '',
                headers: {},
            })
        )

        const data = res.data
        if (data.indexOf('callbackFunction') >= 0) {
            const json = data.substring(18, data.length - 2)
            const object = JSON.parse(json)

            const RAIL_EXPIRATION = `RAIL_EXPIRATION=${object['exp']};`
            const RAIL_DEVICEID = `RAIL_DEVICEID=${object['dfp']};`

            this.axios.axiosRef.defaults.headers.common['cookie'] = `${RAIL_EXPIRATION}${RAIL_DEVICEID}`

            await this.cacheManage.set('RAIL_EXPIRATION', object['exp'])
            await this.cacheManage.set('RAIL_DEVICEID', object['dfp'])

            return { RAIL_EXPIRATION, RAIL_DEVICEID }
        }
    }
}

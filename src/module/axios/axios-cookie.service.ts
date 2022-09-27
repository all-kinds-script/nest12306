import { CACHE_MANAGER, Inject, Injectable } from '@nestjs/common'
import { HttpService } from '@nestjs/axios'
import { AxiosInstance } from 'axios'
import { Cache } from 'cache-manager'
import { GenericsObject } from '@/typings/common'

@Injectable()
export class AxiosCookieService {
    private readonly axiosRef: AxiosInstance
    private cookies: GenericsObject<string> = {}

    constructor(private readonly axios: HttpService, @Inject(CACHE_MANAGER) private readonly cacheManage: Cache) {
        this.axiosRef = this.axios.axiosRef
    }

    setCookie({ key, value }) {
        this.cookies[key] = value
        let cookieStr = ''

        for (const [key, value] of Object.entries(this.cookies)) {
            cookieStr += `${key}=${value};`
        }

        this.axiosRef.defaults.headers.common['cookie'] = cookieStr

        this.cacheManage.set(key, this.cookies).then()
    }

    get cookie() {
        return this.cookies
    }
}

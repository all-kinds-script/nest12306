import { CACHE_MANAGER, Inject, Injectable } from '@nestjs/common'
import { HttpService } from '@nestjs/axios'
import { AxiosInstance } from 'axios'
import { Cache } from 'cache-manager'
import { GenericsObject } from '@/typings/common'

@Injectable()
export class AxiosCookieService {
    private readonly axiosRef: AxiosInstance
    private cookies: GenericsObject<string> = {
        BIGipServerotn: '2263351562.24610.0000',
        RAIL_EXPIRATION: '1664562997214',
        RAIL_DEVICEID:
            'Jrl6Uf8ickL3QQVgfip9WfdzQOzaQrNThM0lx72H0chvYnD1pVaHHtoD6RzjNWlqsDCQo5vWNJKb_tt57kP0mGqXewi74Qb_xbVbWAP8M8KkuWcfMK5vkwEKEuZ4iJQwwFOFlPo-pJKzsuU9FlJkwCvPITiU1i66',
        BIGipServerpassport: '921174282.50215.0000',
        route: '6f50b51faa11b987e576cdb301e545c4',
        JSESSIONID: '02AC5A55E36FECF089AACA4FE524592D',
        BIGipServerpool_passport: '149160458.50215.0000',
        uamtk: 'tF588yxXEMpllHyMGGprcD-Y4IIhn4G65uQL7hcQokIcgd1d0',
        _passport_session: 'd93f4614ecd949189d698f920091044f1298',
        tk: 'rZhJu3klsQz_Cow_NvQnc-XucEHuq2r6qvifZSiAWVQcgd1d0',
        uKey: '25a36abe707067b52a37a7b26c0b7bf35ef2fbff2ae0e7bcb5685be06d736a7a',
    }

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

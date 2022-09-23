import { Injectable } from '@nestjs/common'

import { HttpService } from '@nestjs/axios'
import { firstValueFrom } from 'rxjs'

@Injectable()
export class AxiosCdnService {
    constructor(private readonly axios: HttpService) {}

    // 调用 ip 对应的 api 检查是否可用
    async checkCdnAvailableApi(ip): Promise<any> {
        const res = await firstValueFrom(
            this.axios.get(`https://${ip}/otn/dynamicJs/omseuuq`, {
                headers: {
                    Host: 'kyfw.12306.cn',
                },
                timeout: 2000,
            })
        )
        if (res.status === 200) {
            return ip
        }
    }
}

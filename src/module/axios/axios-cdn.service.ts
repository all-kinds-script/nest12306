import { Injectable } from '@nestjs/common'

import { HttpService } from '@nestjs/axios'
import { Observable } from 'rxjs'

@Injectable()
export class AxiosCdnService {
    constructor(private readonly axios: HttpService) {}

    // 调用 ip 对应的 api 检查是否可用
    checkCdnAvailableApi(ip) {
        return new Observable((observer) => {
            const rx = this.axios.get(`https://${ip}/otn/dynamicJs/omseuuq`, {
                headers: {
                    Host: 'kyfw.12306.cn',
                },
                timeout: 2000,
            })

            rx.subscribe({
                next: (res) => {
                    if (res.status === 200) {
                        observer.next(ip)
                    } else {
                        observer.error(ip)
                    }
                },
                error: () => {
                    observer.error(ip)
                },
            })
        })
    }
}

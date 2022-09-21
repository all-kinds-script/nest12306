import { Injectable } from '@nestjs/common'
import { readFileSync } from 'fs'
import { join } from 'path'
import { catchError, EMPTY, interval, take } from 'rxjs'
import { AxiosCdnService } from '@/module/axios/axios-cdn.service'

@Injectable()
export class CdnConfigService {
    public cdnTxtInfo

    public success: string[] = [
        '117.27.241.254',
        '42.81.144.39',
        '61.147.211.20',
        '106.41.0.37',
        '218.197.116.213',
        '116.77.75.183',
        '112.47.27.131',
        '112.47.27.132',
        '42.81.144.180',
        '218.75.154.94',
        '42.81.144.31',
        '27.195.145.123',
        '113.194.59.199',
    ]
    public fail: string[] = []

    constructor(private readonly axiosCdnService: AxiosCdnService) {
        this.loadCdnTxt()
        // this.startCheckCdn()
    }

    protected loadCdnTxt() {
        const cdnTxt = readFileSync(join(process.cwd(), 'public/txt/cdn.txt'), 'utf-8')
        this.cdnTxtInfo = cdnTxt.split('\r\n')
    }

    startCheckCdn() {
        const cdnLength = this.cdnTxtInfo.length

        const time = interval(200).pipe(take(cdnLength))

        time.subscribe({
            next: (index) => {
                const ip = this.cdnTxtInfo[index]

                const cdn = this.axiosCdnService.checkCdnAvailableApi(ip)

                // 返回一个空的 Observable 对象让其继续（相当于抓了异常什么都没做）
                cdn.pipe(catchError(() => EMPTY))

                cdn.subscribe({
                    next: (ip: string) => this.success.push(ip),
                    error: (ip: string) => this.fail.push(ip),
                })
            },
            complete: () => {
                console.log('CDN 查询完成', this.success)
            },
        })
    }
}

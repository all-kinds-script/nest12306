import { Injectable } from '@nestjs/common'
import { readFileSync } from 'fs'
import { join } from 'path'
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
        let index = 0

        const time = setInterval(async () => {
            if (index === cdnLength) {
                clearInterval(time)
            }

            const ip = this.cdnTxtInfo[index]

            try {
                await this.axiosCdnService.checkCdnAvailableApi(ip)
                this.success.push(ip)
            } catch (e) {
                this.fail.push(ip)
            } finally {
                index++
            }
        }, 200)
    }
}

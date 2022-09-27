import { Injectable } from '@nestjs/common'
import AxiosQrLoginService from '@/module/axios/axios-qr-login.service'
import AxiosCommonService from '@/module/axios/axios-common.service'
import { readFileSync, unlinkSync } from 'fs'
import { clearInterval } from 'timers'
import { HttpService } from '@nestjs/axios'
import { AxiosCookieService } from '@/module/axios/axios-cookie.service'
import * as qrcode from 'qrcode'
import AxiosQueryService from '@/module/axios/axios-query.service'

@Injectable()
export class MsLoginService {
    constructor(
        private readonly axiosQrLoginService: AxiosQrLoginService,
        private readonly axiosCommonService: AxiosCommonService,
        private readonly axiosService: AxiosCookieService,
        private readonly axios: HttpService,
        private readonly axiosQueryService: AxiosQueryService
    ) {}

    async test() {
        const new_tk = await this.axiosQrLoginService.authUamtk()
        const user_name = await this.axiosQrLoginService.authUamauthclient(new_tk)
        await this.axiosQrLoginService.userInfo()
    }

    // 所需 cookie
    // <Cookie BIGipServerotn=418382346.50210.0000 for kyfw.12306.cn/>,
    // <Cookie BIGipServerpool_passport=132383242.50215.0000 for kyfw.12306.cn/>,
    // <Cookie route=c5c62a339e7744272a54643b3be5bf64 for kyfw.12306.cn/>,
    // <Cookie JSESSIONID=5F74234C4122FC24FC2A0C802E66B719 for kyfw.12306.cn/otn>,
    // <Cookie tk=aEk7vnxAmpQcqOItje-U-_LUKfc5O_n6jICxvmvQ9sQtyd1d0 for kyfw.12306.cn/otn>,
    // <Cookie _passport_session=3c5d64a109d14247830e654cf404db861347 for kyfw.12306.cn/passport>,
    // <Cookie uamtk=D5s-z4dCo93f4V9lxA_MI0iwehGtO6EPt6z46jND-WUxhd1d0 for kyfw.12306.cn/passport>]>
    async qrLogin() {
        await this.axiosCommonService.refreshCookie()

        const { uuid, filePath } = await this.axiosQrLoginService.downloadQrToDir()

        const time = setInterval(async () => {
            const data = await this.axiosQrLoginService.authQrCheck(
                this.axiosService.cookie.RAIL_DEVICEID,
                this.axiosService.cookie.RAIL_EXPIRATION,
                uuid
            )

            if (data.result_code === '1') {
                console.log('请确认登录')
            } else if (data.result_code === '3') {
                unlinkSync(filePath)
                clearInterval(time)
                console.log('已经超时')
            } else if (data.result_code === '2') {
                clearInterval(time)

                this.axiosService.setCookie({ key: 'uamtk', value: data.uamtk })

                const new_tk = await this.axiosQrLoginService.authUamtk()
                const user_name = await this.axiosQrLoginService.authUamauthclient(new_tk)
                await this.axiosQueryService.initTicketsType()
                await this.axiosQrLoginService.userInfo()
            }
        }, 1500)
    }
}

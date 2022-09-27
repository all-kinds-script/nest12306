import { CACHE_MANAGER, Inject, Injectable } from '@nestjs/common'
import AxiosQrLoginService from '@/module/axios/axios-qr-login.service'
import AxiosCommonService from '@/module/axios/axios-common.service'
import { unlinkSync } from 'fs'
import { Cache } from 'cache-manager'
import { clearInterval } from 'timers'
import { HttpService } from '@nestjs/axios'
import * as cookie from 'cookie'
import { AxiosCookieService } from '@/module/axios/axios-cookie.service'

@Injectable()
export class MsLoginService {
    constructor(
        private readonly axiosQrLoginService: AxiosQrLoginService,
        private readonly axiosCommonService: AxiosCommonService,
        private readonly axiosService: AxiosCookieService,
        private readonly axios: HttpService
    ) {
        // this.qrLogin()
    }

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
            } else if (data.result_code === '2') {
                clearInterval(time)

                this.axiosService.cookieHeader({ key: 'uamtk', value: data.uamtk })

                // await this.axiosQrLoginService.userLogin()
                const new_tk = await this.axiosQrLoginService.authUamtk()
                const user_name = await this.axiosQrLoginService.authUamauthclient(new_tk)

                // await this.axiosQrLoginService.userLogin()
                await this.axiosQrLoginService.userInfo()
            }
        }, 1500)
    }
}

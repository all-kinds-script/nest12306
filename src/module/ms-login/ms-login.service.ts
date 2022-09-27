import { Inject, Injectable } from '@nestjs/common'
import AxiosQrLoginService from '@/module/axios/axios-qr-login.service'
import AxiosCommonService from '@/module/axios/axios-common.service'
import { readFileSync, unlinkSync } from 'fs'
import { clearInterval } from 'timers'
import { HttpService } from '@nestjs/axios'
import { AxiosCookieService } from '@/module/axios/axios-cookie.service'
import * as qrcode from 'qrcode'
import AxiosQueryService from '@/module/axios/axios-query.service'
import { WINSTON_MODULE_PROVIDER } from 'nest-winston'
import { Logger } from 'winston'

@Injectable()
export class MsLoginService {
    constructor(
        private readonly axiosQrLoginService: AxiosQrLoginService,
        private readonly axiosCommonService: AxiosCommonService,
        private readonly axiosService: AxiosCookieService,
        private readonly axios: HttpService,
        private readonly axiosQueryService: AxiosQueryService,
        @Inject(WINSTON_MODULE_PROVIDER)
        private readonly logger: Logger
    ) {}

    // 所需 cookie
    // BIGipServerotn=418382346.50210.0000
    // BIGipServerpool_passport=132383242.50215.0000
    // route=c5c62a339e7744272a54643b3be5bf64
    // JSESSIONID=5F74234C4122FC24FC2A0C802E66B719
    // tk=aEk7vnxAmpQcqOItje-U-_LUKfc5O_n6jICxvmvQ9sQtyd1d0
    // _passport_session=3c5d64a109d14247830e654cf404db861347
    // uamtk=D5s-z4dCo93f4V9lxA_MI0iwehGtO6EPt6z46jND-WUxhd1d0
    // ukey
    async qrLogin() {
        await this.axiosCommonService.refreshCookie()

        const { uuid, filePath } = await this.axiosQrLoginService.downloadQrToDir()

        const time = setInterval(async () => {
            const data = await this.axiosQrLoginService.authQrCheck(
                this.axiosService.cookie.RAIL_DEVICEID,
                this.axiosService.cookie.RAIL_EXPIRATION,
                uuid
            )

            switch (data.result_code) {
                case '1':
                    this.logger.info('请确认登录')
                    break
                case '2':
                    clearInterval(time)

                    this.axiosService.setCookie({ key: 'uamtk', value: data.uamtk })

                    const new_tk = await this.axiosQrLoginService.authUamtk()
                    const user_name = await this.axiosQrLoginService.authUamauthclient(new_tk)
                    await this.axiosQueryService.initTicketsType()
                    await this.axiosQrLoginService.userInfo()
                    break
                case '3':
                    unlinkSync(filePath)
                    this.logger.info('二维码登录已经超时,已经自动重新登录...')
                    clearInterval(time)

                    await this.qrLogin()
                    break
            }
        }, 1500)
    }
}

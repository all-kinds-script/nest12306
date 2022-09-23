import { CACHE_MANAGER, Inject, Injectable } from '@nestjs/common'
import AxiosQrLoginService from '@/module/axios/axios-qr-login.service'
import AxiosCommonService from '@/module/axios/axios-common.service'
import { unlinkSync } from 'fs'
import { Cache } from 'cache-manager'
import { clearInterval } from 'timers'
import { HttpService } from '@nestjs/axios'

@Injectable()
export class MsLoginService {
    constructor(
        private readonly axiosQrLoginService: AxiosQrLoginService,
        private readonly axiosCommonService: AxiosCommonService,
        @Inject(CACHE_MANAGER) private cacheManage: Cache,
        private readonly axios: HttpService
    ) {
        // this.qrLogin()
    }

    async qrLogin() {
        await this.axiosCommonService.refreshCookie()
        const RAIL_DEVICEID = await this.cacheManage.get('RAIL_DEVICEID')
        const RAIL_EXPIRATION = await this.cacheManage.get('RAIL_EXPIRATION')
        const { uuid, filePath } = await this.axiosQrLoginService.downloadQrToDir()

        const time = setInterval(async () => {
            const data = await this.axiosQrLoginService.authQrCheck(RAIL_DEVICEID, RAIL_EXPIRATION, uuid)

            if (data.result_code === '1') {
                console.log('请确认登录')
            } else if (data.result_code === '3') {
                unlinkSync(filePath)
            } else if (data.result_code === '2') {
                clearInterval(time)

                const cookie = this.axios.axiosRef.defaults.headers.common.cookie
                this.axios.axiosRef.defaults.headers.common.cookie = `${cookie}uamtk=${data.uamtk}`

                // await this.axiosQrLoginService.userLogin()
                const new_tk = await this.axiosQrLoginService.authUamtk()
                console.log(new_tk, 'tk')
                const user_name = await this.axiosQrLoginService.authUamauthclient(new_tk)
                console.log(user_name, 'name')

                // await this.axiosQrLoginService.userLogin()
                // await this.axiosQrLoginService.userInfo()
            }
        }, 1500)
    }
}

import { CACHE_MANAGER, Inject, Injectable } from '@nestjs/common'
import AxiosQrLoginService from '@/module/axios/axios-qr-login.service'
import AxiosCommonService from '@/module/axios/axios-common.service'
import { zip } from 'rxjs'
import { unlinkSync } from 'fs'
import { Cache } from 'cache-manager'

@Injectable()
export class MsLoginService {
    constructor(
        private readonly axiosQrLoginService: AxiosQrLoginService,
        private readonly axiosCommonService: AxiosCommonService,
        @Inject(CACHE_MANAGER) private cacheManage: Cache
    ) {}

    async qrLogin() {
        const RAIL_DEVICEID = await this.cacheManage.get('RAIL_DEVICEID')
        const RAIL_EXPIRATION = await this.cacheManage.get('RAIL_EXPIRATION')

        const rx = zip(this.axiosQrLoginService.downloadQrToDir(), this.axiosCommonService.refreshCookie())

        rx.subscribe(([{ uuid, filePath }]) => {
            this.axiosQrLoginService.authQrCheck(RAIL_DEVICEID, RAIL_EXPIRATION, uuid).subscribe((data) => {
                if (data.result_code === 1) {
                    console.log('请确认登录')
                } else if (data.result_code === 3) {
                    unlinkSync(filePath)
                }
            })
        })

        this.axiosQrLoginService.userLogin().subscribe()
        this.axiosQrLoginService.authUamtk().subscribe((new_tk) => {
            this.axiosQrLoginService.authUamauthclient(new_tk).subscribe((user_name) => {})
        })
        this.axiosQrLoginService.userLogin().subscribe()
        this.axiosQrLoginService.userInfo().subscribe((data) => {})
    }
}

import { HttpService } from '@nestjs/axios'
import { Injectable } from '@nestjs/common'
import { mkdirSync, statSync, writeFileSync } from 'fs'
import { PUBLIC_PATH } from '@/config/constant/path'
import { firstValueFrom } from 'rxjs'
import { VStringObject } from '@/typings/common'
import * as dayjs from 'dayjs'
import { normalize } from 'path'
import { URLSearchParams } from 'url'

@Injectable()
export default class AxiosQrLoginService {
    constructor(private readonly axios: HttpService) {}

    async authQrCheck(RAIL_DEVICEID, RAIL_EXPIRATION, uuid): Promise<any> {
        const res = await firstValueFrom(
            this.axios.get('/passport/web/checkqr', {
                params: {
                    RAIL_DEVICEID,
                    RAIL_EXPIRATION,
                    uuid,
                    appid: 'otn',
                },
            })
        )

        return res.data
    }

    async downloadQrToDir(): Promise<VStringObject | null> {
        const res = await firstValueFrom(
            this.axios.get('/passport/web/create-qr64', {
                params: {
                    appid: 'otn',
                },
            })
        )

        const data = res.data
        if (res.data.result_code === '0') {
            const base64Qr = data.image

            const QRDir = `${PUBLIC_PATH}/QRCode`

            // 判断是否有路径
            const stat = statSync(QRDir, { throwIfNoEntry: false })
            if (!stat) mkdirSync(QRDir, { recursive: true })

            // 文件时间不能为: 否则无法写入
            const id = `${dayjs(Date.now()).format('HH点mm分ss秒_YYYY年MM月DD日')}`
            const filePath = normalize(`${QRDir}/${id}.png`)

            try {
                writeFileSync(filePath, base64Qr, 'base64')
            } catch (e) {
                console.log(e)
            }

            return { filePath, uuid: data.uuid }
        }
    }

    // 检查用户是否登录 并获取 tk 用于 authUamauthclient
    async authUamtk(): Promise<any> {
        const res = await firstValueFrom(
            this.axios.get('/passport/web/auth/uamtk', {
                params: {
                    appid: 'otn',
                },
                headers: {
                    Referer: 'https://kyfw.12306.cn/otn/passport?redirect=/otn/login/userLogin',
                    Origin: 'https://kyfw.12306.cn',
                },
                maxRedirects: 0,
            })
        )

        return res.data.newapptk
    }

    // 获取用户名
    async authUamauthclient(new_tk): Promise<any> {
        const wwwFormUrlencoded = new URLSearchParams({ tk: new_tk })

        const res = await firstValueFrom(
            this.axios.post('/otn/uamauthclient', wwwFormUrlencoded, {
                headers: {
                    'Content-Type': 'application/x-www-form-urlencoded',
                    Referer: 'https://kyfw.12306.cn/otn/passport?redirect=/otn/login/userLogin',
                    Origin: 'https://kyfw.12306.cn',
                },
                maxRedirects: 0,
            })
        )

        return res.data.username
    }

    async userLogin(): Promise<VStringObject> {
        const res = await firstValueFrom(
            this.axios.get('/otn/login/userLogin', {
                maxRedirects: 5,
            })
        )
        return res.data
    }

    async userInfo(): Promise<any> {
        const res = await firstValueFrom(
            this.axios.get('/otn/modifyUser/initQueryUserInfoApi', {
                maxRedirects: 0,
            })
        )
        return res.data['data.userDTO.loginUserDTO']
    }
}

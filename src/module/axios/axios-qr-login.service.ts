import { HttpService } from '@nestjs/axios'
import { Inject, Injectable } from '@nestjs/common'
import { mkdirSync, statSync, writeFileSync } from 'fs'
import { PUBLIC_PATH } from '@/config/constant/path'
import { firstValueFrom } from 'rxjs'
import { GenericsObject } from '@/typings/common'
import * as dayjs from 'dayjs'
import { normalize } from 'path'
import { URLSearchParams } from 'url'
import { WINSTON_MODULE_PROVIDER } from 'nest-winston'
import { Logger } from 'winston'
import { decodeQr, encodeQrTerminal } from '@/utils/qrcode'

@Injectable()
export default class AxiosQrLoginService {
    constructor(
        private readonly axios: HttpService,
        @Inject(WINSTON_MODULE_PROVIDER)
        private readonly logger: Logger
    ) {}

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

    async downloadQrToDir(): Promise<GenericsObject<string> | null> {
        const res = await firstValueFrom(
            this.axios.get('/passport/web/create-qr64', {
                params: {
                    appid: 'otn',
                },
            })
        )

        const data = res.data
        if (res.data.result_code === '0') {
            const base64QrImage: string = data.image

            const QRDir = `${PUBLIC_PATH}/QRCode`

            // 判断是否有路径
            const stat = statSync(QRDir, { throwIfNoEntry: false })
            if (!stat) mkdirSync(QRDir, { recursive: true })

            // 文件时间不能为: 否则无法写入
            const id = `${dayjs(Date.now()).format('HH点mm分ss秒_YYYY年MM月DD日')}`
            const filePath = normalize(`${QRDir}/${id}.png`)

            try {
                writeFileSync(filePath, base64QrImage, 'base64')
            } catch (e) {
                this.logger.error(e)
            }

            const decode = await decodeQr({ data: base64QrImage })
            await encodeQrTerminal(decode)

            return { filePath, uuid: data.uuid }
        }
    }

    // cookie
    // '_passport_session=c16d2e2e821345e0924712eadac3ad2b5175; Path=/passport',
    // 'uamtk=VdLWZbZu8Xln3bX-uCxqzC5CAAfHZ-62WftGx2XByQcmkd1d0; Path=/passport',
    // 'BIGipServerpool_passport=216269322.50215.0000; path=/'
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

    // cookie
    // 'route=9036359bb8a8a461c164a04f8f50b252; Path=/',
    // 'JSESSIONID=5D98D625C506B9C09FD94885C32C0C80; Path=/otn',
    // 'tk=c1hvgUbIakgctGS39rircNjzWIiomodWAfdC6jQtNPcpld1d0; Path=/otn',
    // 'BIGipServerotn=49283594.50210.0000; path=/'
    // 获取用户名
    async authUamauthclient(new_tk): Promise<any> {
        // 可以不写，axios 如果请求头是 application/x-www-form-urlencoded 自动将数据转换为 URLSearchParams 包裹
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

    async userLogin(): Promise<GenericsObject<string>> {
        const res = await firstValueFrom(
            this.axios.get('/otn/login/userLogin', {
                maxRedirects: 5,
            })
        )
        return res.data
    }

    // 用户身份证相关信息
    async userInfo(): Promise<any> {
        const res = await firstValueFrom(
            this.axios.get('/otn/modifyUser/initQueryUserInfoApi', {
                maxRedirects: 0,
            })
        )

        return res.data['data.userDTO.loginUserDTO']
    }
}

import { HttpService } from '@nestjs/axios'
import { CACHE_MANAGER, Inject, Injectable } from '@nestjs/common'
import { mkdirSync, statSync, writeFileSync } from 'fs'
import { PUBLIC_PATH } from '@/config/constant/path'
import { nanoid } from 'nanoid'
import { Observable } from 'rxjs'
import { VStringObject } from '@/typings/common'
import { Cache } from 'cache-manager'

@Injectable()
export default class AxiosQrLoginService {
    constructor(private readonly axios: HttpService) {}

    authQrCheck(RAIL_DEVICEID, RAIL_EXPIRATION, uuid): Observable<any> {
        return new Observable((observer) => {
            const rx = this.axios.get('/passport/web/checkqr', {
                params: {
                    RAIL_DEVICEID,
                    RAIL_EXPIRATION,
                    uuid,
                    appid: 'otn',
                },
            })

            rx.subscribe({
                next: (res) => {
                    observer.next(res.data)
                },
                error: (err) => {
                    observer.error(err)
                },
            })
        })
    }

    downloadQrToDir(): Observable<VStringObject> {
        return new Observable((observer) => {
            const rx = this.axios.get('/passport/web/create-qr64', {
                params: {
                    appid: 'otn',
                },
            })

            rx.subscribe({
                next: (res) => {
                    const data = res.data
                    if (res.data.result_code === '0') {
                        const base64Qr = data.image

                        const QRDir = `${PUBLIC_PATH}/QRCode`

                        // 判断是否有路径
                        const stat = statSync(QRDir, { throwIfNoEntry: false })
                        if (!stat) mkdirSync(QRDir, { recursive: true })

                        const id = nanoid()
                        const filePath = `${QRDir}/${id}.png`

                        writeFileSync(filePath, base64Qr, 'base64')

                        observer.next({ filePath, uuid: data.uuid })
                    }
                },
                error: (err) => {
                    observer.error(err)
                },
            })
        })
    }

    userLogin() {
        return new Observable((observer) => {
            const rx = this.axios.get('/otn/login/userLogin', {})

            rx.subscribe({
                next: (res) => {
                    observer.next(res.data)
                },
                error: (err) => {
                    observer.error(err)
                },
            })
        })
    }

    authUamtk() {
        return new Observable((observer) => {
            const rx = this.axios.get('/otn/login/userLogin', {
                params: {
                    appid: 'otn',
                },
                headers: {
                    Referer: 'https://kyfw.12306.cn/otn/passport?redirect=/otn/login/userLogin',
                    Origin: 'https://kyfw.12306.cn',
                },
                maxRedirects: 0,
            })

            rx.subscribe({
                next: (res) => {
                    observer.next(res.data.newapptk)
                },
                error: (err) => {
                    observer.error(err)
                },
            })
        })
    }

    authUamauthclient(new_tk) {
        return new Observable((observer) => {
            const rx = this.axios.get('/otn/uamauthclient', {
                params: {
                    tk: new_tk,
                },
                headers: {
                    Referer: 'https://kyfw.12306.cn/otn/passport?redirect=/otn/login/userLogin',
                    Origin: 'https://kyfw.12306.cn',
                },
                maxRedirects: 0,
            })

            rx.subscribe({
                next: (res) => {
                    observer.next(res.data.username)
                },
                error: (err) => {
                    observer.error(err)
                },
            })
        })
    }

    userInfo() {
        return new Observable((observer) => {
            const rx = this.axios.get('/otn/modifyUser/initQueryUserInfoApi', {
                maxRedirects: 0,
            })

            rx.subscribe({
                next: (res) => {
                    observer.next(res.data['data.userDTO.loginUserDTO'])
                },
                error: (err) => {
                    observer.error(err)
                },
            })
        })
    }
}

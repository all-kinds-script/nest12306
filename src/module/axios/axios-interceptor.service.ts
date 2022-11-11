import { Injectable } from '@nestjs/common'
import { HttpService } from '@nestjs/axios'
import { AxiosCookieService } from '@/module/axios/axios-cookie.service'
import { AxiosInstance } from "axios";

@Injectable()
export class AxiosInterceptorService {
    private readonly axiosRef:AxiosInstance

    constructor(private readonly axios: HttpService, private readonly axiosCookieService: AxiosCookieService) {
        this.axiosRef = this.axios.axiosRef
        this.initInterceptor()
    }

    initInterceptor() {
        this.axiosRef.interceptors.request.use(this.reqInterceptor.bind(this), this.reqInterceptorErr.bind(this))
        this.axiosRef.interceptors.response.use(this.resInterceptor.bind(this), this.resInterceptorErr.bind(this))
    }

    reqInterceptor(config) {
        return config
    }

    reqInterceptorErr(error) {
        return Promise.reject(error)
    }

    resInterceptor(response) {
        const setCookie = response.headers['set-cookie']

        if (setCookie) {
            setCookie.forEach((cookie) => {
                const [key, value] = cookie.split(';')[0].split('=')

                this.axiosCookieService.setCookie({ key, value })
            })
        }

        return response
    }

    resInterceptorErr(error) {
        return Promise.reject(error)
    }
}

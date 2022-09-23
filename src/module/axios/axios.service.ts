import {Injectable} from '@nestjs/common'
import {HttpService} from '@nestjs/axios'

// this.axios.axiosRef 可获取 axios 实例，例： this.axios.axiosRef.interceptors
@Injectable()
export class AxiosService {
    constructor(private readonly axios: HttpService) {}
}

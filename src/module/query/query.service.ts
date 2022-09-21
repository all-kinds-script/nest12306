import { Injectable } from '@nestjs/common'
import { AxiosService } from '@/module/axios/axios.service'
import { StationsConfigService } from '@/module/config/stations-config.service'

@Injectable()
export class QueryService {
    constructor(private readonly axiosService: AxiosService, private readonly stationsConfigService: StationsConfigService) {
        this.init()
    }

    init() {
        // 根据浏览器标识 获取 到期时间 设备ID 字段头信息
        this.axiosService.getBrowserDeviceId().subscribe((value) => {
            this.axiosService.getExpAndDeviceId(value)
        })

        this.axiosService.initTicketsType().subscribe((value) => {
            this.stationsConfigService.stationsTxtInfo.forEach((item) => {
                this.axiosService.queryTickets(value, '2020-9-30', item.from.key, item.arrive.key).subscribe((v) => {
                    console.log(v)
                })
            })
        })
    }
}

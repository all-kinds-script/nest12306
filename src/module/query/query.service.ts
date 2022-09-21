import { Injectable } from '@nestjs/common'
import { TxtService } from '@/module/ms-config/txt.service'
import { AxiosService } from '@/module/axios/axios.service'

@Injectable()
export class QueryService {
    constructor(private readonly axiosService: AxiosService, private readonly loadTxtService: TxtService) {
        this.init()
    }

    init() {
        // 根据浏览器标识 获取 到期时间 设备ID 字段头信息
        this.axiosService.getBrowserDeviceId().subscribe((value) => {
            this.axiosService.getExpAndDeviceId(value)
        })

        this.axiosService.initTicketsType().subscribe((value) => {
            this.loadTxtService.txtInfo.forEach((item) => {
                this.axiosService.queryTickets(value, '2020-9-30', item.from.key, item.arrive.key).subscribe((v) => {})
            })
        })
    }
}

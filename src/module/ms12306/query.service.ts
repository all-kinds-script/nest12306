import { Injectable } from '@nestjs/common'
import { AxiosService } from '@/module/ms12306/axios.service'
import { map } from 'rxjs'
import { LoadTxtService } from '@/module/ms12306/loadTxt.service'

@Injectable()
export class QueryService {
    constructor(private readonly axiosService: AxiosService, private readonly loadTxtService: LoadTxtService) {
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

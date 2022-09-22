import { Injectable } from '@nestjs/common'
import { AxiosService } from '@/module/axios/axios.service'
import { StationsConfigService } from '@/module/config/stations-config.service'
import QueryTicket from '@/enum/query-ticket'
import QuerySeat from '@/enum/query-seat'

@Injectable()
export class QueryService {
    public ticketInfo = []

    constructor(private readonly axiosService: AxiosService, private readonly stationsConfigService: StationsConfigService) {
        // this.init()
    }

    init() {
        // 根据浏览器标识 获取 到期时间 设备ID 字段头信息
        this.axiosService.getBrowserDeviceId().subscribe((value) => {
            this.axiosService.getExpAndDeviceId(value).subscribe()
        })

        this.axiosService.initTicketsType().subscribe((value) => {
            // this.stationsConfigService.stationsTxtInfo.forEach((item) => {
            //     this.axiosService.queryTickets(value, '2022-09-30', item.from.key, item.arrive.key).subscribe((res) => {
            //         for (const result of res.data.result) {
            //             const ticket = result.split('|')
            //
            //             this.ticketInfo.push({
            //                 startTime: ticket[QueryTicket.START_TIME],
            //                 arriveTime: ticket[QueryTicket.ARRIVE_TIME],
            //                 trainCode: ticket[QueryTicket.TRAIN_CODE],
            //                 haveTicket: ticket[QueryTicket.HAVE_TICKET], // haveTicket === Y  && orderType === '预定' 就有票
            //                 orderType: ticket[QueryTicket.ORDER_TYPE],
            //                 seat: ticket[QuerySeat['硬卧']], // 是否有座  seat !== '' && seat !== '无' && seat !== '*'    seat有票可能是个数
            //             })
            //         }
            //
            //         console.log(this.ticketInfo)
            //     })
            // })
        })
    }
}

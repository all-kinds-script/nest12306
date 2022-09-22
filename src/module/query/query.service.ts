import { Injectable } from '@nestjs/common'
import { AxiosService } from '@/module/axios/axios.service'
import QueryTicket from '@/enum/query-ticket'
import QuerySeat from '@/enum/query-seat'
import { MsConfigService } from '@/module/config/ms-config.service'
import { catchError, EMPTY, interval, take } from 'rxjs'

@Injectable()
export class QueryService {
    public ticketInfo = []
    private ticketsType
    private task = []

    constructor(private readonly axiosService: AxiosService, private readonly msConfigService: MsConfigService) {
        this.init()
        this.initQueryTicketTask()
        this.startQueryTicket()
    }

    init() {
        // 根据浏览器标识 获取 到期时间 设备ID 字段头信息 转为 cookie 信息
        this.axiosService.getBrowserDeviceId().subscribe((value) => this.axiosService.getExpAndDeviceIdToCookie(value).subscribe())

        // 设置查票类型
        this.axiosService.initTicketsType().subscribe((value) => (this.ticketsType = value))
    }

    public initQueryTicketTask() {
        this.msConfigService.job.forEach((job) => {
            job.start_time.forEach((time) => {
                job.stations.forEach((station) => {
                    job.train_code.forEach((train_code) => {
                        this.task.push({
                            time,
                            station,
                            train_code,
                        })
                    })
                })
            })
        })
    }

    public startQueryTicket() {
        const rx = interval(10000).pipe(take(this.task.length))
        rx.pipe(catchError(() => EMPTY))

        rx.subscribe({
            next: (index) => {
                const { time, station, train_code } = this.task[index]

                this.axiosService.queryTickets(this.ticketsType, time, station.from, station.to).subscribe((res) => {
                    for (const result of res.data.result) {
                        const ticket = result.split('|')

                        this.ticketInfo.push({
                            startTime: ticket[QueryTicket.START_TIME],
                            arriveTime: ticket[QueryTicket.ARRIVE_TIME],
                            trainCode: ticket[QueryTicket.TRAIN_CODE],
                            haveTicket: ticket[QueryTicket.HAVE_TICKET], // haveTicket === Y  && orderType === '预定' 就有票
                            orderType: ticket[QueryTicket.ORDER_TYPE],
                            seat: ticket[QuerySeat['硬卧']], // 是否有座  seat !== '' && seat !== '无' && seat !== '*'    seat有票可能是个数
                        })

                        console.log(this.ticketInfo, 111)
                    }
                })
            },
        })
    }
}

import { Injectable } from '@nestjs/common'
import { AxiosService } from '@/module/axios/axios.service'
import QueryTicket from '@/enum/query-ticket'
import QuerySeat from '@/enum/query-seat'
import { MsConfigService } from '@/module/config/ms-config.service'
import { catchError, EMPTY, interval, take } from 'rxjs'
import { EmailService } from '@/module/email/email.service'

@Injectable()
export class QueryService {
    private ticketsType
    private task = []

    constructor(
        private readonly axiosService: AxiosService,
        private readonly msConfigService: MsConfigService,
        private readonly emailService: EmailService
    ) {
        this.setCookie()
        this.initType()
        this.initQueryTicketTask()
        this.startQueryTicket()
    }

    // 设置查票类型
    initType() {
        this.axiosService.initTicketsType().subscribe((value) => (this.ticketsType = value))
    }

    // 根据浏览器标识 获取 到期时间 设备ID 字段头信息 转为 cookie 信息
    setCookie() {
        this.axiosService
            .getBrowserDeviceId()
            .subscribe((value) => this.axiosService.getExpAndDeviceIdToCookie(value).subscribe())
    }

    public initQueryTicketTask() {
        const accounts = this.msConfigService.accounts

        accounts.map((account) => {
            this.task = account.job.map((job) => {
                const task = { ...account, ...job }
                delete task.job

                return task
            })
        })
    }

    public startQueryTicket() {
        const rx = interval(3000).pipe(take(1 || this.task.length))
        rx.pipe(catchError(() => EMPTY))

        rx.subscribe({
            next: (index) => {
                const { start_time, from, to, seats, train_code } = this.task[index]

                this.axiosService.queryTickets(this.ticketsType, start_time, from, to).subscribe((res) => {
                    for (const result of res.data.data.result) {
                        const ticket = result.split('|')

                        train_code.forEach((code) => {
                            if (ticket[QueryTicket.TRAIN_CODE] === code) {
                                seats.forEach((seat) => {
                                    const seatInfo = ticket[seat.seats_query]
                                    const haveTicket = ticket[QueryTicket.HAVE_TICKET]

                                    // 是否有座
                                    const isHaveSeat = seatInfo !== '' && seatInfo !== '无' && seatInfo !== '*'
                                    // 是否有票
                                    const isHaveTicket = haveTicket === 'Y' && haveTicket === '预定'

                                    if (isHaveSeat && isHaveTicket) {
                                        const info = {
                                            startTime: ticket[QueryTicket.START_TIME],
                                            arriveTime: ticket[QueryTicket.ARRIVE_TIME],
                                            trainCode: ticket[QueryTicket.TRAIN_CODE],
                                            haveTicket: ticket[QueryTicket.HAVE_TICKET], // haveTicket === Y  && orderType === '预定' 就有票
                                            orderType: ticket[QueryTicket.ORDER_TYPE],
                                            seat: ticket[QuerySeat['硬卧']], // 是否有座  seat !== '' && seat !== '无' && seat !== '*'    seat有票可能是个数
                                        }

                                        // 发送邮件
                                        // this.emailService.sendHaveTicket()
                                    }
                                })
                            }
                        })
                    }
                })
            },
        })
    }
}

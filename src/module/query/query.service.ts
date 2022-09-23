import { Injectable } from '@nestjs/common'
import { MsConfigService } from '@/module/config/ms-config.service'
import { catchError, concatMap, EMPTY, interval, of, take, zip } from 'rxjs'
import { EmailService } from '@/module/email/email.service'
import AxiosQueryService from '@/module/axios/axios-query.service'
import AxiosCommonService from '@/module/axios/axios-common.service'
import QuerySeat from '@/module/query/enum/query-seat'
import QueryTicket from '@/module/query/enum/query-ticket'

@Injectable()
export class QueryService {
    private ticketsType
    private task = []

    constructor(
        private readonly axiosQueryService: AxiosQueryService,
        private readonly axiosCommonService: AxiosCommonService,
        private readonly msConfigService: MsConfigService,
        private readonly emailService: EmailService
    ) {
        this.axiosCommonService.refreshCookie()
        this.initType()
        this.initQueryTicketTask()
        // this.startQueryTicket()
    }

    // 设置查票类型
    initType() {
        this.axiosQueryService.initTicketsType().subscribe((value) => (this.ticketsType = value))
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
        const rx = interval(1000).pipe(
            take(4 || this.task.length),
            catchError(() => EMPTY),
            concatMap((index) => {
                const task = this.task[index]
                const { start_time, from, to } = task

                return zip(this.axiosQueryService.queryTickets(this.ticketsType, start_time, from, to), of(task))
            })
        )

        rx.subscribe({
            next: ([res, task]) => {
                const { seats, train_code } = task

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
            },
        })
    }
}

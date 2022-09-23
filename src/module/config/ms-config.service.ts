import { Injectable } from '@nestjs/common'
import { ConfigService } from '@nestjs/config'
import { StationsConfigService } from '@/module/config/stations-config.service'
import QuerySeat from '@/module/query/enum/query-seat'
import OrderSeat from '@/enum/order-seat'
import * as dayjs from 'dayjs'

@Injectable()
export class MsConfigService {
    public originAccounts // 读取出来 yml 的配置
    public accounts // 修改为 code 的配置
    public runtime

    constructor(private readonly configService: ConfigService, private stationsConfigService: StationsConfigService) {
        this.loadYml()
        this.replaceInfoToCode()
    }

    private loadYml() {
        const yml = this.configService.get('job-yml')
        this.runtime = yml.runtime
        this.accounts = this.originAccounts = yml.jobs
    }

    private replaceInfoToCode() {
        this.accounts = this.accounts.map((account) => {
            account.job = account.job.map((job) => {
                // 替换 地点编码
                const stations = this.stationsConfigService.stations
                job.from = stations[job.from].key
                job.to = stations[job.to].key

                job.start_time = dayjs(job.start_time).format('YYYY-MM-DD')

                // 替换 座位
                job.seats = job.seats.map((seat) => {
                    return {
                        seats_query: QuerySeat[seat],
                        seats_order: OrderSeat[seat],
                    }
                })

                // 替换 火车编码为大写
                job.train_code = job.train_code.map((trainCode) => {
                    return trainCode.toUpperCase()
                })

                return job
            })

            return account
        })
    }
}

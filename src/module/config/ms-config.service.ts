import { Injectable } from '@nestjs/common'
import { ConfigService } from '@nestjs/config'
import { StationsConfigService } from '@/module/config/stations-config.service'
import QuerySeat from '@/enum/query-seat'
import OrderSeat from '@/enum/order-seat'

@Injectable()
export class MsConfigService {
    public originJob // 读取出来 yml 的配置
    public job // 修改为 code 的配置
    public runtime

    constructor(private readonly configService: ConfigService, private stationsConfigService: StationsConfigService) {
        this.loadYml()
        this.replaceInfoToCode()
    }

    private loadYml() {
        const yml = this.configService.get('yml')

        this.runtime = yml.runtime
        this.job = this.originJob = yml.job
    }

    private replaceInfoToCode() {
        this.job.forEach((config, index) => {
            // 替换 地点编码
            this.job[index].stations = this.stationsConfigService.replaceStationToCode(config.stations)

            // 替换 座位
            this.job[index]['seats_query'] = []
            this.job[index]['seats_order'] = []
            this.job[index].seats.forEach((seat, seatIndex) => {
                this.job[index]['seats_query'][seatIndex] = QuerySeat[seat]
                this.job[index]['seats_order'][seatIndex] = OrderSeat[seat]

                console.log(this.job[index])
            })

            // 替换 火车编码为大写
            this.job[index].train_code = this.job[index].train_code.map((trainCode) => {
                return trainCode.toUpperCase()
            })
        })
    }
}

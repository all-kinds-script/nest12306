import { Injectable } from '@nestjs/common'
import { readFileSync } from 'fs'

@Injectable()
export class OrderService {
    constructor() {
        this.submitOrder()
    }

    public submitOrder() {
        let res = readFileSync(`${process.cwd()}/public/user/query.json`, 'utf-8')
        res = JSON.parse(res)

        const data = {
            train_date: res['startTime'], // 出发时间
            back_train_date: res['startTime'], // 返程时间
            query_from_station_name: '北京西',
            query_to_station_name: '漯河',
            secretStr: decodeURI(res['secret']),
            tour_flag: 'dc', // 旅途类型
            purpose_codes: 'ADULT', // 成人 | 学生
        }
    }
}

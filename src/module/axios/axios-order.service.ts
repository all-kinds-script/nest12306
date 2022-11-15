import { Injectable } from '@nestjs/common'
import { HttpService } from '@nestjs/axios'

@Injectable()
export default class AxiosOrderService {
    constructor(private readonly axios: HttpService) {
        this.toSubmitPageGetToken()
    }

    public async submitOrder(params) {
        const res = await this.axios.post('/otn/leftTicket/submitOrderRequest', params)
        const data = (await res.toPromise()).data
        if (data.data === '0') {
            console.log('订单提交成功')
        } else {
            // 未处理订单
            if (data.message.indexOf('未处理') >= 0) {
            }
        }
    }

    private async toSubmitPageGetToken() {
        const params = { _json_att: '' }
        const res = await this.axios.post('/otn/confirmPassenger/initDc', params)
        const data = (await res.toPromise()).data

        const token = /var globalRepeatSubmitToken '(.+?)'/gims.exec(data)
        const form = /var ticketInfoForPassengerForm *= *(\{.+})/gims.exec(data)
        const order = /var orderRequestDTO *= *(\{.+\})/gims.exec(data)
        console.log(token, data, 11111)
    }
}

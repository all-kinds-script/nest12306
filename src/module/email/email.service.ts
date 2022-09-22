import { Injectable } from '@nestjs/common'
import { MailerService } from '@nestjs-modules/mailer'
import * as dayjs from 'dayjs'

@Injectable()
export class EmailService {
    constructor(private readonly mailerService: MailerService) {}

    public async sendHaveTicket(): Promise<any> {
        const code = 666

        try {
            return await this.mailerService.sendMail({
                to: '1037306928@qq.com', // 接收者
                from: '1037306928@qq.com', // 发送者
                // cc: //抄送
                subject: `验证码为：${code}`, // 标题
                text: '文章体', // 文本
                template: 'verification-code', // `.pug`、`.ejs` 或 `.hbs` 扩展名是自动附加的
                context: {
                    // 要发送到模板引擎的数据
                    code: code,
                    date: dayjs(Date.now()).format('YYYY-MM-DD HH:mm'),
                },
                // html: '<b>welcome</b>', // HTML body content
            })
        } catch (e) {
            console.log(e)
        }
    }
}

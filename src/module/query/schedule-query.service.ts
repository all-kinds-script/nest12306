import { Inject, Injectable } from '@nestjs/common'
import { Cron, SchedulerRegistry } from '@nestjs/schedule'
import { CronCommand, CronJob } from 'cron'
import { Logger } from 'winston'
import { WINSTON_MODULE_PROVIDER } from 'nest-winston'

@Injectable()
export default class ScheduleQueryService {
    constructor(
        private scheduler: SchedulerRegistry,
        @Inject(WINSTON_MODULE_PROVIDER)
        private readonly logger: Logger
    ) {}

    @Cron('*/1 * * * * *', { name: 'AUTOLOGIN' })
    public autoLoginAndCookie() {
        const job = this.scheduler.getCronJob('AUTOLOGIN')
        job.stop()
    }

    //
    public queryTicket(name: string, seconds: number, tick: CronCommand) {
        const job = new CronJob(`*/${seconds} * * * * *`, tick)

        this.scheduler.addCronJob(name, job)
        job.start()
    }
}

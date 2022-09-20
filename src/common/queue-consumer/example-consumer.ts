import { InjectQueue, OnGlobalQueueActive, Process, Processor } from '@nestjs/bull'
import { Job, Queue } from 'bull'

@Processor('queue')
export class ExampleQueueConsumer {
    constructor(@InjectQueue('queue') private queue: Queue) {}

    @Process('transcode')
    async transcode(job: Job<unknown>) {
        let progress = 0
        for (let i = 0; i < 100; i++) {
            console.log(job.data)

            progress += 10

            // 队列进度
            job.progress(progress)
        }
        return {}
    }

    // @OnQueueError()	@OnGlobalQueueError()	handler(error: Error) - 当错误发生时，error包括触发错误
    // @OnQueueWaiting()	@OnGlobalQueueWaiting()	handler(jobId: number | string) - 一旦工作者空闲就等待执行的任务，jobId包括进入此状态的 id
    // @OnQueueActive()	@OnGlobalQueueActive()	handler(job: Job)-job任务已启动
    // @OnQueueStalled()	@OnGlobalQueueStalled()	handler(job: Job)-job任务被标记为延迟。这在时间循环崩溃或暂停时进行调试工作时是很有效的
    // @OnQueueProgress()	@OnGlobalQueueProgress()	handler(job: Job, progress: number)-job任务进程被更新为progress值
    // @OnQueueCompleted()	@OnGlobalQueueCompleted()	handler(job: Job, result: any) job任务进程成功以result结束
    // @OnQueueFailed()	@OnGlobalQueueFailed()	handler(job: Job, err: Error)job任务以err原因失败
    // @OnQueuePaused()	@OnGlobalQueuePaused()	handler()队列被暂停
    // @OnQueueResumed()	@OnGlobalQueueResumed()	handler(job: Job)队列被恢复
    // @OnQueueCleaned()	@OnGlobalQueueCleaned()	handler(jobs: Job[], type: string) 旧任务从队列中被清理，job是一个清理任务数组，type是要清理的任务类型
    // @OnQueueDrained()	@OnGlobalQueueDrained()	handler()在队列处理完所有等待的任务（除非有些尚未处理的任务被延迟）时发射出
    // @OnQueueRemoved()	@OnGlobalQueueRemoved()	handler(job: Job)job任务被成功移除
    //   job任务已启动
    @OnGlobalQueueActive()
    async onGlobalActive(jobId: number, result: any) {
        const job = await this.queue.getJob(jobId)
        console.log(`进程任务 ${job.id}  任务为 ${job.name} 数据是 ${job.data} result ${result}`)
    }
}

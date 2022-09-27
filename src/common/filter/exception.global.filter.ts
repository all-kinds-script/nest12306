import { ArgumentsHost, Catch, ExceptionFilter, HttpException, HttpStatus } from "@nestjs/common";
import { HttpAdapterHost } from "@nestjs/core";

// : HttpAdapterHost<any>
// https://www.kancloud.cn/juukee/nestjs/2669782
// 全局异常处理
@Catch()
export class CustomGlobalExceptionFilter<T> implements ExceptionFilter {
    constructor(private readonly httpAdapterHost: HttpAdapterHost) {}

    catch(exception: T, host: ArgumentsHost) {
        // 在某些情况下，`httpAdapter` 可能在构造方法中不可用，因此我们应该在这里解决它。
        const { httpAdapter } = this.httpAdapterHost
        const ctx = host.switchToHttp()

        const response = ctx.getResponse()
        const request = ctx.getRequest()

        const status = exception instanceof HttpException ? exception.getStatus() : HttpStatus.INTERNAL_SERVER_ERROR

        const exceptionStr = `\r\n\t方法:${request.method}\r\n\t请求地址${request.url}\r\n\t请求体${JSON.stringify(
            request.body
        )}\r\n\t错误消息:${exception['message']},\r\n栈:${exception['stack']}`

        console.log('全局异常日志： %s %s %s error: %s', exceptionStr)

        // 两个响应写法都可以
        // response.status(status).json({
        //   data: null,
        //   code: status,
        //   message: exception['message'],
        //   timestamp: new Date().getTime(),
        //   path: httpAdapter.getRequestUrl(request),
        // })

        httpAdapter.reply(
            response,
            {
                data: null,
                code: status,
                msg: exception['message'],
                timestamp: new Date().getTime(),
                path: httpAdapter.getRequestUrl(request),
            },
            status
        )
    }
}

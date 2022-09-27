import { ArgumentsHost, Catch, ExceptionFilter, HttpException } from "@nestjs/common";

// http异常处理
@Catch(HttpException)
export class HttpExceptionFilter<T extends HttpException> implements ExceptionFilter {
    catch(exception: T, host: ArgumentsHost): any {
        const ctx = host.switchToHttp() // 获取请求上下文

        const res = ctx.getResponse() // 获取请求上下文中的 response对象
        const status = exception.getStatus() // 获取异常状态码
        const verifyRes: string | object = exception.getResponse() // 参数校验响应

        // 设置错误信息
        const msg = exception.message || `${status >= 500 ? '服务器错误' : '客户端错误'}`

        const errorResponse = verifyRes || {
            data: null,
            msg,
            code: status,
            timestamp: new Date().getTime(),
        }

        // 设置返回的网络状态码， 响应头，发送错误信息
        res.status(status)
        res.header('Content-Type', 'application/json; charset=utf-8')
        res.send(errorResponse)
    }
}

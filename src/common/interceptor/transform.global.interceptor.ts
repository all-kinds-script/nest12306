import type { InterceptorRes } from '@/typings/interceptor'
import { CallHandler, ExecutionContext, HttpStatus, Injectable, NestInterceptor } from '@nestjs/common'
import { map, Observable } from 'rxjs'

@Injectable()
export class TransformInterceptor implements NestInterceptor {
    intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
        return next.handle().pipe(
            map((res: InterceptorRes) => {
                const { data, msg, code } = res || {}

                return {
                    data: data || (!msg && res) || null,
                    code: code || HttpStatus.OK,
                    msg: msg || '请求成功',
                }
            })
        )
    }
}

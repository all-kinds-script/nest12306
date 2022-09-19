///jwt.auth.guard.ts
import CustomExceptionError from '@/common/filter/exception.custom'
import { ExecutionContext, Injectable } from '@nestjs/common'
import { JwtService } from '@nestjs/jwt'
import { AuthGuard } from '@nestjs/passport'
import { Observable } from 'rxjs'
@Injectable()
export class JwtAuthGuard extends AuthGuard('jwt') {
  private readonly jwtService: JwtService
  constructor() {
    super()
    this.jwtService = new JwtService()
  }

  canActivate(context: ExecutionContext): boolean | Promise<boolean> | Observable<boolean> {
    // 在这里添加自定义的认证逻辑
    // 例如调用 super.logIn(request) 来建立一个session

    const req: Request = context.switchToHttp().getRequest()

    const token: string = req.headers['authorization']
    const noBearerToken = token?.split(' ')[1]

    const result = this.jwtService.decode(noBearerToken)

    if (result) return true
    if (!result) throw new CustomExceptionError({ msg: 'token 校验失败' }, 400)

    return super.canActivate(context)
  }
}

// import { AuthService } from '@/module/auth/auth.service'
import {Injectable} from '@nestjs/common'
import {PassportStrategy} from '@nestjs/passport'
import {Strategy} from 'passport-local'

// 校验 账号密码是否和本地的 一致
@Injectable()
export class LocalStrategy extends PassportStrategy(Strategy, 'local') {
    // private readonly authService: AuthService

    constructor(authService) {
        super()
    }

    async validate(username: string, password: string): Promise<any> {
        // const user = await this.authService.validateUser(username, password)
        //
        // if (!user) throw new CustomExceptionError({ msg: '用户校验失败' }, 400)
        //
        // return user
    }
}

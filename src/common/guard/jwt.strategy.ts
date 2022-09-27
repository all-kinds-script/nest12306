import { JWT_SECRET } from "@/config/constant/jwt";
import { Injectable } from "@nestjs/common";
import { PassportStrategy } from "@nestjs/passport";
import { ExtractJwt, Strategy } from "passport-jwt";

// jwt 策略，
@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy, 'jwt') {
    constructor() {
        super({
            // 获取 请求头中的 bear token
            jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
            // 确保 JWT 没有过期的责任委托给 Passport 模块。如果我们的路由提供了一个过期的 JWT ，请求将被拒绝，并发送 401 未经授权的响应。Passport 会自动为我们处理
            // jwt 产出 token 时的秘钥
            secretOrKey: JWT_SECRET,
            // 是否忽略过期时间
            ignoreExpiration: false,
        })
    }

    // JWT验证 - Step 4: 被守卫调用
    validate(payload: any) {
        console.log(`JWT验证 - Step 4: 被守卫调用\r\n`)
        const { sub, username, realName, role } = payload

        return {
            userId: sub,
            username,
            realName,
            role,
        }
    }
}

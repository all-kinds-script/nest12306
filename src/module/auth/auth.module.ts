// import { JWT_EXPIRES_IN, JWT_SECRET } from '@/constant/jwt'
// import { UserModule } from '@/module/user/user.module'
//
// import { Module } from '@nestjs/common'
// import { JwtModule } from '@nestjs/jwt'
// import { PassportModule } from '@nestjs/passport'
// // 本文件夹
// import { JwtStrategy } from '@/common/guard/jwt.strategy'
// import { LocalStrategy } from '@/common/guard/local.strategy'
// import { AuthService } from './auth.service'
//
// @Module({
//   imports: [
//     // 设置默认的 passport 策略
//     PassportModule.register({ defaultStrategy: 'jwt' }),
//     JwtModule.register({
//       secret: JWT_SECRET,
//       signOptions: { expiresIn: JWT_EXPIRES_IN }, // token 过期时效
//     }),
//     UserModule,
//   ],
//   providers: [AuthService, LocalStrategy, JwtStrategy],
//   exports: [AuthService, LocalStrategy],
// })
// export class AuthModule {}

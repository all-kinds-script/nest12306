// import { UserEntity } from '@/db/user.entity'
// import { UserService } from '@/module/user/user.service'
// import { encryptPassword } from '@/utils/encrypt'
// import { Injectable } from '@nestjs/common'
// import { JwtService } from '@nestjs/jwt'
//
// @Injectable()
// export class AuthService {
//   constructor(private readonly usersService: UserService, private readonly jwtService: JwtService) {}
//
//   // Local 验证 - Step 2: 校验用户信息
//   async validateUser(username: string, password: string): Promise<any> {
//     const user = await this.usersService.findOne({ username })
//
//     const { salt, encryptPassword: userHashPassword } = user
//
//     if (user) {
//       // 通过密码盐，加密传参，再与数据库里的比较，判断是否相等
//       const hashPassword = encryptPassword(password, salt)
//
//       return userHashPassword === hashPassword ? user : null
//     }
//
//     // 查无此人
//     return null
//   }
//
//   // JWT验证 - 获取 token
//   async certificate(user: UserEntity) {
//     // 必须是个普通对象
//     const payload = Object.assign({}, user)
//
//     return this.getToken(payload)
//   }
//
//   // 加密 token
//   getToken(payload) {
//     return this.jwtService.sign(payload)
//   }
//
//   // 解密 token
//   decodeToken(token: string) {
//     return this.jwtService.decode(token)
//   }
// }

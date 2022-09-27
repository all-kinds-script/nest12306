import { SetMetadata } from "@nestjs/common";

/**
 * 接口不用验证
 */
export const NoAuth = () => SetMetadata('no-auth', true)

/**
 * 登录认证
 */
export const jwtAuth = () => SetMetadata('jwt-auth', true)

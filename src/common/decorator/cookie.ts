import { createParamDecorator, ExecutionContext } from '@nestjs/common'

// 获取 cookie 装饰器 使用: findAll(@Cookies('name') name: string) {}
export const Cookies = createParamDecorator((data: string, ctx: ExecutionContext) => {
  const request = ctx.switchToHttp().getRequest()
  return data ? request.cookies?.[data] : request.cookies
})

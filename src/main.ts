import { HttpAdapterHost, NestFactory } from '@nestjs/core'
import { NestExpressApplication } from '@nestjs/platform-express'
import { VersioningType } from '@nestjs/common'

import { AppModule } from './app.module'

import { TransformInterceptor } from './common/interceptor/transform.global.interceptor'
import { TimeoutInterceptor } from './common/interceptor/timeout.interceptor'
import { CustomGlobalExceptionFilter } from './common/filter/exception.global.filter'
import { HttpExceptionFilter } from './common/filter/exception.http.filter'

import middleware from '@/common/middleware/global_middleware'
import VIRTUAL_PATH from '@/config/constant/router-path.enum'
import { PUBLIC_PATH, VIEW_PATH } from '@/config/constant/path'
import { getIpAddress } from './utils/ip'
import chalk from 'chalk'

async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(AppModule, {})

  app.setGlobalPrefix(VIRTUAL_PATH.API)
  app.enableVersioning({
    // 默认情况下，URI 中的版本将自动以 v 为前缀
    // 可以使用 VersioningType.HEADER 请求头控制 type: VersioningType.HEADER, header: 'Custom-Header',
    // 可以使用 Accept 请求的标头 指定版本 type: VersioningType.MEDIA_TYPE， key: 'v=', 例如头: Accept: application/json;v=2
    type: VersioningType.URI,
    defaultVersion: VIRTUAL_PATH.VERSION, // 全局版本 支持三种, '1'、['1', '2']、VERSION_NEUTRAL
  })

  // 开启跨域
  app.enableCors({
    origin: '*',
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
    preflightContinue: false,
    optionsSuccessStatus: 204,
    credentials: true,
    maxAge: 3000,
  })

  const httpAdapter = app.get(HttpAdapterHost)

  app.use(...middleware) // 中间件
  app.useGlobalInterceptors(new TransformInterceptor(), new TimeoutInterceptor()) // 拦截器
  app.useGlobalFilters(new CustomGlobalExceptionFilter(httpAdapter), new HttpExceptionFilter()) // 过滤器

  // 配置 public 文件夹为静态目录，以达到可直接访问下面文件的目的
  // app.use('/public', express.static(join(rootDir, 'public')));
  app.useStaticAssets(PUBLIC_PATH, { prefix: VIRTUAL_PATH.STATIC_ASSETS })
  // mvc 渲染 类似 jsp
  app.setBaseViewsDir(VIEW_PATH)

  app.setViewEngine('pug')

  const port = 3000
  await app.listen(
    port,
    getIpAddress((address) => {
      console.log('\r\n')
      console.log(chalk.blue(`接口地址: http://${address}:${port}/${VIRTUAL_PATH.API}/v${VIRTUAL_PATH.VERSION}`))
      console.log(chalk.blue(`MVC渲染: http://${address}:${port}/${VIRTUAL_PATH.API}/v${VIRTUAL_PATH.VERSION}/app`))
      console.log(chalk.blue(`SPA 渲染路径: http://${address}:${port}/${VIRTUAL_PATH.SPA_RENDER}`))
      console.log(
        chalk.blue(`静态资源路径: http://${address}:${port}/${VIRTUAL_PATH.STATIC_ASSETS}/upload/日期文件夹/文件名.ext`)
      )
      console.log('\r\n')
    })
  )
}

bootstrap().then()

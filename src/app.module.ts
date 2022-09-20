import { CacheInterceptor, CacheModule, MiddlewareConsumer, Module } from '@nestjs/common'
import { AppController } from './app.controller'
import * as Joi from 'joi'
import { APP_INTERCEPTOR } from '@nestjs/core'
import { JwtMiddleware } from '@/common/middleware/jwt.middleware'
import allConfig, { eventConfig } from './config/index.config'
import { ConfigModule, ConfigService } from '@nestjs/config'
import { ScheduleModule } from '@nestjs/schedule'
import { WinstonModule } from 'nest-winston'
import VIRTUAL_PATH from '@/config/constant/router-path.enum'
import { MailerModule } from '@nestjs-modules/mailer'
import { CLIENT_PATH } from '@/config/constant/path'
import { BullModule } from '@nestjs/bull'
import { EventEmitterModule } from '@nestjs/event-emitter'
import { ServeStaticModule } from '@nestjs/serve-static'
import { Ms12306Module } from './module/ms12306/ms12306.module'

@Module({
    // imports 导入模块相当于导入这个模块所有的（包括这个模块导入的其他模块 包括：providers、imports）
    imports: [
        // dotenv 模块
        ConfigModule.forRoot({
            envFilePath: [`.env.${process.env.NODE_ENV}`, '.env.local'],
            ignoreEnvFile: false, // 是否忽略.env文件
            isGlobal: true, // 全局模块加载 ConfigModule ,不需要在其他模块中导入
            cache: true, // 是否缓存
            expandVariables: true, // 启用环境变量扩展${}
            load: allConfig,
            // 校验是否符合规则，否则异常
            validationSchema: Joi.object({
                node_env: Joi.string().valid('development', 'production').default('development'),
                PORT: Joi.number().default(3000),
            }),
            validationOptions: {
                // 控制是否允许环境变量中的未知键
                allowUnknown: true,
                // 如果为真，则在第一个错误时停止验证；如果为 false，则返回所有错误
                abortEarly: false,
            },
        }),

        // 定时任务模块
        ScheduleModule.forRoot(),

        // 事件模块 注册发生在onApplicationBootstrap生命周期钩子
        EventEmitterModule.forRoot(eventConfig),

        // 日志模块
        WinstonModule.forRootAsync({
            imports: [ConfigModule],
            inject: [ConfigService],
            useFactory(config: ConfigService) {
                return config.get('winston')
            },
        }),

        // 队列模块 forRoot 为所有 注入一个全局可用的配置
        BullModule.forRootAsync({
            imports: [ConfigModule],
            inject: [ConfigService],
            useFactory: (config: ConfigService) => {
                return config.get('queue')
            },
        }),

        // 邮件模块
        MailerModule.forRootAsync({
            // 特别注意一定要导入, 不导入就报错, 说你没在imports引入
            imports: [ConfigModule],
            inject: [ConfigService],
            useFactory: (config: ConfigService) => {
                // 拿到我们配置的config别名 #registerAs方法
                return config.get('email')
            },
        }),

        // 缓存模块
        CacheModule.registerAsync({
            imports: [ConfigModule],
            inject: [ConfigService],
            useFactory: async (config: ConfigService) => {
                return config.get('cache')
            },
        }),

        // SPA 静态网站并将其内容放置在rootPath属性指定的位置。
        ServeStaticModule.forRoot({
            // 静态文件根目录
            rootPath: CLIENT_PATH,
            // 将提供静态应用程序的根路径
            serveRoot: `/${VIRTUAL_PATH.SPA_RENDER}`,
            // 呈现静态应用程序的路径（与serveRoot值连接）。默认值：*（通配符 - 所有路径）。
            renderPath: '*',
            // 提供静态应用程序时要排除的路径
            exclude: ['/api/nest/*', ''],
        }),

        Ms12306Module,

        // 路由器模块
        // RouterModule.register([
        //   {
        //     path: 'admin',
        //     module: parentModole,
        //     children: [
        //       {
        //         path: 'dashboard',
        //         module: childModole,
        //       },
        //     ],
        //   },
        // ]),
    ],
    // 必须创建的一组控制器 处理http请求，包括路由控制，向客户端返回响应(按构造函数循序写)
    controllers: [AppController],
    // 注入器(inject)实例化的提供者（服务提供者,给controllers提供），处理具体的业务逻辑，模块内共享使用；
    providers: [
        // 全局响应缓存,将 CacheInterceptor 全局绑定到每个端点 @UseInterceptors(CacheInterceptor)
        {
            provide: APP_INTERCEPTOR,
            useClass: CacheInterceptor,
        },
    ],
    // 导出其他模块需要共享的Providers以及导入的模块(只能导出在那个模块的providers或imports中注册或导入过的模块或提供者)
    exports: [],
})
export class AppModule {
    configure(consumer: MiddlewareConsumer) {
        // apply() 使用 中间件 和 app.use 一样
        // forRoutes() 应用中间件的路由
        consumer.apply(JwtMiddleware).forRoutes('login')
    }
}

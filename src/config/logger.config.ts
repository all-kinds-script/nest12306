// https://blog.csdn.net/xiexingshishu/article/details/117196560
// 可自定义传输类型（可自己写类实现包的方法）
// 字体样式：bold, dim,italic, underline, inverse, hidden, strikethrough
// 字体背景颜色：black,red,green,yellow,blue, magenta,cyan,white,gray,grey
// 背景颜色：blackBG,redBG,greenBG,yellowBG,blueBG,magentaBG,cyanBG,whiteBG

import { LOG_COLOR, LOG_FLAG, LOG_LEVEL, LOG_LEVELS_CONFIG, LOG_OUT_DIR } from '@/config/constant/log'
import { registerAs } from '@nestjs/config'
import { addColors, format, transports } from 'winston'
import 'winston-daily-rotate-file'

addColors(LOG_COLOR)

// 自定义格式化信息
const customFormat = format.combine(
    format.json(),
    format.label({ label: `运行环境:dev` }),
    format.timestamp({ format: 'MM-DD-YYYY HH:mm:ss' }),
    format.align(),
    format.printf((info) => `[${info.level}] \r\n时间：${[info['timestamp']]}\r\n载体:${info.message}`)
    // format.prettyPrint(),
)

const defaultOptions = {
    format: customFormat,
    datePattern: 'YYYY-MM-DD',
    zippedArchive: true,
    maxSize: '20m',
    maxFiles: '14d',
}

const winstonConfig: any = registerAs('winston', () => ({
    level: LOG_LEVEL,
    levels: LOG_LEVELS_CONFIG,
    silent: LOG_FLAG, // 是否禁用所有日志
    format: customFormat,
    exitOnError: false, // 是否在错误时退出
    transports: [
        // 自定义控制台信息
        new transports.Console({
            level: 'info',
            format: format.combine(
                format.colorize(), // 开启控制台颜色展示
                format.printf((info) => `[${info.level}] \r\n时间：${[info['timestamp']]}\r\n载体:${info.message}`)
            ),
            handleExceptions: true,
            // handleRejections
        }),
        // 自定义文件输出配置
        new transports.DailyRotateFile({
            // handleExceptions:true //处理异常
            // handleRejections:true //处理未经批准的拒绝承诺
            filename: `${LOG_OUT_DIR}/info/%DATE%.log`,
            level: 'info',
            ...defaultOptions,
        }),
        new transports.DailyRotateFile({
            filename: `${LOG_OUT_DIR}/err/%DATE%.log`,
            level: 'error',
            handleExceptions: true,
            // handleRejections
            ...defaultOptions,
        }),
    ],
    // exitOnError:false //异常时候是否退出 false 退出 默认为 true
    // exceptionHandlers: [new transports.File({ filename: `${LOG_OUT_DIR}/other/exceptions.log` })],
    // rejectionHandlers: [new transports.File({ filename: 'logs/other/reject.log' })], //处理未经批准的拒绝承诺,
}))

// 可以创建多个日志打印器
export default winstonConfig

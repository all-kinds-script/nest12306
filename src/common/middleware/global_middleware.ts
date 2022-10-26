import * as bodyParser from 'body-parser'
import * as compression from 'compression'
import * as cookieParser from 'cookie-parser'
import rateLimit from 'express-rate-limit'
import * as session from 'express-session'
import helmet from 'helmet'

const middleware = [
    // 响应体压缩
    compression(),

    // secret 用于加密该会话 ID cookie，它可以是一个字符串用于单一加密，或者数组用来多重加密。如果提供了一个数组，只有第一个元素被用来加密会话 ID cookie，其他元素将被用于验证签名请求。密码本身不应该过于容易被人工解析，最好使用一组随机字符。
    // 使能 re_save 选项会强制重新保存会话即使在请求过程中它未被修改过。其默认值为true，但不赞成使用默认值，在未来这个默认值将被修改。
    // 类似地，使能 saveUninitialized 选项将强制存储一个未初始化的会话。一个未初始化的会话可能是一个新的尚未修改的会话。配置为false用于登陆会话是很有用的，可以减少服务器存储，或者遵循法律规定在存储用户cookie前需要获得用户授权。配置为false在一个客户端在无会话情况下建立多个请求的状况下会很有用。参见这里。
    // 还可以给session中间件传递更多参数，参见 https://github.com/expressjs/session#options 文档。

    // 注意secure:true是推荐选项。然而，它需要启用了https的网站，也就是说，HTTPS对安全cookie来说是必须的。如果配置了secure，但是通过HTTP访问网站，将不会保存cookie。如果你的node.js在代理之后，并且启用了secure:true选项，你需要在express中配置trust proxy选项。
    session({
        name: 'session-name',
        secret: 'secret', // 加密 cookie
        resave: false,
        saveUninitialized: false,
    }),

    // 通过适当地设置 HTTP 头，Helmet 可以帮助保护您的应用免受一些众所周知的 Web 漏洞的影响。
    helmet(),

    // 解析请求体，为了 csrf 可以拿到请求体中的内容
    bodyParser.urlencoded({ extended: false }),
    bodyParser.json(),

    // 必须在 csrf 前使用 cookieParser

    // secret： 一个字符串或者数组，用来给cookie签名。如果不指定这个选项，将不解析签名的cookie。如果提供了一个字符串，那么它会被用来作为secret。如果提供了一个数组，将尝试依次使用其元素来作为secret解析cookie。
    // option：一个作为第二个参数传递给cookie.parse的对象，参见[cookie](https://www.npmjs.org/package/cookie)来了解更多内容。
    // 该中间件将从请求的头文件中解析Cookie并将其数据作为req.cookies暴露出来。如果提供了secret，将暴露为req.signedCookies。这些属性以cookie名称和属性的键值对保存。
    // 当提供了 secret 时，该中间件将解析并验证所有签名的cookie并将其值从req.cookies移动到req.signedCookies。签名cookie是指包含s:前缀的cookie。验证失败的签名cookie值会被替换为false而不是被篡改过的值。

    // 解析 cookie
    cookieParser('secret'),

    // CSRF (跨站脚本攻击) 保护
    // httpOnly 只能是否是 web 服务器访问
    // key 存储令牌秘密的 cookie 的名称
    // 服务端会生成秘钥 secret 设置客户端 cookie ,需要传递 返回token 也给客户端让他携带回来
    // csurf({ cookie: { key: '_csrf', path: '/', secure: false, maxAge: 3000, httpOnly: false, signed: false, sameSite: 'none' } }),

    // 为了保护您的应用程序免受暴力攻击，您必须实现某种速率限制
    rateLimit({
        windowMs: 15 * 60 * 1000, // 15 minutes
        max: 100, // 将每个 IP 限制为每个窗口 1Ms 100 个请求
        standardHeaders: true, // 在 `RateLimit-*` 头中返回速率限制信息
        legacyHeaders: false, // 禁用 `X-RateLimit-*` 头
        message: '请求次数过多, 请稍后再试',
        statusCode: 429,
        requestPropertyName: 'rateLimit', // Express 请求对象上用于存储速率限制信息的属性的名称
        // IP 没有限制的白名单
        skip: (request, response) => {
            return ['10.20.100'].includes(request.ip)
        },
    }),
]

export default middleware

import { registerAs } from '@nestjs/config'

const axiosConfig = registerAs('axios', () => ({
    baseURL: 'https://kyfw.12306.cn',
    timeout: 10000,
    withCredentials: true,
    responseType: 'json', // 文档设置为document自动转化为DOM、text为文字、blob等
    maxRedirects: 5,
    // xsrf 设置
    xsrfCookieName: 'XSRF-TOKEN',
    xsrfHeaderName: 'X-XSRF-TOKEN',
    // 最多转发数，用于node.js
    // 最大响应数据大小
    maxContentLength: 200000,
    headers: {},
    // 自定义错误状态码范围
    validateStatus(status: number) {
        return status >= 200 && status < 400
    },
}))

export default axiosConfig

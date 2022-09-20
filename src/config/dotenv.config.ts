// https://www.kancloud.cn/juukee/nestjs/2675354

// 1. const nestConfig = () => ({port:''}) 返回一个对象配置 config.get('port')
// 2. const nestConfig = () =>registerAs('port',()=>{}) (: {}) 返回一个字段的对象配置

const nestConfig = () => ({
    port: parseInt(process.env.PORT, 10) || 3000,
    node_env: process.env.NODE_ENV || 'development',
    database: {
        host: process.env.DATABASE_HOST,
        port: parseInt(process.env.DATABASE_PORT, 10) || 5432,
    },
})

export default nestConfig

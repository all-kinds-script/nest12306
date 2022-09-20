import { registerAs } from '@nestjs/config'

const cacheConfig = registerAs('cache', () => ({
    isGlobal: true, // 全局模块加载 CacheModule ,不需要在其他模块中导入
    ttl: 5, //秒
    max: 100, //缓存中最大和最小数量
}))

export default cacheConfig

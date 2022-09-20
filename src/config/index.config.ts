import cacheConfig from './cache.config'
import dbConfig from './db.config'
import nestConfig from './dotenv.config'
import emailConfig from './email.config'
import winstonConfig from './logger.config'
import queueConfig from './queue.config'
import axiosConfig from '@/config/axios.config'
export { default as eventConfig } from './event.config'

const allConfig = [nestConfig, emailConfig, cacheConfig, queueConfig, dbConfig, winstonConfig, axiosConfig]

export default allConfig

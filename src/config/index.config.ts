import cacheConfig from './cache.config'
import dbConfig from './db.config'
import nestConfig from './dotenv.config'
import emailConfig from './email.config'
import winstonConfig from './logger.config'
import queueConfig from './queue.config'
export { default as eventConfig } from './event.config'

const allConfig = [nestConfig, emailConfig, cacheConfig, queueConfig, dbConfig, winstonConfig]

export default allConfig

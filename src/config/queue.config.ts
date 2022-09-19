import { registerAs } from '@nestjs/config'

const queueConfig = registerAs('queue', () => ({
  redis: {
    host: '127.0.0.1',
    port: 6379,
    // password: '123456',
  },
}))

export default queueConfig

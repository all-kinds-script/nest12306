import { readFileSync } from 'fs'
import * as yaml from 'js-yaml'
import { JOB_YML_CONFIG_PATH } from '@/config/constant/path'
import { registerAs } from '@nestjs/config'

const yml = yaml.load(readFileSync(JOB_YML_CONFIG_PATH, 'utf8'))

const jobYmlConfig = registerAs('job-yml', () => yml)

export default jobYmlConfig

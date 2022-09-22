import { readFileSync } from 'fs'
import * as yaml from 'js-yaml'
import { YML_CONFIG_PATH } from '@/config/constant/path'
import { registerAs } from '@nestjs/config'

const yml = yaml.load(readFileSync(YML_CONFIG_PATH, 'utf8'))

const ymlConfig = registerAs('yml', () => yml)

export default ymlConfig

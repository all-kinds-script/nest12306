import { normalize } from 'path'

export const ROOT_PATH = process.cwd()

// 根目录下
export const PUBLIC_PATH = normalize(`${ROOT_PATH}/public`)
export const CLIENT_PATH = normalize(`${ROOT_PATH}/client`)
export const YML_CONFIG_PATH = normalize(`${ROOT_PATH}/config.yml`)

// src 目录下
export const SRC_PATH = normalize(`${ROOT_PATH}/apps/nest-core/src`)
export const VIEW_PATH = normalize(`${SRC_PATH}/views`)
export const TEMPLATES_PATH = normalize(`${SRC_PATH}/views/templates`)

// 实体路径
export const ENTITY_PATH = normalize(`${SRC_PATH}/db/**/*.entity{.ts,.js}`)
export const CREATE_ENTITY_PATH = normalize(`${SRC_PATH}/db`)

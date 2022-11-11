import { normalize } from 'path'

export const ROOT_PATH = process.cwd()

// 根目录下
export const PUBLIC_PATH = normalize(`${ROOT_PATH}/public`)
export const CLIENT_PATH = normalize(`${ROOT_PATH}/client`)
export const JOB_YML_CONFIG_PATH = normalize(`${ROOT_PATH}/job-config.yml`)

// src 目录下
export const SRC_PATH = normalize(`${ROOT_PATH}/src`)
export const VIEW_PATH = normalize(`${SRC_PATH}/views`)
export const TEMPLATES_PATH = normalize(`${SRC_PATH}/views/templates`)

// 实体路径
export const ENTITY_PATH = normalize(`${SRC_PATH}/db/**/*.entity{.ts,.js}`)
export const CREATE_ENTITY_PATH = normalize(`${SRC_PATH}/db`)

// 用户信息路径
export const USER_COOKIE_PATH = normalize(`${PUBLIC_PATH}/user/cookie.json`)
export const USER_PASSENGERS_PATH = normalize(`${PUBLIC_PATH}/user/passengers.json`)
export const USER_QR_PATH = normalize(`${PUBLIC_PATH}/QRCode`)

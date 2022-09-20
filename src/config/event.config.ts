const eventConfig = {
    // 是否使用通配符
    wildcard: true,
    // 用于分割命名空间的分隔符
    delimiter: '.',
    // 是否发射新事件
    newListener: true,
    // 是否移除事件
    removeListener: true,
    // 最大事件数量
    maxListeners: 10,
    // 侦听器数量超过最大数量时，在内存泄漏消息中显示事件名称
    verboseMemoryLeak: true,
    // 如果发出错误事件并且它没有侦听器，则禁用抛出
    ignoreErrors: true,
}

export default eventConfig

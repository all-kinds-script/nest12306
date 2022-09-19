import { CREATE_ENTITY_PATH } from '@/config/constant/path'
import { registerAs } from '@nestjs/config'

const dbConfig = registerAs('db', () => ({
  type: 'mysql',
  // 如果为true，在应用程序关闭后连接不会关闭（默认：false)
  keepConnectionAlive: false,
  // https://typeorm.io/logging#
  // query- 记录所有查询。
  // error- 记录所有失败的查询和错误。
  // schema- 记录架构构建过程。
  // warn- 记录内部 orm 警告。
  // info- 记录内部 orm 信息性消息。
  // log- 记录内部 orm 日志消息。
  logging: false,
  logger: 'advanced-console',
  // 记录执行时间过长的查询：
  maxQueryExecutionTime: 0,
  // 用于命名数据​​库中的表和列的命名策略。
  // namingStrategy:,
  // 此数据源上的所有表（或集合）都带有给定字符串的前缀。
  entityPrefix: '',
  // 指示 TypeORM 在从数据库中反序列化实体时是否应跳过构造函数。请注意，当您不调用构造函数时，私有属性和默认属性都不会按预期运行。
  entitySkipConstructor: false,
  // 每次初始化数据源时删除模式。请谨慎使用此选项，不要在生产中使用它 - 否则您将丢失所有生产数据。此选项在调试和开发期间很有用
  dropSchema: false,
  // 指示是否应在每次应用程序启动时自动创建数据库模式。请谨慎使用此选项，不要在生产中使用它 - 否则您可能会丢失生产数据。此选项在调试和开发期间很有用。作为替代方案，您可以使用 CLI 并运行 schema:sync 命令
  // 对于 MongoDB 数据库，它不会创建模式，因为 MongoDB 是无模式的。相反，它仅通过创建索引来同步
  synchronize: true,
  // 指示是否应在每次应用程序启动时自动运行迁移。作为替代方案，您可以使用 CLI 并运行 migration:run 命令。
  migrationsRun: false,
  // 数据库中将包含有关已执行迁移的信息的表的名称。默认情况下，此表称为“迁移”。
  migrationsTableName: '',
  // 迁移的控制事务（默认值：）all，可以是all| none|each
  migrationsTransactionMode: 'none',
  //数据库中将包含有关表元数据信息的表的名称。默认情况下，此表称为“typeorm_metadata”。
  metadataTableName: 'typeorm_metadata',
  // 启用实体结果缓存。您还可以在此处配置缓存类型和其他缓存选项
  cache: {
    type: 'database',
    tableName: 'configurable-table-query-result-cache',
  },
  // 通过路径自动导入实体
  // entities: [ENTITY_PATH],
  // 如果为true,将自动加载实体(默认：false) 每个通过forFeature()注册的实体都会自动添加到配置对象的entities数组中。
  // 那些没有通过forFeature()方法注册，而仅仅是在实体中被引用（通过关系）的实体不能通过autoLoadEntities配置被包含。
  autoLoadEntities: true,
  cli: {
    // CLI 默认创建实体的目录。
    entitiesDir: CREATE_ENTITY_PATH,
    //  CLI 默认创建订阅者的目录。
    subscribersDir: '',
  },

  host: '127.0.0.1',
  port: 3306,
  username: 'root',
  password: 'root',
  // 连接的数据库名
  database: 'nest-dev',
  // 这在 MySQL 的 SQL 级别中称为“排序规则”（如 utf8_general_ci）。如果指定了 SQL 级别的字符集（如 utf8mb4），则使用该字符集的默认排序规则。（默认值：UTF8_GENERAL_CI）。
  charset: 'UTF8_GENERAL_CI',
  //  MySQL 服务器上配置的时区。这用于将服务器日期/时间值类型转换为 JavaScript Date 对象，反之亦然。这可以是local,Z或形式中的偏移量 +HH:MMor -HH:MM。(默认: local)
  timezone: 'local',
  // 在与 MySQL 服务器的初始连接期间发生超时之前的毫秒数。
  connectTimeout: 10000,

  // 允许连接到要求旧（不安全）身份验证方法的 MySQL 实例。(默认: false)
  insecureAuth: false,
  // 当处理数据库中的大数字（BIGINT和DECIMAL列）时，您应该启用此选项（默认值true：）
  supportBigNumbers: true,
  // 启用supportBigNumbers并bigNumberStrings强制大数字（BIGINT和DECIMAL列）始终作为 JavaScript 字符串对象返回（默认值：）true。
  // 启用supportBigNumbers但bigNumberStrings禁用将仅在无法用 JavaScript Number 对象准确表示时将大数字作为 String 对象返回
  // （当它们超出[-2 ^ 53, +2 ^ 53]范围时会发生这种情况），否则它们将作为 Number 对象返回。supportBigNumbers如果禁用，则忽略此选项。
  bigNumberStrings: true,
  // 强制日期类型 ( TIMESTAMP, DATETIME, DATE) 作为字符串返回，而不是膨胀到 JavaScript Date 对象中。可以是真/假或类型名称数组以保留为字符串。(默认: false)
  dateStrings: false,
  // 将协议详细信息打印到标准输出。可以是真/假或应打印的数据包类型名称数组。(默认: false)
  debug: false,
  // 生成错误堆栈跟踪以包括库入口的调用站点（“长堆栈跟踪”）。大多数调用都会有轻微的性能损失。(默认: true)
  trace: true,
  //  每个查询允许多个 mysql 语句。小心这一点，它可能会增加 SQL 注入攻击的范围
  multipleStatements: true,
  // 使用 MySQL 8 中删除的 GeomFromText 和 AsText 等空间函数。（默认值：true）
  legacySpatialSupport: true,
  // 要使用的连接标志列表，而不是默认的。也可以将默认的列入黑名单。有关更多信息，请查看连接标志。 https://github.com/mysqljs/mysql#connection-flags
  // flags:,
  // 带有 ssl 参数的对象或包含 ssl 配置文件名称的字符串
  // ssl:,
  // 重试连接数据库的次数（默认：10）
  retryAttempts: 10,
  // 两次重试连接的间隔(ms)（默认：3000）
  retryDelay: 3000,
}))

export default dbConfig

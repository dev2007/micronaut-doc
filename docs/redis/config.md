---
sidebar_position: 40
---

# 4. 配置 Redis Lettuce

**自定义 Redis 配置**

你可以使用 [DefaultRedisConfiguration](https://micronaut-projects.github.io/micronaut-redis/5.3.2/api/io/micronaut/configuration/lettuce/DefaultRedisConfiguration.html) 类公开的任何属性自定义 Redis 配置。例如，在 `application.yml` 中：

*自定义 Redis 配置*

```yaml
redis:
    uri: redis://localhost
    ssl: true
    timeout: 30s
```

**多个 Redis 连接**

你可以使用 `redis.servers` 设置配置多个 Redis 连接。例如：

*自定义 Redis 配置*

```yaml
redis:
    servers:
        foo:
            uri: redis://foo
        bar:
            uri: redis://bar
```

在这种情况下，将为 `redis.servers` 下的每个条目创建相同的 bean，但公开为 `@Named` bean。

*使用 StatefulRedisConnection*

```groovy
@Inject @Named("foo") StatefulRedisConnection<String, String> connection;
```

上面的例子将注入名为 `foo` 的连接。

## Redis 健康检查

当 `redis-lettuce` 模块被激活时，[RedisHealthIndicator](https://micronaut-projects.github.io/micronaut-redis/5.3.2/api/io/micronaut/configuration/lettuce/health/RedisHealthIndicator.html) 被激活，从而导致 `/health` 端点和 [CurrentHealthStatus](https://docs.micronaut.io/latest/api/io/micronaut/health/CurrentHealthStatus.html) 接口解析 Redis 连接的运行状况。

有关详细信息，参阅[健康端点](../core/management.html#1523-健康端点)。

> [英文链接](https://micronaut-projects.github.io/micronaut-redis/5.3.2/guide/index.html#config)

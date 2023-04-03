---
sidebar_position: 70
---

# 7. 使用 Redis 的 Session 状态

在 Redis 中存储 [Session](https://docs.micronaut.io/latest/api/io/micronaut/session/Session.html) 实例需要特别注意。

你可以使用 [RedisHttpSessionConfiguration](https://micronaut-projects.github.io/micronaut-redis/5.3.2/api/io/micronaut/configuration/lettuce/session/RedisHttpSessionConfiguration.html) 配置 Sessin 在 Redis 中的存储方式。

以下是 `application.yml` 中的配置示例：

*配置 Redis Session*

```yaml
micronaut:
    session:
        http:
            redis:
                enabled: true
                # The Redis namespace to write sessions to
                namespace: 'myapp:sessions'
                # Write session changes in the background
                write-mode: BACKGROUND
                # Disable programmatic activation of keyspace events
                enable-keyspace-events: false
```

:::tip 注意
[RedisSessionStore](https://micronaut-projects.github.io/micronaut-redis/5.3.2/api/io/micronaut/configuration/lettuce/session/RedisSessionStore.html) 实现使用 [keyspace 事件](https://redis.io/topics/notifications)来清除活动会话并激发 [SessionExpiredEvent](https://micronaut-projects.github.io/micronaut-core/latest/api/io/micronaut/session/event/SessionExpiredEvent.html)，并要求它们处于活动状态。
:::

默认情况下，会话值使用 Java 序列化进行序列化，并存储在 Redis 哈希中。如果需要，你可以将序列化配置为使用 Jackson 序列化为 JSON：

*使用 Jackson 序列化*

```yaml
micronaut:
    session:
        http:
            redis:
                enabled: true
                valueSerializer: io.micronaut.jackson.serialize.JacksonObjectSerializer
```

> [英文链接](https://micronaut-projects.github.io/micronaut-redis/5.3.2/guide/index.html#sessions)

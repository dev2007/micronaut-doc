---
sidebar_position: 50
---

# 6. Redis 缓存

如果你希望使用 Redis 来缓存结果，那么你需要在 classpath 上具有 Lettuce 配置依赖项。Lettuce 是一个非阻塞、响应式 Redis 客户端实现，Micronaut 提供了一个允许反应式读取缓存结果的实现。

在应用程序配置中，配置 Redis URL 和 Redis 缓存：

*缓存配置示例*

```yaml
redis:
    uri: redis://localhost
    caches:
        my-cache:
            # expire one hour after write
            expire-after-write: 1h
```

*具有动态过期策略的缓存配置示例*

```yaml
redis:
    uri: redis://localhost
    caches:
        my-cache:
            # expire based on result from class implementing ExpirationAfterWritePolicy
            expiration-after-write-policy: <class path of class implementing ExpirationAfterWritePolicy>
```

*表 1. [RedisCacheConfiguration](https://micronaut-projects.github.io/micronaut-redis/5.3.2/api/io/micronaut/configuration/lettuce/cache/RedisCacheConfiguration.html) 的配置属性*

|属性|类型|描述|
|--|--|--|
|`redis.caches.*.server`|java.lang.String||
|`redis.caches.*.key-serializer`|java.lang.Class||
|`redis.caches.*.value-serializer`|java.lang.Class||
|`redis.caches.*.charset`|java.nio.charset.Charset|用于序列化和反序列化值的字符集|
|`redis.caches.*.expire-after-write`|java.time.Duration|写入缓存后的缓存过期时间。|
|`redis.caches.*.expire-after-access`|java.time.Duration|访问后的缓存过期时间|
|`redis.caches.*.expiration-after-write-policy`|java.lang.String|ExpirationAfterWritePolicy 的一个实现的类路径 |

> [英文链接](https://micronaut-projects.github.io/micronaut-redis/5.3.2/guide/index.html#cache)

---
sidebar_position: 50
---

# 5. Redis 支持

:::note 提示
使用 CLI

如果你使用 Micronaut CLI 创建项目，请提供 `redis-lettuce` 功能以在项目中配置 Redis/Lettuce：

```bash
$ mn create-app my-app --features redis-lettuce
```
:::

如果你希望使用 Redis 缓存结果，[Micronaut Redis](../redis/cache.html) 模块提供了一个 [CacheManager](https://micronaut-projects.github.io/micronaut-cache/3.5.0/api/io/micronaut/cache/CacheManager.html) 实现，允许使用 Redis 作为后备缓存。

> [英文链接](https://micronaut-projects.github.io/micronaut-cache/3.5.0/guide/index.html#redis)

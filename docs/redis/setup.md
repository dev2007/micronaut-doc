---
sidebar_position: 30
---

# 3. 设置 Redis Lettuce 驱动

:::note 提示
*使用 CLI*

如果你使用 Micronaut CLI 创建项目，请提供 `redis-lettuce` 功能来配置项目中的 Lettuce 驱动程序：

```bash
$ mn create-app my-app --features redis-lettuce
```

:::

要配置 Lettuce 驱动程序，你应该首先将 `redis-lettuce` 模块添加到 classpath 中：

import Tabs from '@theme/Tabs';
import TabItem from '@theme/TabItem';

<Tabs>
  <TabItem value="Gradle" label="Gradle">

```groovy
implementation("io.micronaut.redis:micronaut-redis-lettuce")
```

  </TabItem>
  <TabItem value="Maven" label="Maven">

```xml
<dependency>
    <groupId>io.micronaut.redis</groupId>
    <artifactId>micronaut-redis-lettuce</artifactId>
</dependency>
```

  </TabItem>
</Tabs>

然后，你应该配置希望在 `application.yml` 中与之通信的 Redis 服务器的 URI：

*配置 redis.uri*

```yaml
redis:
    uri: redis://localhost
```

:::note 注意
`redis.uri` 设置的格式应与 Lettuce wiki 的 [连接 URI](https://github.com/lettuce-io/lettuce-core/wiki/Redis-URI-and-connection-details) 部分所述的格式相同
:::

你也可以使用 `redis.uris` 指定多个 Redis URI，在这种情况下，将创建 `RedisClusterClient`。

**配置 Lettuce 客户端资源和线程**

你可以提供 `io.lettuce.core.resource.ClientResources` 的自定义实例，该实例将用于创建 `io.lettuce.core.RedisClient`。

可以在不提供自定义 `io.lettuce.core.resource.ClientResources` 的情况下配置线程池大小：

```yaml
redis:
    uri: redis://localhost
    io-thread-pool-size: 5
    computation-thread-pool-size: 4
```

**Lettuce 池大小描述属性**

https://github.com/lettuce-io/lettuce-core/wiki/Configuring-Client-resources


|名字|默认|说明|
|--|--|--|
|I/O 线程池大小|处理器数量|I/O线程池中的线程数。该数字默认为运行时返回的可用处理器的数量（众所周知，这有时并不代表处理器的实际数量）。每个线程代表一个内部事件循环，所有 I/O 任务都在其中运行。这个数字并不反映 I/O 线程的实际数量，因为客户端需要不同的线程池用于网络（NIO）和 Unix 域套接字（EPoll）连接。最小 I/O 线程数为 3。线程较少的池可能会导致未定义的行为。|
|计算线程池大小|处理器数量|计算线程池中的线程数。该数字默认为运行时返回的可用处理器的数量（众所周知，这有时并不代表处理器的实际数量）。每个线程表示一个内部事件循环，所有计算任务都在该循环中运行。最小计算线程为 3。线程较少的池可能会导致未定义的行为。|

:::danger 注意
你可能会看到 `io.lettuce.core.RedisCommandTimeoutException`：如果你的代码因为线程池大小的默认值很小而阻止了 Lettuse 的异步执行，那么命令在之后超时。
:::

**可用的  Lettuce Bean**

一旦你有了上述配置，就可以注入以下 bean 之一：

- `io.lettuce.core.RedisClient`——主客户端界面
- `io.lettuce.core.api.StatefulRedisConnection`——一个连接接口，具有对字符串值进行操作的同步、反应（基于 Reactor）和异步 API
- `io.lettuce.core.pubsub.StatefulRedisPubSubConnection`——用于处理 Redis-Pub/Sub 的连接接口

以下示例演示了 `StatefulRedisConnection` 接口的同步 API 的使用：

*使用 StatefulRedisConnection*

```groovy
@Inject StatefulRedisConnection<String, String> connection
...
RedisCommands<String, String> commands = connection.sync()
commands.set("foo", "bar")
commands.get("foo") == "bar"
```

:::tip 注意
Lettuce 驱动的 `StatefulRedisConnection` 接口设计为长活，无需关闭连接。当应用程序关闭时，它将自动关闭。
:::

> [英文链接](https://micronaut-projects.github.io/micronaut-redis/5.3.2/guide/index.html#setup)

---
sidebar_position: 80
---

# 8. Infinispan 支持

支持 [Infinispan](https://infinispan.org/) 缓存。Micronaut 将创建一个 Infinispan 客户端实例，以使用 HotRod 协议连接到现有的 Infinispan 服务器。

:::tip 注意
此模块是使用 Infinispan {infinispanVersion} 构建和测试的
:::

要开始，请添加 Micronaut Infinispan 模块作为依赖：

import Tabs from '@theme/Tabs';
import TabItem from '@theme/TabItem';

<Tabs>
  <TabItem value="Gradle" label="Gradle">

```groovy
implementation("io.micronaut.cache:micronaut-cache-infinispan:3.5.0")
```

  </TabItem>
  <TabItem value="Maven" label="Maven">

```xml
<dependency>
    <groupId>io.micronaut.cache</groupId>
    <artifactId>micronaut-cache-infinispan</artifactId>
    <version>3.5.0</version>
</dependency>
```

  </TabItem>
</Tabs>

默认情况下，Micronaut 将在 `127.0.0.1:11222` 上设置 [RemoteCacheManager](https://docs.jboss.org/infinispan/10.0/apidocs/org/infinispan/client/hotrod/RemoteCacheManager.html)。要定义自定义地址，请执行以下操作：

```yaml
infinispan:
  client:
    hotrod:
      server:
        host: infinispan.example.com
        port: 10222
```

默认情况下，Micronaut 将尝试从 classpath 读取 `/hotrod-client.properties` 文件，如果找到，将使用该文件。该文件应为 [Infinispan 配置格式](https://docs.jboss.org/infinispan/10.0/apidocs/org/infinispan/client/hotrod/configuration/package-summary.html#package.description)，例如：

```yaml
# Hot Rod client configuration
infinispan.client.hotrod.server_list = 127.0.0.1:11222
infinispan.client.hotrod.marshaller = org.infinispan.commons.marshall.ProtoStreamMarshaller
infinispan.client.hotrod.async_executor_factory = org.infinispan.client.hotrod.impl.async.DefaultAsyncExecutorFactory
infinispan.client.hotrod.default_executor_factory.pool_size = 1
infinispan.client.hotrod.hash_function_impl.2 = org.infinispan.client.hotrod.impl.consistenthash.ConsistentHashV2
infinispan.client.hotrod.tcp_no_delay = true
infinispan.client.hotrod.tcp_keep_alive = false
infinispan.client.hotrod.request_balancing_strategy = org.infinispan.client.hotrod.impl.transport.tcp.RoundRobinBalancingStrategy
infinispan.client.hotrod.key_size_estimate = 64
infinispan.client.hotrod.value_size_estimate = 512
infinispan.client.hotrod.force_return_values = false

## Connection pooling configuration
maxActive = -1
maxIdle = -1
whenExhaustedAction = 1
minEvictableIdleTimeMillis=300000
minIdle = 1
```

要从不同的 classpath 位置读取此文件，请执行以下操作：

```yaml
infinispan:
  client:
    hotrod:
      config-file: classpath:my-infinispan.properties
```

你可以使用 Infinispan 的属性文件和 Micronaut 配置属性。后者将补充/覆盖前者的值。

**表 1. [InfinispanHotRodClientConfiguration](https://micronaut-projects.github.io/micronaut-cache/3.5.0/api/io/micronaut/cache/infinispan/InfinispanHotRodClientConfiguration.html) 的配置属性**

|属性|类型|描述|
|--|--|--|
|`infinispan.client.hotrod.add-cluster`|java.lang.String||
|`infinispan.client.hotrod.add-servers`|java.lang.String||
|`infinispan.client.hotrod.balancing-strategy`|java.lang.String||
|`infinispan.client.hotrod.connection-timeout`|int||
|`infinispan.client.hotrod.force-return-values`|boolean||
|`infinispan.client.hotrod.marshaller`|java.lang.String||
|`infinispan.client.hotrod.add-context-initializer`|java.lang.String||
|`infinispan.client.hotrod.socket-timeout`|int||
|`infinispan.client.hotrod.tcp-no-delay`|boolean||
|`infinispan.client.hotrod.tcp-keep-alive`|boolean||
|`infinispan.client.hotrod.max-retries`|int||
|`infinispan.client.hotrod.batch-size`|int||
|`infinispan.client.hotrod.server.host`|java.lang.String||
|`infinispan.client.hotrod.server.port`|int||
|`infinispan.client.hotrod.statistics.enabled`|boolean||
|`infinispan.client.hotrod.statistics.jmx-enabled`|boolean||
|`infinispan.client.hotrod.statistics.jmx-domain`|java.lang.String||
|`infinispan.client.hotrod.statistics.jmx-name`|java.lang.String||
|`infinispan.client.hotrod.connection-pool.max-active`|int||
|`infinispan.client.hotrod.connection-pool.max-wait`|long||
|`infinispan.client.hotrod.connection-pool.min-idle`|int||
|`infinispan.client.hotrod.connection-pool.min-evictable-idle-time`|long||
|`infinispan.client.hotrod.connection-pool.max-pending-requests`|int||
|`infinispan.client.hotrod.async-executor-factory.factory-class`|java.lang.Class||
|`infinispan.client.hotrod.security.authentication.enabled`|boolean||
|`infinispan.client.hotrod.security.authentication.sasl-mechanism`|java.lang.String||
|`infinispan.client.hotrod.security.authentication.server-name`|java.lang.String||
|`infinispan.client.hotrod.security.authentication.username`|java.lang.String||
|`infinispan.client.hotrod.security.authentication.password`|java.lang.String||
|`infinispan.client.hotrod.security.authentication.realm`|java.lang.String||
|`infinispan.client.hotrod.security.ssl.enabled`|boolean||
|`infinispan.client.hotrod.security.ssl.key-store-file-name`|java.lang.String||
|`infinispan.client.hotrod.security.ssl.key-store-type`|java.lang.String||
|`infinispan.client.hotrod.security.ssl.key-store-password`|char||
|`infinispan.client.hotrod.security.ssl.key-alias`|java.lang.String||
|`infinispan.client.hotrod.security.ssl.trust-store-file-name`|java.lang.String||
|`infinispan.client.hotrod.security.ssl.trust-store-type`|java.lang.String||
|`infinispan.client.hotrod.security.ssl.trust-store-password`|char||
|`infinispan.client.hotrod.security.ssl.sni-host-name`|java.lang.String||
|`infinispan.client.hotrod.security.ssl.protocol`|java.lang.String||
|`infinispan.client.hotrod.config-file`|java.lang.String|配置文件位置|

要禁用 Infinispan，则：

```yaml
infinispan:
  enabled: false
```

> [英文链接](https://micronaut-projects.github.io/micronaut-cache/3.5.0/guide/index.html#infinispan)

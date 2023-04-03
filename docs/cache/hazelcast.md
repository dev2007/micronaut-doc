---
sidebar_position: 70
---

# 7. Hazelcast  支持

支持 [Hazelcast](https://hazelcast.org/) 缓存。Micronaut 将创建一个 Hazelcast 客户端实例，以连接到现有的 Hazelcastserver 集群，或创建一个独立的嵌入式 Hazelccast 成员实例。

:::tip 注意
此模块使用 Hazelcast {hazelcastVersion}进行构建和测试
:::

添加 Micronaut Hazelcast 模块作为依赖：

import Tabs from '@theme/Tabs';
import TabItem from '@theme/TabItem';

<Tabs>
  <TabItem value="Gradle" label="Gradle">

```groovy
implementation("io.micronaut.cache:micronaut-cache-hazelcast:3.5.0")
```

  </TabItem>
  <TabItem value="Maven" label="Maven">

```xml
<dependency>
    <groupId>io.micronaut.cache</groupId>
    <artifactId>micronaut-cache-hazelcast</artifactId>
    <version>3.5.0</version>
</dependency>
```

  </TabItem>
</Tabs>

你也可以使用 cli 功能将 Hazelcast 模块添加到你的项目中，如下所示：

*使用 Hazelcast 模块创建 Micronaut 应用程序*

```bash
$ mn create-app hello-world -f hazelcast
```

使用 Hazelcast 的最低配置是简单地声明 Hazelcast：使用 Hazelcost 集群地址的网络配置（下面的示例）。

```yaml
hazelcast:
  network:
    addresses: ['121.0.0.1:5701']
```

如果你在工作目录或 classpath 中提供 Hazelcast 配置文件（例如：`hazelcast.xml`、`hazelcast.yml`、`hazelcast-client.xml` 或 `Hazelcast-client.yml`），Micronaut 将使用此配置文件来配置 Hazelccast 实例。

当使用 [@Cacheable](https://micronaut-projects.github.io/micronaut-cache/3.5.0/api/io/micronaut/cache/annotation/Cacheable.html) 和其他缓存注解时，Micronaut 将创建 Hazelcast 客户端，并使用服务器上的底层 [IMap](https://docs.hazelcast.org/docs/latest/javadoc/com/hazelcast/core/IMap.html) 缓存数据存储。

可配置选项的完整列表如下。

**表 1. [HazelcastClientConfiguration](https://micronaut-projects.github.io/micronaut-cache/3.5.0/api/io/micronaut/cache/hazelcast/HazelcastClientConfiguration.html) 的配置属性**

|属性|类型|描述|
|--|--|--|
|`hazelcast.client.properties`|java.util.Properties||
|`hazelcast.client.instance-name`|java.lang.String||
|`hazelcast.client.cluster-name`|java.lang.String||
|`hazelcast.client.labels`|java.util.Set||
|`hazelcast.client.user-context`|java.util.concurrent.ConcurrentMap||
|`hazelcast.client.network.smart-routing`|boolean||
|`hazelcast.client.network.connection-timeout`|int||
|`hazelcast.client.network.addresses`|java.util.List||
|`hazelcast.client.network.redo-operation`|boolean||
|`hazelcast.client.network.outbound-port-definitions`|java.util.Collection||
|`hazelcast.client.network.outbound-ports`|java.util.Collection||
|`hazelcast.client.connection-retry.initial-backoff-millis`|int||
|`hazelcast.client.connection-retry.max-backoff-millis`|int||
|`hazelcast.client.network.socket.tcp-no-delay`|boolean||
|`hazelcast.client.network.socket.keep-alive`|boolean||
|`hazelcast.client.network.socket.reuse-address`|boolean||
|`hazelcast.client.network.socket.linger-seconds`|int||
|`hazelcast.client.network.socket.buffer-size`|int||

对于不在上述列表中的设置，可以为 [HazelcastClientConfiguration](https://micronaut-projects.github.io/micronaut-cache/3.5.0/api/io/micronaut/cache/hazelcast/HazelcastClientConfiguration.html) 或 [HazelcastMemberConfiguration](https://micronaut-projects.github.io/micronaut-cache/3.5.0/api/io/micronaut/cache/hazelcast/HazelcastMemberConfiguration.html) 注册 [BeanCreatedEventListener](https://docs.micronaut.io/latest/api/io/micronaut/context/event/BeanCreatedEventListener.html)。监听器将允许直接在配置实例上设置所有属性。

```java
@Singleton
public class HazelcastAdditionalSettings implements BeanCreatedEventListener<HazelcastClientConfiguration> {

    @Override
    public HazelcastClientConfiguration onCreated(BeanCreatedEvent<HazelcastClientConfiguration> event) {
        HazelcastClientConfiguration configuration = event.getBean();
        // Set anything on the configuration
        return configuration;
    }
}
```

或者，`HazelcastClientConfiguration` 或 `HazelcastMemberConfiguration` bean 可以替换为你自己的实现。

要禁用 Hazelcast，则：

```yaml
hazelcast:
  enabled: false
```

> [英文链接](https://micronaut-projects.github.io/micronaut-cache/3.5.0/guide/index.html#hazelcast)

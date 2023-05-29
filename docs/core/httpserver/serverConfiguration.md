---
sidebar_position: 290
---

# 6.29 配置 HTTP 服务器

HTTP 服务器有许多配置选项。它们被定义在 [NettyHttpServerConfiguration](https://docs.micronaut.io/3.8.4/api/io/micronaut/http/server/netty/configuration/NettyHttpServerConfiguration.html) 配置类中，它扩展了 [HttpServerConfiguration](https://docs.micronaut.io/3.8.4/api/io/micronaut/http/server/HttpServerConfiguration.html)。

下面的例子显示了如何通过 `application.yml` 来调整服务器的配置选项：

*配置 HTTP 服务器设置*

```yaml
micronaut:
  server:
    maxRequestSize: 1MB
    host: localhost (1)
    netty:
      maxHeaderSize: 500KB (2)
      worker:
        threads: 8 (3)
      childOptions:
        autoRead: true (4)
```

1. 默认情况下，Micronaut 绑定了所有网络接口。使用 `localhost` 只绑定到回环网络接口。
2. 报头的最大尺寸
3. Netty 工作线程的数量
4. 自动读取请求正文

*表 1.为 [NettyHttpServerConfiguration](https://docs.micronaut.io/3.8.4/api/io/micronaut/http/server/netty/configuration/NettyHttpServerConfiguration.html) 配置属性*

|属性|类型|描述|
|--|--|--|
|micronaut.server.netty.child-options|java.util.Map|设置 Netty 的子 worker 选项。|
|micronaut.server.netty.options|java.util.Map|设置 channel 选项。|
|micronaut.server.netty.max-initial-line-length|int|设置 HTTP 请求的最大初始行长。默认值（4096）。|
|micronaut.server.netty.max-header-size|int|设置任何一个报头的最大尺寸。默认值（8192）。|
|micronaut.server.netty.max-chunk-size|int|设置任何单一请求块的最大尺寸。默认值（8192）。|
|micronaut.server.netty.max-h2c-upgrade-request-size|int|设置HTTP1.1请求主体的最大尺寸，用于将连接升级到HTTP2明文（h2c）。这个初始请求不能被流化，而是被完全缓冲，所以默认值（8192）是相对较小的。*如果这个值对你的使用情况来说太小，可以考虑使用一个空的初始 "升级请求"（例如{@code OPTIONS /}），或者切换到正常的 HTTP2。* *不影响正常的HTTP2（TLS）。*|
|micronaut.server.netty.chunked-supported|boolean|设置是否支持分块传输编码。默认值（true）。|
|micronaut.server.netty.validate-headers|boolean|设置是否验证传入的头文件。默认值（true）。|
|micronaut.server.netty.initial-buffer-size|int|设置初始缓冲区大小。默认值（128）。|
|micronaut.server.netty.log-level|io.netty.handler.logging.LogLevel|设置 Netty 日志级别。|
|micronaut.server.netty.compression-threshold|int|设置请求体的最小尺寸，以便进行压缩。默认值（1024）。|
|micronaut.server.netty.compression-level|int|设置压缩级别（0-9）。默认值（6）。|
|micronaut.server.netty.use-native-transport|boolean|设置是否使用 netty 的本地传输（epoll或kqueue），如果有的话。默认值（false）。|
|micronaut.server.netty.fallback-protocol|java.lang.String|设置通过 ALPN 谈判时使用的回避协议。|
|micronaut.server.netty.keep-alive-on-server-error|boolean|是否在内部服务器错误时发送连接保持活力。默认值（{@value DEFAULT_KEEP_ALIVE_ON_SERVER_ERROR}）。|
|micronaut.server.netty.pcap-logging-path-pattern|java.lang.String|用于记录传入的连接到 pcap 的路径模式。这是一个不支持的选项：行为可能会改变，也可能完全消失，恕不另行通知。|
|micronaut.server.netty.listeners|java.util.List|设置显式的netty监听器配置，如果它们应该是隐式的，则设置{@code null}。|

**使用本地传输**

与基于 NIO 的传输相比，本地 Netty 传输增加了特定平台的功能，产生更少的垃圾，并普遍提高了性能。

要启用本地传输，首先要添加一个依赖项：

对于 x86 的 macOS：

import Tabs from '@theme/Tabs';
import TabItem from '@theme/TabItem';

<Tabs>
  <TabItem value="Gradle" label="Gradle">

```groovy
runtimeOnly("io.netty:netty-transport-native-kqueue::osx-x86_64")
```

  </TabItem>
  <TabItem value="Maven" label="Maven">

```xml
<dependency>
    <groupId>io.netty</groupId>
    <artifactId>netty-transport-native-kqueue</artifactId>
    <scope>runtime</scope>
    <classifier>osx-x86_64</classifier>
</dependency>
```

  </TabItem>
</Tabs>

对于 M1 的 macOS：

<Tabs>
  <TabItem value="Gradle" label="Gradle">

```groovy
runtimeOnly("io.netty:netty-transport-native-kqueue::osx-aarch_64")
```

  </TabItem>
  <TabItem value="Maven" label="Maven">

```xml
<dependency>
    <groupId>io.netty</groupId>
    <artifactId>netty-transport-native-kqueue</artifactId>
    <scope>runtime</scope>
    <classifier>osx-aarch_64</classifier>
</dependency>
```

  </TabItem>
</Tabs>

对于 x86 的 Linux：

<Tabs>
  <TabItem value="Gradle" label="Gradle">

```groovy
runtimeOnly("io.netty:netty-transport-native-epoll::linux-x86_64")
```

  </TabItem>
  <TabItem value="Maven" label="Maven">

```xml
<dependency>
    <groupId>io.netty</groupId>
    <artifactId>netty-transport-native-epoll</artifactId>
    <scope>runtime</scope>
    <classifier>linux-x86_64</classifier>
</dependency>
```

  </TabItem>
</Tabs>

对于 ARM64 的 Linux：

<Tabs>
  <TabItem value="Gradle" label="Gradle">

```groovy
runtimeOnly("io.netty:netty-transport-native-epoll::linux-aarch_64")
```

  </TabItem>
  <TabItem value="Maven" label="Maven">

```xml
<dependency>
    <groupId>io.netty</groupId>
    <artifactId>netty-transport-native-epoll</artifactId>
    <scope>runtime</scope>
    <classifier>linux-aarch_64</classifier>
</dependency>
```

  </TabItem>
</Tabs>

然后配置默认的事件循环组，使其倾向于本地传输：

*配置默认的事件循环组，使其更倾向于本地传输*

```yaml
micronaut:
  netty:
    event-loops:
      default:
        prefer-native-transport: true
```

:::tip 注意
Netty 启用了简单的抽样资源泄漏检测，报告是否有泄漏，其代价是少量的开销。你可以通过设置属性 `netty.resource-leak-detector-level` 来禁用它或启用更高级的检测：`SIMPLE` (默认)、`DISABLED`、`PARANOID` 或 `ADVANCED`。
:::

## 6.29.1 配置服务器线程池

HTTP 服务器是建立在 [Netty](https://netty.io/) 上的，它被设计成一个事件循环模型的非阻塞 I/O 工具箱。

Netty worker 的事件循环使用 "default" 命名的事件循环组。这可以通过 `micronaut.netty.event-loops.default` 进行配置。

:::danger 危险
`micronaut.server.netty.worker` 下的事件循环配置只在事件循环组被设置为不对应于任何 `micronaut.netty.event-loops` 配置的名称时使用。这一行为已被废弃，并将在未来的版本中被移除。使用 `micronaut.netty.event-loops.*` 进行任何事件循环组配置，而不是通过  `event-loop-group` 设置名称。这不适用于父事件循环配置（`micronaut.server.netty.parent`）。
:::

*表 1.为 [Worker](https://docs.micronaut.io/3.8.4/api/io/micronaut/http/server/netty/configuration/NettyHttpServerConfiguration.Worker.html) 配置属性*

|属性|类型|描述|
|--|--|--|
|micronaut.server.netty.worker|[NettyHttpServerConfiguration$Worker](https://docs.micronaut.io/3.8.4/api/io/micronaut/http/server/netty/configuration/NettyHttpServerConfiguration.Worker.html)|设置 worker 事件循环配置。|
|micronaut.server.netty.worker.event-loop-group|java.lang.String|设置使用的名字。|
|micronaut.server.netty.worker.threads|int|设置事件循环组的线程数量。|
|micronaut.server.netty.worker.io-ratio|java.lang.Integer|设置 I/O 率。|
|micronaut.server.netty.worker.executor|java.lang.String|设置执行器名字。|
|micronaut.server.netty.worker.prefer-native-transport|boolean|设置是否偏爱本地传输（如果有的话）|
|micronaut.server.netty.worker.shutdown-quiet-period|java.time.Duration|设置关机静默期|
|micronaut.server.netty.worker.shutdown-timeout|java.time.Duration|设置关机超时（必须>= shutdownQuietPeriod）。|

:::tip 提示
父事件循环可以用 `micronaut.server.netty.parent` 配置，配置选项相同。
:::

服务器也可以被配置为使用不同的命名 worker 事件循环：

*为服务器使用不同的事件循环*

```yaml
micronaut:
  server:
    netty:
      worker:
        event-loop-group: other
  netty:
    event-loops:
      other:
        num-threads: 10
```

:::tip 注意
线程数的默认值是系统属性 `io.netty.eventLoopThreads` 的值，如果没有指定，则是可用处理器 × 2。
:::

关于配置事件循环，见下表：

*表 2. [DefaultEventLoopGroupConfiguration](https://docs.micronaut.io/3.8.4/api/io/micronaut/http/netty/channel/DefaultEventLoopGroupConfiguration.html) 的配置属性*

|属性|类型|描述|
|--|--|--|
|micronaut.netty.event-loops.*.num-threads|int||
|micronaut.netty.event-loops.*.io-ratio|java.lang.Integer||
|micronaut.netty.event-loops.*.prefer-native-transport|boolean||
|micronaut.netty.event-loops.*.executor|java.lang.String||
|micronaut.netty.event-loops.*.shutdown-quiet-period|java.time.Duration||
|micronaut.netty.event-loops.*.shutdown-timeout|java.time.Duration||

### 6.29.1.1 阻塞操作



> [英文链接](https://docs.micronaut.io/3.8.4/guide/index.html#serverConfiguration)


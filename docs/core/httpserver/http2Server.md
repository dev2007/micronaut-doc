---
sidebar_position: 270
---

# 6.27 HTTP/2 支援

从 Micronaut 2.x 开始，Micronaut 的基于 Netty 的 HTTP 服务器可以被配置为支持 HTTP/2。

**为服务器配置 HTTP/2**

第一步是在服务器配置中设置支持的 HTTP 版本：

*启用 HTTP/2 支持*

```yaml
micronaut:
  server:
    http-version: 2.0
```

通过这种配置，Micronau t启用了对 `h2c` 协议的支持（参阅 [HTTP/2 over cleartext](https://httpwg.org/specs/rfc7540.html#discover-http)），这对开发来说是没有问题的。

由于浏览器不支持h2c和一般的 [HTTP/2 over TLS](https://httpwg.org/specs/rfc7540.html#discover-https)（`h2` 协议），建议在生产中启用 HTTPS 支持。对于开发来说，这可以通过以下方式完成：

*启用 h2 协议支持*

```yaml
micronaut:
  server:
    http-version: 2.0
    ssl:
      enabled: true
      buildSelfSigned: true
```

对于生产，请参阅文档中的[配置 HTTPS](/core/httpserver/serverConfiguration.html#用-HTTPS-保护服务器) 部分。

注意，如果你的部署环境使用 JDK 8，或者为了改进对 OpenSSL 的支持，请在 Netty Tomcat Native 上定义以下依赖：

import Tabs from '@theme/Tabs';
import TabItem from '@theme/TabItem';

<Tabs>
  <TabItem value="Gradle" label="Gradle">

```groovy
runtimeOnly("io.netty:netty-tcnative:2.0.46.Final")
```

  </TabItem>
  <TabItem value="Maven" label="Maven">

```xml
<dependency>
    <groupId>io.netty</groupId>
    <artifactId>netty-tcnative</artifactId>
    <version>2.0.46.Final</version>
    <scope>runtime</scope>
</dependency>
```

  </TabItem>
</Tabs>

<Tabs>
  <TabItem value="Gradle" label="Gradle">

```groovy
runtimeOnly("io.netty:netty-tcnative-boringssl-static:2.0.46.Final")
```

  </TabItem>
  <TabItem value="Maven" label="Maven">

```xml
<dependency>
    <groupId>io.netty</groupId>
    <artifactId>netty-tcnative-boringssl-static</artifactId>
    <version>2.0.46.Final</version>
    <scope>runtime</scope>
</dependency>
```

  </TabItem>
</Tabs>

除了对你的架构的适当的 native 库的依赖外。比如说：

*配置 Tomcat Native*

```groovy
runtimeOnly "io.netty:netty-tcnative-boringssl-static:2.0.46.Final:${Os.isFamily(Os.FAMILY_MAC) ? (Os.isArch("aarch64") ? "osx-aarch_64" : "osx-x86_64") : 'linux-x86_64'}"
```

更多信息请参阅 [Tomcat Native](https://netty.io/wiki/forked-tomcat-native.html) 的文档。

**支持 HTTP/2 服务器推送**

Micronaut 框架 3.2 中增加了对服务器推送的支持。服务器推送允许一个单一的请求触发多个响应。这最常用于基于浏览器的资源的情况。其目的是为了改善客户端的延迟，因为他们不必再手动请求该资源，并可以节省一个往返的时间。

一个新的接口，[PushCapableHttpRequest](https://docs.micronaut.io/3.8.4/api/io/micronaut/http/PushCapableHttpRequest.html)，已经被创建来支持这个功能。只需在控制器方法中添加一个 [PushCapableHttpRequest](https://docs.micronaut.io/3.8.4/api/io/micronaut/http/PushCapableHttpRequest.html) 参数，并使用其 API 来触发额外的请求。

:::tip 注意
[PushCapableHttpRequest](https://docs.micronaut.io/3.8.4/api/io/micronaut/http/PushCapableHttpRequest.html) 扩展了 [HttpRequest](https://docs.micronaut.io/3.8.4/api/io/micronaut/http/HttpRequest.html)，所以没有必要在控制器方法中把两者作为参数。
:::

在触发额外的请求之前，应该调用 `isServerPushSupported()` 方法以确保该功能是可用的。一旦知道该功能被支持，使用 `serverPush(HttpRequest)` 方法来触发额外的请求。例如：`request.serverPush(HttpRequest.GET("/static/style.css"))`。

> [英文链接](https://docs.micronaut.io/3.8.4/guide/index.html#http2Server)

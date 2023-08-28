---
description: Micronaut Nats
keywords: [micronaut,micronaut 文档,micronaut 中文文档,文档,Micronaut Nats,Nats,mq,消息中间件]
---

# Micronaut Nats

Micronaut 和 nats.io 之间的集成。

## 1. 简介

本项目包括 Micronaut 和 nats.io 之间的集成。标准 Java 客户端用于完成实际的发布和消费。

## 2. 发布历史

关于本项目，你可以在此处找到发布列表（含发布说明）：

https://github.com/micronaut-projects/micronaut-nats/releases

## 3. 使用 Micronaut CLI

要使用 Micronaut CLI 创建支持 NATS 的项目，请在功能标志中加入 nats 功能。

```bash
$ mn create-app my-nats-app --features nats
```

这将创建一个具有 NATS 最低必要配置的项目。

**消息应用程序**

Micronaut CLI 可以生成消息应用程序。这将创建一个支持 NATS 的 Micronaut 应用程序，但不带 HTTP 服务器（当然你也可以根据需要添加一个）。该配置文件还提供了一些生成 NATS 消费者和生产者的命令。

要创建 NATS 消息应用程序，请使用以下命令：

```bash
$ mn create-messaging-app my-nats-service --features nats
```

如你所料，你可以使用 `./gradlew run`（Gradle）或 `./mvnw compile exec:exec`（Maven）启动应用程序。应用程序将（使用默认配置）尝试连接到 NATS 的 `nats://localhost:4222`，并在不启动 HTTP 服务器的情况下继续运行。与服务之间的所有通信都将通过 NATS 生产者和/或消费者进行。

在新项目中，你现在可以运行 NATS 特定代码生成命令：

```bash
$ mn create-nats-producer Message
| Rendered template Producer.java to destination src/main/java/my/nats/app/MessageProducer.java

$ mn create-nats-listener Message
| Rendered template Listener.java to destination src/main/java/my/nats/app/MessageListener.java
```

## 4. NATS 快速入门

要在现有项目中添加对 NATS.io 的支持，首先应在构建配置中添加 Micronaut NATS 配置。例如：

import Tabs from '@theme/Tabs';
import TabItem from '@theme/TabItem';

<Tabs>
  <TabItem value="Gradle" label="Gradle">

```groovy
implementation("io.micronaut.nats:micronaut-nats")
```

  </TabItem>
  <TabItem value="Maven" label="Maven">

```xml
<dependency>
    <groupId>io.micronaut.nats</groupId>
    <artifactId>micronaut-nats</artifactId>
</dependency>
```

  </TabItem>
</Tabs>

**使用 @NatsClient 创建 NATS 生产者**

要创建一个能发送信息的 NATS 制作器，只需定义一个带有 [@NatsClient](https://micronaut-projects.github.io/micronaut-nats/latest/api/io/micronaut/nats/annotation/NatsClient.html) 注解的接口即可。

例如，下面就是一个简单的 `@NatsClient` 接口：

<Tabs>
  <TabItem value="Java" label="Java" default>

```java
import io.micronaut.nats.annotation.Subject;
import io.micronaut.nats.annotation.NatsClient;

@NatsClient // (1)
public interface ProductClient {

    @Subject("product") // (2)
    void send(byte[] data); // (3)
}
```

  </TabItem>
  <TabItem value="Groovy" label="Groovy">

```groovy
import io.micronaut.nats.annotation.NatsClient
import io.micronaut.nats.annotation.Subject

@NatsClient // (1)
interface ProductClient {

    @Subject("product") // (2)
    void send(byte[] data) // (3)
}
```

  </TabItem>
  <TabItem value="Kotlin" label="Kotlin">

```kt
import io.micronaut.nats.annotation.NatsClient
import io.micronaut.nats.annotation.Subject

@NatsClient // (1)
interface ProductClient {

    @Subject("product") // (2)
    fun send(data: ByteArray) // (3)
}
```

  </TabItem>
</Tabs>

1. [@NatsClient](https://micronaut-projects.github.io/micronaut-nats/latest/api/io/micronaut/nats/annotation/NatsClient.html) 注解用于将此接口指定为客户端
2. [@Subject](https://micronaut-projects.github.io/micronaut-nats/latest/api/io/micronaut/nats/annotation/Subject.html) 注解表示信息应发布给哪个主题
3. 通过将主题作为方法参数，主题也可以是动态的。

编译时 Micronaut 将生成上述接口的实现。你可以通过从 [ApplicationContext](https://micronaut-projects.github.io/micronaut-nats/latest/api/io/micronaut/context/ApplicationContext.html) 中查找 bean 或使用 `@Inject` 注入 bean 来获取 `ProductClient` 的实例：

**使用 @NatsListener 创建 NATS 消费者**

要监听 NATS 消息，你可以使用 [@NatsListener](https://micronaut-projects.github.io/micronaut-nats/latest/api/io/micronaut/nats/annotation/NatsListener.html) 注解来定义消息监听器。

下面的示例将监听上一节中 ProductClient 发布的消息：

1. [@NatsListener](https://micronaut-projects.github.io/micronaut-nats/latest/api/io/micronaut/nats/annotation/NatsListener.html) 用于将该类指定为监听器。
2. [@Subject](https://micronaut-projects.github.io/micronaut-nats/latest/api/io/micronaut/nats/annotation/Subject.html) 注解再次用于指明要订阅的主题。
3. `receive` 方法定义了一个参数，它将接收值。

## 5. 配置连接

[Options](https://javadoc.io/doc/io.nats/jnats/latest/io/nats/client/Options.html) 的所有属性都可以通过配置或 [BeanCreatedEventListener](https://docs.micronaut.io/latest/api/io/micronaut/context/event/BeanCreatedEventListener.html) 进行修改。

可以从配置文件中的字符串值转换的属性可以直接配置。

*表 1. [NatsConnectionFactoryConfig](https://micronaut-projects.github.io/micronaut-nats/latest/api/io/micronaut/nats/connect/NatsConnectionFactoryConfig.html) 的配置属性*

|属性|类型|描述|
|--|--|--|
|nats.*.addresses|java.util.List||
|nats.*.username|java.lang.String||
|nats.*.password|java.lang.String||
|nats.*.token|java.lang.String||
|nats.*.max-reconnect|int||
|nats.*.reconnect-wait|java.time.Duration||
|nats.*.connection-timeout|java.time.Duration||
|nats.*.ping-interval|java.time.Duration||
|nats.*.reconnect-buffer-size|long||
|nats.*.inbox-prefix|java.lang.String||
|nats.*.no-echo|boolean||
|nats.*.utf8-support|boolean||
|nats.*.credentials|java.lang.String||

:::tip 注意
在没有任何配置的情况下，将使用 [Options](https://javadoc.io/doc/io.nats/jnats/latest/io/nats/client/Options.html) 中的默认值。
:::

:::note 提示
也可以使用 `nats.enabled: false` 完全禁用集成
:::

### 连接

可以配置多个连接到同一服务器、不同服务器或单个连接到服务器列表中的一个服务器。

<Tabs>
  <TabItem value="Properties" label="Properties">

```properties
nats.server1.addresses[0]=nats://localhost:4222
nats.server1.username=guest
nats.server1.password=guest
nats.server2.addresses[0]=nats://randomServer:4222
nats.server2.username=guest
nats.server2.password=guest
```

  </TabItem>
  <TabItem value="Yaml" label="Yaml">

```yaml
nats:
  server1:
    addresses:
      - "nats://localhost:4222"
    username: guest
    password: guest
  server2:
    addresses:
      - "nats://randomServer:4222"
    username: guest
    password: guest
```

  </TabItem>
    <TabItem value="Toml" label="Toml">

```toml
[nats]
  [nats.server1]
    addresses=[
      "nats://localhost:4222"
    ]
    username="guest"
    password="guest"
  [nats.server2]
    addresses=[
      "nats://randomServer:4222"
    ]
    username="guest"
    password="guest"
```

  </TabItem>
    <TabItem value="Groovy" label="Groovy">

```groovy
nats {
  server1 {
    addresses = ["nats://localhost:4222"]
    username = "guest"
    password = "guest"
  }
  server2 {
    addresses = ["nats://randomServer:4222"]
    username = "guest"
    password = "guest"
  }
}
```

  </TabItem>
    <TabItem value="Hoon" label="Hoon">

```hocon
{
  nats {
    server1 {
      addresses = ["nats://localhost:4222"]
      username = "guest"
      password = "guest"
    }
    server2 {
      addresses = ["nats://randomServer:4222"]
      username = "guest"
      password = "guest"
    }
  }
}
```

  </TabItem>
    <TabItem value="JSON" label="JSON">

```json
{
  "nats": {
    "server1": {
      "addresses": ["nats://localhost:4222"],
      "username": "guest",
      "password": "guest"
    },
    "server2": {
      "addresses": ["nats://randomServer:4222"],
      "username": "guest",
      "password": "guest"
    }
  }
}
```

  </TabItem>
</Tabs>

NATS 还支持故障切换连接策略，即在服务器列表中使用第一个成功连接的服务器。要在 Micronaut 中使用该选项，只需提供 `host:port` 地址列表即可。

<Tabs>
  <TabItem value="Properties" label="Properties">

```properties
nats.default.addresses[0]=nats://localhost:4222
nats.default.addresses[1]=nats://randomServer:4222
nats.default.username=guest
nats.default.password=guest
```

  </TabItem>
  <TabItem value="Yaml" label="Yaml">

```yaml
nats:
  default:
    addresses:
      - "nats://localhost:4222"
      - "nats://randomServer:4222"
    username: guest
    password: guest
```

  </TabItem>
    <TabItem value="Toml" label="Toml">

```toml
[nats]
  [nats.default]
    addresses=[
      "nats://localhost:4222",
      "nats://randomServer:4222"
    ]
    username="guest"
    password="guest"
```

  </TabItem>
    <TabItem value="Groovy" label="Groovy">

```groovy
nats {
  'default' {
    addresses = ["nats://localhost:4222", "nats://randomServer:4222"]
    username = "guest"
    password = "guest"
  }
}
```

  </TabItem>
    <TabItem value="Hoon" label="Hoon">

```hocon
{
  nats {
    default {
      addresses = ["nats://localhost:4222", "nats://randomServer:4222"]
      username = "guest"
      password = "guest"
    }
  }
}
```

  </TabItem>
    <TabItem value="JSON" label="JSON">

```json
{
  "nats": {
    "default": {
      "addresses": ["nats://localhost:4222", "nats://randomServer:4222"],
      "username": "guest",
      "password": "guest"
    }
  }
}
```

  </TabItem>
</Tabs>

:::caution 警告
使用配置选项 `nats.servers` 时，不会读取 nats 下的其他选项，例如 `nats.username`。
:::

如果需要设置 TLS，可以这样配置：

<Tabs>
  <TabItem value="Properties" label="Properties">

```properties
nats.default.addresses[0]=nats://localhost:4222
nats.default.tls.trust-store-path=/path/to/client.truststore.jks
nats.default.tls.trust-store-password=secret
nats.default.tls.certificate-path=/path/to/certificate.crt
```

  </TabItem>
  <TabItem value="Yaml" label="Yaml">

```yaml
nats:
  default:
    addresses:
      - "nats://localhost:4222" # (1)
    tls:
      trust-store-path:  /path/to/client.truststore.jks # (2)
      trust-store-password: secret
      certificate-path: /path/to/certificate.crt # (3)
```

  </TabItem>
    <TabItem value="Toml" label="Toml">

```toml
[nats]
  [nats.default]
    addresses=[
      "nats://localhost:4222"
    ]
    [nats.default.tls]
      trust-store-path="/path/to/client.truststore.jks"
      trust-store-password="secret"
      certificate-path="/path/to/certificate.crt"
```

  </TabItem>
    <TabItem value="Groovy" label="Groovy">

```groovy
nats {
  'default' {
    addresses = ["nats://localhost:4222"]
    tls {
      trustStorePath = "/path/to/client.truststore.jks"
      trustStorePassword = "secret"
      certificatePath = "/path/to/certificate.crt"
    }
  }
}
```

  </TabItem>
    <TabItem value="Hoon" label="Hoon">

```hocon
{
  nats {
    default {
      addresses = ["nats://localhost:4222"]
      tls {
        trust-store-path = "/path/to/client.truststore.jks"
        trust-store-password = "secret"
        certificate-path = "/path/to/certificate.crt"
      }
    }
  }
}
```

  </TabItem>
    <TabItem value="JSON" label="JSON">

```json
{
  "nats": {
    "default": {
      "addresses": ["nats://localhost:4222"],
      "tls": {
        "trust-store-path": "/path/to/client.truststore.jks",
        "trust-store-password": "secret",
        "certificate-path": "/path/to/certificate.crt"
      }
    }
  }
}
```

  </TabItem>
</Tabs>

1. 你可以使用 `nats://localhost:4222` 或 `tls://localhost:4222` 作为协议。
2. 可以配置完整的信任存储
3. 或使用单个证书安全连接 NATS。

## 6. NATS 生产者

快速入门中的示例介绍了一个接口的微不足道的定义，该接口将使用 [@NatsClient](https://micronaut-projects.github.io/micronaut-nats/latest/api/io/micronaut/nats/annotation/NatsClient.html) 注解自动为你实现。

但 `@NatsClient` 的实现（由 [NatsIntroductionAdvice](https://micronaut-projects.github.io/micronaut-nats/latest/api/io/micronaut/nats/intercept/NatsIntroductionAdvice.html) 类定义）非常灵活，为定义 NATS 客户端提供了多种选择。

### 6.1 定义 @NatsClient 方法

所有向 NATS 发布消息的方法都必须满足以下条件：
- 方法必须位于注有 [@NatsClient](https://micronaut-projects.github.io/micronaut-nats/latest/api/io/micronaut/nats/annotation/NatsClient.html) 的接口中。
- 方法或方法参数必须带有 [@Subject](https://micronaut-projects.github.io/micronaut-nats/latest/api/io/micronaut/nats/annotation/Subject.html) 注解。
- 方法必须包含一个代表消息正文的参数。

:::caution 警告
如果找不到正文参数，就会出现异常。
:::

:::tip 注意
为了使所有功能都能按照本指南中的设计运行，你的类在编译时必须将参数标志设置为 `true`。如果你的应用程序是使用 Micronaut CLI 创建的，那么它已经为你配置好了。
:::

:::caution 警告
除非从发布方法中返回反应类型，否则该操作是阻塞的。
:::

#### 6.1.1 发布参数

所有选项都可用于设置发布信息。[NatsIntroductionAdvice](https://micronaut-projects.github.io/micronaut-nats/latest/api/io/micronaut/configuration/nats/intercept/NatsIntroductionAdvice.html) 使用 [publish](https://javadoc.io/doc/io.nats/jnats/latest/io/nats/client/Connection.html#publish-io.nats.client.Message-) 方法来发布消息，所有参数都可以通过注解或方法参数来设置。

##### 6.1.1.1 主题

如果你需要指定消息的主题，请将 [@Subject](https://micronaut-projects.github.io/micronaut-nats/latest/api/io/micronaut/configuration/nats/annotation/Subject.html) 注解应用于方法或方法的参数。如果值在每次执行时都是静态的，则将注解应用于方法本身。如果每次执行都要设置值，则将注解应用于方法的参数。

<Tabs>
  <TabItem value="Java" label="Java" default>

```java
import io.micronaut.nats.annotation.NatsClient;
import io.micronaut.nats.annotation.Subject;

@NatsClient
public interface ProductClient {

    @Subject("product") // (1)
    void send(byte[] data);

    void send(@Subject String subject, byte[] data); // (2)
}
```

  </TabItem>
  <TabItem value="Groovy" label="Groovy">

```groovy
import io.micronaut.nats.annotation.NatsClient
import io.micronaut.nats.annotation.Subject

@NatsClient
interface ProductClient {

    @Subject("product") // (1)
    void send(byte[] data)

    void send(@Subject String subject, byte[] data) // (2)
}
```

  </TabItem>
  <TabItem value="Kotlin" label="Kotlin">

```kt
import io.micronaut.nats.annotation.NatsClient
import io.micronaut.nats.annotation.Subject

@NatsClient
interface ProductClient {

    @Subject("product") // (1)
    fun send(data: ByteArray)

    fun send(@Subject subject: String, data:ByteArray) // (2)
}
```

  </TabItem>
</Tabs>

1. 主题是静态的
2. 每次执行都必须设置主题

**生产者连接**

如果配置了多个 Nats 服务器，可在 [@Subject](https://micronaut-projects.github.io/micronaut-nats/latest/api/io/micronaut/configuration/nats/annotation/Subject.html) 注解中设置服务器名称，以指定哪个连接用于发布消息。

<Tabs>
  <TabItem value="Java" label="Java" default>

```java
import io.micronaut.nats.annotation.NatsClient;
import io.micronaut.nats.annotation.Subject;

@NatsClient
public interface ProductClient {

    @Subject(value = "product", connection = "product-cluster") // (1)
    void send(byte[] data);
}
```

  </TabItem>
  <TabItem value="Groovy" label="Groovy">

```groovy
import io.micronaut.nats.annotation.NatsClient
import io.micronaut.nats.annotation.Subject

@NatsClient // (1)
interface ProductClient {

    @Subject(value = "product", connection = "product-cluster") // (2)
    void send(byte[] data) // (3)
}
```

  </TabItem>
  <TabItem value="Kotlin" label="Kotlin">

```kt
import io.micronaut.nats.annotation.NatsClient
import io.micronaut.nats.annotation.Subject

@NatsClient
interface ProductClient {

    @Subject(value = "product", connection = "product-cluster") // (1)
    fun send(data: ByteArray)

}
```

  </TabItem>
</Tabs>

1. 连接设置在主题注解上。

:::tip 注意
`connection` 选项也可在 [@NatsClient](https://micronaut-projects.github.io/micronaut-nats/latest/api/io/micronaut/configuration/nats/annotation/NatsClient.html) 注解中设置。
:::

**队列**

:::note 提示
NATS 服务器将把报文路由到队列，并选择报文接收方。
:::

##### 6.1.1.2 头

可以使用应用于方法或方法参数的 [@MessageHeader](https://docs.micronaut.io/latest/api/io/micronaut/messaging/annotation/MessageHeader.html) 注解在消息上设置头信息。如果每次执行时的值都是静态的，则将注解应用于方法本身。如果每次执行都要设置值，则将注解应用于方法的参数。

<Tabs>
  <TabItem value="Java" label="Java" default>

```java
import io.micronaut.messaging.annotation.MessageBody;
import io.micronaut.messaging.annotation.MessageHeader;
import io.micronaut.nats.annotation.NatsClient;
import io.micronaut.nats.annotation.Subject;
import io.nats.client.impl.Headers;

@NatsClient
@MessageHeader(name = "x-product-sealed", value = "true") // (1)
@MessageHeader(name = "productSize", value = "large")
public interface ProductClient {

    @Subject("product")
    @MessageHeader(name = "x-product-count", value = "10") // (2)
    @MessageHeader(name = "productSize", value = "small")
    void send(byte[] data);

    @Subject("product")
    void send(@MessageHeader String productSize, // (3)
              @MessageHeader("x-product-count") Long count,
              byte[] data);

    @Subject("products")
    @MessageHeader(name = "x-product-count", value = "20")
    void send(@MessageBody byte[] data, @MessageHeader List<String> productSizes);// (4)

    @Subject("productHeader")
    void send(@MessageBody byte[] data, Headers headers);// (5)

}
```

  </TabItem>
  <TabItem value="Groovy" label="Groovy">

```groovy
import io.micronaut.messaging.annotation.MessageBody
import io.micronaut.messaging.annotation.MessageHeader
import io.micronaut.nats.annotation.NatsClient
import io.micronaut.nats.annotation.Subject
import io.nats.client.impl.Headers

@NatsClient
@MessageHeader(name = "x-product-sealed", value = "true") // (1)
@MessageHeader(name = "productSize", value = "large")
interface ProductClient {


    @Subject("product")
    @MessageHeader(name = "x-product-count", value = "10") // (2)
    @MessageHeader(name = "productSize", value = "small")
    void send(byte[] data)

    @Subject("product")
    void send(@MessageHeader String productSize, // (3)
              @MessageHeader("x-product-count") Long count,
              byte[] data)

    @Subject("products")
    @MessageHeader(name = "x-product-count", value = "20")
    void send(@MessageBody byte[] data, @MessageHeader List<String> productSizes) // (4)

    @Subject("productHeader")
    void send(@MessageBody byte[] data, Headers headers) // (5)
}
```

  </TabItem>
  <TabItem value="Kotlin" label="Kotlin">

```kt
import io.micronaut.messaging.annotation.MessageBody
import io.micronaut.messaging.annotation.MessageHeader
import io.micronaut.messaging.annotation.MessageHeaders
import io.micronaut.nats.annotation.NatsClient
import io.micronaut.nats.annotation.Subject
import io.nats.client.impl.Headers

@NatsClient
@MessageHeaders(
    MessageHeader(name = "x-product-sealed", value = "true"), // (1)
    MessageHeader(name = "productSize", value = "large")
)
interface ProductClient {

    @Subject("product")
    @MessageHeaders(
        MessageHeader(name = "x-product-count", value = "10"), // (2)
        MessageHeader(name = "productSize", value = "small")
    )
    fun send(data: ByteArray)

    @Subject("product")
    fun send(@MessageHeader productSize: String?, // (3)
             @MessageHeader("x-product-count") count: Long,
             data: ByteArray)

    @Subject("products")
    @MessageHeader(name = "x-product-count", value = "20")
    fun send(@MessageBody data:ByteArray, @MessageHeader productSizes: List<String>) // (4)

    @Subject("productHeader")
    fun send(@MessageBody data: ByteArray, headers: Headers) // (5)

}
```

  </TabItem>
</Tabs>

1. 头信息可以在类级别上定义，并适用于所有方法。如果在方法中定义的标头与类中定义的标头名称相同，则将使用方法中的值。
2. 多个注解可用于在方法或类级别设置多个标头。
3. 每次执行都可以设置标头。如果未设置注解值，名称将从参数中推断。如果注解值为空，则不会设置标头。
4. 也可以使用列表作为标头。空列表或空值不会设置标头。
5. `Headers` 参数可用于传递自定义页眉。注意：如果 `@MessageHeader` 用于方法参数，则 `Headers` 参数将被忽略。

##### 6.1.1.3 消息体

到目前为止，大多数示例都使用 `byte[]` 作为正文类型，以简化操作。本库默认支持大多数标准 Java 类型和 JSON 序列化（使用 Jackson）。功能具有可扩展性，可以添加对其他类型和序列化策略的支持。有关详细信息，参阅[消息序列化/反序列化](#9-消息序列化反序列化serdes)部分。

## 7. NATS 消费者

快速入门部分介绍了一个微不足道的例子，说明了使用 [@NatsListener](https://micronaut-projects.github.io/micronaut-nats/latest/api/io/micronaut/nats/annotation/NatsListener.html) 注解的可能性。

不过，为 `@NatsListener` 提供动力的实现（由 [NatsConsumerAdvice](https://micronaut-projects.github.io/micronaut-nats/latest/api/io/micronaut/nats/intercept/NatsConsumerAdvice.html) 类定义）非常灵活，并为消费 NATS 消息提供了一系列选项。

## 7.1 定义 @NatsListener 方法

所有从 NATS 接收消息的方法都必须满足以下条件：
- 方法必须位于注解了 [@NatsListener](https://micronaut-projects.github.io/micronaut-nats/latest/api/io/micronaut/nats/annotation/NatsListener.html) 的类中。
- 方法必须用 [@Subject](https://micronaut-projects.github.io/micronaut-nats/latest/api/io/micronaut/nats/annotation/Subject.html) 加注解。

:::tip 注意
为了使所有功能都能按照本指南中的 `designed` 运行，你的类在编译时必须将参数标志设置为 `true`。如果你的应用程序是使用 Micronaut CLI 创建的，那么它已经为你配置好了
:::

#### 7.1.1 消费者参数

[NatsConsumerAdvice](https://micronaut-projects.github.io/micronaut-nats/latest/api/io/micronaut/configuration/nats/intercept/NatsConsumerAdvice.html) 使用 [createDispatcher](https://javadoc.io/doc/io.nats/jnats/latest/io/nats/client/Connection.html#createDispatcher-io.nats.client.MessageHandler-) 方法来消费消息。有些选项可以通过注解直接配置。

:::caution 警告
要调用消费者方法，必须满足所有参数。为允许以 null 值执行方法，**必须**将参数声明为 nullable。如果参数无法满足要求，信息将被拒绝。
:::

##### 7.1.1.1 主题

一个方法要成为 Nats 消息的消费者，必须有 [@Subject](https://micronaut-projects.github.io/micronaut-nats/latest/api/io/micronaut/configuration/nats/annotation/Subject.html) 注解。只需将注解应用于方法，并提供你想监听的主题名称即可。

<Tabs>
  <TabItem value="Java" label="Java" default>

```java
import io.micronaut.nats.annotation.NatsListener;
import io.micronaut.nats.annotation.Subject;

@NatsListener
public class ProductListener {

    List<Integer> messageLengths = Collections.synchronizedList(new ArrayList<>());

    @Subject("product") // (1)
    public void receive(byte[] data) {
        messageLengths.add(data.length);
    }
}
```

  </TabItem>
  <TabItem value="Groovy" label="Groovy">

```groovy
import io.micronaut.nats.annotation.NatsListener
import io.micronaut.nats.annotation.Subject

import java.util.concurrent.CopyOnWriteArrayList

@NatsListener
class ProductListener {

    CopyOnWriteArrayList<Integer> messageLengths = []

    @Subject("product") // (1)
    void receive(byte[] data) {
        messageLengths << data.length
    }
}
```

  </TabItem>
  <TabItem value="Kotlin" label="Kotlin">

```kt
import io.micronaut.nats.annotation.NatsListener
import io.micronaut.nats.annotation.Subject
import java.util.Collections

@NatsListener
class ProductListener {

    val messageLengths: MutableList<Int> = Collections.synchronizedList(ArrayList())

    @Subject("product") // (1)
    fun receive(data: ByteArray) {
        messageLengths.add(data.size)
    }
}
```

  </TabItem>
</Tabs>

1. 主题注解是为每个方法设置的。在同一个类中，可以用不同的主题定义多个方法。

**队列支持**

订阅者可在订阅时指定队列组。当消息发布到队列组时，NATS 将把消息传递给一个且仅有一个的订阅者。

<Tabs>
  <TabItem value="Java" label="Java" default>

```java
import io.micronaut.nats.annotation.NatsListener;
import io.micronaut.nats.annotation.Subject;

@NatsListener
public class ProductListener {

    List<String> messageLengths = Collections.synchronizedList(new ArrayList<>());

    @Subject(value = "product", queue = "product-queue") // (1)
    public void receiveByQueue1(byte[] data) {
        messageLengths.add(new String(data));
        System.out.println("Java received " + data.length + " bytes from Nats");
    }

    @Subject(value = "product", queue = "product-queue")
    public void receiveByQueue2(byte[] data) {
        messageLengths.add(new String(data));
        System.out.println("Java received " + data.length + " bytes from Nats");
    }
}
```

  </TabItem>
  <TabItem value="Groovy" label="Groovy">

```groovy
import io.micronaut.nats.annotation.NatsListener
import io.micronaut.nats.annotation.Subject

import java.util.concurrent.CopyOnWriteArrayList

@NatsListener
class ProductListener {

    CopyOnWriteArrayList<String> messageLengths = []

    @Subject(value = "product", queue = "product-queue") // (1)
    void receiveByQueue1(byte[] data) {
        messageLengths << new String(data)
    }

    @Subject(value = "product", queue = "product-queue")
    public void receiveByQueue2(byte[] data) {
        messageLengths << new String(data)
    }
}
```

  </TabItem>
  <TabItem value="Kotlin" label="Kotlin">

```kt
import io.micronaut.messaging.annotation.MessageHeader
import io.micronaut.nats.annotation.NatsListener
import io.micronaut.nats.annotation.Subject
import io.nats.client.impl.Headers
import java.util.Collections

@NatsListener
class ProductListener {

    var messageLengths: MutableList<String> = Collections.synchronizedList(ArrayList())

    @Subject(value = "product", queue = "product-queue") // (1)
    fun receiveByQueue1(data: ByteArray) {
        messageLengths.add(String(data))
    }

    @Subject(value = "product", queue = "product-queue")
    fun receiveByQueue2(data: ByteArray) {
        messageLengths.add(String(data))
    }

}
```

  </TabItem>
</Tabs>

1. 可在 @Subject 中定义队列

:::caution 警告
队列组不会持久保存消息。如果没有可用的侦听器，消息就会被丢弃。
:::

**其他选项**

如果配置了多个 Nats 服务器，可在 [@Subject](https://micronaut-projects.github.io/micronaut-nats/latest/api/io/micronaut/configuration/nats/annotation/Subject.html) 注解中设置服务器名称，以指定哪个连接用于监听消息。

<Tabs>
  <TabItem value="Java" label="Java" default>

```java
import io.micronaut.nats.annotation.NatsListener;
import io.micronaut.nats.annotation.Subject;

@NatsListener
public class ProductListener {

    List<String> messageLengths = Collections.synchronizedList(new ArrayList<>());

    @Subject(value = "product", connection = "product-cluster") // (1)
    public void receive(byte[] data) {
        messageLengths.add(new String(data));
        System.out.println("Java received " + data.length + " bytes from Nats");
    }
}
```

  </TabItem>
  <TabItem value="Groovy" label="Groovy">

```groovy
import io.micronaut.nats.annotation.NatsListener
import io.micronaut.nats.annotation.Subject

@NatsListener
class ProductListener {

    List<String> messageLengths = Collections.synchronizedList([])

    @Subject(value = "product", connection = "product-cluster") // (1)
    void receive(byte[] data) {
        messageLengths << new String(data)
    }
}
```

  </TabItem>
  <TabItem value="Kotlin" label="Kotlin">

```kt
import io.micronaut.messaging.annotation.MessageHeader
import io.micronaut.nats.annotation.NatsListener
import io.micronaut.nats.annotation.Subject
import io.nats.client.impl.Headers
import java.util.Collections

@NatsListener
class ProductListener {

    var messageLengths: MutableList<String> = Collections.synchronizedList(ArrayList())

    @Subject(value = "product", connection = "product-cluster") // (1)
    fun receive(data: ByteArray) {
        messageLengths.add(String(data))
    }

}
```

  </TabItem>
</Tabs>

1. 连接设置在主题注解上。

:::tip 注意
`connection` 选项也可在 [@NatsListener](https://micronaut-projects.github.io/micronaut-nats/latest/api/io/micronaut/configuration/nats/annotation/NatsListener.html) 注解中设置。
:::

##### 7.1.1.2 标头

可以通过对方法参数应用 [@MessageHeader](https://docs.micronaut.io/latest/api/io/micronaut/messaging/annotation/MessageHeader.html) 注解来检索报头。

<Tabs>
  <TabItem value="Java" label="Java" default>

```java
import io.micronaut.messaging.annotation.MessageBody;
import io.micronaut.messaging.annotation.MessageHeader;
import io.micronaut.nats.annotation.NatsListener;
import io.micronaut.nats.annotation.Subject;
import io.nats.client.impl.Headers;

@NatsListener
public class ProductListener {

    Set<String> messageProperties = Collections.synchronizedSet(new HashSet<>());

    @Subject("product")
    public void receive(byte[] data,
            @MessageHeader("x-product-sealed") Boolean sealed, // (1)
            @MessageHeader("x-product-count") Long count, // (2)
            @Nullable @MessageHeader String productSize) { // (3)
        messageProperties.add(sealed + "|" + count + "|" + productSize);
    }

    @Subject("products")
    public void receive(@MessageBody byte[] data, @MessageHeader("x-product-sealed") Boolean sealed,
            @MessageHeader("x-product-count") Long count, @MessageHeader List<String> productSizes) { // (4)
        for (String productSize : productSizes) {
            messageProperties.add(sealed + "|" + count + "|" + productSize);
        }
    }

    @Subject("productHeader")
    public void receive(@MessageBody byte[] data, Headers headers) { // (5)
        String productSize = headers.get("productSize").get(0);
        messageProperties.add(
                headers.get("x-product-sealed").get(0) + "|" +
                        headers.get("x-product-count").get(0) + "|" +
                        productSize);
    }
}
```

  </TabItem>
  <TabItem value="Groovy" label="Groovy">

```groovy
import io.micronaut.core.annotation.Nullable
import io.micronaut.messaging.annotation.MessageBody
import io.micronaut.messaging.annotation.MessageHeader
import io.micronaut.nats.annotation.NatsListener
import io.micronaut.nats.annotation.Subject
import io.nats.client.impl.Headers

import java.util.concurrent.CopyOnWriteArrayList

@NatsListener
class ProductListener {

    CopyOnWriteArrayList<String> messageProperties = []

    @Subject("product")
    void receive(byte[] data,
                 @MessageHeader("x-product-sealed") Boolean sealed, // (1)
                 @MessageHeader("x-product-count") Long count, // (2)
                 @Nullable @MessageHeader String productSize) { // (3)
        messageProperties << sealed.toString() + "|" + count + "|" + productSize
    }

    @Subject("products")
    void receive(@MessageBody byte[] data, @MessageHeader("x-product-sealed") Boolean sealed,
                 @MessageHeader("x-product-count") Long count, @MessageHeader List<String> productSizes) { // (4)
        productSizes.forEach {
            messageProperties << sealed.toString() + "|" + count + "|" + it
        }
    }

    @Subject("productHeader")
    void receive(@MessageBody byte[] data, Headers headers) { // (5)
        String productSize = headers.get("productSize").get(0)
        messageProperties << headers.get("x-product-sealed").get(0) + "|" +
                        headers.get("x-product-count").get(0) + "|" +
                        productSize
    }
}
```

  </TabItem>
  <TabItem value="Kotlin" label="Kotlin">

```kt
import io.micronaut.messaging.annotation.MessageBody
import io.micronaut.messaging.annotation.MessageHeader
import io.micronaut.nats.annotation.NatsListener
import io.micronaut.nats.annotation.Subject
import io.nats.client.impl.Headers
import java.util.Collections

@NatsListener
class ProductListener {

    var messageProperties: MutableList<String> = Collections.synchronizedList(ArrayList())
    private var datas: MutableList<ByteArray> = Collections.synchronizedList(ArrayList())


    @Subject("product")
    fun receive(data: ByteArray,
                @MessageHeader("x-product-sealed") sealed: Boolean, // (1)
                @MessageHeader("x-product-count") count: Long, // (2)
                @MessageHeader productSize: String?) { // (3)
        messageProperties.add(sealed.toString() + "|" + count + "|" + productSize)
        datas.add(data)
    }

    @Subject("products")
    fun receive(@MessageBody data: ByteArray,
                @MessageHeader("x-product-sealed") sealed: Boolean,
                @MessageHeader("x-product-count") count: Long,
                @MessageHeader productSizes: List<String>?) { // (4)
        productSizes?.forEach {
            messageProperties.add("${sealed}|${count}|${it}")
        }
        datas.add(data)
    }

    @Subject("productHeader")
    fun receive(@MessageBody data: ByteArray, headers: Headers) { // (5)
        messageProperties.add("${headers["x-product-sealed"][0]}|${headers["x-product-count"][0]}|${headers["productSize"][0]}")
        datas.add(data)
    }
}
```

  </TabItem>
</Tabs>

1. 标头名称来自注解，而值则会被检索并转换为布尔值。
2. 标头名称来自注解，数值被提取并转换为长字符。
3. 标头名称来自参数名称。该参数允许空值。
4. 标头也可以是代表多个值的列表。
5. 所有标头都可以与标头参数绑定。

##### 7.1.1.3 Nats 类型

参数也可以根据其类型进行绑定。默认支持几种类型，每种类型都有相应的 [NatsTypeArgumentBinder](https://micronaut-projects.github.io/micronaut-nats/latest/api/io/micronaut/configuration/nats/bind/NatsTypeArgumentBinder.html)。参数绑定器将在[自定义参数绑定](#7115-自定义参数绑定)一节中详细介绍。

只有一种类型可用于检索有关[消息](https://javadoc.io/doc/io.nats/jnats/latest/io/nats/client/Message.html)的数据。


<Tabs>
  <TabItem value="Java" label="Java" default>

```java
import io.micronaut.nats.annotation.NatsListener;
import io.micronaut.nats.annotation.Subject;
import io.nats.client.Connection;
import io.nats.client.Message;
import io.nats.client.Subscription;
import io.nats.client.impl.Headers;

@NatsListener
public class ProductListener {

    List<String> messages = Collections.synchronizedList(new ArrayList<>());

    @Subject("product")
    public void receive(byte[] data,
            Message message,
            Connection connection,
            Subscription subscription,
            Headers headers) { // (1)
        messages.add(String.format("subject: [%s], maxPayload: [%s], pendingMessageCount: [%s], x-productCount: [%s]",
                message.getSubject(),
                connection.getMaxPayload(), subscription.getPendingMessageCount(),
                headers.get("x-product-count").get(0)));
    }
}
```

  </TabItem>
  <TabItem value="Groovy" label="Groovy">

```groovy
import io.micronaut.nats.annotation.NatsListener
import io.micronaut.nats.annotation.Subject

import io.nats.client.Connection
import io.nats.client.Message
import io.nats.client.Subscription
import io.nats.client.impl.Headers

import java.util.concurrent.CopyOnWriteArrayList

@NatsListener
class ProductListener {

    CopyOnWriteArrayList<String> messages = []

    @Subject("product")
    void receive(byte[] data,
                 Message message,
                 Connection connection,
                 Subscription subscription,
                 Headers headers) { // (1)
        def count = headers.get("x-product-count").get(0)
        messages << "subject: [$message.subject], maxPayload: [$connection.maxPayload], pendingMessageCount: [$subscription.pendingMessageCount], x-productCount: [$count]".toString()

    }
}
```

  </TabItem>
  <TabItem value="Kotlin" label="Kotlin">

```kt
import io.micronaut.nats.annotation.NatsListener
import io.micronaut.nats.annotation.Subject
import io.nats.client.Connection
import io.nats.client.Message
import io.nats.client.Subscription
import io.nats.client.impl.Headers
import java.util.Collections


@NatsListener
class ProductListener {

    var messages: MutableList<String> = Collections.synchronizedList(ArrayList())
    private var datas: MutableList<ByteArray> = Collections.synchronizedList(ArrayList())

    @Subject(value = "product")
    fun receive(message: Message,
                connection: Connection,
                subscription: Subscription,
                headers: Headers) { // (1)
        messages.add("subject: [${message.subject}], maxPayload: [${connection.maxPayload}], pendingMessageCount: [${subscription.pendingMessageCount}], x-productCount: [${headers["x-product-count"][0]}]")
    }

}
```

  </TabItem>
</Tabs>

1. 参数从[信息](https://javadoc.io/doc/io.nats/jnats/latest/io/nats/client/Message.html)中绑定。

##### 7.1.1.4 信息体

到目前为止，大多数示例都使用 `byte[]` 作为正文类型，以简化操作。本库默认支持大多数标准 Java 类型和 JSON 反序列化（使用 Jackson）。功能具有可扩展性，可以添加对其他类型和反序列化策略的支持。有关详细信息，参阅 [消息序列化/反序列化](#9-消息序列化反序列化serdes)部分。

##### 7.1.1.5 自定义参数绑定

**默认绑定功能**

消费者参数绑定是通过一个 [ArgumentBinderRegistry](https://docs.micronaut.io/latest/api/io/micronaut/core/bind/ArgumentBinderRegistry.html) 实现的，该注册中心专门用于绑定来自 Nats 消息的消费者。负责该功能的类是 [NatsBinderRegistry](https://micronaut-projects.github.io/micronaut-nats/latest/api/io/micronaut/configuration/nats/bind/NatsBinderRegistry.html)。

该注册中心支持根据应用于参数或参数类型的注解使用的参数绑定器。所有参数绑定器必须实现 [NatsAnnotatedArgumentBinder](https://micronaut-projects.github.io/micronaut-nats/latest/api/io/micronaut/configuration/nats/bind/NatsAnnotatedArgumentBinder.html) 或 [NatsTypeArgumentBinder](https://micronaut-projects.github.io/micronaut-nats/latest/api/io/micronaut/configuration/nats/bind/NatsTypeArgumentBinder.html)。但 [NatsDefaultBinder](https://micronaut-projects.github.io/micronaut-nats/latest/api/io/micronaut/configuration/nats/bind/NatsDefaultBinder.html) 是个例外，当没有其他绑定器支持给定参数时，它就会被使用。

当一个参数需要绑定时，[消息](https://javadoc.io/doc/io.nats/jnats/latest/io/nats/client/Message.html)会被用作所有可用数据的来源。绑定注册表会按照一连串的小步骤尝试找到支持该参数的绑定程序。

1. 搜索基于注解的绑定器，以查找与参数上任何注解相匹配的绑定器，该参数上有 [@Bindable](https://docs.micronaut.io/latest/api/io/micronaut/core/bind/annotation/Bindable.html) 注解。
2. 在基于类型的绑定器中搜索与参数类型匹配或属于参数类型子类的绑定器。
3. 返回默认绑定器。

默认绑定器将信息正文与参数绑定。

**自定义绑定**

要注入自己的参数绑定行为，只需注册一个 Bean 即可。现有的绑定注册表将注入该行为，并将其纳入正常处理过程。

**注解绑定**

可以创建自定义注解来绑定消费者参数。然后可以创建一个自定义绑定器，使用该注解和[消息](https://javadoc.io/doc/io.nats/jnats/latest/io/nats/client/Message.html)为参数提供值。事实上，该值可以来自任何地方，但在本文档中，将使用消息中的 replyTo。

<Tabs>
  <TabItem value="Java" label="Java" default>

```java
import java.lang.annotation.Documented;
import java.lang.annotation.ElementType;
import java.lang.annotation.Retention;
import java.lang.annotation.RetentionPolicy;
import java.lang.annotation.Target;

import io.micronaut.core.bind.annotation.Bindable;

@Documented
@Retention(RetentionPolicy.RUNTIME)
@Target({ElementType.PARAMETER})
@Bindable // (1)
public @interface SID {
}
```

  </TabItem>
  <TabItem value="Groovy" label="Groovy">

```groovy
import io.micronaut.core.bind.annotation.Bindable

import java.lang.annotation.Documented
import java.lang.annotation.ElementType
import java.lang.annotation.Retention
import java.lang.annotation.RetentionPolicy
import java.lang.annotation.Target

@Documented
@Retention(RetentionPolicy.RUNTIME)
@Target([ElementType.PARAMETER])
@Bindable // (1)
@interface SID {
}
```

  </TabItem>
  <TabItem value="Kotlin" label="Kotlin">

```kt
import io.micronaut.core.bind.annotation.Bindable

@MustBeDocumented
@Retention(AnnotationRetention.RUNTIME)
@Target(AnnotationTarget.VALUE_PARAMETER)
@Bindable // (1)
annotation class SID
```

  </TabItem>
</Tabs>

1. 必须使用 [@Bindable](https://docs.micronaut.io/latest/api/io/micronaut/core/bind/annotation/Bindable.html) 注解，注解才会被考虑进行绑定。

<Tabs>
  <TabItem value="Java" label="Java" default>

```java
import io.micronaut.core.convert.ArgumentConversionContext;
import io.micronaut.core.convert.ConversionService;
import io.micronaut.nats.bind.NatsAnnotatedArgumentBinder;
import io.nats.client.Message;
import jakarta.inject.Singleton;

@Singleton // (1)
public class SIDAnnotationBinder implements NatsAnnotatedArgumentBinder<SID> { // (2)

    private final ConversionService conversionService;

    public SIDAnnotationBinder(ConversionService conversionService) { // (3)
        this.conversionService = conversionService;
    }

    @Override
    public Class<SID> getAnnotationType() {
        return SID.class;
    }

    @Override
    public BindingResult<Object> bind(ArgumentConversionContext<Object> context, Message source) {
        String sid = source.getSID(); // (4)
        return () -> conversionService.convert(sid, context); // (5)
    }
}
```

  </TabItem>
  <TabItem value="Groovy" label="Groovy">

```groovy
import io.micronaut.core.convert.ArgumentConversionContext
import io.micronaut.core.convert.ConversionService
import io.micronaut.nats.bind.NatsAnnotatedArgumentBinder
import io.nats.client.Message

import jakarta.inject.Singleton

@Singleton // (1)
class SIDAnnotationBinder implements NatsAnnotatedArgumentBinder<SID> { // (2)

    private final ConversionService conversionService

    SIDAnnotationBinder(ConversionService conversionService) { // (3)
        this.conversionService = conversionService
    }

    @Override
    Class<SID> getAnnotationType() {
        SID
    }

    @Override
    BindingResult<Object> bind(ArgumentConversionContext<Object> context, Message source) {
        String sid = source.getSID() // (4)
        return { -> conversionService.convert(sid, context) } // (5)
    }
}
```

  </TabItem>
  <TabItem value="Kotlin" label="Kotlin">

```kt
import io.micronaut.core.bind.ArgumentBinder
import io.micronaut.core.convert.ArgumentConversionContext
import io.micronaut.core.convert.ConversionService
import io.micronaut.nats.bind.NatsAnnotatedArgumentBinder
import io.nats.client.Message
import jakarta.inject.Singleton

@Singleton // (1)
class SIDAnnotationBinder(private val conversionService: ConversionService) // (3)
    : NatsAnnotatedArgumentBinder<SID> { // (2)

    override fun getAnnotationType(): Class<SID> {
        return SID::class.java
    }

    override fun bind(context: ArgumentConversionContext<Any>, source: Message): ArgumentBinder.BindingResult<Any> {
        val sid = source.sid // (4)
        return ArgumentBinder.BindingResult { conversionService.convert(sid, context) } // (5)
    }
}
```

  </TabItem>
</Tabs>

1. 通过使用 `@Singleton` 进行注解，该类就变成了一个 Bean。
2. 自定义注解被用作接口的通用类型。
3. 将转换服务注入实例。
4. 从消息状态中检索 replyTo。
5. 将 replyTo 转换为参数类型。

现在可以在消费者方法中的参数上使用注解。

<Tabs>
  <TabItem value="Java" label="Java" default>

```java
import io.micronaut.nats.annotation.NatsListener;
import io.micronaut.nats.annotation.Subject;

@NatsListener
public class ProductListener {

    List<String> messages = Collections.synchronizedList(new ArrayList<>());

    @Subject("product")
    public void receive(byte[] data, @SID String sid) { // (1)
        messages.add(sid);
    }
}
```

  </TabItem>
  <TabItem value="Groovy" label="Groovy">

```groovy
import io.micronaut.nats.annotation.NatsListener
import io.micronaut.nats.annotation.Subject
import io.micronaut.nats.docs.consumer.custom.type.ProductInfo

import java.util.concurrent.CopyOnWriteArrayList

@NatsListener
class ProductListener {

    CopyOnWriteArrayList<ProductInfo> messages = []

    @Subject("product")
    void receive(byte[] data, @SID String sid) {
        messages << sid
    }
}
```

  </TabItem>
  <TabItem value="Kotlin" label="Kotlin">

```kt
import io.micronaut.nats.annotation.NatsListener
import io.micronaut.nats.annotation.Subject
import io.micronaut.nats.docs.consumer.custom.type.ProductInfo
import java.util.Collections

@NatsListener
class ProductListener {

    var messages: MutableList<String> = Collections.synchronizedList(ArrayList())
    private var datas: MutableList<ByteArray> = Collections.synchronizedList(ArrayList())

    @Subject("product")
    fun receive(data: ByteArray, @SID sid: String)  {// (1)
        messages.add(sid)
        datas.add(data)
    }

}
```

  </TabItem>
</Tabs>

**类型绑定**

可以创建自定义绑定器来支持任何参数类型。例如，可以创建以下类来绑定来自标头的值。该功能可将检索和转换标头的工作集中在一处，而不是在代码中多次进行。

<Tabs>
  <TabItem value="Java" label="Java" default>

```java
import io.micronaut.core.annotation.NonNull;
import io.micronaut.core.annotation.Nullable;

public class ProductInfo {

    private String size;
    private Long count;
    private Boolean sealed;

    public ProductInfo(@Nullable String size, // (1)
                       @NonNull Long count, // (2)
                       @NonNull Boolean sealed) { // (3)
        this.size = size;
        this.count = count;
        this.sealed = sealed;
    }

    public String getSize() {
        return size;
    }

    public Long getCount() {
        return count;
    }

    public Boolean getSealed() {
        return sealed;
    }
}
```

  </TabItem>
  <TabItem value="Groovy" label="Groovy">

```groovy
import io.micronaut.core.convert.ArgumentConversionContext
import io.micronaut.core.convert.ConversionError
import io.micronaut.core.convert.ConversionService
import io.micronaut.core.type.Argument
import io.micronaut.nats.bind.NatsHeaderConvertibleValues
import io.micronaut.nats.bind.NatsTypeArgumentBinder
import io.nats.client.Message
import io.nats.client.impl.Headers

import jakarta.inject.Singleton

@Singleton // (1)
class ProductInfoTypeBinder implements NatsTypeArgumentBinder<ProductInfo> { //(2)

    private final ConversionService conversionService

    ProductInfoTypeBinder(ConversionService conversionService) { //(3)
        this.conversionService = conversionService
    }

    @Override
    Argument<ProductInfo> argumentType() {
        return Argument.of(ProductInfo)
    }

    @Override
    BindingResult<ProductInfo> bind(ArgumentConversionContext<ProductInfo> context, Message source) {
        Headers rawHeaders = source.headers //(4)

        if (rawHeaders == null) {
            return BindingResult.EMPTY
        }

        def headers = new NatsHeaderConvertibleValues(rawHeaders, conversionService)

        String size = headers.get("productSize", String).orElse(null)  //(5)
        Optional<Long> count = headers.get("x-product-count", Long) //(6)
        Optional<Boolean> sealed = headers.get("x-product-sealed", Boolean) // (7)

        if (headers.conversionErrors.isEmpty() && count.isPresent() && sealed.isPresent()) {
            { -> Optional.of(new ProductInfo(size, count.get(), sealed.get())) } //(8)
        } else {
            new BindingResult<ProductInfo>() {
                @Override
                Optional<ProductInfo> getValue() {
                    Optional.empty()
                }

                @Override
                List<ConversionError> getConversionErrors() {
                    headers.conversionErrors //(9)
                }
            }
        }
    }
}
```

  </TabItem>
  <TabItem value="Kotlin" label="Kotlin">

```kt
import io.micronaut.core.bind.ArgumentBinder.BindingResult
import io.micronaut.core.convert.ArgumentConversionContext
import io.micronaut.core.convert.ConversionError
import io.micronaut.core.convert.ConversionService
import io.micronaut.core.type.Argument
import io.micronaut.nats.bind.NatsHeaderConvertibleValues
import io.micronaut.nats.bind.NatsTypeArgumentBinder
import io.micronaut.nats.docs.consumer.custom.type.ProductInfo
import io.nats.client.Message
import jakarta.inject.Singleton
import java.util.Optional

@Singleton // (1)
class ProductInfoTypeBinder constructor(private val conversionService: ConversionService) //(3)
    : NatsTypeArgumentBinder<ProductInfo> { // (2)

    override fun argumentType(): Argument<ProductInfo> {
        return Argument.of(ProductInfo::class.java)
    }

    override fun bind(context: ArgumentConversionContext<ProductInfo>, source: Message): BindingResult<ProductInfo> {
        val rawHeaders = source.headers ?: return BindingResult { Optional.empty<ProductInfo>() } //(4)

        val headers = NatsHeaderConvertibleValues(rawHeaders, conversionService)

        val size = headers.get("productSize", String::class.java).orElse(null)  //(5)
        val count = headers.get("x-product-count", Long::class.java) //(6)
        val sealed = headers.get("x-product-sealed", Boolean::class.java) // (7)

        if (headers.conversionErrors.isEmpty() && count.isPresent && sealed.isPresent) {
            return BindingResult<ProductInfo> { Optional.of(ProductInfo(size, count.get(), sealed.get())) } //(8)
        } else {
            return object : BindingResult<ProductInfo> {
                override fun getValue(): Optional<ProductInfo> {
                    return Optional.empty()
                }

                override fun getConversionErrors(): List<ConversionError> {
                    return headers.conversionErrors //(9)
                }
            }
        }
    }
}
```

  </TabItem>
</Tabs>

1. 通过使用 `@Singleton` 进行注解，该类就变成了一个 Bean。
2. 自定义类型被用作接口的通用类型。
3. 将转换服务注入实例。
4. 从报文状态中获取报文头。
5. 检索 `productSize` 标头，如果未找到该值或无法转换，则默认为空。
6. 检索 `x-product-count` 标头，并使用新的参数上下文进行转换，该上下文用于以后检索转换错误。
7. 检索 `x-product-sealed` 标头，并用一个新的参数上下文进行转换，用于以后检索转换错误。
8. 没有转换错误，并且存在所需的两个参数，因此可以构建实例。
9. 存在转换错误或其中一个所需参数不存在，因此会返回一个自定义 `BindingResult`，以便适当处理转换错误。

## 8. 请求-回复（RPC）

该库通过使用[请求-回复（Request-Reply）](https://docs.nats.io/nats-concepts/core-nats/reqreply)支持 RPC。支持阻塞和非阻塞两种变体。

下面是一个直接回复的示例，消费者将正文转换为大写字母，并用转换后的字符串进行回复。

### 客户端侧

在这种情况下，"客户端侧"首先发布一条信息。然后，某个地方的消费者会接收到信息，并回复一个新值。

<Tabs>
  <TabItem value="Java" label="Java" default>

```java
import io.micronaut.nats.annotation.NatsClient;
import io.micronaut.nats.annotation.Subject;
import org.reactivestreams.Publisher;

@NatsClient
public interface ProductClient {

    @Subject("product")
    String send(String data); // (1)

    @Subject("product")
    Publisher<String> sendReactive(String data); // (2)
}
```

  </TabItem>
  <TabItem value="Groovy" label="Groovy">

```groovy
import io.micronaut.nats.annotation.NatsClient
import io.micronaut.nats.annotation.Subject
import org.reactivestreams.Publisher

@NatsClient
interface ProductClient {

    @Subject("product")
    String send(String data) // (1)

    @Subject("product")
    Publisher<String> sendReactive(String data) // (2)
}
```

  </TabItem>
  <TabItem value="Kotlin" label="Kotlin">

```kt
import io.micronaut.nats.annotation.NatsClient
import io.micronaut.nats.annotation.Subject
import org.reactivestreams.Publisher

@NatsClient
interface ProductClient {

    @Subject("product")
    fun send(data: String): String // (1)

    @Subject("product")
    fun sendReactive(data: String): Publisher<String> // (2)
}
```

  </TabItem>
</Tabs>

1. 发送方法是阻塞的，将在收到响应时返回。
2. sendReactive 方法返回的是反应式，将在收到响应时完成。反应式方法将在 IO 线程池上执行。

:::caution 警告
为了让发布者认为应该使用 RPC，而不仅仅是在确认发布时完成，数据类型必须**不是** `Void`。在上述两种情况下，数据类型都是 `String`。
:::

---

### 服务器侧

在这种情况下，"服务器侧"首先消耗一条信息，然后通过返回结果发布一条新信息。

<Tabs>
  <TabItem value="Java" label="Java" default>

```java
import io.micronaut.nats.annotation.NatsListener;
import io.micronaut.nats.annotation.Subject;

@NatsListener
public class ProductListener {

    @Subject("product")
    public String toUpperCase(String data) { // (1)
        return data.toUpperCase(); // (2)
    }
}
```

  </TabItem>
  <TabItem value="Groovy" label="Groovy">

```groovy
import io.micronaut.nats.annotation.NatsListener
import io.micronaut.nats.annotation.Subject

@NatsListener
class ProductListener {

    @Subject("product")
    String toUpperCase(String data) { // (1)
        data.toUpperCase() // (2)
    }
}
```

  </TabItem>
  <TabItem value="Kotlin" label="Kotlin">

```kt
import io.micronaut.nats.annotation.NatsListener
import io.micronaut.nats.annotation.Subject
import java.util.Collections

@NatsListener
class ProductListener {

    @Subject("product")
    fun receive(data: String): String { // (1)
        return data.uppercase() // (2)
    }
}
```

  </TabItem>
</Tabs>

1. 注入信息中的数据。
2. 返回转换后的报文。

:::tip 注意
如果回复发布因故失败，原始信息将被拒绝。
:::

:::caution 警告
RPC 消费者方法绝不能返回响应式类型。因为结果发布需要在同一线程上进行，而且只能发布一个项目，这样做没有任何价值。
:::

## 9. 消息序列化/反序列化（SerDes）

消息体的序列化和反序列化是通过 [NatsMessageSerDes](https://micronaut-projects.github.io/micronaut-nats/latest/api/io/micronaut/configuration/nats/serdes/NatsMessageSerDes.html) 的实例来处理的。Ser-des（序列化器/反序列化器）负责将 Nats 消息体序列化和反序列化为客户和消费者方法中定义的消息体类型。

ser-des 由 [NatsMessageSerDesRegistry](https://micronaut-projects.github.io/micronaut-nats/latest/api/io/micronaut/configuration/nats/serdes/NatsMessageSerDesRegistry.html) 管理。所有 ser-des bean 都会按顺序注入注册表，然后在需要序列化或反序列化时进行搜索。第一个 [supports-Java.lang.Class-](https://micronaut-projects.github.io/micronaut-nats/latest/api/io/micronaut/configuration/nats/serdes/NatsMessageSerDes.html#supports-java.lang.Class-) 返回 true 的 ser-des 将被返回并使用。

默认情况下，支持标准 Java lang 类型和 JSON 格式（含 Jackson）。只需注册一个 [NatsMessageSerDes](https://micronaut-projects.github.io/micronaut-nats/latest/api/io/micronaut/configuration/nats/serdes/NatsMessageSerDes.html) 类型的 Bean，就能提供自己的服务器。所有服务器都实现了 [Ordered](https://docs.micronaut.io/latest/api/io/micronaut/core/order/Ordered.html) 接口，因此自定义实现可以在默认实现之前、之后或之间出现。

### 9.1 自定义服务器

自定义序列化器/解序列化器对于支持自定义数据格式是必要的。在[自定义消费者绑定](#7115-自定义参数绑定)一节中，演示了一个允许从报文标题绑定 ProductInfo 类型的示例。如果该对象应使用自定义数据格式来表示报文正文，则可以注册自己的序列化器/解序列化器来实现。

在本示例中，字段的字符串表示的简单数据格式是用管道字符连接在一起的。

<Tabs>
  <TabItem value="Java" label="Java" default>

```java
@Singleton // (1)
public class ProductInfoSerDes implements NatsMessageSerDes<ProductInfo> { // (2)

    private final ConversionService conversionService;

    public ProductInfoSerDes(ConversionService conversionService) { // (3)
        this.conversionService = conversionService;
    }

    @Override
    public ProductInfo deserialize(Message message, Argument<ProductInfo> argument) { // (4)
        String body = new String(message.getData(), StandardCharsets.UTF_8);
        String[] parts = body.split("\\|");
        if (parts.length == 3) {
            String size = parts[0];
            if (size.equals("null")) {
                size = null;
            }

            Optional<Long> count = conversionService.convert(parts[1], Long.class);
            Optional<Boolean> sealed = conversionService.convert(parts[2], Boolean.class);

            if (count.isPresent() && sealed.isPresent()) {
                return new ProductInfo(size, count.get(), sealed.get());
            }
        }
        return null;
    }

    @Override
    public byte[] serialize(ProductInfo data) { // (5)
        if (data == null) {
            return null;
        }
        return (data.getSize() + "|" + data.getCount() + "|" + data.getSealed()).getBytes(StandardCharsets.UTF_8);
    }

    @Override
    public boolean supports(Argument<ProductInfo> argument) { // (6)
        return argument.getType().isAssignableFrom(ProductInfo.class);
    }
}
```

  </TabItem>
  <TabItem value="Groovy" label="Groovy">

```groovy
import io.micronaut.core.convert.ConversionService
import io.micronaut.core.type.Argument
import io.micronaut.nats.serdes.NatsMessageSerDes
import io.nats.client.Message

import jakarta.inject.Singleton

@Singleton // (1)
class ProductInfoSerDes implements NatsMessageSerDes<ProductInfo> { // (2)

    private static final Charset UTF8 = Charset.forName("UTF-8")

    private final ConversionService conversionService

    ProductInfoSerDes(ConversionService conversionService) { // (3)
        this.conversionService = conversionService
    }

    @Override
    ProductInfo deserialize(Message message, Argument<ProductInfo> argument) { // (4)
        String body = new String(message.data, UTF8)
        String[] parts = body.split("\\|")
        if (parts.length == 3) {
            String size = parts[0]
            if (size == "null") {
                size = null
            }

            Optional<Long> count = conversionService.convert(parts[1], Long)
            Optional<Boolean> sealed = conversionService.convert(parts[2], Boolean)

            if (count.isPresent() && sealed.isPresent()) {
                return new ProductInfo(size, count.get(), sealed.get())
            }
        }
        null
    }

    @Override
    byte[] serialize(ProductInfo data) { // (5)
        if (data == null) {
            return null
        }
        (data.size + "|" + data.count + "|" + data.sealed).getBytes(UTF8)
    }

    @Override
    boolean supports(Argument<ProductInfo> argument) { // (6)
        argument.type.isAssignableFrom(ProductInfo)
    }
}
```

  </TabItem>
  <TabItem value="Kotlin" label="Kotlin">

```kt
import io.micronaut.core.convert.ConversionService
import io.micronaut.core.type.Argument
import io.micronaut.nats.serdes.NatsMessageSerDes
import io.nats.client.Message
import jakarta.inject.Singleton
import java.nio.charset.Charset

@Singleton // (1)
class ProductInfoSerDes(private val conversionService: ConversionService)// (3)
    : NatsMessageSerDes<ProductInfo> { // (2)

    override fun deserialize(message: Message, argument: Argument<ProductInfo>): ProductInfo? { // (4)
        val body = String(message.data, CHARSET)
        val parts = body.split("\\|".toRegex())
        if (parts.size == 3) {
            var size: String? = parts[0]
            if (size == "null") {
                size = null
            }

            val count = conversionService.convert(parts[1], Long::class.java)
            val sealed = conversionService.convert(parts[2], Boolean::class.java)

            if (count.isPresent && sealed.isPresent) {
                return ProductInfo(size, count.get(), sealed.get())
            }
        }
        return null
    }

    override fun serialize(data: ProductInfo?): ByteArray { // (5)
        return (data?.size + "|" + data?.count + "|" + data?.sealed).toByteArray(CHARSET)
    }

    override fun supports(argument: Argument<ProductInfo>): Boolean { // (6)
        return argument.type.isAssignableFrom(ProductInfo::class.java)
    }

    companion object {
        private val CHARSET = Charset.forName("UTF-8")
    }
}
```

  </TabItem>
</Tabs>

1. 该类被声明为单例，因此将在上下文中注册
2. 泛型指定了我们要接受和返回的类型
3. 注入转换服务，将信息的各个部分转换为所需的类型
4. 反序列化方法从报文中获取字节并构建 `ProductInfo`。
5. 序列化方法获取 `ProductInfo` 并返回要发布的字节。此外，还提供了属性的可变版本，以便在发布前设置内容类型等属性。
6. supports 方法可确保本服务器只处理正确的主体类型。

:::note 提示
由于 `getOrder` 方法未被重载，因此使用了默认的 0 排序。所有默认服务器的优先级都低于默认顺序，这意味着该服务器将在其他服务器之前进行检查。
:::

## 10. NATS 健康指标

该库为使用 Micronaut 管理模块的应用程序提供了一个健康指示器。有关端点本身的更多信息，参阅[健康端点](/core/management/providedEndpoints#1523-健康端点)文档。

健康指示器报告的信息位于 `nats` 键下。

<Tabs>
  <TabItem value="Properties" label="Properties">

```properties
nats.status=UP
nats.details.servers[0]=nats://localhost:4222
```

  </TabItem>
  <TabItem value="Yaml" label="Yaml">

```yaml
"nats": {
  "status": "UP",
  "details": {
    "servers": ["nats://localhost:4222"]
  }
}
```

  </TabItem>
    <TabItem value="Toml" label="Toml">

```toml
[nats]
  status="UP"
  [nats.details]
    servers=[
      "nats://localhost:4222"
    ]
```

  </TabItem>
    <TabItem value="Groovy" label="Groovy">

```groovy
nats {
  status = "UP"
  details {
    servers = ["nats://localhost:4222"]
  }
}
```

  </TabItem>
    <TabItem value="Hoon" label="Hoon">

```hocon
{
  nats {
    status = "UP"
    details {
      servers = ["nats://localhost:4222"]
    }
  }
}
```

  </TabItem>
    <TabItem value="JSON" label="JSON">

```json
{
  "nats": {
    "status": "UP",
    "details": {
      "servers": ["nats://localhost:4222"]
    }
  }
}
```

  </TabItem>
</Tabs>

:::note 提示
要完全禁用 NATS 健康指示器，请添加 endpoints.health.nats.enabled：false。
:::

## 11. Jetstream

Jetstream 是 Nats.io 内置的分布式持久化系统，可实现以下新功能：
- 容错
- 复制
- 一锤定音语义
- 重放策略
- 保留策略和限制
- 流

### 11.1 流

信息流是 "信息存储"，每个信息流都定义了信息的存储方式和保留的限制（持续时间、大小、兴趣）。信息流使用正常的 NATS 主题，在这些主题上发布的任何信息都将被捕获到定义的存储系统中。你可以向主题进行普通发布，以实现无确认交付，但最好使用 JetStream 发布调用，因为 JetStream 服务器会回复确认，说明已成功存储。

如需了解更多信息，参阅 [JetStream Model Deep Dive](https://docs.nats.io/using-nats/developer/develop_jetstream/model_deep_dive)。

#### 11.1.1 配置

[JetStreamOptions.Builder](https://javadoc.io/doc/io.nats/jnats/latest/io/nats/client/JetStreamOptions.Builder.html) 和 [StreamConfiguration.Builder](https://javadoc.io/doc/io.nats/jnats/latest/io/nats/client/api/StreamConfiguration.Builder.html) 上的所有属性都可以通过配置或 BeanCreatedEventListener 进行修改。

以下属性可用于流配置：

*表 1. [NatsConnectionFactoryConfig$JetStreamConfiguration$StreamConfiguration](https://micronaut-projects.github.io/micronaut-nats/latest/api/io/micronaut/nats/connect/NatsConnectionFactoryConfig.JetStreamConfiguration.StreamConfiguration.html) 的配置属性*

|属性|类型|描述|
|--|--|--|
|`nats.*.jetstream.streams.*.description`|java.lang.String||
|`nats.*.jetstream.streams.*.retention-policy`|io.nats.client.api.RetentionPolicy||
|`nats.*.jetstream.streams.*.max-consumers`|long||
|`nats.*.jetstream.streams.*.max-messages`|long||
|`nats.*.jetstream.streams.*.max-messages-per-subject`|long||
|`nats.*.jetstream.streams.*.max-bytes`|long||
|`nats.*.jetstream.streams.*.max-age`|java.time.Duration||
|`nats.*.jetstream.streams.*.max-msg-size`|long||
|`nats.*.jetstream.streams.*.storage-type`|io.nats.client.api.StorageType||
|`nats.*.jetstream.streams.*.replicas`|int||
|`nats.*.jetstream.streams.*.no-ack`|boolean||
|`nats.*.jetstream.streams.*.template-owner`|java.lang.String||
|`nats.*.jetstream.streams.*.discard-policy`|io.nats.client.api.DiscardPolicy||
|`nats.*.jetstream.streams.*.duplicate-window`|java.time.Duration||
|`nats.*.jetstream.streams.*.placement`|io.nats.client.api.Placement||
|`nats.*.jetstream.streams.*.republish`|io.nats.client.api.Republish||
|`nats.*.jetstream.streams.*.mirror`|io.nats.client.api.Mirror||
|`nats.*.jetstream.streams.*.sources`|io.nats.client.api.Source||
|`nats.*.jetstream.streams.*.allow-rollup`|boolean||
|`nats.*.jetstream.streams.*.allow-direct`|boolean||
|`nats.*.jetstream.streams.*.mirror-direct`|boolean||
|`nats.*.jetstream.streams.*.deny-delete`|boolean||
|`nats.*.jetstream.streams.*.deny-purge`|boolean||
|`nats.*.jetstream.streams.*.discard-new-per-subject`|boolean||
|`nats.*.jetstream.streams.*.seal`|boolean||
|`nats.*.jetstream.streams.*.metadata`|java.util.Map||
|`nats.*.jetstream.streams.*.subjects`|java.util.List|获取数据流的主题。|

jetstream 和单一流的简单配置如下：

<Tabs>
  <TabItem value="Properties" label="Properties">

```properties
nats.default.jetstream.streams.events.storage-type=Memory
nats.default.jetstream.streams.events.subjects[0]=events.>
```

  </TabItem>
  <TabItem value="Yaml" label="Yaml">

```yaml
nats:
  default:
    jetstream:
      streams:
        events:
          storage-type: Memory
          subjects:
            - events.>
```

  </TabItem>
    <TabItem value="Toml" label="Toml">

```toml
[nats]
  [nats.default]
    [nats.default.jetstream]
      [nats.default.jetstream.streams]
        [nats.default.jetstream.streams.events]
          storage-type="Memory"
          subjects=[
            "events.>"
          ]
```

  </TabItem>
    <TabItem value="Groovy" label="Groovy">

```groovy
nats {
  'default' {
    jetstream {
      streams {
        events {
          storageType = "Memory"
          subjects = ["events.>"]
        }
      }
    }
  }
}
```

  </TabItem>
    <TabItem value="Hoon" label="Hoon">

```hocon
{
  nats {
    default {
      jetstream {
        streams {
          events {
            storage-type = "Memory"
            subjects = ["events.>"]
          }
        }
      }
    }
  }
}
```

  </TabItem>
    <TabItem value="JSON" label="JSON">

```json
{
  "nats": {
    "default": {
      "jetstream": {
        "streams": {
          "events": {
            "storage-type": "Memory",
            "subjects": ["events.>"]
          }
        }
      }
    }
  }
}
```

  </TabItem>
</Tabs>

#### 11.1.2 生产者

快速入门中的示例介绍了一个接口的琐碎定义，该接口将使用 [@JetstreamClient](https://micronaut-projects.github.io/micronaut-nats/latest/api/io/micronaut/nats/jetstream/annotation/JetstreamClient.html) 注解自动为你实现。

但 `@JetstreamClient`（由 [JetStreamIntroductionAdvice](https://micronaut-projects.github.io/micronaut-nats/latest/api/io/micronaut/nats/jetstream/intercept/JetStreamIntroductionAdvice.html) 类定义）的实现非常灵活，可为定义 Jetstream 客户端提供多种选择。

`@JetstreamClient` 扩展了默认的 `@NatsClient` 并基于相同的方法。因此，你仍然可以使用你已经知道的所有头和主题功能。

`@JetstreamClient` 有一个特殊的扩展，可用于你想要发布的选项。

<Tabs>
  <TabItem value="Java" label="Java" default>

```java
@JetStreamClient
public interface ProductClient {

    PublishAck send(@Subject String subject, @MessageBody byte[] data, PublishOptions publishOptions); // (1)
}
```

  </TabItem>
  <TabItem value="Groovy" label="Groovy">

```groovy
import io.micronaut.messaging.annotation.MessageBody
import io.micronaut.nats.annotation.Subject
import io.micronaut.nats.jetstream.annotation.JetStreamClient
import io.nats.client.PublishOptions
import io.nats.client.api.PublishAck

@JetStreamClient
interface ProductClient {

    PublishAck send(@Subject String subject, @MessageBody byte[] data, PublishOptions publishOptions); // (2)
}
```

  </TabItem>
  <TabItem value="Kotlin" label="Kotlin">

```kt
import io.micronaut.messaging.annotation.MessageBody
import io.micronaut.nats.annotation.Subject
import io.micronaut.nats.jetstream.annotation.JetStreamClient
import io.nats.client.PublishOptions
import io.nats.client.api.PublishAck

@JetStreamClient
interface ProductClient {

    fun send(@Subject subject: String, @MessageBody data: ByteArray, publishOptions: PublishOptions): PublishAck // (1)
}
```

  </TabItem>
</Tabs>

#### 11.1.3 消费者

消费者是流的有状态视图。它充当客户端的接口，用于消费存储在流中的消息子集，并跟踪哪些消息已被客户机交付和确认。

核心 NATS 最多只能保证一次消息传递，而消费者则不同，它可以保证至少一次消息传递。这是通过将发布的消息持久化到流中，以及消费者在客户端接收和处理消息时跟踪每条消息的交付和确认来实现的。JetStream 消费者支持多种确认和多种确认策略。它们会自动重新发送未加封（或 "加封"）的消息，最多可达到用户指定的最大发送尝试次数（当消息达到此限制时会发出警告）。

消费者可以是基于推送的，即向指定主题发送消息；也可以是基于拉动的，即允许客户端按需请求批量消息。选择使用哪种消费者取决于使用情况，但通常情况下，如果客户端应用程序需要从流中获取各自的消息重放，则应使用 "有序推送消费者"。如果需要处理消息并轻松实现横向扩展，则应使用 "拉式消费者"。

除了推式或拉式消费者，消费者还可以是短暂的或持久的。在创建消费者时，如果在 "持久 "字段中设置了显式名称，消费者就会被视为持久消费者，否则就会被视为短暂消费者。耐久性和短暂性的行为完全相同，但短暂性会在一段时间不活动后自动清理（删除），特别是在消费者没有绑定订阅的情况下。默认情况下，即使有一段时间不活动，持久性也会保留（除非明确设置了 InactiveThreshold）

##### 11.1.3.1 基于推送

推送式消费者由服务器控制并向客户端发送消息。根据使用情况，它可以是持久的，也可以是短暂的。

推送消费者与已知的 `@NatsListener` 非常相似。让我们来看一个简单的例子。

<Tabs>
  <TabItem value="Java" label="Java" default>

```java
import io.micronaut.nats.jetstream.annotation.JetStreamListener;
import io.micronaut.nats.jetstream.annotation.PushConsumer;

@JetStreamListener // (1)
public class ProductListener {

    List<byte[]> messageLengths = Collections.synchronizedList(new ArrayList<>());

    @PushConsumer(value = "events", subject = "events.>", durable = "test") // (2)
    public void receive(byte[] data) {
        messageLengths.add(data);
    }
}
```

  </TabItem>
  <TabItem value="Groovy" label="Groovy">

```groovy
import io.micronaut.nats.jetstream.annotation.JetStreamListener
import io.micronaut.nats.jetstream.annotation.PushConsumer

@JetStreamListener // (1)
class ProductListener {

    CopyOnWriteArrayList<byte[]> messageLengths = []

    @PushConsumer(value = "events", subject = "events.>", durable = "test") // (2)
    void receive(byte[] data) {
        messageLengths << data
    }
}
```

  </TabItem>
  <TabItem value="Kotlin" label="Kotlin">

```kt
import io.micronaut.nats.jetstream.annotation.JetStreamListener
import io.micronaut.nats.jetstream.annotation.PushConsumer

@JetStreamListener // (1)
class ProductListener {

    val messageLengths: MutableList<ByteArray> = Collections.synchronizedList(ArrayList())

    @PushConsumer(value = "events", subject = "events.>", durable = "test") // (2)
    fun receive(data: ByteArray) {
        messageLengths.add(data)
    }
}
```

  </TabItem>
</Tabs>

1. 该类需要使用 [@JetstreamListener](https://micronaut-projects.github.io/micronaut-nats/latest/api/io/micronaut/configuration/nats/jetstream/annotation/JetstreamListener.html) 进行注解。
2. [@PushConsumer](https://micronaut-projects.github.io/micronaut-nats/latest/api/io/micronaut/configuration/nats/jetstream/annotation/PushConsumer.html) 配置要监听的流（`value`）和 `subject`。可以使用 [SubscribeOptions](https://javadoc.io/doc/io.nats/jnats/latest/io/nats/client/SubscribeOptions.html) 和 [PushSubscribeOptions](https://javadoc.io/doc/io.nats/jnats/latestio/nats/client/PushSubscribeOptions.html) 中的所有已知值，如 `durable`。

##### 11.1.3.2 基于拉

拉式消费者允许你控制服务器发送客户端消息的时间。

要创建新的拉式订阅，需要注入 [PullConsumerRegistrey](https://micronaut-projects.github.io/micronaut-nats/latest/api/io/micronaut/nats/jetstream/PullConsumerRegistrey.html)。

让我们看一个快速示例。

<Tabs>
  <TabItem value="Java" label="Java" default>

```java
import io.micronaut.nats.jetstream.PullConsumerRegistry;
import io.nats.client.JetStreamApiException;
import io.nats.client.JetStreamSubscription;
import io.nats.client.Message;
import io.nats.client.PullSubscribeOptions;
import io.nats.client.api.ConsumerConfiguration;

@Singleton
public class PullConsumerHelper {

    private final PullConsumerRegistry pullConsumerRegistry;

    public PullConsumerHelper(PullConsumerRegistry pullConsumerRegistry) { // (1)
        this.pullConsumerRegistry = pullConsumerRegistry;
    }

    public List<Message> pullMessages() throws JetStreamApiException, IOException {
        PullSubscribeOptions pullSubscribeOptions =
            PullSubscribeOptions.builder()
                                .stream("events")
                                .configuration(
                                    ConsumerConfiguration
                                        .builder()
                                        .ackWait(
                                            Duration.ofMillis(
                                                2500))
                                        .build())
                                .build();
        JetStreamSubscription jetStreamSubscription =
            pullConsumerRegistry.newPullConsumer("events.>", pullSubscribeOptions); // (2)

        List<Message> messages = jetStreamSubscription.fetch(2, Duration.ofSeconds(2L)); // (3)
        messages.forEach(Message::ack); // (4)
        return messages;
    }
}
```

  </TabItem>
  <TabItem value="Groovy" label="Groovy">

```groovy
import io.micronaut.nats.jetstream.PullConsumerRegistry
import io.nats.client.JetStreamApiException
import io.nats.client.JetStreamSubscription
import io.nats.client.Message
import io.nats.client.PullSubscribeOptions
import io.nats.client.api.ConsumerConfiguration

@Singleton
class PullConsumerHelper {

    private final PullConsumerRegistry pullConsumerRegistry;

    PullConsumerHelper(PullConsumerRegistry pullConsumerRegistry) {  // (1)
        this.pullConsumerRegistry = pullConsumerRegistry
    }

    List<Message> pullMessages() throws JetStreamApiException, IOException {
        JetStreamSubscription jetStreamSubscription =
                pullConsumerRegistry.newPullConsumer("events.>",
                        PullSubscribeOptions.builder()
                                .stream("events")
                                .configuration(
                                        ConsumerConfiguration.builder().ackWait(Duration.ofMillis(2500)).build())
                                .build()) // (2)

        List<Message> messages = jetStreamSubscription.fetch(2, Duration.ofSeconds(2L)) // (3)
        messages.forEach(Message::ack) // (4)
        return messages
    }

}
```

  </TabItem>
  <TabItem value="Kotlin" label="Kotlin">

```kt
import io.micronaut.nats.jetstream.PullConsumerRegistry
import io.nats.client.JetStreamSubscription
import io.nats.client.Message
import io.nats.client.PullSubscribeOptions
import io.nats.client.api.ConsumerConfiguration

@Singleton
class PullConsumerHelper(private val pullConsumerRegistry: PullConsumerRegistry) { // (1)

    fun pullMessages(): List<Message> {
        val pullSubscribeOptions: PullSubscribeOptions =
            PullSubscribeOptions.builder()
                .stream("events")
                .configuration(
                    ConsumerConfiguration
                        .builder()
                        .ackWait(
                            Duration.ofMillis(
                                2500
                            )
                        )
                        .build()
                )
                .build()
        val jetStreamSubscription: JetStreamSubscription =
            pullConsumerRegistry.newPullConsumer("events.>", pullSubscribeOptions) // (2)

        val messages: List<Message> = jetStreamSubscription.fetch(2, Duration.ofSeconds(2L)) // (3)
        messages.forEach(Message::ack) // (4)
        return messages
    }

}
```

  </TabItem>
</Tabs>

1. 要创建新的拉动订阅，需要注入 [PullConsumerRegistry](https://micronaut-projects.github.io/micronaut-nats/latest/api/io/micronaut/nats/jetstream/PullConsumerRegistry.html)。
2. 创建一个新的 [JetStreamSubscription](https://javadoc.io/doc/io.nats/jnats/latest/io/nats/client/JetStreamSubscription.html)，其中包含要订阅的主题和必要的 [PullSubscribeOptions](https://javadoc.io/doc/io.nats/jnats/latest/io/nats/client/PullSubscribeOptions.html)。
3. 从订阅中获取消息。
4. 确认获取的消息。

### 11.2 键/值存储

JetSteam 是 NATS 的持久层，它不仅能提供更高的服务质量和与 "流 "相关的功能，还能实现一些消息系统所不具备的功能。

其中一项功能就是键/值存储功能，它允许客户端应用程序创建 "桶"，并将其用作即时一致的持久关联数组。

你可以使用 KV 桶来执行立即一致的键/值存储所需的典型操作：

- put：将值与键关联
- get：获取与键相关联的值
- delete： 清除与键相关的任何值
- purge：清除与所有键关联的所有值
- create： 仅在当前没有与键相关联的值的情况下将值与该键关联（即与空值比较并设置）
- update：比较并设置（又称比较并交换）键值
- keys：获取所有键的副本（与键关联的值或操作）

你可以为你的存储桶设置限制，例如：- 存储桶的最大大小 - 任何单个值的最大大小 - TTL：存储将保存值多长时间。

最后，你甚至可以做一些键/值存储库通常做不到的事情：

- watch：观察某个键发生的变化，这类似于订阅（发布/订阅意义上的）键：观察者会在键上的放入或删除操作发生时实时接收推送给它的更新。
- watch all：观察数据桶中所有键值的所有变化
- history：检索与每个键相关的值（和删除操作）的历史记录（默认情况下，桶的历史记录设置为 1，这意味着只存储最新的值/操作）

#### 11.2.1 配置

[JetStreamOptions.Builder](https://javadoc.io/doc/io.nats/jnats/latest/io/nats/client/JetStreamOptions.Builder.html) 和 [KeyValueConfiguration.Builder](https://javadoc.io/doc/io.nats/jnats/latest/io/nats/client/api/KeyValueConfiguration.Builder.html) 上的所有属性都可通过配置或 BeanCreatedEventListener 进行修改。

以下属性可用于流配置：

*表 1. [NatsConnectionFactoryConfig$JetStreamConfiguration$KeyValueConfiguration](https://micronaut-projects.github.io/micronaut-nats/latest/api/io/micronaut/nats/connect/NatsConnectionFactoryConfig.JetStreamConfiguration.KeyValueConfiguration.html) 的配置属性*

|属性|类型|描述|
|--|--|--|
|nats.*.jetstream.keyvalue.*.description|java.lang.String||
|nats.*.jetstream.keyvalue.*.max-history-per-key|int||
|nats.*.jetstream.keyvalue.*.max-bucket-size|long||
|nats.*.jetstream.keyvalue.*.max-value-size|long||
|nats.*.jetstream.keyvalue.*.ttl|java.time.Duration||
|nats.*.jetstream.keyvalue.*.storage-type|io.nats.client.api.StorageType||
|nats.*.jetstream.keyvalue.*.replica|int||
|nats.*.jetstream.keyvalue.*.placement|io.nats.client.api.Placement||
|nats.*.jetstream.keyvalue.*.republish|io.nats.client.api.Republish||
|nats.*.jetstream.keyvalue.*.mirror|io.nats.client.api.Mirror||

键值的简单配置可以如下所示：

<Tabs>
  <TabItem value="Properties" label="Properties">

```properties
nats.default.jetstream.keyvalue.examplebucket.storage-type=Memory
nats.default.jetstream.keyvalue.examplebucket.max-history-per-key=5
```

  </TabItem>
  <TabItem value="Yaml" label="Yaml">

```yaml
nats:
  default:
    jetstream:
      keyvalue:
        examplebucket:
          storage-type: Memory
          max-history-per-key: 5
```

  </TabItem>
    <TabItem value="Toml" label="Toml">

```toml
[nats]
  [nats.default]
    [nats.default.jetstream]
      [nats.default.jetstream.keyvalue]
        [nats.default.jetstream.keyvalue.examplebucket]
          storage-type="Memory"
          max-history-per-key=5
```

  </TabItem>
    <TabItem value="Groovy" label="Groovy">

```groovy
nats {
  'default' {
    jetstream {
      keyvalue {
        examplebucket {
          storageType = "Memory"
          maxHistoryPerKey = 5
        }
      }
    }
  }
}
```

  </TabItem>
    <TabItem value="Hoon" label="Hoon">

```hocon
{
  nats {
    default {
      jetstream {
        keyvalue {
          examplebucket {
            storage-type = "Memory"
            max-history-per-key = 5
          }
        }
      }
    }
  }
}
```

  </TabItem>
    <TabItem value="JSON" label="JSON">

```json
{
  "nats": {
    "default": {
      "jetstream": {
        "keyvalue": {
          "examplebucket": {
            "storage-type": "Memory",
            "max-history-per-key": 5
          }
        }
      }
    }
  }
}
```

  </TabItem>
</Tabs>

#### 11.2.2 使用方法

Nats.io 为键/值存储的使用提供了一个 [KeyValue](https://javadoc.io/doc/io.nats/jnats/latest/io/nats/client/api/KeyValue.html) 接口。

要使用它，只需如下注入你的 Key/Value 存储：

<Tabs>
  <TabItem value="Java" label="Java" default>

```java
@Singleton
public class KeyValueStoreHolder {

    @Inject
    @KeyValueStore("examplebucket")
    KeyValue store; // (1)

    public void put(String key, String value) throws JetStreamApiException, IOException {
        store.put(key, value);
    }

}
```

  </TabItem>
  <TabItem value="Groovy" label="Groovy">

```groovy
import io.micronaut.nats.jetstream.annotation.KeyValueStore
import io.nats.client.KeyValue
import jakarta.inject.Inject
import jakarta.inject.Singleton

@Singleton
class KeyValueStoreHolder {

    @Inject
    @KeyValueStore("examplebucket")
    KeyValue store // (1)

    void put(String key, String value) {
        store.put(key, value)
    }
}
```

  </TabItem>
  <TabItem value="Kotlin" label="Kotlin">

```kt
import io.micronaut.nats.jetstream.annotation.KeyValueStore
import io.nats.client.KeyValue
import jakarta.inject.Inject
import jakarta.inject.Singleton

@Singleton
class KeyValueStoreHolder {

    @Inject
    @field:KeyValueStore("examplebucket")
    lateinit var store: KeyValue // (1)

    fun put(key: String, value:String) {
        store.put(key, value)
    }

}
```

  </TabItem>
</Tabs>

1. 只需通过 @KeyValueStore 注解注入键/值存储即可。

### 11.3 对象存储（试验性）

:::caution 警告
实验预览
:::

对象存储通过实施分块机制，允许你存储任意大小（即大）的数据，例如，通过将文件与路径和文件名（即键）关联，允许你存储和检索任意大小的文件（即对象）。你可以从 JetStream 上下文中获取 ObjectStoreManager 对象。

#### 11.3.1 配置

[JetStreamOptions.Builder](https://javadoc.io/doc/io.nats/jnats/latest/io/nats/client/JetStreamOptions.Builder.html) 和 ObjectStoreConfiguration.Builder 上的所有属性都可以通过配置或 [BeanCreatedEventListener](https://javadoc.io/doc/io.nats/jnats/latest/io/nats/client/api/ObjectStoreConfiguration.Builder.html) 进行修改。

*表 1. [NatsConnectionFactoryConfig$JetStreamConfiguration$ObjectStoreConfiguration](https://micronaut-projects.github.io/micronaut-nats/latest/api/io/micronaut/nats/connect/NatsConnectionFactoryConfig.JetStreamConfiguration.ObjectStoreConfiguration.html) 的配置属性*

|属性|类型|描述|
|--|--|--|
|nats.*.jetstream.objectstore.*.description|java.lang.String||
|nats.*.jetstream.objectstore.*.max-bucket-size|long||
|nats.*.jetstream.objectstore.*.ttl|java.time.Duration||
|nats.*.jetstream.objectstore.*.storage-type|io.nats.client.api.StorageType||
|nats.*.jetstream.objectstore.*.replicas|int||
|nats.*.jetstream.objectstore.*.placement|io.nats.client.api.Placement||

键值的简单配置可以如下所示：

<Tabs>
  <TabItem value="Properties" label="Properties">

```properties
nats.default.jetstream.objectstore.examplebucket.storage-type=Memory
```

  </TabItem>
  <TabItem value="Yaml" label="Yaml">

```yaml
nats:
  default:
    jetstream:
      objectstore:
        examplebucket:
          storage-type: Memory
```

  </TabItem>
    <TabItem value="Toml" label="Toml">

```toml
[nats]
  [nats.default]
    [nats.default.jetstream]
      [nats.default.jetstream.objectstore]
        [nats.default.jetstream.objectstore.examplebucket]
          storage-type="Memory"
```

  </TabItem>
    <TabItem value="Groovy" label="Groovy">

```groovy
nats {
  'default' {
    jetstream {
      objectstore {
        examplebucket {
          storageType = "Memory"
        }
      }
    }
  }
}
```

  </TabItem>
    <TabItem value="Hoon" label="Hoon">

```hocon
{
  nats {
    default {
      jetstream {
        objectstore {
          examplebucket {
            storage-type = "Memory"
          }
        }
      }
    }
  }
}
```

  </TabItem>
    <TabItem value="JSON" label="JSON">

```json
{
  "nats": {
    "default": {
      "jetstream": {
        "objectstore": {
          "examplebucket": {
            "storage-type": "Memory"
          }
        }
      }
    }
  }
}
```

  </TabItem>
</Tabs>

#### 11.3.2 使用方法

Nats.io 为对象存储的使用提供了一个 [ObjectStore](https://javadoc.io/doc/io.nats/jnats/latest/io/nats/client/api/ObjectStore.html) 接口。

要使用它，只需按如下方式注入你的对象存储空间：

<Tabs>
  <TabItem value="Java" label="Java" default>

```java
import io.micronaut.nats.jetstream.annotation.ObjectStore;
import io.nats.client.JetStreamApiException;
import jakarta.inject.Inject;
import jakarta.inject.Singleton;

import java.io.IOException;
import java.io.InputStream;
import java.security.NoSuchAlgorithmException;

@Singleton
public class ObjectStoreHolder {

    @Inject
    @ObjectStore("examplebucket")
    io.nats.client.ObjectStore store; // (1)

    public void put(String key, InputStream inputStream) throws JetStreamApiException, IOException, NoSuchAlgorithmException {
        store.put(key, inputStream);
    }

}
```

  </TabItem>
  <TabItem value="Groovy" label="Groovy">

```groovy
import io.micronaut.nats.jetstream.annotation.ObjectStore
import jakarta.inject.Inject
import jakarta.inject.Singleton

@Singleton
class ObjectStoreHolder {

    @Inject
    @ObjectStore("examplebucket")
    io.nats.client.ObjectStore store // (1)

    void put(String key, InputStream value) {
        store.put(key, value)
    }
}
```

  </TabItem>
  <TabItem value="Kotlin" label="Kotlin">

```kt
import io.micronaut.nats.jetstream.annotation.ObjectStore
import jakarta.inject.Inject
import jakarta.inject.Singleton
import java.io.InputStream


@Singleton
class ObjectStoreHolder {

    @Inject
    @field:ObjectStore("examplebucket")
    lateinit var store: io.nats.client.ObjectStore // (1)

    fun put(key: String, value:InputStream) {
        store.put(key, value)
    }

}
```

  </TabItem>
</Tabs>

1. 只需通过 [@ObjectStore](https://micronaut-projects.github.io/micronaut-nats/latest/api/io/micronaut/nats/jetstream/annotation/ObjectStore.html) 注解注入对象存储空间即可。

## 12. 仓库

你可以在此仓库中找到此项目的源代码：

https://github.com/micronaut-projects/micronaut-nats

> [英文链接](https://micronaut-projects.github.io/micronaut-nats/latest/guide/)

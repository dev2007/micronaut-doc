---
description: Micronaut RabbitMQ
keywords: [micronaut,micronaut 文档,micronaut 中文文档,文档,Micronaut RabbitMQ,RabbitMQ,mq,rocketmq,消息中间件]
---

# Micronaut RabbitMQ

Micronaut 和 RabbitMQ 之间的集成。

## 1. 简介

本项目包括 Micronaut 和 RabbitMQ 之间的集成。标准 [Java 客户端](https://www.rabbitmq.com/java-client.html)用于进行实际的发布和消费。

## 2. 发布历史

关于本项目，你可以在此处找到发布版本列表（含发布说明）：

https://github.com/micronaut-projects/micronaut-rabbitmq/releases

**升级到 Micronaut RabbitMQ 4.0**

Micronaut RabbitMQ 4.0 是一个重要的主要版本，其中包括你在升级时需要考虑的许多更改。

**Micronaut 4、AMQP Java Client 5 和 Java 17 基线**

Micronaut RabbitMQ 4.0 需要以下最低依赖集：

- Java 17 或更高版本
- AMQP Java 客户端 5 或更高版本
- Micronaut 4 或更高版本

**`@Queue` 注解成员 `numberOfConsumers` 现在是 `String`**

Micronaut RabbitMQ 以前的版本使用 `int` 作为 `@Queue` 注解的 `numberOfConsumers` 设置。为了允许使用诸如 `@Queue(numberOfConsumers = "${configured-number-of-consumers}")` 这样的表达式通过外部配置更改此值，`numberOfConsumers` 的类型已更改为 `String`

## 3. 使用 Micronaut CLI

要使用 Micronaut CLI 创建一个支持 RabbitMQ 的项目，请在 `features` 标志中添加 `rabbitmq` 功能。

```bash
$ mn create-messaging-app my-rabbitmq-app --features rabbitmq
```

这将创建一个具有 RabbitMQ 最低必要配置的项目。

如你所料，你可以使用 `./gradlew run`（Gradle）或 `./mvnw compile exec:exec`（Maven）启动应用程序。应用程序将（使用默认配置）尝试连接到 http://localhost:5672 上的 RabbitMQ，并在不启动 HTTP 服务器的情况下继续运行。与服务之间的所有通信都将通过 RabbitMQ 生产者和/或消费者进行。

现在，你可以在新项目中运行 RabbitMQ 特定代码生成命令：

```bash
$ mn create-rabbitmq-producer MessageProducer
| Rendered template Producer.java to destination src/main/java/my/rabbitmq/app/MessageProducer.java

$ mn create-rabbitmq-listener MessageListener
| Rendered template Listener.java to destination src/main/java/my/rabbitmq/app/MessageListener.java
```

## 4. RabbitMQ 快速入门

要在现有项目中添加 RabbitMQ 支持，首先应在构建配置中添加 Micronaut RabbitMQ 配置。例如：

import Tabs from '@theme/Tabs';
import TabItem from '@theme/TabItem';

<Tabs>
  <TabItem value="Gradle" label="Gradle">

```groovy
implementation("io.micronaut.rabbitmq:micronaut-rabbitmq")
```

  </TabItem>
  <TabItem value="Maven" label="Maven">

```xml
<dependency>
    <groupId>io.micronaut.rabbitmq</groupId>
    <artifactId>micronaut-rabbitmq</artifactId>
</dependency>
```

  </TabItem>
</Tabs>

### 使用 @RabbitClient 创建 RabbitMQ 生产者

要创建一个可生成消息的 RabbitMQ 客户端，你只需定义一个注解为 [@RabbitClient](https://micronaut-projects.github.io/micronaut-rabbitmq/latest/api/io/micronaut/configuration/rabbitmq/annotation/RabbitClient.html) 的接口即可。

例如，下面是一个微不足道的 `@RabbitClient` 接口：

<Tabs>
  <TabItem value="Java" label="Java" default>

```java
import io.micronaut.rabbitmq.annotation.Binding;
import io.micronaut.rabbitmq.annotation.RabbitClient;

@RabbitClient // (1)
public interface ProductClient {

    @Binding("product") // (2)
    void send(byte[] data); // (3)
}
```

  </TabItem>
  <TabItem value="Groovy" label="Groovy">

```groovy
import io.micronaut.rabbitmq.annotation.Binding
import io.micronaut.rabbitmq.annotation.RabbitClient

@RabbitClient // (1)
interface ProductClient {

    @Binding("product") // (2)
    void send(byte[] data) // (3)
}
```

  </TabItem>
  <TabItem value="Kotlin" label="Kotlin">

```kt
import io.micronaut.rabbitmq.annotation.Binding
import io.micronaut.rabbitmq.annotation.RabbitClient

@RabbitClient // (1)
interface ProductClient {

    @Binding("product") // (2)
    fun send(data: ByteArray)  // (3)
}
```

  </TabItem>
</Tabs>

1. [@RabbitClient](https://micronaut-projects.github.io/micronaut-rabbitmq/latest/api/io/micronaut/configuration/rabbitmq/annotation/RabbitClient.html) 注解用于将此接口指定为客户端
2. [@Binding](https://micronaut-projects.github.io/micronaut-rabbitmq/latest/api/io/micronaut/configuration/rabbitmq/annotation/Binding.html) 注解表示信息应路由至哪个绑定或路由键。
3. `send` 方法只接受一个参数，即消息正文。

在编译时，Micronaut 会生成上述接口的实现。你可以通过从 [ApplicationContext](https://docs.micronaut.io/latest/api/io/micronaut/context/ApplicationContext.html) 中查找 bean 或使用 `@Inject` 注入 bean 来获取 `ProductClient` 的实例：

<Tabs>
  <TabItem value="Java" label="Java" default>

```java
productClient.send("quickstart".getBytes());
```

  </TabItem>
  <TabItem value="Groovy" label="Groovy">

```groovy
productClient.send("quickstart".bytes)
```

  </TabItem>
  <TabItem value="Kotlin" label="Kotlin">

```kt
productClient.send("quickstart".toByteArray())
```

  </TabItem>
</Tabs>

:::tip 注意
由于 `send` 方法返回 `void`，这意味着该方法将发布消息并立即返回，而不会收到来自代理的任何确认。
:::

---

### 使用 @RabbitListener 创建 RabbitMQ 消费者

要监听 RabbitMQ 消息，你可以使用 [@RabbitListener](https://micronaut-projects.github.io/micronaut-rabbitmq/latest/api/io/micronaut/configuration/rabbitmq/annotation/RabbitListener.html) 注解来定义消息监听器。

以下示例将监听上一节中 ProductClient 发布的消息：

<Tabs>
  <TabItem value="Java" label="Java" default>

```java
import io.micronaut.rabbitmq.annotation.Queue;
import io.micronaut.rabbitmq.annotation.RabbitListener;

import java.util.ArrayList;
import java.util.Collections;
import java.util.List;

@RabbitListener // (1)
public class ProductListener {

    List<String> messageLengths = Collections.synchronizedList(new ArrayList<>());

    @Queue("product") // (2)
    public void receive(byte[] data) { // (3)
        messageLengths.add(new String(data));
        System.out.println("Java received " + data.length + " bytes from RabbitMQ");
    }
}
```

  </TabItem>
  <TabItem value="Groovy" label="Groovy">

```groovy
import io.micronaut.rabbitmq.annotation.Queue
import io.micronaut.rabbitmq.annotation.RabbitListener

import java.util.concurrent.CopyOnWriteArrayList

@RabbitListener // (1)
class ProductListener {

    CopyOnWriteArrayList<String> messageLengths = []

    @Queue("product") // (2)
    void receive(byte[] data) { // (3)
        messageLengths << new String(data)
    }
}
```

  </TabItem>
  <TabItem value="Kotlin" label="Kotlin">

```kt
import io.micronaut.rabbitmq.annotation.Queue
import io.micronaut.rabbitmq.annotation.RabbitListener
import java.util.Collections

@RabbitListener // (1)
class ProductListener {

    val messageLengths: MutableList<String> = Collections.synchronizedList(ArrayList())

    @Queue("product") // (2)
    fun receive(data: ByteArray) { // (3)
        val string = String(data)
        messageLengths.add(string)
        println("Kotlin received ${data.size} bytes from RabbitMQ: ${string}")
    }
}
```

  </TabItem>
</Tabs>

1. [@RabbitListener](https://micronaut-projects.github.io/micronaut-rabbitmq/latest/api/io/micronaut/configuration/rabbitmq/annotation/RabbitListener.html) 用于将 bean 指定为消息监听器。
2. [@Queue](https://micronaut-projects.github.io/micronaut-rabbitmq/latest/api/io/micronaut/configuration/rabbitmq/annotation/Queue.html) 注解用于指明要订阅哪个队列。
3. `receive` 方法只接受一个参数，即消息正文

## 5 配置连接

[ConnectionFactory](https://rabbitmq.github.io/rabbitmq-java-client/api/current/com/rabbitmq/client/ConnectionFactory.html) 的所有属性都可以通过配置或 [BeanCreatedEventListener](https://docs.micronaut.io/latest/api/io/micronaut/context/event/BeanCreatedEventListener.html) 进行修改。

可从配置文件中的字符串值转换的属性可直接配置。

*表 1. [SingleRabbitConnectionFactoryConfig](https://micronaut-projects.github.io/micronaut-rabbitmq/latest/api/io/micronaut/rabbitmq/connect/SingleRabbitConnectionFactoryConfig.html) 的配置属性*

|属性|类型|描述|
|--|--|--|
|rabbitmq.host|java.lang.String||
|rabbitmq.port|int||
|rabbitmq.username|java.lang.String||
|rabbitmq.password|java.lang.String||
|rabbitmq.credentials-provider|com.rabbitmq.client.impl.CredentialsProvider||
|rabbitmq.virtual-host|java.lang.String||
|rabbitmq.uri|java.net.URI||
|rabbitmq.requested-channel-max|int||
|rabbitmq.requested-frame-max|int||
|rabbitmq.requested-heartbeat|int||
|rabbitmq.connection-timeout|int||
|rabbitmq.handshake-timeout|int||
|rabbitmq.shutdown-timeout|int||
|rabbitmq.client-properties|java.util.Map|
|rabbitmq.sasl-config|com.rabbitmq.client.SaslConfig||
|rabbitmq.socket-factory|javax.net.SocketFactory||
|rabbitmq.socket-configurator|com.rabbitmq.client.SocketConfigurator||
|rabbitmq.shared-executor|java.util.concurrent.ExecutorService||
|rabbitmq.shutdown-executor|java.util.concurrent.ExecutorService||
|rabbitmq.heartbeat-executor|java.util.concurrent.ScheduledExecutorService||
|rabbitmq.thread-factory|java.util.concurrent.ThreadFactory||
|rabbitmq.exception-handler|com.rabbitmq.client.ExceptionHandler||
|rabbitmq.automatic-recovery-enabled|boolean||
|rabbitmq.topology-recovery-enabled|boolean||
|rabbitmq.topology-recovery-executor|java.util.concurrent.ExecutorService||
|rabbitmq.metrics-collector|com.rabbitmq.client.MetricsCollector||
|rabbitmq.credentials-refresh-service|com.rabbitmq.client.impl.CredentialsRefreshService||
|rabbitmq.network-recovery-interval|int||
|rabbitmq.recovery-delay-handler|com.rabbitmq.client.RecoveryDelayHandler||
|rabbitmq.nio-params|com.rabbitmq.client.impl.nio.NioParams||
|rabbitmq.channel-rpc-timeout|int||
|rabbitmq.ssl-context-factory|com.rabbitmq.client.SslContextFactory||
|rabbitmq.channel-should-check-rpc-response-type|boolean||
|rabbitmq.work-pool-timeout|int||
|rabbitmq.error-on-write-listener|com.rabbitmq.client.impl.ErrorOnWriteListener||
|rabbitmq.topology-recovery-filter|com.rabbitmq.client.impl.recovery.TopologyRecoveryFilter|
|rabbitmq.connection-recovery-triggering-condition|java.util.function.Predicate||
|rabbitmq.topology-recovery-retry-handler|com.rabbitmq.client.impl.recovery.RetryHandler||
|rabbitmq.recovered-queue-name-supplier|com.rabbitmq.client.impl.recovery.RecoveredQueueNameSupplier||
|rabbitmq.traffic-listener|com.rabbitmq.client.TrafficListener||
|rabbitmq.addresses|java.util.List||
|rabbitmq.consumer-executor|java.lang.String||
|rabbitmq.confirm-timeout|java.time.Duration||

*表 2. [ClusterRabbitConnectionFactoryConfig](https://micronaut-projects.github.io/micronaut-rabbitmq/latest/api/io/micronaut/rabbitmq/connect/ClusterRabbitConnectionFactoryConfig.html) 的配置属性*

|属性|类型|描述|
|--|--|--|
|rabbitmq.servers.*.host|java.lang.String||
|rabbitmq.servers.*.port|int||
|rabbitmq.servers.*.username|java.lang.String||
|rabbitmq.servers.*.password|java.lang.String||
|rabbitmq.servers.*.credentials-provider|com.rabbitmq.client.impl.CredentialsProvider||
|rabbitmq.servers.*.virtual-host|java.lang.String||
|rabbitmq.servers.*.uri|java.net.URI||
|rabbitmq.servers.*.requested-channel-max|int||
|rabbitmq.servers.*.requested-frame-max|int||
|rabbitmq.servers.*.requested-heartbeat|int||
|rabbitmq.servers.*.connection-timeout|int||
|rabbitmq.servers.*.handshake-timeout|int||
|rabbitmq.servers.*.shutdown-timeout|int||
|rabbitmq.servers.*.client-properties|java.util.Map||
|rabbitmq.servers.*.sasl-config|com.rabbitmq.client.SaslConfig||
|rabbitmq.servers.*.socket-factory|javax.net.SocketFactory||
|rabbitmq.servers.*.socket-configurator|com.rabbitmq.client.SocketConfigurator||
|rabbitmq.servers.*.shared-executor|java.util.concurrent.ExecutorService||
|rabbitmq.servers.*.shutdown-executor|java.util.concurrent.ExecutorService||
|rabbitmq.servers.*.heartbeat-executor|java.util.concurrent.ScheduledExecutorService||
|rabbitmq.servers.*.thread-factory|java.util.concurrent.ThreadFactory||
|rabbitmq.servers.*.exception-handler|com.rabbitmq.client.ExceptionHandler||
|rabbitmq.servers.*.automatic-recovery-enabled|boolean||
|rabbitmq.servers.*.topology-recovery-enabled|boolean||
|rabbitmq.servers.*.topology-recovery-executor|java.util.concurrent.ExecutorService||
|rabbitmq.servers.*.metrics-collector|com.rabbitmq.client.MetricsCollector||
|rabbitmq.servers.*.credentials-refresh-service|com.rabbitmq.client.impl.CredentialsRefreshService||
|rabbitmq.servers.*.network-recovery-interval|int||
|rabbitmq.servers.*.recovery-delay-handler|com.rabbitmq.client.RecoveryDelayHandler||
|rabbitmq.servers.*.nio-params|com.rabbitmq.client.impl.nio.NioParams||
|rabbitmq.servers.*.channel-rpc-timeout|int||
|rabbitmq.servers.*.ssl-context-factory|com.rabbitmq.client.SslContextFactory||
|rabbitmq.servers.*.channel-should-check-rpc-response-type|boolean||
|rabbitmq.servers.*.work-pool-timeout|int||
|rabbitmq.servers.*.error-on-write-listener|com.rabbitmq.client.impl.ErrorOnWriteListener||
|rabbitmq.servers.*.topology-recovery-filter|com.rabbitmq.client.impl.recovery.TopologyRecoveryFilter||
|rabbitmq.servers.*.connection-recovery-triggering-condition|java.util.function.Predicate||
|rabbitmq.servers.*.topology-recovery-retry-handler|com.rabbitmq.client.impl.recovery.RetryHandler||
|rabbitmq.servers.*.recovered-queue-name-supplier|com.rabbitmq.client.impl.recovery.RecoveredQueueNameSupplier||
|rabbitmq.servers.*.traffic-listener|com.rabbitmq.client.TrafficListener||
|rabbitmq.servers.*.addresses|java.util.List||
|rabbitmq.servers.*.consumer-executor|java.lang.String||
|rabbitmq.servers.*.confirm-timeout|java.time.Duration||

:::tip 注意
在没有任何配置的情况下，将使用 [ConnectionFactory](https://rabbitmq.github.io/rabbitmq-java-client/api/current/com/rabbitmq/client/ConnectionFactory.html) 中的默认值。
:::

要配置 [CredentialsProvider](https://rabbitmq.github.io/rabbitmq-java-client/api/current/com/rabbitmq/client/impl/CredentialsProvider.html) 等功能，可以注册一个 Bean 创建的事件监听器来拦截连接工厂的创建。

<Tabs>
  <TabItem value="Java" label="Java" default>

```java
package io.micronaut.rabbitmq.docs.config;

import com.rabbitmq.client.ConnectionFactory;
import com.rabbitmq.client.impl.DefaultCredentialsProvider;
import io.micronaut.context.event.BeanCreatedEvent;
import io.micronaut.context.event.BeanCreatedEventListener;
import jakarta.inject.Singleton;

@Singleton
public class ConnectionFactoryInterceptor implements BeanCreatedEventListener<ConnectionFactory> {

    @Override
    public ConnectionFactory onCreated(BeanCreatedEvent<ConnectionFactory> event) {
        ConnectionFactory connectionFactory = event.getBean();
        connectionFactory.setCredentialsProvider(new DefaultCredentialsProvider("guest", "guest"));
        return connectionFactory;
    }
}
```

  </TabItem>
  <TabItem value="Groovy" label="Groovy">

```groovy
package io.micronaut.rabbitmq.docs.config

import com.rabbitmq.client.ConnectionFactory
import com.rabbitmq.client.impl.DefaultCredentialsProvider
import io.micronaut.context.event.BeanCreatedEvent
import io.micronaut.context.event.BeanCreatedEventListener
import jakarta.inject.Singleton

@Singleton
class ConnectionFactoryInterceptor implements BeanCreatedEventListener<ConnectionFactory> {

    @Override
    ConnectionFactory onCreated(BeanCreatedEvent<ConnectionFactory> event) {
        def connectionFactory = event.bean
        connectionFactory.credentialsProvider = new DefaultCredentialsProvider("guest", "guest")
        connectionFactory
    }
}
```

  </TabItem>
  <TabItem value="Kotlin" label="Kotlin">

```kt
package io.micronaut.rabbitmq.docs.config

import com.rabbitmq.client.ConnectionFactory
import com.rabbitmq.client.impl.DefaultCredentialsProvider
import io.micronaut.context.event.BeanCreatedEvent
import io.micronaut.context.event.BeanCreatedEventListener
import jakarta.inject.Singleton

@Singleton
class ConnectionFactoryInterceptor: BeanCreatedEventListener<ConnectionFactory> {

    override fun onCreated(event: BeanCreatedEvent<ConnectionFactory>?): ConnectionFactory {
        val connectionFactory = event!!.bean
        connectionFactory.setCredentialsProvider(DefaultCredentialsProvider("guest", "guest"))
        return connectionFactory
    }
}
```

  </TabItem>
</Tabs>

::note 提示
也可以使用 `rabbitmq.enabled: false` 完全禁用集成。
:::

### 连接

可以为同一服务器、不同服务器或服务器列表中的一个服务器配置多个连接。

我们可能希望配置多个连接到同一服务器，以便在不同的线程池上执行一组或多组消费者。此外，只需省略消费者执行器配置选项或提供相同的值，就可以使用下面的配置连接到具有相同消费者执行器的不同服务器。

例如：

```yaml
rabbitmq:
    servers:
        server-a:
            host: localhost
            port: 5672
            consumer-executor: "a-pool"
        server-b:
            host: localhost
            port: 5672
            consumer-executor: "b-pool"
```

例如，如果在 [@Queue](https://micronaut-projects.github.io/micronaut-rabbitmq/latest/api/io/micronaut/configuration/rabbitmq/annotation/Queue.html) 注解中指定连接为 "server-b"，则将使用 "b-pool "执行器服务来执行消费者。

:::caution 警告
当使用配置选项 `rabbitmq.servers` 时，不会读取 `rabbitmq` 下面的其他选项；例如 `rabbitmq.uri`。
:::

RabbitMQ 还支持故障切换连接策略，即在服务器列表中使用第一个成功连接的服务器。要在 Micronaut 中使用该选项，只需提供 `host:port` 地址列表即可。

```yaml
rabbitmq:
    addresses:
      - localhost:12345
      - localhost:12346
    username: guest
    password: guest
```

:::tip 注意
`addresses` 选项也可用于多服务器配置。
:::

## 6. RabbitMQ 生产者

快速入门中的示例介绍了一个接口的微不足道的定义，该接口将使用 @RabbitClientannotation 自动为你实现。

然而，支持 [@RabbitClient](https://micronaut-projects.github.io/micronaut-rabbitmq/latest/api/io/micronaut/configuration/rabbitmq/annotation/RabbitClient.html)（由 [RabbitMQIntroductionAdvice](https://micronaut-projects.github.io/micronaut-rabbitmq/latest/api/io/micronaut/configuration/rabbitmq/intercept/RabbitMQIntroductionAdvice.html) 类定义）的实现非常灵活，并为定义 RabbitMQ 生产者提供了一系列选项。

### Exchange

可通过 [@RabbitClient](https://micronaut-projects.github.io/micronaut-rabbitmq/latest/api/io/micronaut/configuration/rabbitmq/annotation/RabbitClient.html) 注解提供要发布消息的交易所。在本示例中，客户端向名为 `animals` 的自定义头信息交换中心发布消息。

<Tabs>
  <TabItem value="Java" label="Java" default>

```java
import io.micronaut.messaging.annotation.MessageHeader;
import io.micronaut.rabbitmq.annotation.RabbitClient;

@RabbitClient("animals") // (1)
public interface AnimalClient {

    void send(@MessageHeader String animalType, Animal animal); // (2)

    default void send(Animal animal) { // (3)
        send(animal.getClass().getSimpleName(), animal);
    }
}
```

  </TabItem>
  <TabItem value="Groovy" label="Groovy">

```groovy
import io.micronaut.messaging.annotation.MessageHeader
import io.micronaut.rabbitmq.annotation.RabbitClient

@RabbitClient("animals") // (1)
abstract class AnimalClient {

    abstract void send(@MessageHeader String animalType, Animal animal) // (2)

    void send(Animal animal) { // (3)
        send(animal.getClass().simpleName, animal)
    }
}
```

  </TabItem>
  <TabItem value="Kotlin" label="Kotlin">

```kt
import io.micronaut.messaging.annotation.MessageHeader
import io.micronaut.rabbitmq.annotation.RabbitClient

@RabbitClient("animals") // (1)
abstract class AnimalClient {

    abstract fun send(@MessageHeader animalType: String, animal: Animal)  // (2)

    fun send(animal: Animal) { //(3)
        send(animal.javaClass.simpleName, animal)
    }
}
```

  </TabItem>
</Tabs>

1. exchange 名称通过 `@RabbitClient` 注解提供。
2. 标头值用于将报文路由到队列。
3. 创建了一个辅助方法来自动提供标头值。

:::caution 警告
在向 exchange 发布信息之前，exchange 必须已经存在。
:::

### 6.1 定义 @Rabbit 客户端方法

所有向 RabbitMQ 发布消息的方法必须满足以下条件：
- 该方法必须位于注解了 [@RabbitClient](https://micronaut-projects.github.io/micronaut-rabbitmq/latest/api/io/micronaut/configuration/rabbitmq/annotation/RabbitClient.html) 的类中。
- 方法必须包含一个代表消息体的参数。

:::caution 警告
如果找不到消息体参数，就会抛出异常。
:::

:::tip 注意
为了使所有功能都能按照本指南中的设计运行，你的类在编译时必须将参数标志设置为 `true`。如果你的应用程序是使用 Micronaut CLI 创建的，那么它已经为你配置好了。
:::

:::caution 警告
除非发布方法返回的是响应式类型，否则该操作是阻塞的
:::

#### 6.1.1 发布参数

所有选项均可用于设置发布消息。[RabbitMQIntroductionAdvice](https://micronaut-projects.github.io/micronaut-rabbitmq/latest/api/io/micronaut/configuration/rabbitmq/intercept/RabbitMQIntroductionAdvice.html) 使用 [basicPublish](https://rabbitmq.github.io/rabbitmq-java-client/api/current/com/rabbitmq/client/Channel.html#basicPublish(java.lang.String,java.lang.String,com.rabbitmq.client.AMQP.BasicProperties,byte%5B%5D)) 方法来发布消息，所有参数均可通过注解或方法参数设置。

##### 6.1.1.1 绑定（Routing Key）

如果需要指定消息的路由键，请将 [@Binding](https://micronaut-projects.github.io/micronaut-rabbitmq/latest/api/io/micronaut/configuration/rabbitmq/annotation/Binding.html) 注解应用到方法或方法的参数。如果方法本身的值在每次执行时都是静态的，则将注解应用到方法本身。如果每次执行都要设置值，则将注解应用于方法的参数。

<Tabs>
  <TabItem value="Java" label="Java" default>

```java
import io.micronaut.rabbitmq.annotation.Binding;
import io.micronaut.rabbitmq.annotation.RabbitClient;

@RabbitClient
public interface ProductClient {

    @Binding("product") // (1)
    void send(byte[] data);

    void send(@Binding String binding, byte[] data); // (2)
}
```

  </TabItem>
  <TabItem value="Groovy" label="Groovy">

```groovy
import io.micronaut.rabbitmq.annotation.Binding
import io.micronaut.rabbitmq.annotation.RabbitClient

@RabbitClient
interface ProductClient {

    @Binding("product") // (1)
    void send(byte[] data)

    void send(@Binding String binding, byte[] data) // (2)
}
```

  </TabItem>
  <TabItem value="Kotlin" label="Kotlin">

```kt
import io.micronaut.rabbitmq.annotation.Binding
import io.micronaut.rabbitmq.annotation.RabbitClient

@RabbitClient
interface ProductClient {

    @Binding("product") // (1)
    fun send(data: ByteArray)

    fun send(@Binding binding: String, data: ByteArray)  // (2)
}
```

  </TabItem>
</Tabs>

1. 绑定是静态的
2. 绑定必须在每次执行时设置

**生产者连接**

如果配置了多个 RabbitMQ 服务器，则可在 [@Binding](https://micronaut-projects.github.io/micronaut-rabbitmq/latest/api/io/micronaut/configuration/rabbitmq/annotation/Binding.html) 注解中设置服务器名称，以指定应使用哪个连接来发布消息。

<Tabs>
  <TabItem value="Java" label="Java" default>

```java
import io.micronaut.rabbitmq.annotation.Binding;
import io.micronaut.rabbitmq.annotation.RabbitClient;

@RabbitClient // (1)
public interface ProductClient {

    @Binding(value = "product", connection = "product-cluster") // (2)
    void send(byte[] data); // (3)
}
```

  </TabItem>
  <TabItem value="Groovy" label="Groovy">

```groovy
import io.micronaut.rabbitmq.annotation.Binding
import io.micronaut.rabbitmq.annotation.RabbitClient

@RabbitClient // (1)
interface ProductClient {

    @Binding(value = "product", connection = "product-cluster") // (2)
    void send(byte[] data) // (3)
}
```

  </TabItem>
  <TabItem value="Kotlin" label="Kotlin">

```kt
import io.micronaut.rabbitmq.annotation.Binding
import io.micronaut.rabbitmq.annotation.RabbitClient

@RabbitClient // (1)
interface ProductClient {

    @Binding(value = "product", connection = "product-cluster") // (2)
    fun send(data: ByteArray)  // (3)
}
```

  </TabItem>
</Tabs>

连接设置在绑定注解上。

:::tip 注意
连接选项也可在 [@RabbitClient](https://micronaut-projects.github.io/micronaut-rabbitmq/latest/api/io/micronaut/configuration/rabbitmq/annotation/RabbitClient.html) 注解中设置。
:::

##### 6.1.1.2 RabbitMQ 属性

<Tabs>
  <TabItem value="Java" label="Java" default>

```java
import io.micronaut.rabbitmq.annotation.Binding;
import io.micronaut.rabbitmq.annotation.RabbitClient;
import io.micronaut.rabbitmq.annotation.RabbitProperty;

@RabbitClient
@RabbitProperty(name = "appId", value = "myApp") // (1)
@RabbitProperty(name = "userId", value = "admin")
public interface ProductClient {

    @Binding("product")
    @RabbitProperty(name = "contentType", value = "application/json") // (2)
    @RabbitProperty(name = "userId", value = "guest")
    void send(byte[] data);

    @Binding("product")
    void send(@RabbitProperty("userId") String user, @RabbitProperty String contentType, byte[] data); // (3)
}
```

  </TabItem>
  <TabItem value="Groovy" label="Groovy">

```groovy
import io.micronaut.rabbitmq.annotation.Binding
import io.micronaut.rabbitmq.annotation.RabbitClient
import io.micronaut.rabbitmq.annotation.RabbitProperty

@RabbitClient
@RabbitProperty(name = "appId", value = "myApp") // (1)
interface ProductClient {

    @Binding("product")
    @RabbitProperty(name = "contentType", value = "application/json") // (2)
    @RabbitProperty(name = "userId", value = "guest")
    void send(byte[] data)

    @Binding("product")
    void send(@RabbitProperty("userId") String user, @RabbitProperty String contentType, byte[] data) // (3)
}
```

  </TabItem>
  <TabItem value="Kotlin" label="Kotlin">

```kt
import io.micronaut.rabbitmq.annotation.Binding
import io.micronaut.rabbitmq.annotation.RabbitClient
import io.micronaut.rabbitmq.annotation.RabbitProperties
import io.micronaut.rabbitmq.annotation.RabbitProperty

@RabbitClient
@RabbitProperty(name = "appId", value = "myApp") // (1)
interface ProductClient {

    @Binding("product")
    @RabbitProperties( // (2)
            RabbitProperty(name = "contentType", value = "application/json"),
            RabbitProperty(name = "userId", value = "guest")
    )
    fun send(data: ByteArray)

    @Binding("product")
    fun send(@RabbitProperty("userId") user: String, @RabbitProperty contentType: String?, data: ByteArray)  // (3)
}
```

  </TabItem>
</Tabs>

1. 属性可以在类级别定义，并适用于所有方法。如果方法中定义的属性与类中定义的属性同名，则将使用方法中的值。
2. 多个注解可用于在方法或类级别设置多个属性。
3. 每次执行都可设置属性。如果未设置注解值，名称将从参数中推断。传递给方法的值将始终被使用，即使是空值。

对于方法参数，如果未向注解提供值，参数名称将被用作属性名称。例如，`@RabbitProperty String userId` 将导致在发布之前在属性对象上设置 `userId` 属性。

:::caution 警告
如果注解或参数名称无法与属性名称匹配，则会出现异常。如果所提供的值无法转换为 [BasicProperties](https://rabbitmq.github.io/rabbitmq-java-client/api/current/com/rabbitmq/client/BasicProperties.html) 中定义的类型，则会出现异常
:::

##### 6.1.1.3 标头

可以使用应用于方法或方法参数的 [@MessageHeader](https://docs.micronaut.io/latest/api/io/micronaut/messaging/annotation/MessageHeader.html) 注解在消息上设置头信息。如果每次执行时的值都是静态的，则将注解应用于方法本身。如果每次执行都要设置值，则将注解应用于方法的参数。

<Tabs>
  <TabItem value="Java" label="Java" default>

```java
import io.micronaut.messaging.annotation.MessageHeader;
import io.micronaut.rabbitmq.annotation.Binding;
import io.micronaut.rabbitmq.annotation.RabbitClient;
import io.micronaut.rabbitmq.annotation.RabbitHeaders;

import java.util.Map;

@RabbitClient
@MessageHeader(name = "x-product-sealed", value = "true") // (1)
@MessageHeader(name = "productSize", value = "large")
public interface ProductClient {

    @Binding("product")
    @MessageHeader(name = "x-product-count", value = "10") // (2)
    @MessageHeader(name = "productSize", value = "small")
    void send(byte[] data);

    @Binding("product")
    void send(@MessageHeader String productSize, // (3)
              @MessageHeader("x-product-count") Long count,
              byte[] data);

    @Binding("product")
    void send(@RabbitHeaders Map<String, Object> headers, // (4)
              byte[] data);
}
```

  </TabItem>
  <TabItem value="Groovy" label="Groovy">

```groovy
import io.micronaut.messaging.annotation.MessageHeader
import io.micronaut.rabbitmq.annotation.Binding
import io.micronaut.rabbitmq.annotation.RabbitClient
import io.micronaut.rabbitmq.annotation.RabbitHeaders

@RabbitClient
@MessageHeader(name = "x-product-sealed", value = "true") // (1)
@MessageHeader(name = "productSize", value = "large")
interface ProductClient {

    @Binding("product")
    @MessageHeader(name = "x-product-count", value = "10") // (2)
    @MessageHeader(name = "productSize", value = "small")
    void send(byte[] data)

    @Binding("product")
    void send(@MessageHeader String productSize, // (3)
              @MessageHeader("x-product-count") Long count,
              byte[] data)

    @Binding("product")
    void send(@RabbitHeaders Map<String, Object> headers, // (4)
              byte[] data)
}
```

  </TabItem>
  <TabItem value="Kotlin" label="Kotlin">

```kt
import io.micronaut.messaging.annotation.MessageHeader
import io.micronaut.messaging.annotation.MessageHeaders
import io.micronaut.rabbitmq.annotation.Binding
import io.micronaut.rabbitmq.annotation.RabbitClient
import io.micronaut.rabbitmq.annotation.RabbitHeaders

@RabbitClient
@MessageHeaders(
    MessageHeader(name = "x-product-sealed", value = "true"), // (1)
    MessageHeader(name = "productSize", value = "large")
)
interface ProductClient {

    @Binding("product")
    @MessageHeaders(
        MessageHeader(name = "x-product-count", value = "10"), // (2)
        MessageHeader(name = "productSize", value = "small")
    )
    fun send(data: ByteArray)

    @Binding("product")
    fun send(@MessageHeader productSize: String?, // (3)
             @MessageHeader("x-product-count") count: Long,
             data: ByteArray)

    @Binding("product")
    fun send(@RabbitHeaders headers: Map<String, Any>, // (4)
             data: ByteArray)
}
```

  </TabItem>
</Tabs>

1. 标头可以在类级别定义，并适用于所有方法。如果方法中定义的标头与类中定义的标头名称相同，则将使用方法中的值。
2. 多个注解可用于在方法或类级别设置多个标头。
3. 每次执行都可以设置标头。如果未设置注解值，名称将从参数中推断。传递给方法的值将始终被使用，即使为空。
4. 使用 [@RabbitHeaders](https://micronaut-projects.github.io/micronaut-rabbitmq/latest/api/io/micronaut/rabbitmq/annotation/RabbitHeaders.html) 注解的 `Map<String, Object>` 参数可用于传递头信息的映射表。

##### 6.1.1.4 消息体

到目前为止，大多数示例都使用 `byte[]` 作为正文类型，以简化操作。本库默认支持大多数标准 Java 类型和 JSON 序列化（使用 Jackson）。功能具有可扩展性，可以添加对其他类型和序列化策略的支持。有关更多信息，参阅[消息序列化/反序列化](#10-报文序列化反序列化serdes)一节。

#### 6.1.2 代理确认

客户端方法支持两种返回类型，即 `void` 和响应类型。如果方法返回 `void`，则消息将被发布，方法将不经确认返回。如果返回类型是响应类型，则将返回一个可订阅的"冷"发布器。

由于该发布者是冷发布者，因此在订阅流之前，消息不会被实际发布。

例如：

<Tabs>
  <TabItem value="Java" label="Java" default>

```java
import io.micronaut.rabbitmq.annotation.Binding;
import io.micronaut.rabbitmq.annotation.RabbitClient;
import org.reactivestreams.Publisher;

import java.util.concurrent.CompletableFuture;

@RabbitClient
public interface ProductClient {

    @Binding("product")
    Publisher<Void> sendPublisher(byte[] data); // (1)

    @Binding("product")
    CompletableFuture<Void> sendFuture(byte[] data); // (2)
}
```

  </TabItem>
  <TabItem value="Groovy" label="Groovy">

```groovy
import io.micronaut.rabbitmq.annotation.Binding
import io.micronaut.rabbitmq.annotation.RabbitClient
import org.reactivestreams.Publisher

import java.util.concurrent.CompletableFuture

@RabbitClient
interface ProductClient {

    @Binding("product")
    Publisher<Void> sendPublisher(byte[] data) // (1)

    @Binding("product")
    CompletableFuture<Void> sendFuture(byte[] data) // (2)
}
```

  </TabItem>
  <TabItem value="Kotlin" label="Kotlin">

```kt
import io.micronaut.rabbitmq.annotation.Binding
import io.micronaut.rabbitmq.annotation.RabbitClient
import org.reactivestreams.Publisher
import java.util.concurrent.CompletableFuture


@RabbitClient
interface ProductClient {

    @Binding("product")
    fun sendPublisher(data: ByteArray): Publisher<Void>  // (1)

    @Binding("product")
    fun sendFuture(data: ByteArray): CompletableFuture<Void>  // (2)

    @Binding("product")
    suspend fun sendSuspend(data: ByteArray) //suspend methods work too!
}
```

  </TabItem>
</Tabs>

1. 可以返回 `Publisher`。如果存在所需的相关依赖关，也可以返回任何其他响应流实现类型。
2. 也可返回 Java futures

:::tip 注意
不支持 RxJava 1。发布者确认将在 IO 线程池上执行。
:::

## 7. RabbitMQ 消费者

快速入门中的示例展示了一个使用 [@RabbitListener](https://micronaut-projects.github.io/micronaut-rabbitmq/latest/api/io/micronaut/configuration/rabbitmq/annotation/RabbitListener.html) 注解监听消息的类的微不足道的定义。

然而，支持 `@RabbitListener`（由 [RabbitMQConsumerAdvice](https://micronaut-projects.github.io/micronaut-rabbitmq/latest/api/io/micronaut/configuration/rabbitmq/intercept/RabbitMQConsumerAdvice.html) 类定义）的实现非常灵活，并为定义 RabbitMQ 消费者提供了一系列选项。

### 7.1 定义 @RabbitListener 方法

所有从 RabbitMQ 消费消息的方法必须满足以下条件：
- 该方法必须位于注解了 [@RabbitListener](https://micronaut-projects.github.io/micronaut-rabbitmq/latest/api/io/micronaut/configuration/rabbitmq/annotation/RabbitListener.html) 的类中。
- 方法必须使用 [@Queue](https://micronaut-projects.github.io/micronaut-rabbitmq/latest/api/io/micronaut/configuration/rabbitmq/annotation/Queue.html) 进行注解。

:::tip 注意
为了使所有功能都能按照本指南中的设计运行，你的类在编译时必须将参数标志设置为 `true`。如果你的应用程序是使用 Micronaut CLI 创建的，那么它已经为你配置好了。
:::

#### 7.1.1 消费者参数

[basicConsume](https://rabbitmq.github.io/rabbitmq-java-client/api/current/com/rabbitmq/client/Channel.html#basicConsume(java.lang.String,boolean,java.lang.String,boolean,boolean,java.util.Map,com.rabbitmq.client.Consumer)) 方法用于 [RabbitMQConsumerAdvice](https://micronaut-projects.github.io/micronaut-rabbitmq/latest/api/io/micronaut/configuration/rabbitmq/intercept/RabbitMQConsumerAdvice.html) 消费消息。某些选项可通过注解直接配置。

:::caution 警告
要调用消费者方法，必须满足所有参数。为允许以空值执行方法，**必须**将参数声明为 nullable。如果参数无法满足要求，信息将被拒绝。
:::

##### 7.1.1.1 Queue

要使方法成为 RabbitMQ 消息的消费者，需要使用 [@Queue](https://micronaut-projects.github.io/micronaut-rabbitmq/latest/api/io/micronaut/configuration/rabbitmq/annotation/Queue.html) 注解。只需将注解应用到方法并提供你要监听的队列名称即可。

:::caution 警告
队列（Queue）必须已经存在，才能监听其中的消息。
:::

<Tabs>
  <TabItem value="Java" label="Java" default>

```java
import io.micronaut.rabbitmq.annotation.Queue;
import io.micronaut.rabbitmq.annotation.RabbitListener;

import java.util.ArrayList;
import java.util.Collections;
import java.util.List;

@RabbitListener
public class ProductListener {

    List<Integer> messageLengths = Collections.synchronizedList(new ArrayList<>());

    @Queue("product") // (1)
    public void receive(byte[] data) {
        messageLengths.add(data.length);
    }
}
```

  </TabItem>
  <TabItem value="Groovy" label="Groovy">

```groovy
import io.micronaut.rabbitmq.annotation.Queue
import io.micronaut.rabbitmq.annotation.RabbitListener

import java.util.concurrent.CopyOnWriteArrayList

@RabbitListener
class ProductListener {

    CopyOnWriteArrayList<Integer> messageLengths = []

    @Queue("product") // (1)
    void receive(byte[] data) {
        messageLengths << data.length
    }
}
```

  </TabItem>
  <TabItem value="Kotlin" label="Kotlin">

```kt
import io.micronaut.rabbitmq.annotation.Queue
import io.micronaut.rabbitmq.annotation.RabbitListener
import java.util.Collections

@RabbitListener
class ProductListener {

    val messageLengths: MutableList<Int> = Collections.synchronizedList(ArrayList())

    @Queue("product") // (1)
    fun receive(data: ByteArray) {
        messageLengths.add(data.size)
    }
}
```

  </TabItem>
</Tabs>

1. 队列注解是为每个方法设置的。在同一个类中，可以用不同的队列定义多个方法。

**其他选项**

如果已配置多个 RabbitMQ 服务器，则可在 [@Queue](https://micronaut-projects.github.io/micronaut-rabbitmq/latest/api/io/micronaut/configuration/rabbitmq/annotation/Queue.html) 注解中设置服务器名称，以指定应使用哪个连接来监听消息。


<Tabs>
  <TabItem value="Java" label="Java" default>

```java
import io.micronaut.rabbitmq.annotation.Queue;
import io.micronaut.rabbitmq.annotation.RabbitListener;

import java.util.ArrayList;
import java.util.Collections;
import java.util.List;

@RabbitListener
public class ProductListener {

    List<String> messageLengths = Collections.synchronizedList(new ArrayList<>());

    @Queue(value = "product", connection = "product-cluster") // (1)
    public void receive(byte[] data) {
        messageLengths.add(new String(data));
        System.out.println("Java received " + data.length + " bytes from RabbitMQ");
    }
}
```

  </TabItem>
  <TabItem value="Groovy" label="Groovy">

```groovy
import io.micronaut.rabbitmq.annotation.Queue
import io.micronaut.rabbitmq.annotation.RabbitListener

@RabbitListener
class ProductListener {

    List<String> messageLengths = Collections.synchronizedList([])

    @Queue(value = "product", connection = "product-cluster") // (1)
    void receive(byte[] data) {
        messageLengths << new String(data)
    }
}
```

  </TabItem>
  <TabItem value="Kotlin" label="Kotlin">

```kt
import io.micronaut.rabbitmq.annotation.Queue
import io.micronaut.rabbitmq.annotation.RabbitListener
import java.util.Collections

@RabbitListener
class ProductListener {

    internal var messageLengths: MutableList<String> = Collections.synchronizedList(ArrayList())

    @Queue(value = "product", connection = "product-cluster") // (1)
    fun receive(data: ByteArray) {
        messageLengths.add(String(data))
        println("Java received " + data.size + " bytes from RabbitMQ")
    }
}
```

  </TabItem>
</Tabs>


1. 连接设置在队列注解上。

:::tip 注意
`connection` 选项也可在 [@RabbitListener](https://micronaut-projects.github.io/micronaut-rabbitmq/latest/api/io/micronaut/configuration/rabbitmq/annotation/RabbitListener.html) 注解中设置。
:::

默认情况下，所有消费者都在同一个"消费者线程池上执行。如果出于某种原因需要在不同的线程池上执行一个或多个消费者，可以在 [@Queue](https://micronaut-projects.github.io/micronaut-rabbitmq/latest/api/io/micronaut/configuration/rabbitmq/annotation/Queue.html) 注解中指定。


<Tabs>
  <TabItem value="Java" label="Java" default>

```java
import io.micronaut.rabbitmq.annotation.Queue;
import io.micronaut.rabbitmq.annotation.RabbitListener;

import java.util.ArrayList;
import java.util.Collections;
import java.util.List;

@RabbitListener
public class ProductListener {

    List<String> messageLengths = Collections.synchronizedList(new ArrayList<>());

    @Queue(value = "product", executor = "product-listener") // (1)
    public void receive(byte[] data) {
        messageLengths.add(new String(data));
        System.out.println("Java received " + data.length + " bytes from RabbitMQ");
    }
}
```

  </TabItem>
  <TabItem value="Groovy" label="Groovy">

```groovy
import io.micronaut.rabbitmq.annotation.Queue
import io.micronaut.rabbitmq.annotation.RabbitListener

import java.util.concurrent.CopyOnWriteArrayList

@RabbitListener
class ProductListener {

    CopyOnWriteArrayList<String> messageLengths = []

    @Queue(value = "product", executor = "product-listener") // (1)
    void receive(byte[] data) {
        messageLengths << new String(data)
    }
}
```

  </TabItem>
  <TabItem value="Kotlin" label="Kotlin">

```kt
import io.micronaut.rabbitmq.annotation.Queue
import io.micronaut.rabbitmq.annotation.RabbitListener
import java.util.Collections

@RabbitListener
class ProductListener {

    internal var messageLengths: MutableList<String> = Collections.synchronizedList(ArrayList())

    @Queue(value = "product", executor = "product-listener") // (1)
    fun receive(data: ByteArray) {
        messageLengths.add(String(data))
        println("Kotlin received " + data.size + " bytes from RabbitMQ")
    }
}
```

  </TabItem>
</Tabs>

1. 执行器设置在队列注解上。

Micronaut 会寻找一个 [ExecutorService](https://docs.oracle.com/en/java/javase/17/docs/api/java.base/java/util/concurrent/ExecutorService.html) Bean，其命名限定符与注解中设置的名称相匹配。该 bean 可以手动提供，也可以通过 ExecutorConfiguration 的配置自动创建。

例如：

*配置 `product-listener` 线程池*

```yaml
micronaut:
    executors:
        product-listener:
            type: fixed
            nThreads: 25
```

:::tip 注意
由于 RabbitMQ Java 客户端的工作方式，所有消费者的初始回调仍是连接中配置的线程池（默认为"消费者"），但工作会立即转移到请求的线程池。`executor` 选项也可在 [@RabbitListener](https://micronaut-projects.github.io/micronaut-rabbitmq/latest/api/io/micronaut/configuration/rabbitmq/annotation/RabbitListener.html) 注解中设置。
:::

:::note 提示
[@Queue](https://micronaut-projects.github.io/micronaut-rabbitmq/latest/api/io/micronaut/configuration/rabbitmq/annotation/Queue.html) 注解支持消费报文的其他选项，包括将消费者声明为排他性、是否重新排队被拒绝的报文或设置未确认报文的限制等。
:::

##### 7.1.1.2 属性

传递给 [basicConsume](https://rabbitmq.github.io/rabbitmq-java-client/api/current/com/rabbitmq/client/Channel.html#basicConsume(java.lang.String,boolean,java.lang.String,boolean,boolean,java.util.Map,com.rabbitmq.client.Consumer)) 的参数可通过 [@RabbitProperty](https://micronaut-projects.github.io/micronaut-rabbitmq/latest/api/io/micronaut/configuration/rabbitmq/annotation/RabbitProperty.html) 注解进行配置。

此外，任何方法参数都可以通过注解绑定到与消息一起接收的 [BasicProperties](https://rabbitmq.github.io/rabbitmq-java-client/api/current/com/rabbitmq/client/BasicProperties.html) 中的属性。


<Tabs>
  <TabItem value="Java" label="Java" default>

```java
import io.micronaut.core.annotation.Nullable;
import io.micronaut.rabbitmq.annotation.Queue;
import io.micronaut.rabbitmq.annotation.RabbitListener;
import io.micronaut.rabbitmq.annotation.RabbitProperty;

import java.util.ArrayList;
import java.util.Collections;
import java.util.List;

@RabbitListener
public class ProductListener {

    List<String> messageProperties = Collections.synchronizedList(new ArrayList<>());

    @Queue("product")
    @RabbitProperty(name = "x-priority", value = "10", type = Integer.class) // (1)
    public void receive(byte[] data,
                        @RabbitProperty("userId") String user,  // (2)
                        @Nullable @RabbitProperty String contentType,  // (3)
                        String appId) {  // (4)
        messageProperties.add(user + "|" + contentType + "|" + appId);
    }
}
```

  </TabItem>
  <TabItem value="Groovy" label="Groovy">

```groovy
import io.micronaut.core.annotation.Nullable
import io.micronaut.rabbitmq.annotation.Queue
import io.micronaut.rabbitmq.annotation.RabbitListener
import io.micronaut.rabbitmq.annotation.RabbitProperty

import java.util.concurrent.CopyOnWriteArrayList

@RabbitListener
class ProductListener {

    CopyOnWriteArrayList<String> messageProperties = []

    @Queue("product")
    @RabbitProperty(name = "x-priority", value = "10", type = Integer) // (1)
    void receive(byte[] data,
                 @RabbitProperty("userId") String user, // (2)
                 @Nullable @RabbitProperty String contentType, // (3)
                 String appId) { // (4)
        messageProperties << user + "|" + contentType + "|" + appId
    }
}
```

  </TabItem>
  <TabItem value="Kotlin" label="Kotlin">

```kt
import io.micronaut.rabbitmq.annotation.Queue
import io.micronaut.rabbitmq.annotation.RabbitListener
import io.micronaut.rabbitmq.annotation.RabbitProperty
import java.util.Collections

@RabbitListener
class ProductListener {

    val messageProperties: MutableList<String> = Collections.synchronizedList(ArrayList())

    @Queue("product")
    @RabbitProperty(name = "x-priority", value = "10", type = Integer::class) // (1)
    fun receive(data: ByteArray,
                @RabbitProperty("userId") user: String, // (2)
                @RabbitProperty contentType: String?, // (3)
                appId: String) { // (4)
        messageProperties.add("$user|$contentType|$appId")
    }
}
```

  </TabItem>
</Tabs>

1. 该属性将作为参数发送给 Java 客户端消费方法。也可在类级别上定义属性，以应用于类中的所有消费者。请注意，如果 RabbitMQ 期望的不是字符串，则此处需要类型。
2. 参数由 `userId` 属性绑定。
3. 从参数名称推断出要绑定的属性名称。此参数允许空值。
4. 如果参数名称与定义的属性名称之一匹配，则将从该属性绑定参数。

:::caution 警告
如果注解或参数名无法与属性名匹配，则会出现异常。如果所提供的类型无法从 [BasicProperties](https://rabbitmq.github.io/rabbitmq-java-client/api/current/com/rabbitmq/client/BasicProperties.html) 中定义的类型转换，则会抛出异常。
:::

##### 7.1.1.3 Headers

可以通过对方法参数应用 [@MessageHeader](https://docs.micronaut.io/latest/api/io/micronaut/messaging/annotation/MessageHeader.html) 注解来检索头。


<Tabs>
  <TabItem value="Java" label="Java" default>

```java
import io.micronaut.core.annotation.Nullable;
import io.micronaut.messaging.annotation.MessageHeader;
import io.micronaut.rabbitmq.annotation.Queue;
import io.micronaut.rabbitmq.annotation.RabbitHeaders;
import io.micronaut.rabbitmq.annotation.RabbitListener;

import java.util.ArrayList;
import java.util.Collections;
import java.util.List;
import java.util.Map;

@RabbitListener
public class ProductListener {

    List<String> messageProperties = Collections.synchronizedList(new ArrayList<>());

    @Queue("product")
    public void receive(byte[] data,
                        @MessageHeader("x-product-sealed") Boolean sealed, // (1)
                        @MessageHeader("x-product-count") Long count, // (2)
                        @Nullable @MessageHeader String productSize) { // (3)
        messageProperties.add(sealed + "|" + count + "|" + productSize);
    }

    @Queue("product")
    public void receive(byte[] data,
                        @RabbitHeaders Map<String, Object> headers) { // (4)
        Object productSize = headers.get("productSize");
        messageProperties.add(
                headers.get("x-product-sealed").toString() + "|" +
                headers.get("x-product-count").toString() + "|" +
                (productSize != null ? productSize.toString() : null));
    }
}
```

  </TabItem>
  <TabItem value="Groovy" label="Groovy">

```groovy
import io.micronaut.core.annotation.Nullable
import io.micronaut.messaging.annotation.MessageHeader
import io.micronaut.rabbitmq.annotation.Queue
import io.micronaut.rabbitmq.annotation.RabbitHeaders
import io.micronaut.rabbitmq.annotation.RabbitListener

import java.util.concurrent.CopyOnWriteArrayList

@RabbitListener
class ProductListener {

    CopyOnWriteArrayList<String> messageProperties = []

    @Queue("product")
    void receive(byte[] data,
                 @MessageHeader("x-product-sealed") Boolean productSealed, // (1)
                 @MessageHeader("x-product-count") Long count, // (2)
                 @Nullable @MessageHeader String productSize) { // (3)
        messageProperties << productSealed.toString() + "|" + count + "|" + productSize
    }

    @Queue("product")
    void receive(byte[] data,
                 @RabbitHeaders Map<String, Object> headers) { // (4)
        messageProperties <<
                headers["x-product-sealed"].toString() + "|" +
                headers["x-product-count"] + "|" +
                headers["productSize"]?.toString()
    }
}
```

  </TabItem>
  <TabItem value="Kotlin" label="Kotlin">

```kt
import io.micronaut.messaging.annotation.MessageHeader
import io.micronaut.rabbitmq.annotation.Queue
import io.micronaut.rabbitmq.annotation.RabbitHeaders
import io.micronaut.rabbitmq.annotation.RabbitListener
import java.util.Collections

@RabbitListener
class ProductListener {

    var messageProperties: MutableList<String> = Collections.synchronizedList(ArrayList())

    @Queue("product")
    fun receive(data: ByteArray,
                @MessageHeader("x-product-sealed") sealed: Boolean, // (1)
                @MessageHeader("x-product-count") count: Long, // (2)
                @MessageHeader productSize: String?) { // (3)
        messageProperties.add(sealed.toString() + "|" + count + "|" + productSize)
    }

    @Queue("product")
    fun receive(data: ByteArray,
                @RabbitHeaders headers: Map<String, Any>) { // (4)
        messageProperties.add(
            headers["x-product-sealed"].toString() + "|" +
            headers["x-product-count"].toString() + "|" +
            headers["productSize"]?.toString()
        )
    }
}
```

  </TabItem>
</Tabs>

1. 标头名称来自注解，而值则会被检索并转换为布尔值。
2. 标头名称来自注解，数值被提取并转换为长字符。
3. 标头名称来自参数名称。该参数允许空值。
4. 所有标头都可以用 [@RabbitHeaders](https://micronaut-projects.github.io/micronaut-rabbitmq/latest/api/io/micronaut/rabbitmq/annotation/RabbitHeaders.html) 绑定到一个 `Map` 参数。

##### 7.1.1.4 RabbitMQ 类型

参数也可根据其类型进行绑定。默认支持几种类型，每种类型都有相应的 [RabbitTypeArgumentBinder](https://micronaut-projects.github.io/micronaut-rabbitmq/latest/api/io/micronaut/configuration/rabbitmq/bind/RabbitTypeArgumentBinder.html)。参数绑定器将在[自定义参数绑定](#7116-自定义参数绑定)一节中详细介绍。

只有两种类型支持检索有关消息的数据。它们是 [Envelope](https://rabbitmq.github.io/rabbitmq-java-client/api/current/com/rabbitmq/client/Envelope.html) 和 [BasicProperties](https://rabbitmq.github.io/rabbitmq-java-client/api/current/com/rabbitmq/client/BasicProperties.html)。

<Tabs>
  <TabItem value="Java" label="Java" default>

```java
import com.rabbitmq.client.BasicProperties;
import com.rabbitmq.client.Channel;
import com.rabbitmq.client.Envelope;
import io.micronaut.rabbitmq.annotation.Queue;
import io.micronaut.rabbitmq.annotation.RabbitListener;

import java.util.ArrayList;
import java.util.Collections;
import java.util.List;

@RabbitListener
public class ProductListener {

    List<String> messages = Collections.synchronizedList(new ArrayList<>());

    @Queue("product")
    public void receive(byte[] data,
                        Envelope envelope, // (1)
                        BasicProperties basicProperties, // (2)
                        Channel channel) { // (3)
        messages.add(String.format("exchange: [%s], routingKey: [%s], contentType: [%s]",
                envelope.getExchange(), envelope.getRoutingKey(), basicProperties.getContentType()));
    }
}
```

  </TabItem>
  <TabItem value="Groovy" label="Groovy">

```groovy
import com.rabbitmq.client.BasicProperties
import com.rabbitmq.client.Channel
import com.rabbitmq.client.Envelope
import io.micronaut.rabbitmq.annotation.Queue
import io.micronaut.rabbitmq.annotation.RabbitListener

import java.util.concurrent.CopyOnWriteArrayList

@RabbitListener
class ProductListener {

    CopyOnWriteArrayList<String> messages = []

    @Queue("product")
    void receive(byte[] data,
                 Envelope envelope, // (1)
                 BasicProperties basicProperties, // (2)
                 Channel channel) { // (3)
        messages << "exchange: [$envelope.exchange], routingKey: [$envelope.routingKey], contentType: [$basicProperties.contentType]".toString()
    }
}
```

  </TabItem>
  <TabItem value="Kotlin" label="Kotlin">

```kt
import com.rabbitmq.client.BasicProperties
import com.rabbitmq.client.Channel
import com.rabbitmq.client.Envelope
import io.micronaut.rabbitmq.annotation.Queue
import io.micronaut.rabbitmq.annotation.RabbitListener
import java.util.Collections

@RabbitListener
class ProductListener {

    val messages: MutableList<String> = Collections.synchronizedList(ArrayList())

    @Queue("product")
    fun receive(data: ByteArray,
                envelope: Envelope, // (1)
                basicProperties: BasicProperties, // (2)
                channel: Channel) { // (3)
        messages.add("exchange: [${envelope.exchange}], routingKey: [${envelope.routingKey}], contentType: [${basicProperties.contentType}]")
    }
}
```

  </TabItem>
</Tabs>

1. 参数由 [Envelope](https://rabbitmq.github.io/rabbitmq-java-client/api/current/com/rabbitmq/client/Envelope.html) 绑定
2. 参数由 [BasicProperties](https://rabbitmq.github.io/rabbitmq-java-client/api/current/com/rabbitmq/client/BasicProperties.html) 绑定

##### 7.1.1.5 消息体

到目前为止，为了简单起见，大多数示例都使用 `byte[]` 作为主体类型。该库默认支持大多数标准 Java 类型和 JSON 反序列化（使用 Jackson）。功能具有可扩展性，可以添加对其他类型和反序列化策略的支持。更多信息，参阅[消息序列化/反序列化](#10-报文序列化反序列化serdes)部分。

##### 7.1.1.6 自定义参数绑定

**默认绑定功能**

消费者参数绑定通过 [ArgumentBinderRegistry](https://docs.micronaut.io/latest/api/io/micronaut/core/bind/ArgumentBinderRegistry.html) 实现，该 ArgumentBinderRegistry 专门用于从 RabbitMQ 消息绑定消费者。负责该功能的类是 [RabbitBinderRegistry](https://micronaut-projects.github.io/micronaut-rabbitmq/latest/api/io/micronaut/configuration/rabbitmq/bind/RabbitBinderRegistry.html)。

注册表支持根据应用于参数或参数类型的注解使用的参数绑定器。所有参数绑定器都必须实现 [RabbitAnnotatedArgumentBinder](https://micronaut-projects.github.io/micronaut-rabbitmq/latest/api/io/micronaut/configuration/rabbitmq/bind/RabbitAnnotatedArgumentBinder.html) 或 [RabbitTypeArgumentBinder](https://micronaut-projects.github.io/micronaut-rabbitmq/latest/api/io/micronaut/configuration/rabbitmq/bind/RabbitTypeArgumentBinder.html)。[RabbitDefaultBinder](https://micronaut-projects.github.io/micronaut-rabbitmq/latest/api/io/micronaut/configuration/rabbitmq/bind/RabbitDefaultBinder.html) 是一个例外，当没有其他绑定器支持给定参数时，就会使用该绑定器。

当一个参数需要绑定时，[RabbitConsumerState](https://micronaut-projects.github.io/micronaut-rabbitmq/latest/api/io/micronaut/configuration/rabbitmq/bind/RabbitConsumerState.html) 将被用作所有可用数据的来源。绑定器注册表会遵循一连串的小步骤来尝试找到支持该参数的绑定器。

1. 搜索基于注解的绑定器，以查找与参数上任何使用 [@Bindable](https://docs.micronaut.io/latest/api/io/micronaut/core/bind/annotation/Bindable.html) 注解的注解相匹配的绑定器。
2. 在基于类型的绑定器中搜索与参数类型匹配或属于参数类型子类的绑定器。
3. 返回默认绑定器。

默认绑定器会检查参数名称是否与某个 [BasicProperties](https://rabbitmq.github.io/rabbitmq-java-client/api/current/com/rabbitmq/client/BasicProperties.html) 匹配。如果名称不匹配，则将信息正文绑定到参数。

**自定义绑定**

要注入自己的参数绑定行为，就像注册一个 Bean 一样简单。现有的绑定注册表将注入该行为，并将其纳入正常处理过程。

**注解绑定**

可以创建自定义注解来绑定消费者参数。然后可以创建一个自定义绑定器来使用该注解和 [RabbitConsumerState](https://micronaut-projects.github.io/micronaut-rabbitmq/latest/api/io/micronaut/configuration/rabbitmq/bind/RabbitConsumerState.html) 为参数提供值。事实上，该值可以来自任何地方，但在本文档中，将使用 envelope 中的发送标记。


<Tabs>
  <TabItem value="Java" label="Java" default>

```java
import io.micronaut.core.bind.annotation.Bindable;

import java.lang.annotation.Documented;
import java.lang.annotation.ElementType;
import java.lang.annotation.Retention;
import java.lang.annotation.RetentionPolicy;
import java.lang.annotation.Target;

@Documented
@Retention(RetentionPolicy.RUNTIME)
@Target({ElementType.PARAMETER})
@Bindable // (1)
public @interface DeliveryTag {
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
@interface DeliveryTag {
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
annotation class DeliveryTag
```

  </TabItem>
</Tabs>

1. 必须使用 [@Bindable](https://docs.micronaut.io/latest/api/io/micronaut/core/bind/annotation/Bindable.html) 注解，注解才会被考虑进行绑定。

<Tabs>
  <TabItem value="Java" label="Java" default>

```java
import io.micronaut.core.convert.ArgumentConversionContext;
import io.micronaut.core.convert.ConversionService;
import io.micronaut.rabbitmq.bind.RabbitAnnotatedArgumentBinder;
import io.micronaut.rabbitmq.bind.RabbitConsumerState;
import jakarta.inject.Singleton;

@Singleton // (1)
public class DeliveryTagAnnotationBinder implements RabbitAnnotatedArgumentBinder<DeliveryTag> { // (2)

    private final ConversionService conversionService;

    public DeliveryTagAnnotationBinder(ConversionService conversionService) { // (3)
        this.conversionService = conversionService;
    }

    @Override
    public Class<DeliveryTag> getAnnotationType() {
        return DeliveryTag.class;
    }

    @Override
    public BindingResult<Object> bind(ArgumentConversionContext<Object> context, RabbitConsumerState source) {
        Long deliveryTag = source.getEnvelope().getDeliveryTag(); // (4)
        return () -> conversionService.convert(deliveryTag, context); // (5)
    }
}
```

  </TabItem>
  <TabItem value="Groovy" label="Groovy">

```groovy
import io.micronaut.core.convert.ArgumentConversionContext
import io.micronaut.core.convert.ConversionService
import io.micronaut.rabbitmq.bind.RabbitAnnotatedArgumentBinder
import io.micronaut.rabbitmq.bind.RabbitConsumerState
import jakarta.inject.Singleton

@Singleton // (1)
class DeliveryTagAnnotationBinder implements RabbitAnnotatedArgumentBinder<DeliveryTag> { // (2)

    private final ConversionService conversionService

    DeliveryTagAnnotationBinder(ConversionService conversionService) { // (3)
        this.conversionService = conversionService
    }

    @Override
    Class<DeliveryTag> getAnnotationType() {
        DeliveryTag
    }

    @Override
    BindingResult<Object> bind(ArgumentConversionContext<Object> context, RabbitConsumerState source) {
        long deliveryTag = source.envelope.deliveryTag // (4)
        return { -> conversionService.convert(deliveryTag, context) } // (5)
    }
}
```

  </TabItem>
  <TabItem value="Kotlin" label="Kotlin">

```kt
import io.micronaut.core.bind.ArgumentBinder
import io.micronaut.core.convert.ArgumentConversionContext
import io.micronaut.core.convert.ConversionService
import io.micronaut.rabbitmq.bind.RabbitAnnotatedArgumentBinder
import io.micronaut.rabbitmq.bind.RabbitConsumerState
import jakarta.inject.Singleton

@Singleton // (1)
class DeliveryTagAnnotationBinder(private val conversionService: ConversionService)// (3)
    : RabbitAnnotatedArgumentBinder<DeliveryTag> { // (2)

    override fun getAnnotationType(): Class<DeliveryTag> {
        return DeliveryTag::class.java
    }

    override fun bind(context: ArgumentConversionContext<Any>, source: RabbitConsumerState): ArgumentBinder.BindingResult<Any> {
        val deliveryTag = source.envelope.deliveryTag // (4)
        return ArgumentBinder.BindingResult { conversionService.convert(deliveryTag, context) } // (5)
    }
}
```

  </TabItem>
</Tabs>

1. 通过使用 `@Singleton` 进行注解，该类就变成了一个 Bean。
2. 自定义注解被用作接口的通用类型。
3. 将转换服务注入实例。
4. 从消息状态中获取传送标记。
5. 将标签转换为参数类型。例如，即使发送标记是 `Long`，参数也可以是 `String`。

现在可以在消费者方法中的参数上使用注解。

<Tabs>
  <TabItem value="Java" label="Java" default>

```java
import io.micronaut.rabbitmq.annotation.Queue;
import io.micronaut.rabbitmq.annotation.RabbitListener;

import java.util.Collections;
import java.util.HashSet;
import java.util.Set;

@RabbitListener
public class ProductListener {

    Set<Long> messages = Collections.synchronizedSet(new HashSet<>());

    @Queue("product")
    public void receive(byte[] data, @DeliveryTag Long tag) { // (1)
        messages.add(tag);
    }
}
```

  </TabItem>
  <TabItem value="Groovy" label="Groovy">

```groovy
import io.micronaut.rabbitmq.annotation.Queue
import io.micronaut.rabbitmq.annotation.RabbitListener

import java.util.concurrent.CopyOnWriteArraySet

@RabbitListener
class ProductListener {

    CopyOnWriteArraySet<Long> messages = []

    @Queue("product")
    void receive(byte[] data, @DeliveryTag Long tag) { // (1)
        messages << tag
    }
}
```

  </TabItem>
  <TabItem value="Kotlin" label="Kotlin">

```kt
import io.micronaut.rabbitmq.annotation.Queue
import io.micronaut.rabbitmq.annotation.RabbitListener
import java.util.Collections

@RabbitListener
class ProductListener {

    val messages: MutableSet<Long> = Collections.synchronizedSet(HashSet())

    @Queue("product")
    fun receive(data: ByteArray, @DeliveryTag tag: Long) { // (1)
        messages.add(tag)
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
import io.micronaut.core.annotation.NonNull
import io.micronaut.core.annotation.Nullable

class ProductInfo {

    private String size
    private Long count
    private Boolean productSealed

    ProductInfo(@Nullable String size, // (1)
                @NonNull Long count, // (2)
                @NonNull Boolean productSealed) { // (3)
        this.size = size
        this.count = count
        this.productSealed = productSealed
    }

    String getSize() {
        size
    }

    Long getCount() {
        count
    }

    Boolean getSealed() {
        productSealed
    }
}
```

  </TabItem>
  <TabItem value="Kotlin" label="Kotlin">

```kt
class ProductInfo(val size: String?, // (1)
                  val count: Long, // (2)
                  val sealed: Boolean)// (3)
```

  </TabItem>
</Tabs>

1. `size` 参数非必需
2. `count` 参数必需
3. `sealed` 参数必需

然后就可以创建一个类型参数绑定器来创建 `ProductInfo` 实例，以便与消费者方法参数绑定。

<Tabs>
  <TabItem value="Java" label="Java" default>

```java
import io.micronaut.core.convert.ArgumentConversionContext;
import io.micronaut.core.convert.ConversionError;
import io.micronaut.core.convert.ConversionService;
import io.micronaut.core.type.Argument;
import io.micronaut.rabbitmq.bind.RabbitConsumerState;
import io.micronaut.rabbitmq.bind.RabbitHeaderConvertibleValues;
import io.micronaut.rabbitmq.bind.RabbitTypeArgumentBinder;
import jakarta.inject.Singleton;

import java.util.List;
import java.util.Map;
import java.util.Optional;

@Singleton // (1)
public class ProductInfoTypeBinder implements RabbitTypeArgumentBinder<ProductInfo> { //(2)

    private final ConversionService conversionService;

    ProductInfoTypeBinder(ConversionService conversionService) { //(3)
        this.conversionService = conversionService;
    }

    @Override
    public Argument<ProductInfo> argumentType() {
        return Argument.of(ProductInfo.class);
    }

    @Override
    public BindingResult<ProductInfo> bind(ArgumentConversionContext<ProductInfo> context, RabbitConsumerState source) {
        Map<String, Object> rawHeaders = source.getProperties().getHeaders(); //(4)

        if (rawHeaders == null) {
            return BindingResult.EMPTY;
        }

        RabbitHeaderConvertibleValues headers = new RabbitHeaderConvertibleValues(rawHeaders, conversionService);

        String size = headers.get("productSize", String.class).orElse(null);  //(5)
        Optional<Long> count = headers.get("x-product-count", Long.class); //(6)
        Optional<Boolean> sealed = headers.get("x-product-sealed", Boolean.class); // (7)

        if (headers.getConversionErrors().isEmpty() && count.isPresent() && sealed.isPresent()) {
            return () -> Optional.of(new ProductInfo(size, count.get(), sealed.get())); //(8)
        } else {
            return new BindingResult<ProductInfo>() {
                @Override
                public Optional<ProductInfo> getValue() {
                    return Optional.empty();
                }

                @Override
                public List<ConversionError> getConversionErrors() {
                    return headers.getConversionErrors(); //(9)
                }
            };
        }
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
import io.micronaut.rabbitmq.bind.RabbitConsumerState
import io.micronaut.rabbitmq.bind.RabbitHeaderConvertibleValues
import io.micronaut.rabbitmq.bind.RabbitTypeArgumentBinder
import jakarta.inject.Singleton

@Singleton // (1)
class ProductInfoTypeBinder implements RabbitTypeArgumentBinder<ProductInfo> { //(2)

    private final ConversionService conversionService

    ProductInfoTypeBinder(ConversionService conversionService) { //(3)
        this.conversionService = conversionService
    }

    @Override
    Argument<ProductInfo> argumentType() {
        return Argument.of(ProductInfo)
    }

    @Override
    BindingResult<ProductInfo> bind(ArgumentConversionContext<ProductInfo> context, RabbitConsumerState source) {
        Map<String, Object> rawHeaders = source.properties.headers //(4)

        if (rawHeaders == null) {
            return BindingResult.EMPTY
        }

        def headers = new RabbitHeaderConvertibleValues(rawHeaders, conversionService)

        String size = headers.get("productSize", String).orElse(null)  //(5)
        Optional<Long> count = headers.get("x-product-count", Long) //(6)
        Optional<Boolean> productSealed = headers.get("x-product-sealed", Boolean) // (7)

        if (headers.conversionErrors.isEmpty() && count.isPresent() && productSealed.isPresent()) {
            { -> Optional.of(new ProductInfo(size, count.get(), productSealed.get())) } //(8)
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
import io.micronaut.rabbitmq.bind.RabbitConsumerState
import io.micronaut.rabbitmq.bind.RabbitHeaderConvertibleValues
import io.micronaut.rabbitmq.bind.RabbitTypeArgumentBinder
import jakarta.inject.Singleton
import java.util.Optional

@Singleton // (1)
class ProductInfoTypeBinder constructor(private val conversionService: ConversionService) //(3)
    : RabbitTypeArgumentBinder<ProductInfo> { // (2)

    override fun argumentType(): Argument<ProductInfo> {
        return Argument.of(ProductInfo::class.java)
    }

    override fun bind(context: ArgumentConversionContext<ProductInfo>, source: RabbitConsumerState): BindingResult<ProductInfo> {
        val rawHeaders = source.properties.headers ?: return BindingResult { Optional.empty<ProductInfo>() } //(4)

        val headers = RabbitHeaderConvertibleValues(rawHeaders, conversionService)

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

#### 7.1.2 确认消息

确认、拒绝或不确认报文有三种方式。
1. 对于接受 [RabbitAcknowledgement](https://micronaut-projects.github.io/micronaut-rabbitmq/latest/api/io/micronaut/configuration/rabbitmq/bind/RabbitAcknowledgement.html) 类型参数的方法，只有在执行该类的相应方法时才会确认消息。
2. 对于返回任何其他类型，包括 `void`，的方法，如果该方法没有抛出异常，则消息将被确认。如果出现异常，则消息将被拒绝。
3. 此外，对于启用了 @Queue autoAcknowledgment 选项的方法，消息一旦送达就会被确认。

**确认类型**

<Tabs>
  <TabItem value="Java" label="Java" default>

```java
import io.micronaut.rabbitmq.annotation.Queue;
import io.micronaut.rabbitmq.annotation.RabbitListener;
import io.micronaut.rabbitmq.bind.RabbitAcknowledgement;

import java.util.concurrent.atomic.AtomicInteger;

@RabbitListener
public class ProductListener {

    AtomicInteger messageCount = new AtomicInteger();

    @Queue(value = "product") // (1)
    public void receive(byte[] data, RabbitAcknowledgement acknowledgement) { // (2)
        int count = messageCount.getAndUpdate((intValue) -> ++intValue);
        if (count  == 0) {
            acknowledgement.nack(false, true); // (3)
        } else if (count > 3) {
            acknowledgement.ack(true); // (4)
        }
    }
}
```

  </TabItem>
  <TabItem value="Groovy" label="Groovy">

```groovy
import io.micronaut.rabbitmq.annotation.Queue
import io.micronaut.rabbitmq.annotation.RabbitListener
import io.micronaut.rabbitmq.bind.RabbitAcknowledgement

import java.util.concurrent.atomic.AtomicInteger

@RabbitListener
class ProductListener {

    AtomicInteger messageCount = new AtomicInteger()

    @Queue(value = "product") // (1)
    void receive(byte[] data, RabbitAcknowledgement acknowledgement) { // (2)
        int count = messageCount.getAndUpdate({ intValue -> ++intValue })
        println new String(data)
        if (count  == 0) {
            acknowledgement.nack(false, true) // (3)
        } else if (count > 3) {
            acknowledgement.ack(true) // (4)
        }
    }
}
```

  </TabItem>
  <TabItem value="Kotlin" label="Kotlin">

```kt
import io.micronaut.rabbitmq.annotation.Queue
import io.micronaut.rabbitmq.annotation.RabbitListener
import io.micronaut.rabbitmq.bind.RabbitAcknowledgement
import java.util.concurrent.atomic.AtomicInteger

@RabbitListener
class ProductListener {

    val messageCount = AtomicInteger()

    @Queue(value = "product") // (1)
    fun receive(data: ByteArray, acknowledgement: RabbitAcknowledgement) { // (2)
        val count = messageCount.getAndUpdate { intValue -> intValue + 1 }
        if (count == 0) {
            acknowledgement.nack(false, true) // (3)
        } else if (count > 3) {
            acknowledgement.ack(true) // (4)
        }
    }
}
```

  </TabItem>
</Tabs>

1. 当方法具有 [RabbitAcknowledgement](https://micronaut-projects.github.io/micronaut-rabbitmq/latest/api/io/micronaut/configuration/rabbitmq/bind/RabbitAcknowledgement.html) 参数时，不再考虑 `reQueue` 和 `autoAcknowledgment` 选项。
2. 确认参数被注入到方法中。这表示该库不再以任何方式控制该消费者的确认。
3. 第一条消息被拒绝并重新排队。
4. 第二和第三条信息未被确认。收到的第四条信息与第二条和第三条信息一起被确认，因为 `multiple` 参数为 `true`

### 7.2 处理消费者异常

异常可能以多种不同方式出现。可能出现问题的地方包括：
- 将消息与方法参数绑定
- 消费者方法抛出的异常
- 消息确认导致的异常
- 尝试将消费者添加到通道时抛出的异常

如果消费者 bean 实现了 [RabbitListenerExceptionHandler](https://micronaut-projects.github.io/micronaut-rabbitmq/latest/api/io/micronaut/configuration/rabbitmq/exception/RabbitListenerExceptionHandler.html)，那么异常将被发送到方法实现。

如果消费者 bean 未实现 [RabbitListenerExceptionHandler](https://micronaut-projects.github.io/micronaut-rabbitmq/latest/api/io/micronaut/configuration/rabbitmq/exception/RabbitListenerExceptionHandler.html)，则异常将被路由到主异常处理程序 bean。要覆盖默认异常处理程序，请将 [DefaultRabbitListenerExceptionHandler](https://micronaut-projects.github.io/micronaut-rabbitmq/latest/api/io/micronaut/configuration/rabbitmq/exception/DefaultRabbitListenerExceptionHandler.html) 替换为你自己的实现，并指定为` @Primary`。

### 7.3 消费者执行

RabbitMQ 允许为新连接提供 [ExecutorService](https://docs.oracle.com/en/java/javase/17/docs/api/java.base/java/util/concurrent/ExecutorService.html)。该服务用于执行消费者。整个应用程序使用单个连接，并将其配置为使用名为 Executor 服务的消费者。执行器可通过应用程序配置进行配置。参阅 [ExecutorConfiguration](https://docs.micronaut.io/latest/api/io/micronaut/scheduling/executor/ExecutorConfiguration.html) 获取完整的选项列表。

例如：

*配置 `consumer` 线程池*

```yaml
micronaut:
    executors:
        consumer:
            type: fixed
            nThreads: 25
```

如果没有提供配置，则会使用 2 倍于可用处理器数量的固定线程池。

**并发消费者**

默认情况下，单个消费者不能同时处理多条消息。RabbitMQ 会等待向消费者提供消息，直到前一条消息被确认。从 3.0.0 版开始，[@Queue](https://micronaut-projects.github.io/micronaut-rabbitmq/latest/api/io/micronaut/configuration/rabbitmq/annotation/Queue.html) 注解中添加了一个新选项，用于设置单个消费者方法应向 RabbitMQ 注册的消费者数量。这将允许消费者并发执行。

<Tabs>
  <TabItem value="Java" label="Java" default>

```java
import io.micronaut.context.annotation.Requires;
import io.micronaut.rabbitmq.annotation.Queue;
import io.micronaut.rabbitmq.annotation.RabbitListener;

import java.util.concurrent.CopyOnWriteArraySet;

@RabbitListener
public class ProductListener {

    CopyOnWriteArraySet<String> threads = new CopyOnWriteArraySet<>();

    @Queue(value = "product", numberOfConsumers = "5") // (1)
    public void receive(byte[] data) {
        threads.add(Thread.currentThread().getName()); // (2)
        try {
            Thread.sleep(500);
        } catch (InterruptedException e) { }
    }
}
```

  </TabItem>
  <TabItem value="Groovy" label="Groovy">

```groovy
import io.micronaut.context.annotation.Requires
import io.micronaut.rabbitmq.annotation.Queue
import io.micronaut.rabbitmq.annotation.RabbitListener

import java.util.concurrent.CopyOnWriteArraySet

@RabbitListener
class ProductListener {

    CopyOnWriteArraySet<String> threads = new CopyOnWriteArraySet<>()

    @Queue(value = "product", numberOfConsumers = "5") // (1)
    void receive(byte[] data) {
        threads << Thread.currentThread().name // (2)
        sleep 500
    }
}
```

  </TabItem>
  <TabItem value="Kotlin" label="Kotlin">

```kt
import io.micronaut.context.annotation.Requires
import io.micronaut.rabbitmq.annotation.Queue
import io.micronaut.rabbitmq.annotation.RabbitListener

import java.util.concurrent.CopyOnWriteArraySet

@RabbitListener
class ProductListener {
    var threads = CopyOnWriteArraySet<String>()

    @Queue(value = "product", numberOfConsumers = "5") // (1)
    fun receive(data: ByteArray?) {
        threads.add(Thread.currentThread().name) // (2)
        Thread.sleep(500)
    }
}
```

  </TabItem>
</Tabs>

1. `numberOfConsumers` 在注解中设置
2. 在短时间窗口内收到多条信息将导致线程集合包含类似 `[pool-2-thread-9, pool-2-thread-7, pool-2-thread-10, pool-2-thread-8, pool-2-thread-6]` 的内容。

:::caution 警告
与其他任何并发执行情况一样，对消费者实例中数据的操作必须是线程安全的。
:::

## 8. 直接回复（RPC）

该库通过使用[直接回复（direct reply-to）](https://www.rabbitmq.com/direct-reply-to.html)支持 RPC。支持阻塞和非阻塞两种变体。要开始使用此功能，发布方法必须将 `replyTo` 属性设置为 `amq.rabbitmq.reply-to`。`amq.rabbitmq.reply-to` 队列始终存在，无需创建。

下面是一个直接回复的示例，消费者将正文转换为大写字母，并用转换后的字符串进行回复。

### 8.1 客户端侧

在这种情况下，"客户端侧"首先发布一条消息。然后，某处的消费者将收到消息并回复一个新值。

<Tabs>
  <TabItem value="Java" label="Java" default>

```java
import io.micronaut.rabbitmq.annotation.Binding;
import io.micronaut.rabbitmq.annotation.RabbitClient;
import io.micronaut.rabbitmq.annotation.RabbitProperty;
import org.reactivestreams.Publisher;

@RabbitClient
@RabbitProperty(name = "replyTo", value = "amq.rabbitmq.reply-to") // (1)
public interface ProductClient {

    @Binding("product")
    String send(String data); // (2)

    @Binding("product")
    Publisher<String> sendReactive(String data); // (3)
}
```

  </TabItem>
  <TabItem value="Groovy" label="Groovy">

```groovy
import io.micronaut.rabbitmq.annotation.Binding
import io.micronaut.rabbitmq.annotation.RabbitClient
import io.micronaut.rabbitmq.annotation.RabbitProperty
import org.reactivestreams.Publisher

@RabbitClient
@RabbitProperty(name = "replyTo", value = "amq.rabbitmq.reply-to") // (1)
interface ProductClient {

    @Binding("product")
    String send(String data) // (2)

    @Binding("product")
    Publisher<String> sendReactive(String data) // (3)
}
```

  </TabItem>
  <TabItem value="Kotlin" label="Kotlin">

```kt
import io.micronaut.rabbitmq.annotation.Binding
import io.micronaut.rabbitmq.annotation.RabbitClient
import io.micronaut.rabbitmq.annotation.RabbitProperty
import org.reactivestreams.Publisher

@RabbitClient
@RabbitProperty(name = "replyTo", value = "amq.rabbitmq.reply-to") // (1)
interface ProductClient {

    @Binding("product")
    fun send(data: String): String  // (2)

    @Binding("product")
    fun sendReactive(data: String): Publisher<String>  // (3)
}
```

  </TabItem>
</Tabs>

1. 设置回复属性。这可以放在个别方法上。
2. 发送方法是阻塞的，将在收到回复时返回。
3. sendReactive 方法返回的是反应式类型，将在收到回复时完成。反应式方法将在 IO 线程池中执行。

:::caution 警告
为了让发布者认为应该使用 RPC，而不仅仅是在确认发布时完成，数据类型必须**不是** `Void`。在上述两种情况下，数据类型都是 `String`。此外，必须设置 `replyTo` 属性。使用 `replyTo` 指定值不会自动创建队列。`amq.rabbitmq.reply-to` 队列比较特殊，不需要创建。
:::

### 8.2 服务器侧

在这种情况下，"服务器侧"首先是消耗一条信息，然后向回复队列发布一条新信息。

<Tabs>
  <TabItem value="Java" label="Java" default>

```java
import io.micronaut.rabbitmq.annotation.Queue;
import io.micronaut.rabbitmq.annotation.RabbitListener;

@RabbitListener
public class ProductListener {

    @Queue("product")
    public String toUpperCase(String data) { // (1)
        return data.toUpperCase(); // (2)
    }
}
```

  </TabItem>
  <TabItem value="Groovy" label="Groovy">

```groovy
import io.micronaut.rabbitmq.annotation.Queue
import io.micronaut.rabbitmq.annotation.RabbitListener

@RabbitListener
class ProductListener {

    @Queue("product")
    String toUpperCase(String data) { // (1)
        data.toUpperCase() // (2)
    }
}
```

  </TabItem>
  <TabItem value="Kotlin" label="Kotlin">

```kt
import io.micronaut.rabbitmq.annotation.Queue
import io.micronaut.rabbitmq.annotation.RabbitListener

@RabbitListener
class ProductListener {

    @Queue("product")
    fun toUpperCase(data: String): String { // (1)
        return data.uppercase() // (2)
    }
}
```

  </TabItem>
</Tabs>

1. 注入回复属性。如果消费者并不总是参与 RPC，则可以使用 `@Nullable` 对其进行注解，以便同时使用两种情况。
2. 注入通道以便使用。这可以用另一个 `@RabbitClient` 的方法调用来代替。
3. 将转换后的消息发布到 `replyTo` 绑定。

:::tip 注意
如果回复发布因故失败，原始消息将被拒绝。
:::

:::caution 警告
RPC 消费者方法绝不能返回反应式类型。因为结果发布需要在同一线程中进行，而且只能发布一个项目，这样做没有任何价值
:::

### 8.3 配置

默认情况下，如果 RPC 调用在[给定时间内](https://micronaut-projects.github.io/micronaut-rabbitmq/latest/guide/configurationreference.html)没有响应，将抛出或发出 `TimeoutException`。

## 9. 创建 Queue/Exchange

此库的目的是使用 RabbitMQ 消费和发布消息。队列、交换或它们之间的绑定的任何设置都**不会**自动完成。如果你的需求决定你的应用程序应创建这些实体，则可注册 [BeanCreatedEventListener](https://docs.micronaut.io/latest/api/io/micronaut/context/event/BeanCreatedEventListener.html) 以拦截 [ChannelPool](https://micronaut-projects.github.io/micronaut-rabbitmq/latest/api/io/micronaut/configuration/rabbitmq/connect/ChannelPool.html)，从而直接使用 Java API 执行操作。我们提供了一个类，你只需扩展该类即可接收一个通道来完成这项工作。

对于本文档中的所有示例，都已注册了一个事件监听器来创建测试代码所需的队列、交换和绑定。

<Tabs>
  <TabItem value="Java" label="Java" default>

```java
import com.rabbitmq.client.Channel;
import io.micronaut.rabbitmq.connect.ChannelInitializer;
import jakarta.inject.Singleton;

import java.io.IOException;
import java.util.HashMap;
import java.util.Map;

@Singleton // (1)
public class ChannelPoolListener extends ChannelInitializer { // (2)

    @Override
    public void initialize(Channel channel, String name) throws IOException { // (3)
        //docs/quickstart
        Map<String, Object> args = new HashMap<>();
        args.put("x-max-priority", 100);
        channel.queueDeclare("product", false, false, false, args); // (4)

        //docs/exchange
        channel.exchangeDeclare("animals", "headers", false);
        channel.queueDeclare("snakes", false, false, false, null);
        channel.queueDeclare("cats", false, false, false, null);
        Map<String, Object> catArgs = new HashMap<>();
        catArgs.put("x-match", "all");
        catArgs.put("animalType", "Cat");
        channel.queueBind("cats", "animals", "", catArgs);

        Map<String, Object> snakeArgs = new HashMap<>();
        snakeArgs.put("x-match", "all");
        snakeArgs.put("animalType", "Snake");
        channel.queueBind("snakes", "animals", "", snakeArgs);
    }

}
```

  </TabItem>
  <TabItem value="Groovy" label="Groovy">

```groovy
import com.rabbitmq.client.Channel
import io.micronaut.rabbitmq.connect.ChannelInitializer
import jakarta.inject.Singleton

@Singleton // (1)
class ChannelPoolListener extends ChannelInitializer { // (2)

    @Override
    void initialize(Channel channel, String name) throws IOException { // (3)
        channel.queueDeclare("product", false, false, false, ["x-max-priority": 100]) // (4)

        //docs/exchange
        channel.exchangeDeclare("animals", "headers", false)
        channel.queueDeclare("snakes", false, false, false, null)
        channel.queueDeclare("cats", false, false, false, null)
        Map<String, Object> catArgs = [:]
        catArgs.put("x-match", "all")
        catArgs.put("animalType", "Cat")
        channel.queueBind("cats", "animals", "", catArgs)

        Map<String, Object> snakeArgs = [:]
        snakeArgs.put("x-match", "all")
        snakeArgs.put("animalType", "Snake")
        channel.queueBind("snakes", "animals", "", snakeArgs)
    }
}
```

  </TabItem>
  <TabItem value="Kotlin" label="Kotlin">

```kt
import com.rabbitmq.client.Channel
import io.micronaut.rabbitmq.connect.ChannelInitializer
import jakarta.inject.Singleton
import java.io.IOException

@Singleton // (1)
class ChannelPoolListener : ChannelInitializer() { // (2)

    @Throws(IOException::class)
    override fun initialize(channel: Channel, name: String) { // (3)
        channel.queueDeclare("product", false, false, false, mapOf("x-max-priority" to 100)) // (4)

        //docs/exchange
        channel.exchangeDeclare("animals", "headers", false)
        channel.queueDeclare("snakes", false, false, false, null)
        channel.queueDeclare("cats", false, false, false, null)
        val catArgs = HashMap<String, Any>()
        catArgs["x-match"] = "all"
        catArgs["animalType"] = "Cat"
        channel.queueBind("cats", "animals", "", catArgs)

        val snakeArgs = HashMap<String, Any>()
        snakeArgs["x-match"] = "all"
        snakeArgs["animalType"] = "Snake"
        channel.queueBind("snakes", "animals", "", snakeArgs)
    }

}
```

  </TabItem>
</Tabs>

1. 该类被声明为单例，因此将在上下文中注册
2. 该类扩展了本库提供的一个抽象类
3. 实现接收通道和连接名称的方法，以进行初始化
4. 声明队列或执行所需的任何操作

## 10. 报文序列化/反序列化（SerDes）

消息体的序列化和反序列化是通过 [RabbitMessageSerDes](https://micronaut-projects.github.io/micronaut-rabbitmq/latest/api/io/micronaut/configuration/rabbitmq/serdes/RabbitMessageSerDes.html) 的实例来处理的。ser-des（序列化器/反序列化器）负责将 RabbitMQ 消息体序列化和反序列化为客户机和消费者方法中定义的消息体类型。

ser-des 由 [RabbitMessageSerDesRegistry](https://micronaut-projects.github.io/micronaut-rabbitmq/latest/api/io/micronaut/configuration/rabbitmq/serdes/RabbitMessageSerDesRegistry.html) 管理。所有 ser-des bean 都会按顺序注入注册表，然后在需要序列化或反序列化时进行搜索。第一个 [supports-java.lang.Class-](https://micronaut-projects.github.io/micronaut-rabbitmq/latest/api/io/micronaut/configuration/rabbitmq/serdes/RabbitMessageSerDes.html#supports-java.lang.Class-) 返回 true 的 ser-des 将被返回并使用。

默认情况下，支持标准 Java lang 类型和 JSON 格式（含 Jackson）。你只需注册一个 [RabbitMessageSerDes](https://micronaut-projects.github.io/micronaut-rabbitmq/latest/api/io/micronaut/configuration/rabbitmq/serdes/RabbitMessageSerDes.html) 类型的 Bean，即可提供你自己的服务器。所有服务器都实现了 [Ordered](https://micronaut-projects.github.io/micronaut-rabbitmq/latest/api/io/micronaut/configuration/rabbitmq/serdes/RabbitMessageSerDes.html) 接口，因此自定义实现可以在默认实现之前、之后或之间出现。

### 10.1 自定义服务器

自定义序列化器/解序列化器对于支持自定义数据格式是必要的。在[自定义消费者绑定](https://micronaut-projects.github.io/micronaut-rabbitmq/latest/guide/#consumerCustom)一节中，演示了一个允许从报文标题绑定 `ProductInfo` 类型的示例。如果该对象应该用自定义数据格式来表示报文正文，则可以注册自己的序列化器/解序列化器来实现。

在本示例中，字段的字符串表示的简单数据格式是用管道字符连接在一起的。

<Tabs>
  <TabItem value="Java" label="Java" default>

```java
import io.micronaut.core.convert.ConversionService;
import io.micronaut.core.type.Argument;
import io.micronaut.rabbitmq.bind.RabbitConsumerState;
import io.micronaut.rabbitmq.intercept.MutableBasicProperties;
import io.micronaut.rabbitmq.serdes.RabbitMessageSerDes;
import jakarta.inject.Singleton;

import java.nio.charset.Charset;
import java.util.Optional;

@Singleton // (1)
public class ProductInfoSerDes implements RabbitMessageSerDes<ProductInfo> { // (2)

    private static final Charset CHARSET = Charset.forName("UTF-8");

    private final ConversionService conversionService;

    public ProductInfoSerDes(ConversionService conversionService) { // (3)
        this.conversionService = conversionService;
    }

    @Override
    public ProductInfo deserialize(RabbitConsumerState consumerState, Argument<ProductInfo> argument) { // (4)
        String body = new String(consumerState.getBody(), CHARSET);
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
    public byte[] serialize(ProductInfo data, MutableBasicProperties properties) { // (5)
        if (data == null) {
            return null;
        }
        return (data.getSize() + "|" + data.getCount() + "|" + data.getSealed()).getBytes(CHARSET);
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
import io.micronaut.rabbitmq.bind.RabbitConsumerState
import io.micronaut.rabbitmq.intercept.MutableBasicProperties
import io.micronaut.rabbitmq.serdes.RabbitMessageSerDes
import jakarta.inject.Singleton
import java.nio.charset.Charset

@Singleton // (1)
class ProductInfoSerDes implements RabbitMessageSerDes<ProductInfo> { // (2)

    private static final Charset UTF8 = Charset.forName("UTF-8")

    private final ConversionService conversionService

    ProductInfoSerDes(ConversionService conversionService) { // (3)
        this.conversionService = conversionService
    }

    @Override
    ProductInfo deserialize(RabbitConsumerState consumerState, Argument<ProductInfo> argument) { // (4)
        String body = new String(consumerState.body, UTF8)
        String[] parts = body.split("\\|")
        if (parts.length == 3) {
            String size = parts[0]
            if (size == "null") {
                size = null
            }

            Optional<Long> count = conversionService.convert(parts[1], Long)
            Optional<Boolean> productSealed = conversionService.convert(parts[2], Boolean)

            if (count.isPresent() && productSealed.isPresent()) {
                return new ProductInfo(size, count.get(), productSealed.get())
            }
        }
        null
    }

    @Override
    byte[] serialize(ProductInfo data, MutableBasicProperties properties) { // (5)
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
import io.micronaut.rabbitmq.bind.RabbitConsumerState
import io.micronaut.rabbitmq.intercept.MutableBasicProperties
import io.micronaut.rabbitmq.serdes.RabbitMessageSerDes
import jakarta.inject.Singleton
import java.nio.charset.Charset

@Singleton // (1)
class ProductInfoSerDes(private val conversionService: ConversionService)// (3)
    : RabbitMessageSerDes<ProductInfo> { // (2)

    override fun deserialize(consumerState: RabbitConsumerState, argument: Argument<ProductInfo>): ProductInfo? { // (4)
        val body = String(consumerState.body, CHARSET)
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

    override fun serialize(data: ProductInfo?, properties: MutableBasicProperties): ByteArray { // (5)
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
由于 `getOrder` 方法未被重载，因此使用默认顺序 0。所有默认服务器的优先级都低于默认顺序，这意味着该服务器将先于其他服务器被检查。
:::

## 11 RabbitMQ 健康指标

该库为使用 Micronaut `management` 模块的应用程序提供了一个健康指示器。有关端点本身的更多信息，参阅[健康端点](/core/management/providedEndpoints#1523-健康端点)文档。

健康指示器报告的信息位于 `rabbitmq` 关键字下。详细信息将包括 [Connection#getServerProperties](https://rabbitmq.github.io/rabbitmq-java-client/api/current/com/rabbitmq/client/Connection.html#getServerProperties()) 报告的所有内容。例如：

```yaml
"rabbitmq": {
  "status": "UP",
  "details": {
    "cluster_name": "rabbit@a0378bc51148",
    "product": "RabbitMQ",
    "copyright": "Copyright (C) 2007-2018 Pivotal Software, Inc.",
    "capabilities": {
      "consumer_priorities": true,
      "exchange_exchange_bindings": true,
      "connection.blocked": true,
      "authentication_failure_close": true,
      "per_consumer_qos": true,
      "basic.nack": true,
      "direct_reply_to": true,
      "publisher_confirms": true,
      "consumer_cancel_notify": true
    },
    "information": "Licensed under the MPL.  See http:\/\/www.rabbitmq.com\/",
    "version": "3.7.8",
    "platform": "Erlang\/OTP 20.3.8.5"
```

:::note 提示
要完全禁用 RabbitMQ 健康指示器，请添加 endpoints.health.rabbitmq.enabled: false。
:::

## 12. RabbitMQ 指标

Java RabbitMQ 客户端内置了对 Micrometer 的支持。如果在你的应用程序中启用 Micrometer，将默认收集 RabbitMQ 的指标。有关如何将 Micronaut 与 Micrometer 集成的详细信息，参阅[文档](/micrometer)。

RabbitMQ 指标绑定器可配置。例如：

```yaml
micronaut:
    metrics:
        binders:
            rabbitmq:
                enabled: Boolean
                tags: String[]
                prefix: String
```

## 13. 仓库

你可以在此资源库中找到此项目的源代码：

https://github.com/micronaut-projects/micronaut-rabbitmq

> [英文链接](https://micronaut-projects.github.io/micronaut-rabbitmq/latest/guide/)

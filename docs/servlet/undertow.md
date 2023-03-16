---
sidebar_position: 70
---

# 7. Undertow Server

要使用 [Undertow](http://undertow.io/) 作为服务器，请添加以下依赖项：


import Tabs from '@theme/Tabs';
import TabItem from '@theme/TabItem';

<Tabs>
  <TabItem value="Gradle" label="Gradle">

```groovy
implementation("io.micronaut.servlet:micronaut-http-server-undertow:3.3.5")
```

  </TabItem>
  <TabItem value="Maven" label="Maven">

```xml
<dependency>
    <groupId>io.micronaut.servlet</groupId>
    <artifactId>micronaut-http-server-undertow</artifactId>
    <version>3.3.5</version>
</dependency>
```

  </TabItem>
</Tabs>

:::warning 警告
GraalVM 本地镜像不支持 Undertow。如果需要本地镜像支持，请使用 [Jetty](../servlet/jetty.html) 或 [Tomcat](../servlet/tomcat.html)。参阅 [UNDERTOW-1408](https://issues.redhat.com/projects/UNDERTOW/issues/UNDERTOW-1408)。
:::

:::tip 注意
如果你计划生成一个 WAR 文件，那么依赖应该是 `developmentOnly`。
:::

要自定义 Undertow 服务器，可以使用以下配置属性：

*表 1. [UndertowConfiguration](https://micronaut-projects.github.io/micronaut-servlet/3.3.5/api/io/micronaut/servlet/undertow/UndertowConfiguration.html) 配置属性*

|属性|类型|描述|
|--|--|--|
|micronaut.server.undertow.buffer-size|int||
|micronaut.server.undertow.io-threads|int||
|micronaut.server.undertow.worker-threads|int||
|micronaut.server.undertow.direct-buffers|boolean|
|micronaut.server.undertow.handler|io.undertow.server.HttpHandler||
|micronaut.server.undertow.worker|org.xnio.XnioWorker||
|micronaut.server.undertow.ssl-engine-delegated-task-executor|java.util.concurrent.Executor||
|micronaut.server.undertow.byte-buffer-pool|io.undertow.connector.ByteBufferPool||
|micronaut.server.undertow.worker-options|java.util.Map|设置 worker 选项。|
|micronaut.server.undertow.socket-options|java.util.Map|设置 socket 选项。|
|micronaut.server.undertow.server-options|java.util.Map|设置 server 选项。|

或者你也可能注册一个 `BeanCreatedEventListener`：

*Undertow Server 定制*

```java
import io.micronaut.context.event.BeanCreatedEvent;
import io.micronaut.context.event.BeanCreatedEventListener;
import io.undertow.Undertow;
import jakarta.inject.Singleton;

@Singleton
public class UndertowServerCustomizer implements BeanCreatedEventListener<Undertow.Builder> {
    @Override
    public Undertow.Builder onCreated(BeanCreatedEvent<Undertow.Builder> event) {
        Undertow.Builder undertowBuilder = event.getBean();
        // perform customizations...
        return undertowBuilder;
    }
}
```

> [英文链接](https://micronaut-projects.github.io/micronaut-servlet/3.3.5/guide/index.html#undertow)

---
sidebar_position: 50
---

# 5. Jetty Server

要将 [Jetty](https://www.eclipse.org/jetty/) 用作服务器，请添加以下依赖项：

<Tabs>

  <TabItem value="Gradle" label="Gradle">

```groovy
implementation("io.micronaut.servlet:micronaut-http-server-jetty:3.3.5")
```

  </TabItem>
  <TabItem value="Maven" label="Maven">

```xml
<dependency>
    <groupId>io.micronaut.servlet</groupId>
    <artifactId>micronaut-http-server-jetty</artifactId>
    <version>3.3.5</version>
</dependency>
```

  </TabItem>
</Tabs>

:::tip 注意
GraalVM 本地镜像支持 Jetty
:::

:::tip 注意
如果你计划生成一个 WAR 文件，那么依赖应该是 `developmentOnly`。
:::

要自定义 Jetty 服务器，可以使用以下配置属性：

*表 1. 为 [JettyConfiguration](https://micronaut-projects.github.io/micronaut-servlet/3.3.5/api/io/micronaut/servlet/jetty/JettyConfiguration.html) 配置属性*

|属性|类型|描述|
|--|--|--|
|micronaut.server.jetty.idle-timeout|long||
|micronaut.server.jetty.persistent-connections-enabled|boolean||
|micronaut.server.jetty.send-server-version|boolean||
|micronaut.server.jetty.send-xpowered-by|boolean||
|micronaut.server.jetty.send-date-header|boolean||
|micronaut.server.jetty.delay-dispatch-until-content|boolean||
|micronaut.server.jetty.customizers|java.util.List||
|micronaut.server.jetty.output-buffer-size|int||
|micronaut.server.jetty.output-aggregation-size|int||
|micronaut.server.jetty.request-header-size|int||
|micronaut.server.jetty.response-header-size|int||
|micronaut.server.jetty.header-cache-size|int||
|micronaut.server.jetty.secure-port|int||
|micronaut.server.jetty.secure-scheme|java.lang.String||
|micronaut.server.jetty.form-encoded-methods|java.lang.String||
|micronaut.server.jetty.max-error-dispatches|int||
|micronaut.server.jetty.min-request-data-rate|long||
|micronaut.server.jetty.min-response-data-rate|long||
|micronaut.server.jetty.request-cookie-compliance|org.eclipse.jetty.http.CookieCompliance||
|micronaut.server.jetty.response-cookie-compliance|org.eclipse.jetty.http.CookieCompliance||
|micronaut.server.jetty.multi-part-form-data-compliance|org.eclipse.jetty.server.MultiPartFormDataCompliance||
|micronaut.server.jetty.notify-remote-async-errors|boolean|
|micronaut.server.jetty.relative-redirect-allowed|boolean||
|micronaut.server.jetty.local-address|java.net.SocketAddress||
|micronaut.server.jetty.server-authority|org.eclipse.jetty.util.HostPort||
|micronaut.server.jetty.init-parameters|java.util.Map|设置 servlet 初始化参数。|

或者，你可以注册一个 `BeanCreatedEventListener`。

*Jetty Server 自定义*

```java
import io.micronaut.context.event.BeanCreatedEvent;
import io.micronaut.context.event.BeanCreatedEventListener;
import org.eclipse.jetty.server.Server;
import jakarta.inject.Singleton;

@Singleton
public class JettyServerCustomizer implements BeanCreatedEventListener<Server> {
    @Override
    public Server onCreated(BeanCreatedEvent<Server> event) {
        Server jettyServer = event.getBean();
        // perform customizations...
        return jettyServer;
    }
}
```

> [英文链接](https://micronaut-projects.github.io/micronaut-servlet/3.3.5/guide/index.html#jetty)

---
sidebar_position: 280
---

# 6.28 服务器事件

HTTP 服务器发出一些 [Bean 事件](/core/ioc#314-bean-事件)，定义在 [io.micronaut.runtime.server.event](https://micronaut-projects.github.io/micronaut-docs-mn3/3.9.4/api/io/micronaut/runtime/server/event/package-summary.html) 包中，你可以为其编写监听器。下表总结了这些：

*表 1.服务器事件*

|事件|描述|
|--|--|
|[ServerStartupEvent](https://micronaut-projects.github.io/micronaut-docs-mn3/3.9.4/api/io/micronaut/runtime/server/event/ServerStartupEvent.html)|当服务器完成启动时发出|
|[ServerShutdownEvent](https://micronaut-projects.github.io/micronaut-docs-mn3/3.9.4/api/io/micronaut/runtime/server/event/ServerShutdownEvent.html)|服务器关闭时发出的|
|[ServiceReadyEvent](https://micronaut-projects.github.io/micronaut-docs-mn3/3.9.4/api/io/micronaut/discovery/event/ServiceReadyEvent.html)|在所有的 [ServerStartupEvent](https://micronaut-projects.github.io/micronaut-docs-mn3/3.9.4/api/io/micronaut/runtime/server/event/ServerStartupEvent.html) 监听器被调用后发出，暴露了 [EmbeddedServerInstance](https://micronaut-projects.github.io/micronaut-docs-mn3/3.9.4/api/io/micronaut/discovery/EmbeddedServerInstance.html)|
|[ServiceStoppedEvent](https://micronaut-projects.github.io/micronaut-docs-mn3/3.9.4/api/io/micronaut/discovery/event/ServiceStoppedEvent.html)|在所有 [ServerShutdownEvent](https://micronaut-projects.github.io/micronaut-docs-mn3/3.9.4/api/io/micronaut/runtime/server/event/ServerShutdownEvent.html) 监听器被调用后发出，暴露 [EmbeddedServerInstance](https://micronaut-projects.github.io/micronaut-docs-mn3/3.9.4/api/io/micronaut/discovery/EmbeddedServerInstance.html)|

:::caution 警告
在 [ServerStartupEvent](https://micronaut-projects.github.io/micronaut-docs-mn3/3.9.4/api/io/micronaut/runtime/server/event/ServerStartupEvent.html) 的监听器中做大量工作会增加启动时间。
:::

下面的例子定义了一个 [ApplicationEventListener](https://micronaut-projects.github.io/micronaut-docs-mn3/3.9.4/api/io/micronaut/context/event/ApplicationEventListener.html)，它监听 [ServerStartupEvent](https://micronaut-projects.github.io/micronaut-docs-mn3/3.9.4/api/io/micronaut/runtime/server/event/ServerStartupEvent.html)：

*监听服务器启动事件*

```java
import io.micronaut.context.event.ApplicationEventListener;
...
@Singleton
public class StartupListener implements ApplicationEventListener<ServerStartupEvent> {
    @Override
    public void onApplicationEvent(ServerStartupEvent event) {
        // logic here
        ...
    }
}
```

另外，你也可以在任何接受 `ServerStartupEvent` 的 bean 的方法上使用 [@EventListener](https://micronaut-projects.github.io/micronaut-docs-mn3/3.9.4/api/io/micronaut/runtime/event/annotation/EventListener.html) 注解：

*使用 @EventListener 和 ServerStartupEvent*

```java
import io.micronaut.runtime.event.annotation.EventListener;
import io.micronaut.runtime.server.event.ServerStartupEvent;
import javax.inject.Singleton;
...
@Singleton
public class MyBean {

    @EventListener
    public void onStartup(ServerStartupEvent event) {
        // logic here
        ...
    }
}
```

> [英文链接](https://docs.micronaut.io/3.9.4/guide/index.html#serverEvents)

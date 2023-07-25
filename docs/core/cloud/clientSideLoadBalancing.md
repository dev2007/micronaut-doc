---
sidebar_position: 30
---

# 8.3 客户端负载均衡

当从 Consul、Eureka 或其他服务发现服务器[发现服务](./serviceDiscovery)时，[DiscoveryClient](https://micronaut-projects.github.io/micronaut-docs-mn3/3.9.4/api/io/micronaut/discovery/DiscoveryClient.html) 会发出一个可用的 [ServiceInstance](https://micronaut-projects.github.io/micronaut-docs-mn3/3.9.4/api/io/micronaut/discovery/ServiceInstance.html) 列表。

默认情况下，Micronaut 会使用该列表中的服务器自动执行轮循客户端负载均衡。这与[重试通知](../../core/aop#57-重试通知)相结合，为你的微服务基础设施增加了额外的弹性。

负载均衡由 [LoadBalancer](https://micronaut-projects.github.io/micronaut-docs-mn3/3.9.4/api/io/micronaut/http/client/LoadBalancer.html) 接口处理，该接口有一个 [LoadBalancer.select()](https://micronaut-projects.github.io/micronaut-docs-mn3/3.9.4/api/io/micronaut/http/client/LoadBalancer.html#select--) 方法，该方法会返回一个会发出一个服务实例的 `Publisher`。

之所以要返回 [Publisher](http://www.reactive-streams.org/reactive-streams-1.0.3-javadoc/org/reactivestreams/Publisher.html)，是因为选择 [ServiceInstance](https://micronaut-projects.github.io/micronaut-docs-mn3/3.9.4/api/io/micronaut/discovery/ServiceInstance.html) 的过程可能会导致网络操作，这取决于所采用的[服务发现](./serviceDiscovery.html)策略。

[LoaderBalancer](https://micronaut-projects.github.io/micronaut-docs-mn3/3.9.4/api/io/micronaut/http/client/LoadBalancer.html) 接口的默认实现是 [DiscoveryClientRoundRobinLoadBalancer](https://micronaut-projects.github.io/micronaut-docs-mn3/3.9.4/api/io/micronaut/http/client/loadbalance/DiscoveryClientRoundRobinLoadBalancer.html)。你可以用另一种实现来替换这种策略，以定制 Micronaut 中客户端负载均衡的处理方式，因为有许多不同的方法来优化负载均衡。

例如，你可能希望在特定区域的服务之间实现负载均衡，或者在总体响应时间最佳的服务器之间实现负载均衡。

要替换 [LoaderBalancer](https://micronaut-projects.github.io/micronaut-docs-mn3/3.9.4/api/io/micronaut/http/client/LoadBalancer.html)，可定义一个 Bean 来[替换](../../core/ioc#310-bean-替换) [DiscoveryClientLoadBalancerFactory](https://micronaut-projects.github.io/micronaut-docs-mn3/3.9.4/api/io/micronaut/http/client/loadbalance/DiscoveryClientLoadBalancerFactory.html)。

事实上，这正是 Netflix Ribbon 支持所要做的，将在下一节中介绍。

## 8.3.1 Netflix Ribbon 支持

:::tip 提示
*使用 CLI*

如果使用 Micronaut CLI 创建项目，请使用 `netflix-ribbon` 特性在项目中配置 Netflix Ribbon：

```bash
$ mn create-app my-app --features netflix-ribbon
```
:::

[Netflix Ribbon](https://github.com/Netflix/ribbon) 是 Netflix 使用的进程间通信库，支持可定制的负载平衡策略。

如果你的应用程序需要更灵活地执行客户端负载平衡，你可以使用 Micronaut 的 Netflix Ribbon 支持。

要在应用程序中添加 Ribbon 支持，请在构建时添加 `netflix-ribbon` 配置：

import Tabs from '@theme/Tabs';
import TabItem from '@theme/TabItem';

<Tabs>
  <TabItem value="Gradle" label="Gradle">

```groovy
implementation("io.micronaut.netflix:micronaut-netflix-ribbon")
```

  </TabItem>
  <TabItem value="Maven" label="Maven">

```xml
<dependency>
    <groupId>io.micronaut.netflix</groupId>
    <artifactId>micronaut-netflix-ribbon</artifactId>
</dependency>
```

  </TabItem>
</Tabs>

[LoadBalancer](https://micronaut-projects.github.io/micronaut-docs-mn3/3.9.4/api/io/micronaut/http/client/LoadBalancer.html) 实现现在将是 [RibbonLoadBalancer](https://micronaut-projects.github.io/micronaut-netflix/latest/api/io/micronaut/configuration/ribbon/RibbonLoadBalancer.html) 实例。

Ribbon 的[配置选项](https://netflix.github.io/ribbon/ribbon-core-javadoc/com/netflix/client/config/CommonClientConfigKey.html)可以使用配置中的 `ribbon` 命名空间来设置。例如，在配置文件（如 `application.yml`）中：

*配置 Ribbon*

<Tabs>
  <TabItem value="Properties" label="Properties">

```properties
ribbon.VipAddress=test
ribbon.ServerListRefreshInterval=2000
```

  </TabItem>
  <TabItem value="Yaml" label="Yaml">

```yaml
ribbon:
  VipAddress: test
  ServerListRefreshInterval: 2000
```

  </TabItem>
    <TabItem value="Toml" label="Toml">

```toml
[ribbon]
  VipAddress="test"
  ServerListRefreshInterval=2000
```

  </TabItem>
    <TabItem value="Groovy" label="Groovy">

```groovy
ribbon {
  VipAddress = "test"
  ServerListRefreshInterval = 2000
}
```

  </TabItem>
    <TabItem value="Hoon" label="Hoon">

```hocon
{
  ribbon {
    VipAddress = "test"
    ServerListRefreshInterval = 2000
  }
}
```

  </TabItem>
    <TabItem value="JSON" label="JSON">

```json
{
  "ribbon": {
    "VipAddress": "test",
    "ServerListRefreshInterval": 2000
  }
}
```

  </TabItem>
</Tabs>

每个被发现的客户端还可以在 `ribbon.clients` 下进行配置。例如，给定一个 `@Client(id="hello-world")`，你就可以用它来配置功能区设置：

*每个客户端的功能区设置*

<Tabs>
  <TabItem value="Properties" label="Properties">

```properties
ribbon.clients.hello-world.VipAddress=test
ribbon.clients.hello-world.ServerListRefreshInterval=2000
```

  </TabItem>
  <TabItem value="Yaml" label="Yaml">

```yaml
ribbon:
  clients:
    hello-world:
      VipAddress: test
      ServerListRefreshInterval: 2000
```

  </TabItem>
    <TabItem value="Toml" label="Toml">

```toml
[ribbon]
  [ribbon.clients]
    [ribbon.clients.hello-world]
      VipAddress="test"
      ServerListRefreshInterval=2000
```

  </TabItem>
    <TabItem value="Groovy" label="Groovy">

```groovy
ribbon {
  clients {
    helloWorld {
      VipAddress = "test"
      ServerListRefreshInterval = 2000
    }
  }
}
```

  </TabItem>
    <TabItem value="Hoon" label="Hoon">

```hocon
{
  ribbon {
    clients {
      hello-world {
        VipAddress = "test"
        ServerListRefreshInterval = 2000
      }
    }
  }
}
```

  </TabItem>
    <TabItem value="JSON" label="JSON">

```json
{
  "ribbon": {
    "clients": {
      "hello-world": {
        "VipAddress": "test",
        "ServerListRefreshInterval": 2000
      }
    }
  }
}
```

  </TabItem>
</Tabs>

默认情况下，Micronaut 会为每个将 Ribbon 与 Micronaut 的 [DiscoveryClient](https://micronaut-projects.github.io/micronaut-docs-mn3/3.9.4/api/io/micronaut/discovery/DiscoveryClient.html) 集成的客户端注册一个 [DiscoveryClientServerList](https://micronaut-projects.github.io/micronaut-netflix/latest/api/io/micronaut/configuration/ribbon/DiscoveryClientServerList.html)。

> [英文链接](https://micronaut-projects.github.io/micronaut-docs-mn3/3.9.4/guide/index.html#clientSideLoadBalancing)

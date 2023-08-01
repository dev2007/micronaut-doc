---
sidebar_position: 20
---

# 15.2 内置端点

在项目中添加 `management` 依赖时，默认情况下会启用以下内置端点：

*表 1.默认端点*

|端点|URI|描述|
|--|--|--|
|[BeansEndpoint](https://micronaut-projects.github.io/micronaut-docs-mn3/3.9.4/api/io/micronaut/management/endpoint/beans/BeansEndpoint.html)|`/beans`|返回应用程序中已加载 Bean 定义的信息（参阅 [BeansEndpoint](#1521-bean-端点)）|
|[HealthEndpoint](https://micronaut-projects.github.io/micronaut-docs-mn3/3.9.4/api/io/micronaut/management/endpoint/health/HealthEndpoint.html)|`/health`|返回有关应用程序 "健康状况 "的信息（参阅 [HealthEndpoint](#1523-健康端点)）|
|[InfoEndpoint](https://micronaut-projects.github.io/micronaut-docs-mn3/3.9.4/api/io/micronaut/management/endpoint/info/InfoEndpoint.html)|`/info`|返回应用程序状态的静态信息（参阅 [InfoEndpoint](#1522-信息端点)）|
|[LoggersEndpoint](https://micronaut-projects.github.io/micronaut-docs-mn3/3.9.4/api/io/micronaut/management/endpoint/loggers/LoggersEndpoint.html)|`/loggers`|返回有关可用日志记录器的信息，并允许更改配置的日志级别（参阅 [LoggersEndpoint](#1527-记录器端点)）|
|[MetricsEndpoint](https://micronaut-projects.github.io/micronaut-docs-mn3/3.9.4/guide/index.html#metricsEndpoint)|`/metrics`|返回[应用程序指标](#1524-指标端点)。需要 classpath 上的 `micrometer-core` 配置。|
|[RefreshEndpoint](https://micronaut-projects.github.io/micronaut-docs-mn3/3.9.4/api/io/micronaut/management/endpoint/refresh/RefreshEndpoint.html)|`/refresh`|刷新应用程序状态（参阅 [RefreshEndpoint](#1525-刷新端点)）|
|[RoutesEndpoint](https://micronaut-projects.github.io/micronaut-docs-mn3/3.9.4/api/io/micronaut/management/endpoint/routes/RoutesEndpoint.html)|`/routes`|返回应用程序可调用的 URI 信息（参阅 [RoutesEndpoint](#1526-路由端点)）|
|[ThreadDumpEndpoint](https://micronaut-projects.github.io/micronaut-docs-mn3/3.9.4/api/io/micronaut/management/endpoint/threads/ThreadDumpEndpoint.html)|`/threaddump`|返回应用程序中当前线程的信息。|

此外，`management` 依赖还提供以下内置端点，但默认情况下并未启用：

*表 2.禁用端点*

|端点|URI|描述|
|--|--|--|
|[EnvironmentEndpoint](https://micronaut-projects.github.io/micronaut-docs-mn3/3.9.4/api/io/micronaut/management/endpoint/env/EnvironmentEndpoint.html)|`/env`|返回环境及其属性源的信息（参阅 [EnvironmentEndpoint](#15210-环境端点)）|

|[CachesEndpoint](https://micronaut-projects.github.io/micronaut-docs-mn3/3.9.4/guide/index.html#cachesEndpoint)|`/caches`|返回缓存的相关信息，并允许对其进行无效处理（参阅 [CachesEndpoint](#1528-缓存端点)）|
|[ServerStopEndpoint](https://micronaut-projects.github.io/micronaut-docs-mn3/3.9.4/api/io/micronaut/management/endpoint/stop/ServerStopEndpoint.html)|`/stop`|关闭应用服务器（参阅 [ServerStopEndpoint](#1529-服务器停止端点)）|

:::warning 警告
可以通过定义 `endpoints.all.sensitive：false`，开放所有端点供未经身份验证的访问，但应谨慎使用，因为私人和敏感信息会被暴露出来。
:::

**管理端口**

默认情况下，所有管理端点都通过与应用程序相同的端口开放。你可以通过指定 `endpoints.all.port` 设置来改变这种行为：

import Tabs from '@theme/Tabs';
import TabItem from '@theme/TabItem';

<Tabs>
  <TabItem value="Properties" label="Properties">

```properties
endpoints.all.port=8085
```

  </TabItem>
  <TabItem value="Yaml" label="Yaml">

```yaml
endpoints:
  all:
    port: 8085
```

  </TabItem>
    <TabItem value="Toml" label="Toml">

```toml
[endpoints]
  [endpoints.all]
    port=8085
```

  </TabItem>
    <TabItem value="Groovy" label="Groovy">

```groovy
endpoints {
  all {
    port = 8085
  }
}
```

  </TabItem>
    <TabItem value="Hoon" label="Hoon">

```hocon
{
  endpoints {
    all {
      port = 8085
    }
  }
}
```

  </TabItem>
    <TabItem value="JSON" label="JSON">

```json
{
  "endpoints": {
    "all": {
      "port": 8085
    }
  }
}
```

  </TabItem>
</Tabs>

在上述示例中，管理端点仅通过 8085 端口暴露。

**JMX**

Micronaut 提供用 JMX 注册端点的功能。参阅 [JMX](/jmx) 部分以开始使用。

## 15.2.1 Bean 端点

Beans 端点返回应用程序中已加载的 Bean 定义的相关信息。默认情况下，返回的 Bean 数据是一个对象，其中键是 Bean 定义类名，值是有关 Bean 属性的对象。

要执行 Beans 端点，请向 `/beans` 发送 `GET` 请求。

### 配置

要配置 Beans 端点，请通过 `endpoints.beans` 提供配置。

*Bean 端点配置示例*

<Tabs>
  <TabItem value="Properties" label="Properties">

```properties
endpoints.beans.enabled=Boolean
endpoints.beans.sensitive=Boolean
```

  </TabItem>
  <TabItem value="Yaml" label="Yaml">

```yaml
endpoints:
  beans:
    enabled: Boolean
    sensitive: Boolean
```

  </TabItem>
    <TabItem value="Toml" label="Toml">

```toml
[endpoints]
  [endpoints.beans]
    enabled="Boolean"
    sensitive="Boolean"
```

  </TabItem>
    <TabItem value="Groovy" label="Groovy">

```groovy
endpoints {
  beans {
    enabled = "Boolean"
    sensitive = "Boolean"
  }
}
```

  </TabItem>
    <TabItem value="Hoon" label="Hoon">

```hocon
{
  endpoints {
    beans {
      enabled = "Boolean"
      sensitive = "Boolean"
    }
  }
}
```

  </TabItem>
    <TabItem value="JSON" label="JSON">

```json
{
  "endpoints": {
    "beans": {
      "enabled": "Boolean",
      "sensitive": "Boolean"
    }
  }
}
```

  </TabItem>
</Tabs>

---

### 定制

bean 端点由 bean 定义数据收集器和豆类数据实现组成。bean 定义数据收集器（[BeanDefinitionDataCollector](https://micronaut-projects.github.io/micronaut-docs-mn3/3.9.4/api/io/micronaut/management/endpoint/beans/BeanDefinitionDataCollector.html)）负责返回一个发布器，该发布器会返回响应中使用的数据。bean 定义数据 ([BeanDefinitionData](https://micronaut-projects.github.io/micronaut-docs-mn3/3.9.4/api/io/micronaut/management/endpoint/beans/BeanDefinitionData.html)) 负责返回有关单个 bean 定义的数据。

要覆盖任何一个辅助类的默认行为，要么扩展默认实现（[DefaultBeanDefinitionDataCollector](https://micronaut-projects.github.io/micronaut-docs-mn3/3.9.4/api/io/micronaut/management/endpoint/beans/impl/DefaultBeanDefinitionDataCollector.html)、[DefaultBeanDefinitionData](https://micronaut-projects.github.io/micronaut-docs-mn3/3.9.4/api/io/micronaut/management/endpoint/beans/impl/DefaultBeanDefinitionData.html)），要么直接实现相关接口。为确保使用你的实现而不是默认实现，请在你的类中添加 [@Replaces](https://micronaut-projects.github.io/micronaut-docs-mn3/3.9.4/api/io/micronaut/context/annotation/Replaces.html) 注解，其值为默认实现。

## 15.2.2 信息端点

信息端点从应用程序的状态中返回静态信息。暴露的信息可由任意数量的 "信息源 "提供。

要执行信息端点，请向 `/info` 发送 `GET` 请求。

### 配置

要配置信息端点，请通过 `endpoints.info` 提供配置。

*信息端点配置示例*

<Tabs>
  <TabItem value="Properties" label="Properties">

```properties
endpoints.info.enabled=Boolean
endpoints.info.sensitive=Boolean
```

  </TabItem>
  <TabItem value="Yaml" label="Yaml">

```yaml
endpoints:
  info:
    enabled: Boolean
    sensitive: Boolean
```

  </TabItem>
    <TabItem value="Toml" label="Toml">

```toml
[endpoints]
  [endpoints.info]
    enabled="Boolean"
    sensitive="Boolean"
```

  </TabItem>
    <TabItem value="Groovy" label="Groovy">

```groovy
endpoints {
  info {
    enabled = "Boolean"
    sensitive = "Boolean"
  }
}
```

  </TabItem>
    <TabItem value="Hoon" label="Hoon">

```hocon
{
  endpoints {
    info {
      enabled = "Boolean"
      sensitive = "Boolean"
    }
  }
}
```

  </TabItem>
    <TabItem value="JSON" label="JSON">

```json
{
  "endpoints": {
    "info": {
      "enabled": "Boolean",
      "sensitive": "Boolean"
    }
  }
}
```

  </TabItem>
</Tabs>

---

### 定制

信息端点由一个信息聚合器和任意数量的信息源组成。要添加信息源，请创建一个实现 [InfoSource](https://micronaut-projects.github.io/micronaut-docs-mn3/3.9.4/api/io/micronaut/management/endpoint/info/InfoSource.html) 的 Bean 类。如果您的信息源需要从 Java 属性文件中检索数据，请扩展 [PropertiesInfoSource](https://micronaut-projects.github.io/micronaut-docs-mn3/3.9.4/api/io/micronaut/management/endpoint/info/source/PropertiesInfoSource.html) 接口，该接口为此提供了一个辅助方法。

所有信息源 Bean 都与信息聚合器收集在一起。要提供自己的信息聚合器实现，请创建一个实现 [InfoAggregator](https://micronaut-projects.github.io/micronaut-docs-mn3/3.9.4/api/io/micronaut/management/endpoint/info/InfoAggregator.html) 的类，并将其注册为一个 Bean。为确保使用自己的实现而不是默认实现，请在类中添加 [@Replaces](https://micronaut-projects.github.io/micronaut-docs-mn3/3.9.4/api/io/micronaut/context/annotation/Replaces.html) 注解，其值为[默认实现](https://micronaut-projects.github.io/micronaut-docs-mn3/3.9.4/api/io/micronaut/management/endpoint/info/impl/ReactiveInfoAggregator.html)。

默认信息聚合器会返回一个包含所有信息源返回的组合属性的映射。该映射以 JSON 格式从 `/info` 端点返回。

---

### 提供的信息来源

**配置信息源**

[ConfigurationInfoSource](https://micronaut-projects.github.io/micronaut-docs-mn3/3.9.4/api/io/micronaut/management/endpoint/info/source/ConfigurationInfoSource.html) 返回 `info` 键下的配置属性。除了字符串、整数和布尔值外，更复杂的属性可在 JSON 输出中以映射形式显示（如果配置格式支持）。

*信息源示例（application.groovy）*

```groovy
info.demo.string = "demo string"
info.demo.number = 123
info.demo.map = [key: 'value', other_key: 123]
```

上述配置会从信息端点得到以下 JSON 响应：

```json
{
  "demo": {
    "string": "demo string",
    "number": 123,
    "map": {
      "key": "value",
      "other_key": 123
    }
  }
}
```

**配置**

可以使用 `endpoints.info.config.enabled` 属性禁用配置信息源。

**Git 信息源**

如果类路径上有 `git.properties` 文件，[GitInfoSource](https://micronaut-projects.github.io/micronaut-docs-mn3/3.9.4/api/io/micronaut/management/endpoint/info/source/GitInfoSource.html) 就会在 `git` 密钥下公开该文件中的值。生成 `git.properties` 文件必须作为构建过程的一部分进行配置。Gradle 用户可以使用 [Gradle Git 属性插件](https://plugins.gradle.org/plugin/com.gorylenko.gradle-git-properties)。Maven 用户可以使用 [Maven Git Commit ID 插件](https://github.com/git-commit-id/maven-git-commit-id-plugin)。

**配置**

要指定属性文件的其他路径或名称，请在 `endpoints.info.git.location` 属性中提供自定义值。

可以使用 `endpoints.info.git.enabled` 属性禁用 git 信息源。

**构建信息源**

如果类路径上有 `META-INF/build-info.properties` 文件，[BuildInfoSource](https://micronaut-projects.github.io/micronaut-docs-mn3/3.9.4/api/io/micronaut/management/endpoint/info/source/BuildInfoSource.html) 就会在构建密钥下公开该文件中的值。生成 `build-info.properties` 文件必须作为构建的一部分进行配置。对于 Gradle 用户来说，一个简单的选择是 [Gradle Build Info Plugin](https://plugins.gradle.org/plugin/com.pasam.gradle.buildinfo)。对于 Maven 用户来说，[Spring Boot Maven 插件](https://docs.spring.io/spring-boot/docs/current/maven-plugin/reference/htmlsingle/#goals-build-info)也是一个不错的选择。

**配置**

要指定属性文件的其他路径/名称，请在 `endpoints.info.build.location` 属性中提供自定义值。

可以使用 `endpoints.info.build.enabled` 属性禁用构建信息源。

## 15.2.3 健康端点

健康状况端点返回有关应用程序"健康"的信息，该信息由任意数量的"健康指标"决定。

要执行健康状况端点，请向 `/health` 发送 `GET` 请求。此外，健康状况端点还提供 `/health/liveness` 和 `/health/readiness` 健康状况指标。

**配置**

要配置健康端点，可通过 `endpoints.health` 提供配置。

*健康端点配置示例*

<Tabs>
  <TabItem value="Properties" label="Properties">

```properties

```

  </TabItem>
  <TabItem value="Yaml" label="Yaml">

```yaml
endpoints:
  health:
    enabled: Boolean
    sensitive: Boolean
    details-visible: String
    status:
      http-mapping: Map<String, HttpStatus>
```

  </TabItem>
    <TabItem value="Toml" label="Toml">

```toml
[endpoints]
  [endpoints.health]
    enabled="Boolean"
    sensitive="Boolean"
    details-visible="String"
    [endpoints.health.status]
      http-mapping="Map<String, HttpStatus>"
```

  </TabItem>
    <TabItem value="Groovy" label="Groovy">

```groovy
endpoints {
  health {
    enabled = "Boolean"
    sensitive = "Boolean"
    detailsVisible = "String"
    status {
      httpMapping = "Map<String, HttpStatus>"
    }
  }
}
```

  </TabItem>
    <TabItem value="Hoon" label="Hoon">

```hocon
{
  endpoints {
    health {
      enabled = "Boolean"
      sensitive = "Boolean"
      details-visible = "String"
      status {
        http-mapping = "Map<String, HttpStatus>"
      }
    }
  }
}
```

  </TabItem>
    <TabItem value="JSON" label="JSON">

```json
{
  "endpoints": {
    "health": {
      "enabled": "Boolean",
      "sensitive": "Boolean",
      "details-visible": "String",
      "status": {
        "http-mapping": "Map<String, HttpStatus>"
      }
    }
  }
}
```

  </TabItem>
</Tabs>

- `details-visible` 是 [DetailsVisibility](https://micronaut-projects.github.io/micronaut-docs-mn3/3.9.4/api/io/micronaut/management/endpoint/health/DetailsVisibility.html) 之一

`details-visible` 设置控制是否向未通过认证的用户显示健康详细信息。

例如，设置：

*使用 details-visible*

<Tabs>
  <TabItem value="Properties" label="Properties">

```properties
endpoints.health.details-visible=ANONYMOUS
```

  </TabItem>
  <TabItem value="Yaml" label="Yaml">

```yaml
endpoints:
  health:
    details-visible: ANONYMOUS
```

  </TabItem>
    <TabItem value="Toml" label="Toml">

```toml
[endpoints]
  [endpoints.health]
    details-visible="ANONYMOUS"
```

  </TabItem>
    <TabItem value="Groovy" label="Groovy">

```groovy
endpoints {
  health {
    detailsVisible = "ANONYMOUS"
  }
}
```

  </TabItem>
    <TabItem value="Hoon" label="Hoon">

```hocon
{
  endpoints {
    health {
      details-visible = "ANONYMOUS"
    }
  }
}
```

  </TabItem>
    <TabItem value="JSON" label="JSON">

```json
{
  "endpoints": {
    "health": {
      "details-visible": "ANONYMOUS"
    }
  }
}
```

  </TabItem>
</Tabs>

向未认证的匿名用户公开各种健康指标中有关应用程序健康状况的详细信息。

`endpoints.health.status.http-mapping` 设置可控制为每种健康状态返回的状态代码。默认值如下表所示：

|状态|HTTP 码|
|--|--|
|[UP](https://micronaut-projects.github.io/micronaut-docs-mn3/3.9.4/api/io/micronaut/health/HealthStatus.html#UP)|[OK](https://micronaut-projects.github.io/micronaut-docs-mn3/3.9.4/api/io/micronaut/http/HttpStatus.html#OK) (200)|
|[UNKNOWN](https://micronaut-projects.github.io/micronaut-docs-mn3/3.9.4/api/io/micronaut/health/HealthStatus.html#UNKNOWN)|[OK](https://micronaut-projects.github.io/micronaut-docs-mn3/3.9.4/api/io/micronaut/http/HttpStatus.html#OK) (200)|
|[DOWN](https://micronaut-projects.github.io/micronaut-docs-mn3/3.9.4/api/io/micronaut/health/HealthStatus.html#DOWN)|[SERVICE_UNAVAILABLE](https://micronaut-projects.github.io/micronaut-docs-mn3/3.9.4/api/io/micronaut/http/HttpStatus.html#SERVICE_UNAVAILABLE) (503)|

你可以在配置文件（如 `application.yml`）中提供自定义映射：

*自定义健康状态代码*

<Tabs>
  <TabItem value="Properties" label="Properties">

```properties
endpoints.health.status.http-mapping.DOWN=200
```

  </TabItem>
  <TabItem value="Yaml" label="Yaml">

```yaml
endpoints:
  health:
    status:
      http-mapping:
        DOWN: 200
```

  </TabItem>
    <TabItem value="Toml" label="Toml">

```toml
[endpoints]
  [endpoints.health]
    [endpoints.health.status]
      [endpoints.health.status.http-mapping]
        DOWN=200
```

  </TabItem>
    <TabItem value="Groovy" label="Groovy">

```groovy
endpoints {
  health {
    status {
      httpMapping {
        DOWN = 200
      }
    }
  }
}
```

  </TabItem>
    <TabItem value="Hoon" label="Hoon">

```hocon
{
  endpoints {
    health {
      status {
        http-mapping {
          DOWN = 200
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
  "endpoints": {
    "health": {
      "status": {
        "http-mapping": {
          "DOWN": 200
        }
      }
    }
  }
}
```

  </TabItem>
</Tabs>

即使 [HealthStatus](https://micronaut-projects.github.io/micronaut-docs-mn3/3.9.4/api/io/micronaut/health/HealthStatus.html) 为 [DOWN](https://micronaut-projects.github.io/micronaut-docs-mn3/3.9.4/api/io/micronaut/health/HealthStatus.html#DOWN)，上述操作也会返回 [OK](https://micronaut-projects.github.io/micronaut-docs-mn3/3.9.4/api/io/micronaut/http/HttpStatus.html#OK) (200)。

---

### 定制

健康状况端点由一个健康状况聚合器和任意数量的健康状况指示器组成。要添加健康指标，请创建一个实现 [HealthIndicator](https://micronaut-projects.github.io/micronaut-docs-mn3/3.9.4/api/io/micronaut/management/health/indicator/HealthIndicator.html) 的 Bean 类。建议同时使用 [@Liveness](https://micronaut-projects.github.io/micronaut-docs-mn3/3.9.4/api/io/micronaut/management/health/indicator/annotation/Liveness.html) 或 [@Readiness](https://micronaut-projects.github.io/micronaut-docs-mn3/3.9.4/api/io/micronaut/management/health/indicator/annotation/Readiness.html) 限定符。如果不使用限定符，健康指示器将成为 `/health` 和 `/health/readiness` 端点的一部分。基类 [AbstractHealthIndicator](https://micronaut-projects.github.io/micronaut-docs-mn3/3.9.4/api/io/micronaut/management/health/indicator/AbstractHealthIndicator.html) 可用于子类化，使过程更简单。

所有健康指标豆都与健康聚合器收集在一起。要提供自己的健康状况聚合器实现，请创建一个实现 [HealthAggregator](https://micronaut-projects.github.io/micronaut-docs-mn3/3.9.4/api/io/micronaut/management/health/aggregator/HealthAggregator.html) 的类，并将其注册为一个 Bean。为确保使用您的实现而不是默认实现，请在你的类中添加 [@Replaces](https://micronaut-projects.github.io/micronaut-docs-mn3/3.9.4/api/io/micronaut/context/annotation/Replaces.html) 注解，其值为默认实现 [DefaultHealthAggregator](https://micronaut-projects.github.io/micronaut-docs-mn3/3.9.4/api/io/micronaut/management/health/aggregator/DefaultHealthAggregator.html)。

默认健康状况聚合器根据指标的健康状况计算后返回整体状态。[健康状况](https://micronaut-projects.github.io/micronaut-docs-mn3/3.9.4/api/io/micronaut/health/HealthStatus.html)由以下几个信息组成：

|||
|--|--|
|Name|状态名字|
|Description|状态描述|
|Operational|指标所代表的功能是否正常工作
|Severity|状态的严重程度。数字越大越严重|

“worst” 状态作为整体状态返回。选择非操作状态而不是操作状态。选择较高的严重性而不是较低的严重性。

---

### 提供的指标

Micronaut 提供的所有健康指标都在 `/health` 和 `/health/readiness` 端点上公开。

**磁盘空间**

提供的健康指标可根据可用磁盘空间的大小确定应用程序的健康状况。磁盘空间健康指标的配置可在 `endpoints.health.disk-space` 关键字下提供。

*磁盘空间指标配置示例*

<Tabs>
  <TabItem value="Properties" label="Properties">

```properties
endpoints.health.disk-space.enabled=Boolean
endpoints.health.disk-space.path=String
endpoints.health.disk-space.threshold=String | Long
```

  </TabItem>
  <TabItem value="Yaml" label="Yaml">

```yaml
endpoints:
  health:
    disk-space:
      enabled: Boolean
      path: String
      threshold: String | Long
```

  </TabItem>
    <TabItem value="Toml" label="Toml">

```toml
[endpoints]
  [endpoints.health]
    [endpoints.health.disk-space]
      enabled="Boolean"
      path="String"
      threshold="String | Long"
```

  </TabItem>
    <TabItem value="Groovy" label="Groovy">

```groovy
endpoints {
  health {
    diskSpace {
      enabled = "Boolean"
      path = "String"
      threshold = "String | Long"
    }
  }
}
```

  </TabItem>
    <TabItem value="Hoon" label="Hoon">

```hocon
{
  endpoints {
    health {
      disk-space {
        enabled = "Boolean"
        path = "String"
        threshold = "String | Long"
      }
    }
  }
}
```

  </TabItem>
    <TabItem value="JSON" label="JSON">

```json
{
  "endpoints": {
    "health": {
      "disk-space": {
        "enabled": "Boolean",
        "path": "String",
        "threshold": "String | Long"
      }
    }
  }
}
```

  </TabItem>
</Tabs>

- `path` 指定用于确定磁盘空间的路径
- `threshold` 指定可用空间的最小值

阈值可以是字符串，如 `10MB` 或 `200KB`，也可以是字节数。

**JDBC**

JDBC 健康指示器根据在应用程序上下文中成功创建数据源连接的能力来确定应用程序的健康状况。唯一支持的配置选项是通过 endpoints.health.jdbc.enabled 关键字启用或禁用该指标。

**发现客户端**

如果你的应用程序使用服务发现，则会包含一个健康指示器来监控发现客户端的健康状况。返回的数据可包括可用服务列表。

## 15.2.4 指标端点

Micronaut 可通过与 [Micrometer](https://micrometer.io/) 的集成公开应用指标。

:::note 提示
*使用 CLI*

如果使用 Micronaut CLI 创建项目，请提供其中一个 Micrometer 功能以启用指标，并在项目中预先配置所选注册表。例如：

```bash
$ mn create-app my-app --features micrometer-atlas
```
:::

度量端点会返回有关应用程序 "度量 "的信息。要执行指标端点，请向 `/metrics` 发送 `GET` 请求。这将返回可用度量名称的列表。

你可以使用 `/metrics/[name]`（如 `/metrics/jvm.memory.used`）来获取特定指标。

参阅 [Micronaut Micrometer](/micrometer.html) 文档，了解注册表列表以及如何配置、公开和自定义度量输出的信息。

## 15.2.5 刷新端点

刷新端点会刷新应用程序状态，导致上下文中的所有 [Refreshable](https://micronaut-projects.github.io/micronaut-docs-mn3/3.9.4/api/io/micronaut/runtime/context/scope/Refreshable.html) Bean 被销毁，并在收到进一步请求时重新实体化。这是通过在应用程序上下文中发布 [RefreshEvent](https://micronaut-projects.github.io/micronaut-docs-mn3/3.9.4/api/io/micronaut/runtime/context/scope/refresh/RefreshEvent.html) 来实现的。

要执行刷新端点，请向 `/refresh` 发送 `POST` 请求。

```bash
$ curl -X POST http://localhost:8080/refresh
```

在不带正文的情况下执行时，端点会首先刷新 [Enviroment](https://micronaut-projects.github.io/micronaut-docs-mn3/3.9.4/api/io/micronaut/context/env/Environment.html) 并执行差分以检测任何更改，然后仅在检测到更改时才执行刷新。要跳过这一检查并刷新所有 `@Refreshable` Bean，而不管环境是否发生变化（例如，强制刷新第三方服务的缓存响应），请在 `POST` 请求正文中添加一个 `force` 参数。

```bash
$ curl -X POST http://localhost:8080/refresh -H 'Content-Type: application/json' -d '{"force": true}'
```

### 配置

若要配置刷新终结点，请通过 `endpoints.refresh` 提供配置。

*Bean 端点配置示例*

<Tabs>
  <TabItem value="Properties" label="Properties">

```properties
endpoints.refresh.enabled=Boolean
endpoints.refresh.sensitive=Boolean
```

  </TabItem>
  <TabItem value="Yaml" label="Yaml">

```yaml
endpoints:
  refresh:
    enabled: Boolean
    sensitive: Boolean
```

  </TabItem>
    <TabItem value="Toml" label="Toml">

```toml
[endpoints]
  [endpoints.refresh]
    enabled="Boolean"
    sensitive="Boolean"
```

  </TabItem>
    <TabItem value="Groovy" label="Groovy">

```groovy
endpoints {
  refresh {
    enabled = "Boolean"
    sensitive = "Boolean"
  }
}
```

  </TabItem>
    <TabItem value="Hoon" label="Hoon">

```hocon
{
  endpoints {
    refresh {
      enabled = "Boolean"
      sensitive = "Boolean"
    }
  }
}
```

  </TabItem>
    <TabItem value="JSON" label="JSON">

```json
{
  "endpoints": {
    "refresh": {
      "enabled": "Boolean",
      "sensitive": "Boolean"
    }
  }
}
```

  </TabItem>
</Tabs>

## 15.2.6 路由端点

路由端点会返回可为应用程序调用的 URI 的相关信息。默认情况下，返回的数据包括 URI、允许的方法、生成的内容类型以及将执行的方法的相关信息。

要执行 routes 端点，请向 `/routes` 发送 `GET` 请求。

**配置**

要配置路由端点，请通过 `endpoints.routes` 提供配置。

*路由端点配置示例*

<Tabs>
  <TabItem value="Properties" label="Properties">

```properties
endpoints.routes.enabled=Boolean
endpoints.routes.sensitive=Boolean
```

  </TabItem>
  <TabItem value="Yaml" label="Yaml">

```yaml
endpoints:
  routes:
    enabled: Boolean
    sensitive: Boolean
```

  </TabItem>
    <TabItem value="Toml" label="Toml">

```toml
[endpoints]
  [endpoints.routes]
    enabled="Boolean"
    sensitive="Boolean"
```

  </TabItem>
    <TabItem value="Groovy" label="Groovy">

```groovy
endpoints {
  routes {
    enabled = "Boolean"
    sensitive = "Boolean"
  }
}
```

  </TabItem>
    <TabItem value="Hoon" label="Hoon">

```hocon
{
  endpoints {
    routes {
      enabled = "Boolean"
      sensitive = "Boolean"
    }
  }
}
```

  </TabItem>
    <TabItem value="JSON" label="JSON">

```json
{
  "endpoints": {
    "routes": {
      "enabled": "Boolean",
      "sensitive": "Boolean"
    }
  }
}
```

  </TabItem>
</Tabs>

---

### 引导

路由端点由路由数据收集器和路由数据实现器组成。路由数据收集器 ([RouteDataCollector](https://micronaut-projects.github.io/micronaut-docs-mn3/3.9.4/api/io/micronaut/management/endpoint/routes/RouteDataCollector.html)) 负责返回一个发布者，该发布者会返回响应中使用的数据。路由数据 ([RouteData](https://micronaut-projects.github.io/micronaut-docs-mn3/3.9.4/api/io/micronaut/management/endpoint/routes/RouteData.html)) 负责返回有关单个路由的数据。

要覆盖任何一个辅助类的默认行为，要么扩展默认实现（[DefaultRouteDataCollector](https://micronaut-projects.github.io/micronaut-docs-mn3/3.9.4/api/io/micronaut/management/endpoint/routes/impl/DefaultRouteDataCollector.html)、[DefaultRouteData](https://micronaut-projects.github.io/micronaut-docs-mn3/3.9.4/api/io/micronaut/management/endpoint/routes/impl/DefaultRouteData.html)），要么直接实现相关接口。为确保使用您的实现而不是默认实现，请在你的类中添加 [@Replaces](https://micronaut-projects.github.io/micronaut-docs-mn3/3.9.4/api/io/micronaut/context/annotation/Replaces.html) 注解，其值为默认实现。

## 15.2.7 记录器端点

日志记录器端点返回应用程序中可用日志记录器的信息，并允许配置其日志级别。

:::tip 注意
日志记录器端点默认为禁用，必须通过设置 `endpoints.loggers.enabled=true` 明确启用。
:::

要按名称收集所有日志记录器及其配置的有效日志级别，请向 `/loggers` 发送 `GET` 请求。这也提供了可用日志级别的列表。

```bash
$ curl http://localhost:8080/loggers

{
    "levels": [
        "ALL", "TRACE", "DEBUG", "INFO", "WARN", "ERROR", "OFF", "NOT_SPECIFIED"
    ],
    "loggers": {
        "ROOT": {
            "configuredLevel": "INFO",
            "effectiveLevel": "INFO"
        },
        "io": {
            "configuredLevel": "NOT_SPECIFIED",
            "effectiveLevel": "INFO"
        },
        "io.micronaut": {
            "configuredLevel": "NOT_SPECIFIED",
            "effectiveLevel": "INFO"
        },
        // etc...
    }
}
```

要获取特定日志记录器的日志级别，请在 GET 请求中包含日志记录器名称。例如，要访问日志记录器 `io.micronaut.http` 的日志级别，请在 `GET` 请求中包含日志记录器名称：

```bash
$ curl http://localhost:8080/loggers/io.micronaut.http

{
    "configuredLevel": "NOT_SPECIFIED",
    "effectiveLevel": "INFO"
}
```

如果命名的日志记录器不存在，则会以未指定（即 `NOT_SPECIFIED`）配置的日志级别创建（其有效日志级别通常为根日志记录器的级别）。

要更新单个日志记录器的日志级别，请向已命名的日志记录器 URL 发送 `POST` 请求，并在正文中提供要配置的日志级别。

```bash
$ curl -i -X POST \
       -H "Content-Type: application/json" \
       -d '{ "configuredLevel": "ERROR" }' \
       http://localhost:8080/loggers/ROOT

HTTP/1.1 200 OK

$ curl http://localhost:8080/loggers/ROOT

{
    "configuredLevel": "ERROR",
    "effectiveLevel": "ERROR"
}
```

### 配置

若要配置记录器终结点，请通过 `endpoints.loggers` 提供配置。

*记录器端点配置示例*

<Tabs>
  <TabItem value="Properties" label="Properties">

```properties
endpoints.loggers.enabled=Boolean
endpoints.loggers.sensitive=Boolean
```

  </TabItem>
  <TabItem value="Yaml" label="Yaml">

```yaml
endpoints.loggers.enabled=Boolean
endpoints.loggers.sensitive=Boolean
```

  </TabItem>
    <TabItem value="Toml" label="Toml">

```toml
[endpoints]
  [endpoints.loggers]
    enabled="Boolean"
    sensitive="Boolean"
```

  </TabItem>
    <TabItem value="Groovy" label="Groovy">

```groovy
endpoints {
  loggers {
    enabled = "Boolean"
    sensitive = "Boolean"
  }
}
```

  </TabItem>
    <TabItem value="Hoon" label="Hoon">

```hocon
{
  endpoints {
    loggers {
      enabled = "Boolean"
      sensitive = "Boolean"
    }
  }
}
```

  </TabItem>
    <TabItem value="JSON" label="JSON">

```json
{
  "endpoints": {
    "loggers": {
      "enabled": "Boolean",
      "sensitive": "Boolean"
    }
  }
}
```

  </TabItem>
</Tabs>

:::tip 注意
默认情况下，端点不允许未经授权的用户更改日志级别（即使敏感设置为 `false）。要做到这一点，必须将 `endpoints.loggers.write-sensitive` 设置为 `false`。
:::

---

### 定制

日志记录器端点由两个可定制的部分组成：[LoggersManager](https://micronaut-projects.github.io/micronaut-docs-mn3/3.9.4/api/io/micronaut/management/endpoint/loggers/LoggersManager.html) 和 [LoggingSystem](https://micronaut-projects.github.io/micronaut-docs-mn3/3.9.4/api/io/micronaut/logging/LoggingSystem.html)。有关自定义日志系统的信息，参阅[文档的日志部分](/core/logging)。

[LoggersManager](https://micronaut-projects.github.io/micronaut-docs-mn3/3.9.4/api/io/micronaut/management/endpoint/loggers/LoggersManager.html) 负责检索和设置日志级别。如果默认实现无法满足你的使用要求，只需提供你自己的实现，并使用 [@Replaces](https://micronaut-projects.github.io/micronaut-docs-mn3/3.9.4/api/io/micronaut/context/annotation/Replaces.html) 注解替换 [DefaultLoggersManager](https://micronaut-projects.github.io/micronaut-docs-mn3/3.9.4/api/io/micronaut/management/endpoint/loggers/impl/DefaultLoggersManager.html) 即可。

## 15.2.8 缓存端点

缓存端点文档可在 [micronaut-cache 项目](/cache/endpoint.html)中获取。

## 15.2.9 服务器停止端点

停止端点关闭应用服务器。

要执行停止端点，请发送 `POST` 请求到 `/stop` 。

### 配置

要配置停止端点，请通过 `endpoints.stop` 提供配置。

*停止端点配置示例*

<Tabs>
  <TabItem value="Properties" label="Properties">

```properties
endpoints.stop.enabled=Boolean
endpoints.stop.sensitive=Boolean
```

  </TabItem>
  <TabItem value="Yaml" label="Yaml">

```yaml
endpoints:
  stop:
    enabled: Boolean
    sensitive: Boolean
```

  </TabItem>
    <TabItem value="Toml" label="Toml">

```toml
[endpoints]
  [endpoints.stop]
    enabled="Boolean"
    sensitive="Boolean"
```

  </TabItem>
    <TabItem value="Groovy" label="Groovy">

```groovy
endpoints {
  stop {
    enabled = "Boolean"
    sensitive = "Boolean"
  }
}
```

  </TabItem>
    <TabItem value="Hoon" label="Hoon">

```hocon
{
  endpoints {
    stop {
      enabled = "Boolean"
      sensitive = "Boolean"
    }
  }
}
```

  </TabItem>
    <TabItem value="JSON" label="JSON">

```json
{
  "endpoints": {
    "stop": {
      "enabled": "Boolean",
      "sensitive": "Boolean"
    }
  }
}
```

  </TabItem>
</Tabs>

:::tip 注意
默认情况下，停止端点是禁用的，必须明确启用才能使用。
:::

## 15.2.10 环境端点

环境巾返回有关[环境](https://micronaut-projects.github.io/micronaut-docs-mn3/3.9.4/api/io/micronaut/context/env/Environment.html)端点及其 [PropertySource](https://micronaut-projects.github.io/micronaut-docs-mn3/3.9.4/api/io/micronaut/context/env/PropertySource.html) 的信息。

**配置**

要启用和配置环境端点，请通过 `endpoints.env` 进行配置。

*环境端点配置示例*

<Tabs>
  <TabItem value="Properties" label="Properties">

```properties
endpoints.env.enabled=Boolean
endpoints.env.sensitive=Boolean
```

  </TabItem>
  <TabItem value="Yaml" label="Yaml">

```yaml
endpoints:
  env:
    enabled: Boolean
    sensitive: Boolean
```

  </TabItem>
    <TabItem value="Toml" label="Toml">

```toml
[endpoints]
  [endpoints.env]
    enabled="Boolean"
    sensitive="Boolean"
```

  </TabItem>
    <TabItem value="Groovy" label="Groovy">

```groovy
endpoints {
  env {
    enabled = "Boolean"
    sensitive = "Boolean"
  }
}
```

  </TabItem>
    <TabItem value="Hoon" label="Hoon">

```hocon
{
  endpoints {
    env {
      enabled = "Boolean"
      sensitive = "Boolean"
    }
  }
}
```

  </TabItem>
    <TabItem value="JSON" label="JSON">

```json
{
  "endpoints": {
    "env": {
      "enabled": "Boolean",
      "sensitive": "Boolean"
    }
  }
}
```

  </TabItem>
</Tabs>

- 默认情况下，`enabled` 为 `false`，`sensitive` 为 `true`

默认情况下，端点将屏蔽所有值。要自定义屏蔽，您需要提供一个实现 [EnvironmentEndpointFilter](https://micronaut-projects.github.io/micronaut-docs-mn3/3.9.4/api/io/micronaut/management/endpoint/env/EnvironmentEndpointFilter.html) 的 Bean。

第一个示例将屏蔽所有值，但前缀为 `safe` 的值除外

*环境屏蔽的第一个示例*

```java
@Singleton
public class OnlySafePrefixedEnvFilter implements EnvironmentEndpointFilter {
    private static final Pattern SAFE_PREFIX_PATTERN = Pattern.compile("safe.*", Pattern.CASE_INSENSITIVE);

    @Override
    public void specifyFiltering(@NotNull EnvironmentFilterSpecification specification) {
        specification
                .maskAll() // All values will be masked apart from the supplied patterns
                .exclude(SAFE_PREFIX_PATTERN);
    }
}
```

也可以使用 [maskNone--](https://micronaut-projects.github.io/micronaut-docs-mn3/3.9.4/api/io/micronaut/management/endpoint/env/EnvironmentFilterSpecification.html#maskNone--) 允许纯文本中的所有值，然后指定将被屏蔽的名称模式，即：

*拒绝而不是允许*

```java
@Singleton
public class AllPlainExceptSecretOrMatchEnvFilter implements EnvironmentEndpointFilter {
    // Mask anything starting with `sekrt`
    private static final Pattern SECRET_PREFIX_PATTERN = Pattern.compile("sekrt.*", Pattern.CASE_INSENSITIVE);

    // Mask anything exactly matching `exact-match`
    private static final String EXACT_MATCH = "exact-match";

    // Mask anything that starts with `private.`
    private static final Predicate<String> PREDICATE_MATCH = name -> name.startsWith("private.");

    @Override
    public void specifyFiltering(@NotNull EnvironmentFilterSpecification specification) {
        specification
                .maskNone() // All values will be in plain-text apart from the supplied patterns
                .exclude(SECRET_PREFIX_PATTERN)
                .exclude(EXACT_MATCH)
                .exclude(PREDICATE_MATCH);
    }
}
```

通过调用 [legacyMasking--](https://micronaut-projects.github.io/micronaut-docs-mn3/3.9.4/api/io/micronaut/management/endpoint/env/EnvironmentFilterSpecification.html#legacyMasking--) 方法，可以应用合理的默认值。这将显示除名称中包含 `password`、`credential`、`certificate`、`key`、`secret` 或 `token` 字样的值以外的所有值。

---

### 获取环境信息

要执行端点，请向 `/env` 发送 `GET` 请求。

---

### 获取特定 `PropertySource` 的信息

要执行端点，请向 `/env/{propertySourceName}` 发送 `GET` 请求。

## 15.2.11 线程转储端点


线程转储（threaddump）端点会返回应用程序中运行的线程信息。

要执行线程转储端点，请向 `/threaddump` 发送 `GET` 请求。

**配置**

要配置线程转储端点，请通过 `endpoints.threaddump` 提供配置。

*线程转储端点配置示例*

<Tabs>
  <TabItem value="Properties" label="Properties">

```properties
endpoints.threaddump.enabled=Boolean
endpoints.threaddump.sensitive=Boolean
```

  </TabItem>
  <TabItem value="Yaml" label="Yaml">

```yaml
endpoints:
  threaddump:
    enabled: Boolean
    sensitive: Boolean
```

  </TabItem>
    <TabItem value="Toml" label="Toml">

```toml
[endpoints]
  [endpoints.threaddump]
    enabled="Boolean"
    sensitive="Boolean"
```

  </TabItem>
    <TabItem value="Groovy" label="Groovy">

```groovy
endpoints {
  threaddump {
    enabled = "Boolean"
    sensitive = "Boolean"
  }
}
```

  </TabItem>
    <TabItem value="Hoon" label="Hoon">

```hocon
{
  endpoints {
    threaddump {
      enabled = "Boolean"
      sensitive = "Boolean"
    }
  }
}
```

  </TabItem>
    <TabItem value="JSON" label="JSON">

```json
{
  "endpoints": {
    "threaddump": {
      "enabled": "Boolean",
      "sensitive": "Boolean"
    }
  }
}
```

  </TabItem>
</Tabs>

---

### 定制

线程转储端点委派给 [ThreadInfoMapper](https://micronaut-projects.github.io/micronaut-docs-mn3/3.9.4/api/io/micronaut/management/endpoint/threads/ThreadInfoMapper.html)，后者负责将 `java.lang.management.ThreadInfo` 对象转换为其他任何对象，以便发送序列化。

> [英文链接](https://micronaut-projects.github.io/micronaut-docs-mn3/3.9.4/guide/index.html#providedEndpoints)

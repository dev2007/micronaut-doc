---
sidebar_position: 10
---

# 8.1 云配置

为云构建的应用程序通常需要适应在云环境中运行，以分布式方式读取和共享配置，并在必要时将配置外部化到环境中。

Micronaut 的[环境](./core/config#41-环境)概念默认为云平台感知，并尽最大努力检测底层活动环境。

然后，你可以使用 [Requires](https://micronaut-projects.github.io/micronaut-docs-mn3/3.9.4/api/io/micronaut/context/annotation/Requires.html) 注解[有条件地加载 Bean 定义](./core/ioc#39-条件-bean)。

下表总结了[环境](./core/config#41-环境)接口中的常量，并提供了一个示例：

*表 1.Micronaut 环境检测*

|常量|描述|Requires 示例|环境名字|
|--|--|--|--|
|[ANDROID](https://micronaut-projects.github.io/micronaut-docs-mn3/3.9.4/api/io/micronaut/context/env/Environment.html#ANDROID)|应用程序作为 Android 应用程序运行|`@Requires(env = Environment.ANDROID)`|android|
|[TEST](https://micronaut-projects.github.io/micronaut-docs-mn3/3.9.4/api/io/micronaut/context/env/Environment.html#TEST)|应用程序在 JUnit 或 Spock 测试中运行|`@Requires(env = Environment.TEST)`|test|
|[CLOUD](https://micronaut-projects.github.io/micronaut-docs-mn3/3.9.4/api/io/micronaut/context/env/Environment.html#CLOUD)|应用程序在云环境中运行（适用于所有其他云平台类型）|`@Requires(env = Environment.CLOUD)`|cloud|
|[AMAZON_EC2](https://micronaut-projects.github.io/micronaut-docs-mn3/3.9.4/api/io/micronaut/context/env/Environment.html#AMAZON_EC2)|在 [Amazon EC2](https://micronaut-projects.github.io/micronaut-docs-mn3/3.9.4/api/io/micronaut/context/env/Environment.html#AMAZON_EC2) 上运行|`@Requires(env = Environment.AMAZON_EC2)`|ec2|
|[GOOGLE_COMPUTE](https://micronaut-projects.github.io/micronaut-docs-mn3/3.9.4/api/io/micronaut/context/env/Environment.html#GOOGLE_COMPUTE)|在 [Google Compute](https://micronaut-projects.github.io/micronaut-docs-mn3/3.9.4/api/io/micronaut/context/env/Environment.html#GOOGLE_COMPUTE) 上运行|`@Requires(env = Environment.GOOGLE_COMPUTE)`|gcp|
|[KUBERNETES](https://micronaut-projects.github.io/micronaut-docs-mn3/3.9.4/api/io/micronaut/context/env/Environment.html#KUBERNETES)|在 [Kubernetes](https://micronaut-projects.github.io/micronaut-docs-mn3/3.9.4/api/io/micronaut/context/env/Environment.html#KUBERNETES) 上运行|`@Requires(env = Environment.KUBERNETES)`|k8s|
|[HEROKU](https://micronaut-projects.github.io/micronaut-docs-mn3/3.9.4/api/io/micronaut/context/env/Environment.html#HEROKU)|在 [Heroku](https://micronaut-projects.github.io/micronaut-docs-mn3/3.9.4/api/io/micronaut/context/env/Environment.html#HEROKU) 上运行|`@Requires(env = Environment.HEROKU)`|heroku|
|[CLOUD_FOUNDRY](https://micronaut-projects.github.io/micronaut-docs-mn3/3.9.4/api/io/micronaut/context/env/Environment.html#CLOUD_FOUNDRY)|在 [Cloud Foundry](https://micronaut-projects.github.io/micronaut-docs-mn3/3.9.4/api/io/micronaut/context/env/Environment.html#CLOUD_FOUNDRY) 上运行|`@Requires(env = Environment.CLOUD_FOUNDRY)`|pcf|
|[AZURE](https://micronaut-projects.github.io/micronaut-docs-mn3/3.9.4/api/io/micronaut/context/env/Environment.html#AZURE)|在 [Microsoft Azure](https://micronaut-projects.github.io/micronaut-docs-mn3/3.9.4/api/io/micronaut/context/env/Environment.html#AZURE) 上运行|`@Requires(env = Environment.AZURE)`|azure|
|[IBM](https://micronaut-projects.github.io/micronaut-docs-mn3/3.9.4/api/io/micronaut/context/env/Environment.html#IBM)|在 [IBM Cloud](https://micronaut-projects.github.io/micronaut-docs-mn3/3.9.4/api/io/micronaut/context/env/Environment.html#IBM) 上运行|`@Requires(env = Environment.IBM)`|ibm|
|[DIGITAL_OCEAN](https://micronaut-projects.github.io/micronaut-docs-mn3/3.9.4/api/io/micronaut/context/env/Environment.html#DIGITAL_OCEAN)|在 [Digital Ocean](https://micronaut-projects.github.io/micronaut-docs-mn3/3.9.4/api/io/micronaut/context/env/Environment.html#DIGITAL_OCEAN) 上运行|`@Requires(env = Environment.DIGITAL_OCEAN)`|digitalocean|
|[ORACLE_CLOUD](https://micronaut-projects.github.io/micronaut-docs-mn3/3.9.4/api/io/micronaut/context/env/Environment.html#ORACLE_CLOUD)|在 [Oracle Cloud](https://micronaut-projects.github.io/micronaut-docs-mn3/3.9.4/api/io/micronaut/context/env/Environment.html#ORACLE_CLOUD) 上运行|`@Requires(env = Environment.ORACLE_CLOUD)`|oraclecloud|

请注意，你可以有多个活动环境，例如在 AWS 的 Kubernetes 中运行时。

此外，使用上表中定义的常量值可以创建特定环境的配置文件。例如，如果创建了 `src/main/resources/application-gcp.yml` 文件，只有在 Google Compute 上运行时才会加载该文件。

:::note 提示
环境中的任何配置属性也可以通过[环境](https://micronaut-projects.github.io/micronaut-docs-mn3/3.9.4/api/io/micronaut/context/env/Environment.html)变量来设置。例如，设置 `CONSUL_CLIENT_HOST`  环境变量可覆盖 [ConsulConfiguration](https://micronaut-projects.github.io/micronaut-discovery-client/latest/api/io/micronaut/discovery/consul/ConsulConfiguration.html) 中的 `host` 属性。
:::

## 使用云实例元数据

当 Micronaut 检测到它在受支持的云平台上运行时，它就会在启动时填充 [ComputeInstanceMetadata](https://micronaut-projects.github.io/micronaut-docs-mn3/3.9.4/api/io/micronaut/discovery/cloud/ComputeInstanceMetadata.html) 接口。

:::note 提示
从 Micronaut 2.1.x 开始，这一逻辑取决于是否存在 Oracle Cloud、AWS 或 GCP 的相应核心云模块。
:::

所有这些数据都会合并到正在运行的[ServiceInstance](https://micronaut-projects.github.io/micronaut-docs-mn3/3.9.4/api/io/micronaut/discovery/ServiceInstance.html)的元数据属性中。

要访问应用程序实例的元数据，你可以使用 [EmbeddedServerInstance](https://micronaut-projects.github.io/micronaut-docs-mn3/3.9.4/api/io/micronaut/discovery/EmbeddedServerInstance.html) 接口并调用 `getMetadata()`，它会返回一个元数据映射表。

如果通过客户端进行远程连接，一旦从[LoadBalancer](https://micronaut-projects.github.io/micronaut-docs-mn3/3.9.4/api/io/micronaut/http/client/LoadBalancer.html)或 DiscoveryClient API 获取了[ServiceInstance](https://micronaut-projects.github.io/micronaut-docs-mn3/3.9.4/api/io/micronaut/discovery/ServiceInstance.html)，就可以引用实例元数据。

:::note 提示
Netflix Ribbon 客户端负载平衡器可配置为使用元数据进行区域感知客户端负载平衡。参阅[客户端负载平衡](./clientSideLoadBalancing)
:::

要通过[服务发现](./serviceDiscovery)获取服务的元数据，可使用 [LoadBalancerResolver](https://micronaut-projects.github.io/micronaut-docs-mn3/3.9.4/api/io/micronaut/http/client/LoadBalancerResolver.html) 接口来解析 [LoadBalancer](https://micronaut-projects.github.io/micronaut-docs-mn3/3.9.4/api/io/micronaut/http/client/LoadBalancer.html) 并通过标识符获取服务的引用：

*获取服务实例的元数据*

```java
LoadBalancer loadBalancer = loadBalancerResolver.resolve("some-service");
Flux.from(
    loadBalancer.select()
).subscribe((instance) ->
    ConvertibleValues<String> metaData = instance.getMetadata();
    ...
);
```

[EmbeddedServerInstance](https://micronaut-projects.github.io/micronaut-docs-mn3/3.9.4/api/io/micronaut/discovery/EmbeddedServerInstance.html) 可通过监听 [ServiceReadyEvent](https://micronaut-projects.github.io/micronaut-docs-mn3/3.9.4/api/io/micronaut/discovery/event/ServiceReadyEvent.html) 的事件监听器使用。使用 [@EventListener](https://micronaut-projects.github.io/micronaut-docs-mn3/3.9.4/api/io/micronaut/runtime/event/annotation/EventListener.html) 注解可以轻松地在你的 Bean 中监听事件。

要获取本地运行服务器的元数据，请使用 [ServiceReadyEvent](https://micronaut-projects.github.io/micronaut-docs-mn3/3.9.4/api/io/micronaut/discovery/event/ServiceReadyEvent.html) 的[事件监听器](../../core/ioc#314-bean-事件)：

*获取本地服务器的元数据*

```java
@EventListener
void onServiceStarted(ServiceReadyEvent event) {
    ServiceInstance serviceInstance = event.getSource();
    ConvertibleValues<String> metadata = serviceInstance.getMetadata();
}
```

## 8.1.1 分页式配置

正如你所看到的，Micronaut 拥有一个强大的系统，用于外部化配置并使其适应环境，其灵感来自 Grails 和 Spring Boot 中的类似方法。

但是，如果你想让多个微服务共享配置，该怎么办呢？Micronaut 包含用于分布式配置的 API。

[ConfigurationClient](https://micronaut-projects.github.io/micronaut-docs-mn3/3.9.4/api/io/micronaut/discovery/config/ConfigurationClient.html) 接口有一个 `getPropertySources` 方法，可用于从分布式源读取和解析配置。

`getPropertySources` 返回一个[Publisher](http://www.reactive-streams.org/reactive-streams-1.0.3-javadoc/org/reactivestreams/Publisher.html)，该发布者发布零或多个 [PropertySource](https://micronaut-projects.github.io/micronaut-docs-mn3/3.9.4/api/io/micronaut/context/env/PropertySource.html) 实例。

默认实现是 [DefaultCompositeConfigurationClient](https://micronaut-projects.github.io/micronaut-docs-mn3/3.9.4/api/io/micronaut/discovery/config/DefaultCompositeConfigurationClient.html)，它将所有已注册的 `ConfigurationClient` Bean 合并为一个 Bean。

你可以实现自己的 [ConfigurationClient](https://micronaut-projects.github.io/micronaut-docs-mn3/3.9.4/api/io/micronaut/discovery/config/ConfigurationClient.html) 或使用 Micronaut 提供的实现。下面的章节将介绍。

## 8.1.2 HashiCorp Consul 支持

[Consul](https://www.consul.io/) 是由 HashiCorp 提供的一种流行的服务发现和分布式配置服务器。Micronaut 有一个本地 [ConsulClient](https://micronaut-projects.github.io/micronaut-discovery-client/latest/api/io/micronaut/discovery/consul/client/v1/ConsulClient.html)，它使用 Micronaut 对[声明式 HTTP 客户端](../../core/httpclient/clientAnnotation)的支持。

### 启动 Consul

开始使用 Consul 的最快方法是通过 Docker：

1. 使用 Docker 启动 Consul

```bash
docker run -p 8500:8500 consul
```

或者，你也可以[安装并运行一个本地 Consul 实例](https://www.consul.io/docs/install)。

---

### 使用 Consul 启用分布式配置

:::note 提示
**使用 CLI**

如果使用 Micronaut CLI 创建项目，请提供 config-consul 特性，以便在项目中启用 Consul 的分布式配置：

```bash
$ mn create-app my-app --features config-consul
```
:::

要启用分布式配置，请确保已启用 [[bootstrap]](../../core/config#49-引导配置)，并使用以下配置创建一个 `src/main/resources/bootstrap.[yml/toml/properties]` 文件：

import Tabs from '@theme/Tabs';
import TabItem from '@theme/TabItem';

<Tabs>
  <TabItem value="Properties" label="Properties">

```properties
micronaut.application.name=hello-world
micronaut.config-client.enabled=true
consul.client.defaultZone=${CONSUL_HOST:localhost}:${CONSUL_PORT:8500}
```

  </TabItem>
  <TabItem value="Yaml" label="Yaml">

```yaml
micronaut:
  application:
    name: hello-world
  config-client:
    enabled: true
consul:
  client:
    defaultZone: "${CONSUL_HOST:localhost}:${CONSUL_PORT:8500}"
```

  </TabItem>
    <TabItem value="Toml" label="Toml">

```toml
[micronaut]
  [micronaut.application]
    name="hello-world"
  [micronaut.config-client]
    enabled=true
[consul]
  [consul.client]
    defaultZone="${CONSUL_HOST:localhost}:${CONSUL_PORT:8500}"
```

  </TabItem>
    <TabItem value="Groovy" label="Groovy">

```groovy
micronaut {
  application {
    name = "hello-world"
  }
  configClient {
    enabled = true
  }
}
consul {
  client {
    defaultZone = "${CONSUL_HOST:localhost}:${CONSUL_PORT:8500}"
  }
}
```

  </TabItem>
    <TabItem value="Hoon" label="Hoon">

```hocon
{
  micronaut {
    application {
      name = "hello-world"
    }
    config-client {
      enabled = true
    }
  }
  consul {
    client {
      defaultZone = "${CONSUL_HOST:localhost}:${CONSUL_PORT:8500}"
    }
  }
}
```

  </TabItem>
    <TabItem value="JSON" label="JSON">

```json
{
  "micronaut": {
    "application": {
      "name": "hello-world"
    },
    "config-client": {
      "enabled": true
    }
  },
  "consul": {
    "client": {
      "defaultZone": "${CONSUL_HOST:localhost}:${CONSUL_PORT:8500}"
    }
  }
}
```

  </TabItem>
</Tabs>

启用分布式配置后，在 Consul 的键/值存储中存储要共享的配置。有多种方法可以做到这一点。

---

### 以键/值对形式存储配置

一种方法是直接在 Consul 中存储键和值。在这种情况下，默认情况下 Micronaut 会在 Consul `/config` 目录中查找配置。

:::note 提示
你可以通过设置 `consul.client.config.path` 来改变搜索路径。
:::

在 `/config` 目录中，Micronaut 按优先顺序搜索下列目录中的值：

*表 1.配置解析优先级*

|目录|描述|
|--|--|
|`/config/application`|所有应用程序共享配置|
|`/config/application,prod`|prod 环境中所有应用程序共享的配置|
|`/config/[APPLICATION_NAME]`|特定于应用程序的配置，例如 `/config/hello-world`|
|`/config/[APPLICATION_NAME],prod`|活动环境的特定应用程序配置|

`APPLICATION_NAME` 的值就是你在 `bootstrap` 配置文件中配置的 `micronaut.application.name` 的值。
要查看实际操作，请使用下面的 cURL 命令在 `/config/application` 目录中存储一个名为 `foo.bar` 的属性，其值为 `myvalue`。

*使用 cURL 写入值*

```bash
curl -X PUT -d @- localhost:8500/v1/kv/config/application/foo.bar <<< myvalue
```

如果你现在定义了 `@Value("${foo.bar}")`，或调用 `environment.getProperty(..)` 将从 Consul 解析出 `myvalue` 值。

---

### 以 YAML、JSON 等格式存储配置

有些 Consul 用户喜欢用某种格式的 blob 来存储配置，比如 YAML。Micronaut 支持这种模式，并支持以 YAML、JSON 或 Java 属性格式存储配置。

:::note 提示
[ConfigDiscoveryConfiguration](https://micronaut-projects.github.io/micronaut-docs-mn3/3.9.4/api/io/micronaut/discovery/config/ConfigDiscoveryConfiguration.html) 有许多配置选项，用于配置如何发现分布式配置。
:::

你可以设置 `consul.client.config.format` 选项来配置读取属性的格式。

例如，配置 JSON 格式：

<Tabs>
  <TabItem value="Properties" label="Properties">

```properties
consul.client.config.format=JSON
```

  </TabItem>
  <TabItem value="Yaml" label="Yaml">

```yaml
consul:
  client:
    config:
      format: JSON
```

  </TabItem>
    <TabItem value="Toml" label="Toml">

```toml
[consul]
  [consul.client]
    [consul.client.config]
      format="JSON"
```

  </TabItem>
    <TabItem value="Groovy" label="Groovy">

```groovy
consul {
  client {
    config {
      format = "JSON"
    }
  }
}
```

  </TabItem>
    <TabItem value="Hoon" label="Hoon">

```hocon
{
  consul {
    client {
      config {
        format = "JSON"
      }
    }
  }
}
```

  </TabItem>
    <TabItem value="JSON" label="JSON">

```json
{
  "consul": {
    "client": {
      "config": {
        "format": "JSON"
      }
    }
  }
}
```

  </TabItem>
</Tabs>

现在将配置以 JSON 格式写入 Consul：

*使用 cURL 编写 JSON*

```bash
curl -X PUT  localhost:8500/v1/kv/config/application \
-d @- << EOF
{ "foo": {  "bar": "myvalue" } }
EOF
```

---

### 将配置存储为文件引用

另一个流行的选项是 [git2consul](https://github.com/breser/git2consul)，它能将 Git 仓库的内容镜像到 Consul 的键/值存储。

你可以建立一个包含 `application.yml`、`hello-world-test.json` 等文件的 Git 仓库，这些文件的内容将被克隆到 Consul 中。

在这种情况下，Consul 中的每个键都代表一个带扩展名的文件，例如 `/config/application.yml`，你必须配置 `FILE` 格式：

<Tabs>
  <TabItem value="Properties" label="Properties">

```properties
consul.client.config.format=FILE
```

  </TabItem>
  <TabItem value="Yaml" label="Yaml">

```yaml
consul:
  client:
    config:
      format: FILE
```

  </TabItem>
    <TabItem value="Toml" label="Toml">

```toml
[consul]
  [consul.client]
    [consul.client.config]
      format="FILE"
```

  </TabItem>
    <TabItem value="Groovy" label="Groovy">

```groovy
consul {
  client {
    config {
      format = "FILE"
    }
  }
}
```

  </TabItem>
    <TabItem value="Hoon" label="Hoon">

```hocon
{
  consul {
    client {
      config {
        format = "FILE"
      }
    }
  }
}
```

  </TabItem>
    <TabItem value="JSON" label="JSON">

```json
{
  "consul": {
    "client": {
      "config": {
        "format": "FILE"
      }
    }
  }
}
```

  </TabItem>
</Tabs>

## 8.1.3 HashiCorp Vault 支持

Micronaut 与作为分布式配置源的 HashiCorp Vault 集成。

要启用分布式配置，请确保已启用 [bootstrap]，并创建一个 src/main/resources/bootstrap.[yml/toml/properties]文件，配置如下：

*与 HashiCorp Vault 集成*

<Tabs>
  <TabItem value="Properties" label="Properties">

```properties
micronaut.application.name=hello-world
micronaut.config-client.enabled=true
vault.client.config.enabled=true
```

  </TabItem>
  <TabItem value="Yaml" label="Yaml">

```yaml
micronaut:
  application:
    name: hello-world
  config-client:
    enabled: true

vault:
  client:
    config:
      enabled: true
```

  </TabItem>
    <TabItem value="Toml" label="Toml">

```toml
[micronaut]
  [micronaut.application]
    name="hello-world"
  [micronaut.config-client]
    enabled=true
[vault]
  [vault.client]
    [vault.client.config]
      enabled=true
```

  </TabItem>
    <TabItem value="Groovy" label="Groovy">

```groovy
micronaut {
  application {
    name = "hello-world"
  }
  configClient {
    enabled = true
  }
}
vault {
  client {
    config {
      enabled = true
    }
  }
}
```

  </TabItem>
    <TabItem value="Hoon" label="Hoon">

```hocon
{
  micronaut {
    application {
      name = "hello-world"
    }
    config-client {
      enabled = true
    }
  }
  vault {
    client {
      config {
        enabled = true
      }
    }
  }
}
```

  </TabItem>
    <TabItem value="JSON" label="JSON">

```json
{
  "micronaut": {
    "application": {
      "name": "hello-world"
    },
    "config-client": {
      "enabled": true
    }
  },
  "vault": {
    "client": {
      "config": {
        "enabled": true
      }
    }
  }
}
```

  </TabItem>
</Tabs>

有关所有配置选项，参阅[配置参考](https://micronaut-projects.github.io/micronaut-discovery-client/latest/guide/configurationreference.html#io.micronaut.discovery.vault.config.VaultClientConfiguration)。

Micronaut 使用配置的 micronaut.application.name 从 Vault 查找应用程序的属性源。

*表 1.配置解析优先级*

|目录|描述|
|--|--|
|`/application`|所有应用程序共享配置|
|`/[APPLICATION_NAME]`|特定应用配置|
|`/application/[ENV_NAME]`|活动环境名称中所有应用程序共享的配置|
|`/[APPLICATION_NAME]/[ENV_NAME]`|活动环境名称的特定应用程序配置|

有关如何设置服务器的更多信息，参阅 [HashiCorp Vault 文档](https://www.vaultproject.io/api-docs/secret/kv)。

## 8.1.4 Spring Cloud 配置支持

自 1.1 版起，Micronaut 为那些尚未转向 Consul 等更完整的专用解决方案的用户提供了原生 [Spring 云配置](https://spring.io/projects/spring-cloud-config)功能。

要启用分布式配置，请确保已启用 [[bootstrap]](../../core/config#49-引导配置)，并使用以下配置创建一个 src/main/resources/bootstrap.[yml/toml/properties] 文件：

*与 Spring 云配置集成*

<Tabs>
  <TabItem value="Properties" label="Properties">

```properties
micronaut.application.name=hello-world
micronaut.config-client.enabled=true
spring.cloud.config.enabled=true
spring.cloud.config.uri=http://localhost:8888/
spring.cloud.config.retry-attempts=4
spring.cloud.config.retry-delay=2s
```

  </TabItem>
  <TabItem value="Yaml" label="Yaml">

```yaml
micronaut:
  application:
    name: hello-world
  config-client:
    enabled: true
spring:
  cloud:
    config:
      enabled: true
      uri: http://localhost:8888/
      retry-attempts: 4
      retry-delay: 2s
```

  </TabItem>
    <TabItem value="Toml" label="Toml">

```toml
[micronaut]
  [micronaut.application]
    name="hello-world"
  [micronaut.config-client]
    enabled=true
[spring]
  [spring.cloud]
    [spring.cloud.config]
      enabled=true
      uri="http://localhost:8888/"
      retry-attempts=4
      retry-delay="2s"
```

  </TabItem>
    <TabItem value="Groovy" label="Groovy">

```groovy
micronaut {
  application {
    name = "hello-world"
  }
  configClient {
    enabled = true
  }
}
spring {
  cloud {
    config {
      enabled = true
      uri = "http://localhost:8888/"
      retryAttempts = 4
      retryDelay = "2s"
    }
  }
}
```

  </TabItem>
    <TabItem value="Hoon" label="Hoon">

```hocon
{
  micronaut {
    application {
      name = "hello-world"
    }
    config-client {
      enabled = true
    }
  }
  spring {
    cloud {
      config {
        enabled = true
        uri = "http://localhost:8888/"
        retry-attempts = 4
        retry-delay = "2s"
      }
    }
  }
}
```

  </TabItem>
    <TabItem value="JSON" label="JSON">

```json
{
  "micronaut": {
    "application": {
      "name": "hello-world"
    },
    "config-client": {
      "enabled": true
    }
  },
  "spring": {
    "cloud": {
      "config": {
        "enabled": true,
        "uri": "http://localhost:8888/",
        "retry-attempts": 4,
        "retry-delay": "2s"
      }
    }
  }
}
```

  </TabItem>
</Tabs>

- `retry-attempts` 是可选项，用于指定重试次数。
- `retry-delay` 是可选项，用于指定重试之间的延迟时间。

Micronaut 使用配置的 `micronaut.application.name` 从通过 `spring.cloud.config.uri` 配置的 Spring Cloud 配置服务器中查找应用程序的属性源。

有关如何设置服务器的更多信息，参阅 [Spring Cloud 配置服务器文档](https://spring.io/projects/spring-cloud-config#learn)。

## 8.1.5 AWS 参数存储支持

Micronaut 支持通过 AWS 系统管理器参数存储共享配置。你需要配置以下依赖：

<Tabs>
  <TabItem value="Gradle" label="Gradle">

```groovy
implementation("io.micronaut.aws:micronaut-aws-parameter-store")
```

  </TabItem>
  <TabItem value="Maven" label="Maven">

```xml
<dependency>
    <groupId>io.micronaut.aws</groupId>
    <artifactId>micronaut-aws-parameter-store</artifactId>
</dependency>
```

  </TabItem>
</Tabs>

要启用分布式配置，请确保已启用 [bootstrap](../../core/config#49-引导配置)，并创建包含以下配置的 `src/main/resources/bootstrap.yml` 文件：

<Tabs>
  <TabItem value="Properties" label="Properties">

```properties
micronaut.application.name=hello-world
micronaut.config-client.enabled=true
aws.client.system-manager.parameterstore.enabled=true
```

  </TabItem>
  <TabItem value="Yaml" label="Yaml">

```yaml
micronaut:
  application:
    name: hello-world
  config-client:
    enabled: true
aws:
  client:
    system-manager:
      parameterstore:
        enabled: true
```

  </TabItem>
    <TabItem value="Toml" label="Toml">

```toml
[micronaut]
  [micronaut.application]
    name="hello-world"
  [micronaut.config-client]
    enabled=true
[aws]
  [aws.client]
    [aws.client.system-manager]
      [aws.client.system-manager.parameterstore]
        enabled=true
```

  </TabItem>
    <TabItem value="Groovy" label="Groovy">

```groovy
micronaut {
  application {
    name = "hello-world"
  }
  configClient {
    enabled = true
  }
}
aws {
  client {
    systemManager {
      parameterstore {
        enabled = true
      }
    }
  }
}
```

  </TabItem>
    <TabItem value="Hoon" label="Hoon">

```hocon
{
  micronaut {
    application {
      name = "hello-world"
    }
    config-client {
      enabled = true
    }
  }
  aws {
    client {
      system-manager {
        parameterstore {
          enabled = true
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
  "micronaut": {
    "application": {
      "name": "hello-world"
    },
    "config-client": {
      "enabled": true
    }
  },
  "aws": {
    "client": {
      "system-manager": {
        "parameterstore": {
          "enabled": true
        }
      }
    }
  }
}
```

  </TabItem>
</Tabs>

有关所有配置选项，参阅[配置参考](https://micronaut-projects.github.io/micronaut-aws/latest/guide/configurationreference.html#io.micronaut.discovery.aws.parameterstore.AWSParameterStoreConfiguration)。

你可以从 AWS 控制台 → 系统管理器 → 参数存储配置共享属性。

Micronaut 使用层次结构读取配置值，并支持 `String`、`StringList` 和 `SecureString` 类型。

你也可以通过在下划线 `_` 后加上环境名称来创建特定环境的配置。例如，如果 `micronaut.application.name` 设置为 `helloworld`，那么在 `helloworld_test` 下指定的配置值将只应用于测试环境。

*表 1.配置解析优先级*

|目录|描述|
|--|--|
|`/config/application`|所有应用程序共享配置|
|`/config/[APPLICATION_NAME]`|特定于应用程序的配置，例如 `/config/hello-world`|
|`/config/application_prod`|prod [环境](https://micronaut-projects.github.io/micronaut-docs-mn3/3.9.4/api/io/micronaut/context/env/Environment.html)中所有应用程序共享的配置|
|`/config/[APPLICATION_NAME]_prod`|活动[环境](https://micronaut-projects.github.io/micronaut-docs-mn3/3.9.4/api/io/micronaut/context/env/Environment.html)的特定应用程序配置|

例如，如果在 AWS 参数存储中配置了配置名称 `/config/application_test/server.url`，则任何连接到该参数存储的应用程序都可以使用 `server.url` 检索该值。如果应用程序将 `micronaut.application.name` 配置为 `myapp`，则名称为 `/config/myapp_test/server.url` 的值会覆盖该应用程序的值。

树的每一层都可以由键=值对组成。对于多个键/值对，请将类型设为 `StringList`。

对于特殊的安全信息，如密钥或密码，请使用 `SecureString` 类型。添加和检索值时将自动调用 KMS，并使用账户的默认密钥存储对其进行解密。如果你将配置设置为不使用安全字符串，它们将加密后返回给您，你必须手动解密它们。

## 8.1.6 Oracle Cloud Vault 支持

参阅 [Oracle Cloud Vault 安全分布式配置](../../oracle.html#15-利用-Oracle-云保管库确保分布式配置安全)文档。

## 8.1.7 Google Cloud 发布/订阅支持

参阅 [Micronaut GCP Pub/Sub](../../gcp/secretManager.html#91-分布式配置) 文档。

## 8.1.8 Kubernetes 支持

参阅 [Kubernetes 配置客户端](../../kubernetes#5-配置客户端) 文档。

> [英文链接](https://micronaut-projects.github.io/micronaut-docs-mn3/3.9.4/guide/index.html#cloudConfiguration)

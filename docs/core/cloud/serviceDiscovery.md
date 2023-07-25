---
sidebar_position: 20
---

# 8.2 服务发现

服务发现可让微服务在不知道相关服务的物理位置或 IP 地址的情况下找到彼此。

Micronaut 与多种工具和库集成。参阅 [Micronaut 服务发现文档](../../discoveryclient.html) 了解更多。

## 8.2.1 Consul 支持

参阅 [Micronaut Consul 文档](../../discoveryclient.html#3-consul-支持)。

## 8.2.2 Eureka 支持

参阅 [Micronaut Eureka 文档](../../discoveryclient.html#4-eureka-支持)。

## 8.2.3 Kubernetes 支持

Kubernetes 是一种容器运行时，具有集成服务发现和分布式配置等多种功能。

Micronaut 包括与 Kubernetes 的一级集成。更多详情，参阅 [Micronaut Kubernetes 文档](../../kubernetes.html)。

## 8.2.4 AWS Route 53 支持

要使用 [Route 53 服务发现](https://aws.amazon.com/route53/)，必须满足以下条件：

- 运行某种类型的 EC2 实例
- 拥有 Route 53 托管的域名
- 拥有较新版本的 AWS-CLI（如 14+）。

假设你具备这些条件，那么你就准备好了。它不像 Consul 或 Eureka 那样花哨，但除了 AWS-CLI 的一些初始设置外，没有其他运行软件会出错。

如果在服务中添加自定义健康检查，你甚至可以支持健康检查。要测试你的账户是否可以创建和使用服务发现，参阅集成测试部分。更多信息请访问 https://docs.aws.amazon.com/Route53/latest/APIReference/overview-service-discovery.html。

步骤如下：
1. 使用 AWS-CLI 创建命名空间。您可以根据使用的 IP 或子网创建公共或私有命名空间。
2. 使用 AWS-CLI 命令创建带有 DNS 记录的服务
3. 添加健康检查或自定义健康检查（可选）
4. 在应用程序配置文件中添加服务 ID，如下所示：

*应用程序配置示例*

import Tabs from '@theme/Tabs';
import TabItem from '@theme/TabItem';

<Tabs>
  <TabItem value="Properties" label="Properties">

```properties
aws.route53.registration.enabled=true
aws.route53.registration.aws-service-id=srv-978fs98fsdf
aws.route53.registration.namespace=micronaut.io
micronaut.application.name=something
```

  </TabItem>
  <TabItem value="Yaml" label="Yaml">

```yaml
aws.route53.registration.enabled=true
aws.route53.registration.aws-service-id=srv-978fs98fsdf
aws.route53.registration.namespace=micronaut.io
micronaut.application.name=something
```

  </TabItem>
    <TabItem value="Toml" label="Toml">

```toml
[aws]
  [aws.route53]
    [aws.route53.registration]
      enabled=true
      aws-service-id="srv-978fs98fsdf"
      namespace="micronaut.io"
[micronaut]
  [micronaut.application]
    name="something"
```

  </TabItem>
    <TabItem value="Groovy" label="Groovy">

```groovy
aws {
  route53 {
    registration {
      enabled = true
      awsServiceId = "srv-978fs98fsdf"
      namespace = "micronaut.io"
    }
  }
}
micronaut {
  application {
    name = "something"
  }
}
```

  </TabItem>
    <TabItem value="Hoon" label="Hoon">

```hocon
{
  aws {
    route53 {
      registration {
        enabled = true
        aws-service-id = "srv-978fs98fsdf"
        namespace = "micronaut.io"
      }
    }
  }
  micronaut {
    application {
      name = "something"
    }
  }
}
```

  </TabItem>
    <TabItem value="JSON" label="JSON">

```json
{
  "aws": {
    "route53": {
      "registration": {
        "enabled": true,
        "aws-service-id": "srv-978fs98fsdf",
        "namespace": "micronaut.io"
      }
    }
  },
  "micronaut": {
    "application": {
      "name": "something"
    }
  }
}
```

  </TabItem>
</Tabs>

1. 确保在构建文件中包含以下依赖：

<Tabs>
  <TabItem value="Gradle" label="Gradle">

```groovy
implementation("io.micronaut.aws:micronaut-aws-route53")
```

  </TabItem>
  <TabItem value="Maven" label="Maven">

```xml
<dependency>
    <groupId>io.micronaut.aws</groupId>
    <artifactId>micronaut-aws-route53</artifactId>
</dependency>
```

  </TabItem>
</Tabs>

1. 在客户端，你需要同样的依赖和更少的配置选项：

<Tabs>
  <TabItem value="Properties" label="Properties">

```properties
aws.route53.discovery.client.enabled=true
aws.route53.discovery.client.aws-service-id=srv-978fs98fsdf
aws.route53.discovery.client.namespace-id=micronaut.io
```

  </TabItem>
  <TabItem value="Yaml" label="Yaml">

```yaml
aws:
  route53:
    discovery:
      client:
        enabled: true
        aws-service-id: srv-978fs98fsdf
        namespace-id: micronaut.io
```

  </TabItem>
    <TabItem value="Toml" label="Toml">

```toml
[aws]
  [aws.route53]
    [aws.route53.discovery]
      [aws.route53.discovery.client]
        enabled=true
        aws-service-id="srv-978fs98fsdf"
        namespace-id="micronaut.io"
```

  </TabItem>
    <TabItem value="Groovy" label="Groovy">

```groovy
aws {
  route53 {
    discovery {
      client {
        enabled = true
        awsServiceId = "srv-978fs98fsdf"
        namespaceId = "micronaut.io"
      }
    }
  }
}
```

  </TabItem>
    <TabItem value="Hoon" label="Hoon">

```hocon
{
  aws {
    route53 {
      discovery {
        client {
          enabled = true
          aws-service-id = "srv-978fs98fsdf"
          namespace-id = "micronaut.io"
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
  "aws": {
    "route53": {
      "discovery": {
        "client": {
          "enabled": true,
          "aws-service-id": "srv-978fs98fsdf",
          "namespace-id": "micronaut.io"
        }
      }
    }
  }
}
```

  </TabItem>
</Tabs>

然后，你就可以使用 [DiscoveryClient API](https://micronaut-projects.github.io/micronaut-docs-mn3/3.9.4/api/io/micronaut/discovery/DiscoveryClient.html) 查找通过 Route 53 注册的其他服务。例如

*客户端示例代码*

```java
DiscoveryClient discoveryClient = embeddedServer.getApplicationContext().getBean(DiscoveryClient.class);
List<String> serviceIds = Flux.from(discoveryClient.getServiceIds()).blockFirst();
List<ServiceInstance> instances = Flux.from(discoveryClient.getInstances(serviceIds.get(0))).blockFirst();
```

**创建命名空间**

命名空间类似于常规的 Route53 托管区域，它们会出现在 Route53 控制台中，但控制台不支持修改它们。此时，您必须使用 AWS-CLI 来实现任何服务发现功能。

首先要确定创建的是面向公众的命名空间还是私有命名空间，因为两者的命令不同：

*创建命名空间*

```bash
$ aws servicediscovery create-public-dns-namespace --name micronaut.io --create-request-id create-1522767790 --description adescriptionhere

or

$ aws servicediscovery create-private-dns-namespace --name micronaut.internal.io --create-request-id create-1522767790 --description adescriptionhere --vpc yourvpcID
```

运行该命令后，你将得到一个操作 ID。你可以使用 `get-operation` CLI 命令查看状态：

*获取操作结果*

```bash
$ aws servicediscovery get-operation --operation-id asdffasdfsda
```

你可以使用该命令获取任何返回操作 ID 的调用的状态。

命令的结果将告诉你命名空间的 ID。记下来，接下来的步骤会用到它。如果出现错误，它会说明错误原因。

**创建服务和 DNS 记录**

下一步是创建服务和 DNS 记录。

*创建服务*

```bash
$ aws create-service --name yourservicename --create-request-id somenumber --description someservicedescription --dns-config NamespaceId=yournamespaceid,RoutingPolicy=WEIGHTED,DnsRecords=[{Type=A,TTL=1000},{Type=A,TTL=1000}]
```

`DnsRecord` 类型可以是 `A`(ipv4)、`AAAA`(ipv6)、`SRV` 或 `CNAME`。`RoutingPolicy` 可以是 `WEIGHTED` 或 `MULTIVALUE`。请记住，`CNAME` 必须使用加权路由类型，`SRV` 必须配置有效端口。

要添加健康检查，请在 CLI 上使用以下语法：

*指定健康检查*

```bash
Type=string,ResourcePath=string,FailureThreshold=integer
```

类型可以是 "HTTP"、"HTTPS "或 "TCP"。只能在公共命名空间上使用标准健康检查。请参阅私有命名空间的自定义健康检查。资源路径应该是一个 URL，如果健康，就会返回 `200 OK`。

对于自定义健康检查，只需指定 `--health-check-custom-config FailureThreshold=integer` 即可，它也适用于私有命名空间。

这也很好，因为 Micronaut 会发送脉冲命令，让 AWS 知道实例仍然健康。

如需更多帮助，请运行 "aws discoveryservice create-service help"。

如果该命令成功执行，你将得到一个服务 ID 和一个 ARN。写下来，它将被放入 Micronaut 配置中。

**在 Micronaut 中设置配置**

**自动命名注册**

添加配置，使你的应用程序在 Route 53 自动发现中注册：

*注册属性*

<Tabs>
  <TabItem value="Properties" label="Properties">

```properties
aws.route53.registration.enabled=true
aws.route53.registration.aws-service-id=<enter the service id you got after creation on aws cli>
aws.route53.discovery.namespace-id=<enter the namespace id you got after creating the namespace>
```

  </TabItem>
  <TabItem value="Yaml" label="Yaml">

```yaml
aws:
  route53:
    registration:
      enabled: true
      aws-service-id: <enter the service id you got after creation on aws cli>
    discovery:
      namespace-id: <enter the namespace id you got after creating the namespace>
```

  </TabItem>
    <TabItem value="Toml" label="Toml">

```toml
aws:
  route53:
    registration:
      enabled: true
      aws-service-id: <enter the service id you got after creation on aws cli>
    discovery:
      namespace-id: <enter the namespace id you got after creating the namespace>
```

  </TabItem>
    <TabItem value="Groovy" label="Groovy">

```groovy
aws:
  route53:
    registration:
      enabled: true
      aws-service-id: <enter the service id you got after creation on aws cli>
    discovery:
      namespace-id: <enter the namespace id you got after creating the namespace>
```

  </TabItem>
    <TabItem value="Hoon" label="Hoon">

```hocon
{
  aws {
    route53 {
      registration {
        enabled = true
        aws-service-id = "<enter the service id you got after creation on aws cli>"
      }
      discovery {
        namespace-id = "<enter the namespace id you got after creating the namespace>"
      }
    }
  }
}
```

  </TabItem>
    <TabItem value="JSON" label="JSON">

```json
{
  "aws": {
    "route53": {
      "registration": {
        "enabled": true,
        "aws-service-id": "<enter the service id you got after creation on aws cli>"
      },
      "discovery": {
        "namespace-id": "<enter the namespace id you got after creating the namespace>"
      }
    }
  }
}
```

  </TabItem>
</Tabs>

**发现客户端配置**

*发现属性*

<Tabs>
  <TabItem value="Properties" label="Properties">

```properties
aws.route53.discovery.client.enabled=true
aws.route53.discovery.client.aws-service-id=<enter the service id you got after creation on aws cli>
```

  </TabItem>
  <TabItem value="Yaml" label="Yaml">

```yaml
aws:
  route53:
    discovery:
      client:
        enabled: true
        aws-service-id: <enter the service id you got after creation on aws cli>
```

  </TabItem>
    <TabItem value="Toml" label="Toml">

```toml
[aws]
  [aws.route53]
    [aws.route53.discovery]
      [aws.route53.discovery.client]
        enabled=true
        aws-service-id="<enter the service id you got after creation on aws cli>"
```

  </TabItem>
    <TabItem value="Groovy" label="Groovy">

```groovy
aws {
  route53 {
    discovery {
      client {
        enabled = true
        awsServiceId = "<enter the service id you got after creation on aws cli>"
      }
    }
  }
}
```

  </TabItem>
    <TabItem value="Hoon" label="Hoon">

```hocon
{
  aws {
    route53 {
      discovery {
        client {
          enabled = true
          aws-service-id = "<enter the service id you got after creation on aws cli>"
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
  "aws": {
    "route53": {
      "discovery": {
        "client": {
          "enabled": true,
          "aws-service-id": "<enter the service id you got after creation on aws cli>"
        }
      }
    }
  }
}
```

  </TabItem>
</Tabs>

你还可以通过获取 bean "Route53AutoNamingClient "来调用以下方法：

*发现方法*

```java
// if serviceId is null it will use property "aws.route53.discovery.client.awsServiceId"
Publisher<List<ServiceInstance>> getInstances(String serviceId)
// reads property "aws.route53.discovery.namespaceId"
Publisher<List<String>> getServiceIds()
```

**集成测试**

如果设置了环境变量 AWS_SUBNET_ID，并在主目录中配置了有效的凭据（在 `~/.aws/credentials` 中），则可以运行集成测试。你还需要在 Route53 上托管一个域。该测试将创建一个 t2.nano 实例、一个命名空间和服务，并将该实例注册到服务发现中。测试完成后，它将删除/终止其启动的所有资源。

## 8.2.5 手动服务发现配置

如果不想使用 Consul 这样的服务发现服务器，或者与无法在 Consul 注册的第三方服务交互，可以通过服务发现手动配置可用的服务。

为此，请使用 `micronaut.http.services` 设置。例如

*手动配置服务*

<Tabs>
  <TabItem value="Properties" label="Properties">

```properties
micronaut.http.services.foo.urls[0]=http://foo1
micronaut.http.services.foo.urls[1]=http://foo2
```

  </TabItem>
  <TabItem value="Yaml" label="Yaml">

```yaml
micronaut:
  http:
    services:
      foo:
        urls:
          - http://foo1
          - http://foo2
```

  </TabItem>
    <TabItem value="Toml" label="Toml">

```toml
[micronaut]
  [micronaut.http]
    [micronaut.http.services]
      [micronaut.http.services.foo]
        urls=[
          "http://foo1",
          "http://foo2"
        ]
```

  </TabItem>
    <TabItem value="Groovy" label="Groovy">

```groovy
micronaut {
  http {
    services {
      foo {
        urls = ["http://foo1", "http://foo2"]
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
    http {
      services {
        foo {
          urls = ["http://foo1", "http://foo2"]
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
    "http": {
      "services": {
        "foo": {
          "urls": ["http://foo1", "http://foo2"]
        }
      }
    }
  }
}
```

  </TabItem>
</Tabs>

然后，你可以使用 `@Client("foo")` 注入一个客户端，它将使用上述配置在两个配置的服务器之间进行负载平衡。

:::danger 危险
在服务发现中使用 `@Client` 时，必须在注解中以烤肉串风格指定服务 ID。不过，上面示例中的配置可以使用驼峰风格。
:::

:::note 提示
在生产中，你可以通过指定环境变量（如 `MICRONAUT_HTTP_SERVICES_FOO_URLS=http://prod1,http://prod2`）来覆盖此配置。
:::

请注意，默认情况下不会进行健康检查，以确保所引用的服务处于运行状态。您可以通过启用健康检查和指定健康检查路径（默认为 `/health`）来改变这种情况：

*启用健康检查*

<Tabs>
  <TabItem value="Properties" label="Properties">

```properties
micronaut.http.services.foo.health-check=true
micronaut.http.services.foo.health-check-interval=15s
micronaut.http.services.foo.health-check-uri=/health
```

  </TabItem>
  <TabItem value="Yaml" label="Yaml">

```yaml
micronaut:
  http:
    services:
      foo:
        health-check: true
        health-check-interval: 15s
        health-check-uri: /health
```

  </TabItem>
    <TabItem value="Toml" label="Toml">

```toml
[micronaut]
  [micronaut.http]
    [micronaut.http.services]
      [micronaut.http.services.foo]
        health-check=true
        health-check-interval="15s"
        health-check-uri="/health"
```

  </TabItem>
    <TabItem value="Groovy" label="Groovy">

```groovy
micronaut {
  http {
    services {
      foo {
        healthCheck = true
        healthCheckInterval = "15s"
        healthCheckUri = "/health"
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
    http {
      services {
        foo {
          health-check = true
          health-check-interval = "15s"
          health-check-uri = "/health"
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
    "http": {
      "services": {
        "foo": {
          "health-check": true,
          "health-check-interval": "15s",
          "health-check-uri": "/health"
        }
      }
    }
  }
}
```

  </TabItem>
</Tabs>

- `health-check` 表示是否对服务进行健康检查
- `health-check-interval` 是检查的间隔时间
- `health-check-uri` 指定健康检查请求的端点 URI

Micronaut 启动后台线程检查服务的健康状态，如果任何配置的服务响应错误代码，它们就会从可用服务列表中移除。

> [英文链接](https://micronaut-projects.github.io/micronaut-docs-mn3/3.9.4/guide/index.html#serviceDiscovery)

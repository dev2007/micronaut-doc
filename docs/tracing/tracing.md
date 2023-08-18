---
description: Micronaut Tracing
keywords: [micronaut,micronaut 文档,micronaut 中文文档,文档,Micronaut Tracing,追踪,链路追踪,zipkin,skywalking]
---

# Micronaut 追踪

添加分布式追踪支持。

## 1. 简介

在生产中运行微服务时，对分布式架构中微服务之间的交互进行故障排除可能很有挑战性。

要解决这个问题，以分布式方式可视化微服务之间的交互至关重要。目前，有多种分布式跟踪解决方案，其中最流行的是 [Zipkin](https://zipkin.io/) 和 [Jaeger](https://www.jaegertracing.io/)，它们都为[开放追踪](https://opentracing.io/) API 提供了不同程度的支持。

Micronaut 的特点是与 Zipkin 和 Jaeger（通过开放追踪 API）集成。

### 追踪注解

[io.micronaut.tracing.annotation](https://micronaut-projects.github.io/micronaut-tracing/latest/api/io/micronaut/tracing/annotation/package-summary.html) 包，包含可在方法上声明的注解，以创建新的 span 或延续现有的 span。

可用的注解有：

- [@NewSpan](https://micronaut-projects.github.io/micronaut-tracing/latest/api/io/micronaut/tracing/annotation/NewSpan.html) 注解创建了一个新 span，封装了方法调用或反应类型。
- [@ContinueSpan](https://micronaut-projects.github.io/micronaut-tracing/latest/api/io/micronaut/tracing/annotation/ContinueSpan.html) 注解会延续现有 span，并封装方法调用或反应类型。
- [@SpanTag](https://micronaut-projects.github.io/micronaut-tracing/latest/api/io/micronaut/tracing/annotation/SpanTag.html) 注解可用于方法参数，将参数值包含在 Span 的标记中。在参数上使用 @SpanTag 时，必须使用 @NewSpan 或 @ContinueSpan 对方法进行注解。

下面的代码段提供了一个使用注解的示例：

*使用跟踪注解*

```java
@Singleton
class HelloService {

    @NewSpan("hello-world") (1)
    public String hello(@SpanTag("person.name") String name) { (2)
        return greet("Hello " + name);
    }

    @ContinueSpan (3)
    public String greet(@SpanTag("hello.greeting") String greet) {
        return greet;
    }
}
```

1. [@NewSpan](https://micronaut-projects.github.io/micronaut-tracing/latest/api/io/micronaut/tracing/annotation/NewSpan.html) 注解启动了一个新的 span
2. 使用 [@SpanTag](https://micronaut-projects.github.io/micronaut-tracing/latest/api/io/micronaut/tracing/annotation/SpanTag.html) 将方法参数列为 span 的标记
3. 使用 [@ContinueSpan](https://micronaut-projects.github.io/micronaut-tracing/latest/api/io/micronaut/tracing/annotation/ContinueSpan.html) 注解延续现有 span，并使用 `@SpanTag` 加入其他标记

**追踪工具**

除了显式跟踪标记外，Micronaut 还包含许多工具，以确保 Span 上下文在线程之间和微服务边界之间传播。

这些工具可在 `io.micronaut.tracing.instrument` 包中找到，包括[客户端过滤器](/core/httpclient/clientFilter)和[服务器过滤器](/core/httpserver/filters)，用于通过 HTTP 传播必要的头信息。

---

### 追踪 Bean

如果跟踪注解和现有的工具还不够，Micronaut 的跟踪集成会注册一个 `io.opentracing.Tracer` Bean，该 Bean 公开了开放追踪 API，并可根据需要进行依赖注入。

根据您选择的实现，还可以使用其他 Bean。例如，Zipkin 的 `brave.Tracing` 和 `brave.SpanCustomizer` Bean 也可用。

## 2. 发布历史

关于此项目，您可以在此处找到发布版本列表（含发布说明）：

https://github.com/micronaut-projects/micronaut-tracing/releases

## 3. 重大变更

本节将记录里程碑或候选发布版本以及主要发布版本（例如 1.x.x → 2.x.x）中可能发生的重大更改。

### Micronaut Tracing 4.5.0 重大变更

在 OpenTelemetry `1.19.0` 版中，注解从 `io.opentelemetry.extension.annotations` 移到了 `io.opentelemetry.instrumentation.annotations`。如果要继续使用，必须更新包名。

---

### Micronaut Tracing 5.0.0-M2 重大变更

Micronaut Tracing Zipkin 模块 (`io.micronaut.tracing:micronaut-tracing-zipkin`) 已重命名并分离为两个新模块：

- Micronaut Tracing Brave (`io.micronaut.tracing:micronaut-tracing-brave`)
- Micronaut Tracing Brave HTTP (`io.micronaut.tracing:micronaut-tracing-brave-http`)

如果使用 OpenTracing 和 Micronaut Tracing Zipkin 模块，则必须将 `io.micronaut.tracing:micronaut-tracing-zipkin` 依赖更改为 `io.micronaut.tracing:micronaut-tracing-brave-http`。Micronaut Tracing Brave HTTP 带来了 HTTP 过滤器，用于自动监测请求。如果不需要 HTTP 过滤器，只需添加 `io.micronaut.tracing:micronaut-tracing-brave` 依赖即可。

## 4. 使用 Jaeger 进行追踪

[Jaeger](https://www.jaegertracing.io/) 是 Uber 开发的分布式跟踪系统，或多或少是[开放追踪](https://opentracing.io/)的参考实现。

### 运行 Jaeger

开始使用 Jaeger 的最简单方法是使用 Docker：

```bash
$ docker run -d \
  -e COLLECTOR_ZIPKIN_HTTP_PORT=9411 \
  -p 5775:5775/udp \
  -p 6831:6831/udp \
  -p 6832:6832/udp \
  -p 5778:5778 \
  -p 16686:16686 \
  -p 14268:14268 \
  -p 9411:9411 \
  jaegertracing/all-in-one:1.6
```

导航至 http://localhost:16686 访问 Jaeger 用户界面。

更多信息，参阅 [Jaeger 入门](https://www.jaegertracing.io/docs/getting-started/)。

---

### 向 Jaeger 发送追踪

:::note 提示
*使用 CLI*

如果使用 Micronaut CLI 创建项目，请提供 tracing-jaeger 功能，以便在项目中包含 Jaeger 跟踪功能：

```bash
$ mn create-app my-app --features tracing-jaeger
```
:::

要向 Jaeger 发送跟踪 span，请在构建过程中添加 `micronaut-tracing-jaeger` 依赖：

import Tabs from '@theme/Tabs';
import TabItem from '@theme/TabItem';

<Tabs>
  <TabItem value="Gradle" label="Gradle">

```groovy
implementation("io.micronaut.tracing:micronaut-tracing-jaeger")
```

  </TabItem>
  <TabItem value="Maven" label="Maven">

```xml
<dependency>
    <groupId>io.micronaut.tracing</groupId>
    <artifactId>micronaut-tracing-jaeger</artifactId>
</dependency>
```

  </TabItem>
</Tabs>

然后在配置中启用 Jaeger 追踪（可能只在生产配置中启用）：

<Tabs>
  <TabItem value="Properties" label="Properties">

```properties
tracing.jaeger.enabled=true
```

  </TabItem>
  <TabItem value="Yaml" label="Yaml">

```yaml
tracing:
  jaeger:
    enabled: true
```

  </TabItem>
    <TabItem value="Toml" label="Toml">

```toml
[tracing]
  [tracing.jaeger]
    enabled=true
```

  </TabItem>
    <TabItem value="Groovy" label="Groovy">

```groovy
tracing {
  jaeger {
    enabled = true
  }
}
```

  </TabItem>
    <TabItem value="Hoon" label="Hoon">

```hocon
{
  tracing {
    jaeger {
      enabled = true
    }
  }
}
```

  </TabItem>
    <TabItem value="JSON" label="JSON">

```json
{
  "tracing": {
    "jaeger": {
      "enabled": true
    }
  }
}
```

  </TabItem>
</Tabs>

---

### Jaeger 配置

向 Jaeger 发送 Spans 的 Jaeger 客户端有许多可用的配置选项，它们通常通过 [JaegerConfiguration](https://micronaut-projects.github.io/micronaut-tracing/latest/api/io/micronaut/tracing/jaeger/JaegerConfiguration.html) 类公开。有关可用选项，参阅 Javadoc。

下面是一个自定义JaegerConfiguration配置的例子：

*自定义 Jaeger 配置*

<Tabs>
  <TabItem value="Properties" label="Properties">

```properties
tracing.jaeger.enabled=true
tracing.jaeger.sampler.probability=0.5
tracing.jaeger.sender.agentHost=foo
tracing.jaeger.sender.agentPort=5775
tracing.jaeger.reporter.flushInterval=2000
tracing.jaeger.reporter.maxQueueSize=200
tracing.jaeger.codecs=W3C,B3,JAEGER
```

  </TabItem>
  <TabItem value="Yaml" label="Yaml">

```yaml
tracing:
  jaeger:
    enabled: true
    sampler:
      probability: 0.5
    sender:
      agentHost: foo
      agentPort: 5775
    reporter:
      flushInterval: 2000
      maxQueueSize: 200
    codecs: W3C,B3,JAEGER
```

  </TabItem>
    <TabItem value="Toml" label="Toml">

```toml
[tracing]
  [tracing.jaeger]
    enabled=true
    [tracing.jaeger.sampler]
      probability=0.5
    [tracing.jaeger.sender]
      agentHost="foo"
      agentPort=5775
    [tracing.jaeger.reporter]
      flushInterval=2000
      maxQueueSize=200
    codecs="W3C,B3,JAEGER"
```

  </TabItem>
    <TabItem value="Groovy" label="Groovy">

```groovy
tracing {
  jaeger {
    enabled = true
    sampler {
      probability = 0.5
    }
    sender {
      agentHost = "foo"
      agentPort = 5775
    }
    reporter {
      flushInterval = 2000
      maxQueueSize = 200
    }
    codecs = "W3C,B3,JAEGER"
  }
}
```

  </TabItem>
    <TabItem value="Hoon" label="Hoon">

```hocon
{
  tracing {
    jaeger {
      enabled = true
      sampler {
        probability = 0.5
      }
      sender {
        agentHost = "foo"
        agentPort = 5775
      }
      reporter {
        flushInterval = 2000
        maxQueueSize = 200
      }
      codecs = "W3C,B3,JAEGER"
    }
  }
}
```

  </TabItem>
    <TabItem value="JSON" label="JSON">

```json
{
  "tracing": {
    "jaeger": {
      "enabled": true,
      "sampler": {
        "probability": 0.5
      },
      "sender": {
        "agentHost": "foo",
        "agentPort": 5775
      },
      "reporter": {
        "flushInterval": 2000,
        "maxQueueSize": 200
      },
      "codecs": "W3C,B3,JAEGER"
    }
  }
}
```

  </TabItem>
</Tabs>

你还可以选择将常用的配置类（如 `io.jaegertracing.Configuration.SamplerConfiguration`）定义为 Bean，从而将它们依赖注入到 [JaegerConfiguration](https://micronaut-projects.github.io/micronaut-tracing/latest/api/io/micronaut/tracing/jaeger/JaegerConfiguration.html) 中。同样，自定义的 `io.opentracing.ScopeManager` 也可以注入到 [JaegerTracerFactory](https://micronaut-projects.github.io/micronaut-tracing/latest/api/io/micronaut/tracing/jaeger/JaegerTracerFactory.html) 中。有关可用注入点，参阅 [JaegerConfiguration](https://micronaut-projects.github.io/micronaut-tracing/latest/api/io/micronaut/tracing/jaeger/JaegerConfiguration.html) 和 [JaegerTracerFactory](https://micronaut-projects.github.io/micronaut-tracing/latest/api/io/micronaut/tracing/jaeger/JaegerTracerFactory.html) 的 API。

---

### 过滤 HTTP span

将健康检查和其他 HTTP 请求排除在服务之外可能很有用。这可以通过在配置中添加正则表达式模式列表来实现：

*过滤 HTTP 请求 span*

<Tabs>
  <TabItem value="Properties" label="Properties">

```properties
tracing.jaeger.enabled=true
tracing.exclusions[0]=/health
tracing.exclusions[1]=/env/.*
```

  </TabItem>
  <TabItem value="Yaml" label="Yaml">

```yaml
tracing:
  jaeger:
    enabled: true
  exclusions:
    - /health
    - /env/.*
```

  </TabItem>
    <TabItem value="Toml" label="Toml">

```toml
[tracing]
  [tracing.jaeger]
    enabled=true
  exclusions=[
    "/health",
    "/env/.*"
  ]
```

  </TabItem>
    <TabItem value="Groovy" label="Groovy">

```groovy
tracing {
  jaeger {
    enabled = true
  }
  exclusions = ["/health", "/env/.*"]
}
```

  </TabItem>
    <TabItem value="Hoon" label="Hoon">

```hocon
{
  tracing {
    jaeger {
      enabled = true
    }
    exclusions = ["/health", "/env/.*"]
  }
}
```

  </TabItem>
    <TabItem value="JSON" label="JSON">

```json
{
  "tracing": {
    "jaeger": {
      "enabled": true
    },
    "exclusions": ["/health", "/env/.*"]
  }
}
```

  </TabItem>
</Tabs>

## 5. 使用 Zipkin 追踪

[Zipkin](https://zipkin.io/) 是一个分布式跟踪系统。它有助于收集定时数据，以排除微服务架构中的延迟问题。它同时管理数据的收集和检索。

### 运行 Zipkin

使用 Zipkin 的最快方法是使用 Docker：

*使用 Docker 运行 Zipkin*

```bash
$ docker run -d -p 9411:9411 openzipkin/zipkin
```

导航至 http://localhost:9411 查看轨迹。

---

### 向 Zipkin 发送追踪

:::note 提示
*使用 CLI*

如果使用 Micronaut CLI 创建项目，请提供 tracing-zipkin 功能，以便在项目中包含 Zipkin 跟踪功能：

```bash
$ mn create-app my-app --features tracing-zipkin
```
:::

要向 Zipkin 发送追踪 span，请在构建过程中添加 `micronaut-tracing-brave-http` 依赖：

<Tabs>
  <TabItem value="Gradle" label="Gradle">

```groovy
implementation("io.micronaut.tracing:micronaut-tracing-brave-http")
```

  </TabItem>
  <TabItem value="Maven" label="Maven">

```xml
<dependency>
    <groupId>io.micronaut.tracing</groupId>
    <artifactId>micronaut-tracing-brave-http</artifactId>
</dependency>
```

  </TabItem>
</Tabs>

然后在配置中启用 ZipKin 跟踪（可能只在生产配置中启用）：

<Tabs>
  <TabItem value="Properties" label="Properties">

```properties
tracing.zipkin.enabled=true
```

  </TabItem>
  <TabItem value="Yaml" label="Yaml">

```yaml
tracing:
  zipkin:
    enabled: true
```

  </TabItem>
    <TabItem value="Toml" label="Toml">

```toml
[tracing]
  [tracing.zipkin]
    enabled=true
```

  </TabItem>
    <TabItem value="Groovy" label="Groovy">

```groovy
tracing {
  zipkin {
    enabled = true
  }
}
```

  </TabItem>
    <TabItem value="Hoon" label="Hoon">

```hocon
{
  tracing {
    zipkin {
      enabled = true
    }
  }
}
```

  </TabItem>
    <TabItem value="JSON" label="JSON">

```json
{
  "tracing": {
    "zipkin": {
      "enabled": true
    }
  }
}
```

  </TabItem>
</Tabs>

---

### 定制 Zipkin 发送器

要发送 Spans，需要配置 Zipkin 发送器。您可以配置一个 [HttpClientSender](https://micronaut-projects.github.io/micronaut-tracing/latest/api/io/micronaut/tracing/brave/sender/HttpClientSender.html)，使用 Micronaut 的本地 HTTP 客户端和 `tracing.zipkin.http.url` 设置异步发送 Spans：

*配置多个 Zipkin 服务器*

<Tabs>
  <TabItem value="Properties" label="Properties">

```properties
tracing.zipkin.enabled=true
tracing.zipkin.http.url=http://localhost:9411
```

  </TabItem>
  <TabItem value="Yaml" label="Yaml">

```yaml
tracing:
  zipkin:
    enabled: true
    http:
      url: http://localhost:9411
```

  </TabItem>
    <TabItem value="Toml" label="Toml">

```toml
[tracing]
  [tracing.zipkin]
    enabled=true
    [tracing.zipkin.http]
      url="http://localhost:9411"
```

  </TabItem>
    <TabItem value="Groovy" label="Groovy">

```groovy
tracing {
  zipkin {
    enabled = true
    http {
      url = "http://localhost:9411"
    }
  }
}
```

  </TabItem>
    <TabItem value="Hoon" label="Hoon">

```hocon
{
  tracing {
    zipkin {
      enabled = true
      http {
        url = "http://localhost:9411"
      }
    }
  }
}
```

  </TabItem>
    <TabItem value="JSON" label="JSON">

```json
{
  "tracing": {
    "zipkin": {
      "enabled": true,
      "http": {
        "url": "http://localhost:9411"
      }
    }
  }
}
```

  </TabItem>
</Tabs>

向 localhost 发送跨距不太可能适合生产部署，因此一般需要配置一个或多个 Zipkin 服务器的生产位置：

*配置多个 Zipkin 服务器*

<Tabs>
  <TabItem value="Properties" label="Properties">

```properties
tracing.zipkin.enabled=true
tracing.zipkin.http.urls[0]=https://foo:9411
tracing.zipkin.http.urls[1]=https://bar:9411
```

  </TabItem>
  <TabItem value="Yaml" label="Yaml">

```yaml
tracing:
  zipkin:
    enabled: true
    http:
      urls:
        - https://foo:9411
        - https://bar:9411
```

  </TabItem>
    <TabItem value="Toml" label="Toml">

```toml
[tracing]
  [tracing.zipkin]
    enabled=true
    [tracing.zipkin.http]
      urls=[
        "https://foo:9411",
        "https://bar:9411"
      ]
```

  </TabItem>
    <TabItem value="Groovy" label="Groovy">

```groovy
tracing {
  zipkin {
    enabled = true
    http {
      urls = ["https://foo:9411", "https://bar:9411"]
    }
  }
}
```

  </TabItem>
    <TabItem value="Hoon" label="Hoon">

```hocon
{
  tracing {
    zipkin {
      enabled = true
      http {
        urls = ["https://foo:9411", "https://bar:9411"]
      }
    }
  }
}
```

  </TabItem>
    <TabItem value="JSON" label="JSON">

```json
{
  "tracing": {
    "zipkin": {
      "enabled": true,
      "http": {
        "urls": ["https://foo:9411", "https://bar:9411"]
      }
    }
  }
}
```

  </TabItem>
</Tabs>

:::note 提示
在生产中，使用逗号分隔的 URL 列表设置 TRACING_ZIPKIN_HTTP_URLS 环境变量也同样有效。
:::

或者，要使用不同的 `zipkin2.reporter.Sender` 实现，可以定义一个 `zipkin2.reporter.Sender` 类型的 Bean 来代替它。

---

### Zipkin 配置

向 Zipkin 发送 Spans 的 Brave 客户端有许多可用的配置选项，它们通常通过 [BraveTracerConfiguration](https://micronaut-projects.github.io/micronaut-tracing/latest/api/io/micronaut/tracing/brave/BraveTracerConfiguration.html) 类公开。有关可用选项，参阅 Javadoc。

下面是一个自定义 Zipkin 配置的示例：

*自定义 Zipkin 配置*

<Tabs>
  <TabItem value="Properties" label="Properties">

```properties
tracing.zipkin.enabled=true
tracing.zipkin.traceId128Bit=true
tracing.zipkin.sampler.probability=1
```

  </TabItem>
  <TabItem value="Yaml" label="Yaml">

```yaml
tracing:
  zipkin:
    enabled: true
    traceId128Bit: true
    sampler:
      probability: 1
```

  </TabItem>
    <TabItem value="Toml" label="Toml">

```toml
[tracing]
  [tracing.zipkin]
    enabled=true
    traceId128Bit=true
    [tracing.zipkin.sampler]
      probability=1
```

  </TabItem>
    <TabItem value="Groovy" label="Groovy">

```groovy
tracing {
  zipkin {
    enabled = true
    traceId128Bit = true
    sampler {
      probability = 1
    }
  }
}
```

  </TabItem>
    <TabItem value="Hoon" label="Hoon">

```hocon
{
  tracing {
    zipkin {
      enabled = true
      traceId128Bit = true
      sampler {
        probability = 1
      }
    }
  }
}
```

  </TabItem>
    <TabItem value="JSON" label="JSON">

```json
{
  "tracing": {
    "zipkin": {
      "enabled": true,
      "traceId128Bit": true,
      "sampler": {
        "probability": 1
      }
    }
  }
}
```

  </TabItem>
</Tabs>

您还可以选择将常见的配置类，如 `brave.sampler.Sampler` 等，定义为 Bean，从而依赖注入到 [BraveTracerConfiguration](https://micronaut-projects.github.io/micronaut-tracing/latest/api/io/micronaut/tracing/brave/BraveTracerConfiguration.html) 中。有关可用注入点，参阅 [BraveTracerConfiguration](https://micronaut-projects.github.io/micronaut-tracing/latest/api/io/micronaut/tracing/brave/BraveTracerConfiguration.html) 的 API。

---

### 过滤 HTTP span

将健康检查和其他 HTTP 请求排除在服务之外可能很有用。这可以通过在配置中添加正则表达式模式列表来实现：

*过滤 HTTP 请求 span*

<Tabs>
  <TabItem value="Properties" label="Properties">

```properties
tracing.zipkin.enabled=true
tracing.exclusions[0]=/health
tracing.exclusions[1]=/env/.*
```

  </TabItem>
  <TabItem value="Yaml" label="Yaml">

```yaml
tracing:
  zipkin:
    enabled: true
  exclusions:
    - /health
    - /env/.*
```

  </TabItem>
    <TabItem value="Toml" label="Toml">

```toml
[tracing]
  [tracing.zipkin]
    enabled=true
  exclusions=[
    "/health",
    "/env/.*"
  ]
```

  </TabItem>
    <TabItem value="Groovy" label="Groovy">

```groovy
tracing {
  zipkin {
    enabled = true
  }
  exclusions = ["/health", "/env/.*"]
}
```

  </TabItem>
    <TabItem value="Hoon" label="Hoon">

```hocon
{
  tracing {
    zipkin {
      enabled = true
    }
    exclusions = ["/health", "/env/.*"]
  }
}
```

  </TabItem>
    <TabItem value="JSON" label="JSON">

```json
{
  "tracing": {
    "zipkin": {
      "enabled": true
    },
    "exclusions": ["/health", "/env/.*"]
  }
}
```

  </TabItem>
</Tabs>

## 6. 使用 OpenTelemetry 进行追踪

Micronaut Open Telemetry 模块使用 [Open Telemetry Autoconfigure SDK](https://github.com/open-telemetry/opentelemetry-java/blob/main/sdk-extensions/autoconfigure/README.md) 为追踪配置 Open Telemetry。对于某些功能，您必须添加额外的依赖项。Micronaut 中定义的默认值可能与 [Open Telemetry Autoconfigure SDK](https://github.com/open-telemetry/opentelemetry-java/blob/main/sdk-extensions/autoconfigure/README.md) 模块中的默认值不同：

- otel.traces.exporter = none
- otel.metrics.exporter = none
- otel.logs.exporter = none
- otel.service.name = application.name 的值

### OpenTelemetry 注解

[io.micronaut.tracing.opentelemetry.processing](https://micronaut-projects.github.io/micronaut-tracing/latest/api/io/micronaut/tracing/opentelemetry/processing/package-summary.html) 软件包包含转换器和映射器，可使用 OpenTelemetry 注解。

### 6.1 OpenTelemetry 注解

[io.micronaut.tracing.opentelemetry.processing](https://micronaut-projects.github.io/micronaut-tracing/latest/api/io/micronaut/tracing/opentelemetry/processing/package-summary.html) 包包含可使用 Open Telemetry 注释的转换器和映射器。

要启用 OpenTelemetry 注解，您必须在依赖中添加下一个注解处理器：

<Tabs>
  <TabItem value="Gradle" label="Gradle">

```groovy
annotationProcessor("io.micronaut.tracing:micronaut-tracing-opentelemetry-annotation:5.0.1")
```

  </TabItem>
  <TabItem value="Maven" label="Maven">

```xml
<annotationProcessorPaths>
    <path>
        <groupId>io.micronaut.tracing</groupId>
        <artifactId>micronaut-tracing-opentelemetry-annotation</artifactId>
        <version>5.0.1</version>
    </path>
</annotationProcessorPaths>
```

  </TabItem>
</Tabs>

[io.micronaut.tracing.annotation](https://micronaut-projects.github.io/micronaut-tracing/latest/api/io/micronaut/tracing/annotation/package-summary.html) 包中定义的开放追踪注解也可在 Open Telemetry 中使用。

### 6.2 OpenTelemetry 输出程序

您可以在项目中指定要使用的输出程序。默认值设置为 "none"，这意味着默认情况下没有出口程序注册。[Open Telemetry Autoconfigure SDK](https://github.com/open-telemetry/opentelemetry-java/blob/main/sdk-extensions/autoconfigure/README.md) 文档中定义了可用的值。

对于每个要使用的出口程序，都必须在配置中指定，并添加所需的依赖：

- OpenTelemetry 协议导出器: `otlp`

<Tabs>
  <TabItem value="Gradle" label="Gradle">

```groovy
implementation("io.opentelemetry:opentelemetry-exporter-otlp")
```

  </TabItem>
  <TabItem value="Maven" label="Maven">

```xml
<dependency>
    <groupId>io.opentelemetry</groupId>
    <artifactId>opentelemetry-exporter-otlp</artifactId>
</dependency>
```

  </TabItem>
</Tabs>

- 日志导出器：`logging`

<Tabs>
  <TabItem value="Gradle" label="Gradle">

```groovy
implementation("io.opentelemetry:opentelemetry-exporter-logging")
```

  </TabItem>
  <TabItem value="Maven" label="Maven">

```xml
<dependency>
    <groupId>io.opentelemetry</groupId>
    <artifactId>opentelemetry-exporter-logging</artifactId>
</dependency>
```

  </TabItem>
</Tabs>

- Jaeger 导出器：`jaeger`

<Tabs>
  <TabItem value="Gradle" label="Gradle">

```groovy
implementation("io.opentelemetry:opentelemetry-exporter-jaeger")
```

  </TabItem>
  <TabItem value="Maven" label="Maven">

```xml
<dependency>
    <groupId>io.opentelemetry</groupId>
    <artifactId>opentelemetry-exporter-jaeger</artifactId>
</dependency>
```

  </TabItem>
</Tabs>

- Google Cloud 追踪： `google_cloud_trace`

<Tabs>
  <TabItem value="Gradle" label="Gradle">

```groovy
implementation("com.google.cloud.opentelemetry:exporter-auto")
```

  </TabItem>
  <TabItem value="Maven" label="Maven">

```xml
<dependency>
    <groupId>com.google.cloud.opentelemetry</groupId>
    <artifactId>exporter-auto</artifactId>
</dependency>
```

  </TabItem>
</Tabs>

- Zipkin 导出器：`zipkin`

<Tabs>
  <TabItem value="Gradle" label="Gradle">

```groovy
implementation("io.opentelemetry:opentelemetry-exporter-zipkin")
```

  </TabItem>
  <TabItem value="Maven" label="Maven">

```xml
<dependency>
    <groupId>io.opentelemetry</groupId>
    <artifactId>opentelemetry-exporter-zipkin</artifactId>
</dependency>
```

  </TabItem>
</Tabs>

Zipkin 导出器的配置示例：

<Tabs>
  <TabItem value="Properties" label="Properties">

```properties
otel.traces.exporter=zipkin
```

  </TabItem>
  <TabItem value="Yaml" label="Yaml">

```yaml
otel:
  traces:
    exporter: zipkin
```

  </TabItem>
    <TabItem value="Toml" label="Toml">

```toml
[otel]
  [otel.traces]
    exporter="zipkin"
```

  </TabItem>
    <TabItem value="Groovy" label="Groovy">

```groovy
otel {
  traces {
    exporter = "zipkin"
  }
}
```

  </TabItem>
    <TabItem value="Hoon" label="Hoon">

```hocon
{
  otel {
    traces {
      exporter = "zipkin"
    }
  }
}
```

  </TabItem>
    <TabItem value="JSON" label="JSON">

```json
{
  "otel": {
    "traces": {
      "exporter": "zipkin"
    }
  }
}
```

  </TabItem>
</Tabs>

### 6.3 OpenTelemetry 传播器

您可以在项目中指定要使用的传播器。默认设置为 "tracecontext, baggage"。[Open Telemetry Autoconfigure SDK](https://github.com/open-telemetry/opentelemetry-java/blob/main/sdk-extensions/autoconfigure/README.md) 文档中定义了可用的值。

要在应用程序中使用 [AWS X-Ray](https://docs.aws.amazon.com/xray/latest/devguide/xray-concepts.html#xray-concepts-tracingheader) 传播器，必须在项目中添加下一个依赖：

<Tabs>
  <TabItem value="Gradle" label="Gradle">

```groovy
implementation("io.opentelemetry:opentelemetry-extension-aws")
```

  </TabItem>
  <TabItem value="Maven" label="Maven">

```xml
<dependency>
    <groupId>io.opentelemetry</groupId>
    <artifactId>opentelemetry-extension-aws</artifactId>
</dependency>
```

  </TabItem>
</Tabs>

而 "xray "必须添加到配置文件中。

<Tabs>
  <TabItem value="Properties" label="Properties">

```properties
otel.traces.exporter=otlp
otel.propagators=tracecontext, baggage, xray
```

  </TabItem>
  <TabItem value="Yaml" label="Yaml">

```yaml
otel:
  traces:
    exporter: otlp
  propagators: tracecontext, baggage, xray
```

  </TabItem>
    <TabItem value="Toml" label="Toml">

```toml
[otel]
  [otel.traces]
    exporter="otlp"
  propagators="tracecontext, baggage, xray"
```

  </TabItem>
    <TabItem value="Groovy" label="Groovy">

```groovy
otel {
  traces {
    exporter = "otlp"
  }
  propagators = "tracecontext, baggage, xray"
}
```

  </TabItem>
    <TabItem value="Hoon" label="Hoon">

```hocon
{
  otel {
    traces {
      exporter = "otlp"
    }
    propagators = "tracecontext, baggage, xray"
  }
}
```

  </TabItem>
    <TabItem value="JSON" label="JSON">

```json
{
  "otel": {
    "traces": {
      "exporter": "otlp"
    },
    "propagators": "tracecontext, baggage, xray"
  }
}
```

  </TabItem>
</Tabs>

### 6.4 ID 生成器

#### ID 生成器

某些自定义供应商可能需要与默认格式不同的 span traceId。您可以提供自己的 [IdGenerator](https://github.com/open-telemetry/opentelemetry-java/blob/main/sdk/trace/src/main/java/io/opentelemetry/sdk/trace/IdGenerator.java) 类型的 Bean。例如，AWS X-Ray 要求其跟踪标识符采用特定格式。添加以下依赖关系，将 [AwsXrayIdGenerator](https://github.com/open-telemetry/opentelemetry-java/blob/main/sdk-extensions/aws/src/main/java/io/opentelemetry/sdk/extension/aws/trace/AwsXrayIdGenerator.java) 实例注册为 [IdGenerator](https://github.com/open-telemetry/opentelemetry-java/blob/main/sdk/trace/src/main/java/io/opentelemetry/sdk/trace/IdGenerator.java) 类型的 Bean。

<Tabs>
  <TabItem value="Gradle" label="Gradle">

```groovy
implementation("io.opentelemetry.contrib:opentelemetry-aws-xray")
```

  </TabItem>
  <TabItem value="Maven" label="Maven">

```xml
<dependency>
    <groupId>io.opentelemetry.contrib</groupId>
    <artifactId>opentelemetry-aws-xray</artifactId>
</dependency>
```

  </TabItem>
</Tabs>

要成功将跟踪记录导出到 AWS X-Ray，必须运行 [AWS Open Telemetry Collector](https://github.com/aws-observability/aws-otel-collector)，它将定期将跟踪记录发送到 AWS。

### 6.5 HTTP 服务器和客户端

要在每个 HTTP 服务器请求、客户端请求、服务器响应和客户端响应中创建 span 对象，必须添加下一个依赖：

<Tabs>
  <TabItem value="Gradle" label="Gradle">

```groovy
implementation("io.micronaut.tracing:micronaut-tracing-opentelemetry-http")
```

  </TabItem>
  <TabItem value="Maven" label="Maven">

```xml
<dependency>
    <groupId>io.micronaut.tracing</groupId>
    <artifactId>micronaut-tracing-opentelemetry-http</artifactId>
</dependency>
```

  </TabItem>
</Tabs>

#### 过滤 HTTP span

将健康检查和其他 HTTP 请求排除在服务之外可能很有用。这可以通过在配置中添加正则表达式模式列表来实现：

*过滤 HTTP 请求 span*

<Tabs>
  <TabItem value="Properties" label="Properties">

```properties
otel.exclusions[0]=/health
otel.exclusions[1]=/env/.*
```

  </TabItem>
  <TabItem value="Yaml" label="Yaml">

```yaml
otel:
  exclusions:
    - /health
    - /env/.*
```

  </TabItem>
    <TabItem value="Toml" label="Toml">

```toml
[otel]
  exclusions=[
    "/health",
    "/env/.*"
  ]
```

  </TabItem>
    <TabItem value="Groovy" label="Groovy">

```groovy
otel {
  exclusions = ["/health", "/env/.*"]
}
```

  </TabItem>
    <TabItem value="Hoon" label="Hoon">

```hocon
{
  otel {
    exclusions = ["/health", "/env/.*"]
  }
}
```

  </TabItem>
    <TabItem value="JSON" label="JSON">

```json
{
  "otel": {
    "exclusions": ["/health", "/env/.*"]
  }
}
```

  </TabItem>
</Tabs>

---

#### 在请求 span 中添加 HTTP 标头

如果需要，你可以在 span 对象中添加额外的 HTTP 头。您可以为客户端请求、客户端响应、服务器请求和服务器响应指定不同的标头。

*在请求 span 中添加 HTTP 头*

<Tabs>
  <TabItem value="Properties" label="Properties">

```properties
otel.http.client.request-headers[0]=X-From-Client-Request
otel.http.client.response-headers[0]=X-From-Client-Response
otel.http.server.request-headers[0]=X-From-Server-Request
otel.http.server.response-headers[0]=X-From-Server-Response
```

  </TabItem>
  <TabItem value="Yaml" label="Yaml">

```yaml
otel:
  http:
    client:
      request-headers:
        - X-From-Client-Request
      response-headers:
        - X-From-Client-Response
    server:
      request-headers:
        - X-From-Server-Request
      response-headers:
        - X-From-Server-Response
```

  </TabItem>
    <TabItem value="Toml" label="Toml">

```toml
[otel]
  [otel.http]
    [otel.http.client]
      request-headers=[
        "X-From-Client-Request"
      ]
      response-headers=[
        "X-From-Client-Response"
      ]
    [otel.http.server]
      request-headers=[
        "X-From-Server-Request"
      ]
      response-headers=[
        "X-From-Server-Response"
      ]
```

  </TabItem>
    <TabItem value="Groovy" label="Groovy">

```groovy
otel {
  http {
    client {
      requestHeaders = ["X-From-Client-Request"]
      responseHeaders = ["X-From-Client-Response"]
    }
    server {
      requestHeaders = ["X-From-Server-Request"]
      responseHeaders = ["X-From-Server-Response"]
    }
  }
}
```

  </TabItem>
    <TabItem value="Hoon" label="Hoon">

```hocon
{
  otel {
    http {
      client {
        request-headers = ["X-From-Client-Request"]
        response-headers = ["X-From-Client-Response"]
      }
      server {
        request-headers = ["X-From-Server-Request"]
        response-headers = ["X-From-Server-Response"]
      }
    }
  }
}
```

  </TabItem>
    <TabItem value="JSON" label="JSON">

```json
{
  "otel": {
    "http": {
      "client": {
        "request-headers": ["X-From-Client-Request"],
        "response-headers": ["X-From-Client-Response"]
      },
      "server": {
        "request-headers": ["X-From-Server-Request"],
        "response-headers": ["X-From-Server-Response"]
      }
    }
  }
}
```

  </TabItem>
</Tabs>

## 6.6 gRPC 服务器和客户端

要启用在每个 GRPC 服务器请求、客户端请求、服务器响应和客户端响应上创建 span 对象。您必须添加下一个依赖：

<Tabs>
  <TabItem value="Gradle" label="Gradle">

```groovy
implementation("io.micronaut.tracing:micronaut-tracing-opentelemetry-grpc")
```

  </TabItem>
  <TabItem value="Maven" label="Maven">

```xml
<dependency>
    <groupId>io.micronaut.tracing</groupId>
    <artifactId>micronaut-tracing-opentelemetry-grpc</artifactId>
</dependency>
```

  </TabItem>
</Tabs>

### 6.7 Kafka

要在每条 Kafka 消息上创建 span 对象，请添加以下依赖：

<Tabs>
  <TabItem value="Gradle" label="Gradle">

```groovy
implementation("io.micronaut.tracing:micronaut-tracing-opentelemetry-kafka")
```

  </TabItem>
  <TabItem value="Maven" label="Maven">

```xml
<dependency>
    <groupId>io.micronaut.tracing</groupId>
    <artifactId>micronaut-tracing-opentelemetry-kafka</artifactId>
</dependency>
```

  </TabItem>
</Tabs>

#### 在请求 span 中添加 Kafka 消息标头

在 span 对象中添加 Kafka 消息标头的方式可配置如下：

*在请求跨度中添加 Kafka 消息标头*

<Tabs>
  <TabItem value="Properties" label="Properties">

```properties
otel.instrumentation.kafka.wrapper=true
otel.instrumentation.kafka.headers-as-lists=false
otel.instrumentation.kafka.attribute-with-prefix=true
otel.instrumentation.kafka.attribute-prefix=myPrefix
otel.instrumentation.kafka.captured-headers[0]=myHeader1
otel.instrumentation.kafka.captured-headers[1]=myHeader2
otel.instrumentation.kafka.included-topics[0]=topic1
otel.instrumentation.kafka.included-topics[1]=topic2
otel.instrumentation.kafka.excluded-topics[0]=topic1
otel.instrumentation.kafka.excluded-topics[1]=topic2
```

  </TabItem>
  <TabItem value="Yaml" label="Yaml">

```yaml
otel:
  instrumentation:
    kafka:
      wrapper: true
      headers-as-lists: false
      attribute-with-prefix: true
      attribute-prefix: myPrefix
      captured-headers: # list of headers which need to send as span attributes
        - myHeader1
        - myHeader2
      included-topics:
        - topic1
        - topic2
      excluded-topics:
        - topic1
        - topic2
```

  </TabItem>
    <TabItem value="Toml" label="Toml">

```toml
[otel]
  [otel.instrumentation]
    [otel.instrumentation.kafka]
      wrapper=true
      headers-as-lists=false
      attribute-with-prefix=true
      attribute-prefix="myPrefix"
      captured-headers=[
        "myHeader1",
        "myHeader2"
      ]
      included-topics=[
        "topic1",
        "topic2"
      ]
      excluded-topics=[
        "topic1",
        "topic2"
      ]
```

  </TabItem>
    <TabItem value="Groovy" label="Groovy">

```groovy
otel {
  instrumentation {
    kafka {
      wrapper = true
      headersAsLists = false
      attributeWithPrefix = true
      attributePrefix = "myPrefix"
      capturedHeaders = ["myHeader1", "myHeader2"]
      includedTopics = ["topic1", "topic2"]
      excludedTopics = ["topic1", "topic2"]
    }
  }
}
```

  </TabItem>
    <TabItem value="Hoon" label="Hoon">

```hocon
{
  otel {
    instrumentation {
      kafka {
        wrapper = true
        headers-as-lists = false
        attribute-with-prefix = true
        attribute-prefix = "myPrefix"
        captured-headers = ["myHeader1", "myHeader2"]
        included-topics = ["topic1", "topic2"]
        excluded-topics = ["topic1", "topic2"]
      }
    }
  }
}
```

  </TabItem>
    <TabItem value="JSON" label="JSON">

```json
{
  "otel": {
    "instrumentation": {
      "kafka": {
        "wrapper": true,
        "headers-as-lists": false,
        "attribute-with-prefix": true,
        "attribute-prefix": "myPrefix",
        "captured-headers": ["myHeader1", "myHeader2"],
        "included-topics": ["topic1", "topic2"],
        "excluded-topics": ["topic1", "topic2"]
      }
    }
  }
}
```

  </TabItem>
</Tabs>

- `wrapper` —— 如果为 "true"，将使用消费者和生产者的对象代理进行跟踪。如果禁用包装器，则可通过 kafka 监听器进行跟踪。
- 如果要将头信息设置为列表，请将 `headers-as-lists` 设置为 `true`。
- `attribute-with-prefix` —— 是否为 span 属性名添加前缀（默认值：`false`）
- `attribute-prefix` —— span 属性（标题名称）的自定义前缀。默认值：`messaging.header`。
- `captured-headers` 是要添加为 span 属性的标题列表。默认情况下，所有标题都会添加为 span 属性。要不将标题设置为 span 属性，请指定 `null` 或空字符串。
- `included-topics` —— 要跟踪的主题列表
- `excluded-topics` —— 不跟踪的主题列表

:::note 注意
您不能同时使用 `included-topics` 和 `excluded-topics` 属性，因为它们是相互排斥的，只能选择其一。
:::

### 6.8 AWS SDK 工具

包含以下依赖，以便使用 [AWS SDK](https://aws-otel.github.io/docs/getting-started/java-sdk/trace-manual-instr#instrumenting-the-aws-sdk)：

<Tabs>
  <TabItem value="Gradle" label="Gradle">

```groovy
implementation("io.opentelemetry.instrumentation:opentelemetry-aws-sdk-2.2")
```

  </TabItem>
  <TabItem value="Maven" label="Maven">

```xml
<dependency>
    <groupId>io.opentelemetry.instrumentation</groupId>
    <artifactId>opentelemetry-aws-sdk-2.2</artifactId>
</dependency>
```

  </TabItem>
</Tabs>

此外，还包括 [Micronaut AWS SDK v2](https://micronaut-projects.github.io/micronaut-aws/latest/guide/#sdkv2) 依赖：

<Tabs>
  <TabItem value="Gradle" label="Gradle">

```groovy
implementation("io.micronaut.aws:micronaut-aws-sdk-v2")
```

  </TabItem>
  <TabItem value="Maven" label="Maven">

```xml
<dependency>
    <groupId>io.micronaut.aws</groupId>
    <artifactId>micronaut-aws-sdk-v2</artifactId>
</dependency>
```

  </TabItem>
</Tabs>

`micronaut-aws-sdk-v2` 依赖创建了一个 `SdkClientBuilder` 类型的 Bean。为了检测 AWS SDK，Micronaut OpenTelemetry 通过 `SdkClientBuilder` 类型的 Bean 创建监听器注册了一个追踪拦截器。

### 6.9 AWS 资源检测器

AWS 资源检测器利用 AWS 基础架构信息丰富追踪内容。

要使用 AWS 资源检测器，请包含以下依赖：

<Tabs>
  <TabItem value="Gradle" label="Gradle">

```groovy
implementation("io.opentelemetry:opentelemetry-sdk-extension-aws")
```

  </TabItem>
  <TabItem value="Maven" label="Maven">

```xml
<dependency>
    <groupId>io.opentelemetry</groupId>
    <artifactId>opentelemetry-sdk-extension-aws</artifactId>
</dependency>
```

  </TabItem>
</Tabs>

并提供一个 [ResourceProvider](https://micronaut-projects.github.io/micronaut-tracing/latest/api/io/micronaut/tracing/opentelemetry/ResourceProvider.html) 类型的 Bean

```java
package io.micronaut.tracing.opentelemetry;

import io.micronaut.core.annotation.NonNull;
import io.opentelemetry.contrib.aws.resource.Ec2Resource;
import io.opentelemetry.sdk.resources.Resource;

import jakarta.inject.Singleton;

@Singleton
public class AwsResourceProvider implements ResourceProvider {

    @Override
    @NonNull
    public Resource resource() {
        return Resource.getDefault()
            .merge(Ec2Resource.get());
    }
}
```

## 7. 仓库

你可以在此仓库中找到此项目的源代码：

https://github.com/micronaut-projects/micronaut-tracing

> [英文链接](https://micronaut-projects.github.io/micronaut-tracing/latest/guide/)

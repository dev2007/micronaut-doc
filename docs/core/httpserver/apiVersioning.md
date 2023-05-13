---
sidebar_position: 180
---

# 6.18 API 版本化

自 1.1.x 以来，Micronaut 通过专用的 [@Version](https://docs.micronaut.io/3.8.4/api/io/micronaut/core/version/annotation/Version.html) 注解支持 API 版本控制。

以下示例演示如何对 API 进行版本控制：

*版本化一个 API*

import Tabs from '@theme/Tabs';
import TabItem from '@theme/TabItem';

<Tabs>
  <TabItem value="Java" label="Java" default>

```java
import io.micronaut.core.version.annotation.Version;
import io.micronaut.http.annotation.Controller;
import io.micronaut.http.annotation.Get;

@Controller("/versioned")
class VersionedController {

    @Version("1") // (1)
    @Get("/hello")
    String helloV1() {
        return "helloV1";
    }

    @Version("2") // (2)
    @Get("/hello")
    String helloV2() {
        return "helloV2";
    }
```

  </TabItem>
  <TabItem value="Groovy" label="Groovy">

```groovy
import io.micronaut.core.version.annotation.Version
import io.micronaut.http.annotation.Controller
import io.micronaut.http.annotation.Get

@Controller("/versioned")
class VersionedController {

    @Version("1") // (1)
    @Get("/hello")
    String helloV1() {
        "helloV1"
    }

    @Version("2") // (2)
    @Get("/hello")
    String helloV2() {
        "helloV2"
    }
```

  </TabItem>
  <TabItem value="Kotlin" label="Kotlin">

```kt
import io.micronaut.core.version.annotation.Version
import io.micronaut.http.annotation.Controller
import io.micronaut.http.annotation.Get

@Controller("/versioned")
internal class VersionedController {

    @Version("1") // (1)
    @Get("/hello")
    fun helloV1(): String {
        return "helloV1"
    }

    @Version("2") // (2)
    @Get("/hello")
    fun helloV2(): String {
        return "helloV2"
    }
```

  </TabItem>
</Tabs>

1. `helloV1` 方法被声明为版本 `1`
2. `helloV2` 方法被声明为版本 `2`

然后通过在 `application.yml` 中将 `micronaut.router.version.enabled` 设置为 `true` 来启用版本化：

*启用版本化*

```yaml
micronaut:
  router:
    versioning:
      enabled: true
```

默认情况下，Micronaut 有两种基于名为 `X-API-version` 的 HTTP 头或名为 `API-version` 的请求参数解析版本的策略，但这是可配置的。完整的配置示例如下所示：

*配置版本化*

```yaml
micronaut:
  router:
    versioning:
      enabled: true (1)
      parameter:
        enabled: false (2)
        names: 'v,api-version' (3)
      header:
        enabled: true (4)
        names: (5)
          - 'X-API-VERSION'
          - 'Accept-Version'
```

1. 启用版本控制
2. 启用或禁用基于参数的版本控制
3. 将参数名称指定为逗号分隔的列表
4. 启用或禁用基于标头的版本控制
5. 将头名称指定为列表

如果这还不够，你还可以实现 [RequestVersionResolver](https://docs.micronaut.io/3.8.4/api/io/micronaut/web/router/version/resolution/RequestVersionResolver.html) 接口，该接口接收 [HttpRequest](https://docs.micronaut.io/3.8.4/api/io/micronaut/http/HttpRequest.html) 并可以实现你选择的任何策略

**默认版本**

可以通过配置提供默认版本。

*配置默认版本*

```yaml
micronaut:
  router:
    versioning:
      enabled: true
      default-version: 3 (1)
```

1. 设置默认版本

如果满足以下条件，则**不**匹配路由：
- 已配置默认版本
- 在请求中找不到任何版本
- 路由定义了一个版本
- 路由版本与默认版本不匹配

如果传入请求指定了一个版本，则默认版本无效

**版本化客户端请求**

Micronaut 的 [声明式 HTTP 客户端](/core/httpClient/clientAnnotation)还支持通过 [@Version](https://docs.micronaut.io/3.8.4/api/io/micronaut/core/version/annotation/Version.html) 注解对传出请求进行自动版本控制。

默认情况下，如果使用 [@Version](https://docs.micronaut.io/3.8.4/api/io/micronaut/core/version/annotation/Version.html) 注解客户端接口，则使用 `X-API-VERSION` 标头包含提供给注解的值。

例如：

<Tabs>
  <TabItem value="Java" label="Java" default>

```java
import io.micronaut.core.version.annotation.Version;
import io.micronaut.http.annotation.Get;
import io.micronaut.http.client.annotation.Client;
import org.reactivestreams.Publisher;
import io.micronaut.core.async.annotation.SingleResult;

@Client("/hello")
@Version("1") // (1)
public interface HelloClient {

    @Get("/greeting/{name}")
    String sayHello(String name);

    @Version("2")
    @Get("/greeting/{name}")
    @SingleResult
    Publisher<String> sayHelloTwo(String name); // (2)
}
```

  </TabItem>
  <TabItem value="Groovy" label="Groovy">

```groovy
import io.micronaut.core.version.annotation.Version
import io.micronaut.http.annotation.Get
import io.micronaut.http.client.annotation.Client
import reactor.core.publisher.Mono


@Client("/hello")
@Version("1") // (1)
interface HelloClient {

    @Get("/greeting/{name}")
    String sayHello(String name)

    @Version("2")
    @Get("/greeting/{name}")
    Mono<String> sayHelloTwo(String name) // (2)
}
```

  </TabItem>
  <TabItem value="Kotlin" label="Kotlin">

```kt
import io.micronaut.core.version.annotation.Version
import io.micronaut.http.annotation.Get
import io.micronaut.http.client.annotation.Client
import reactor.core.publisher.Mono

@Client("/hello")
@Version("1") // (1)
interface HelloClient {

    @Get("/greeting/{name}")
    fun sayHello(name : String) : String

    @Version("2")
    @Get("/greeting/{name}")
    fun sayHelloTwo(name : String) : Mono<String>  // (2)
}
```

  </TabItem>
</Tabs>

1. [@Version](https://docs.micronaut.io/3.8.4/api/io/micronaut/core/version/annotation/Version.html) 注解可以在类型级别使用，以指定要用于所有方法的版本
2. 当在方法级别定义时，它仅用于该方法

可以使用 [DefaultClientVersioningConfiguration](https://docs.micronaut.io/3.8.4/api/io/micronaut/http/client/interceptor/configuration/DefaultClientVersioningConfiguration.html) 配置每个调用的版本发送方式的默认行为：

*表 1. [DefaultClientVersioningConfiguration](https://docs.micronaut.io/3.8.4/api/io/micronaut/http/client/interceptor/configuration/DefaultClientVersioningConfiguration.html) 的配置属性*

|属性|类型|描述|
|--|--|--|
|micronaut.http.client.versioning.default.headers|java.util.List|请求头的名字列表。|
|micronaut.http.client.versioning.default.parameters|java.util.List|请求查询参数的名字列表。|

例如，要使用 `Accept-Version` 作为头名称：

*配置客户端版本化*

```yaml
micronaut:
  http:
    client:
      versioning:
        default:
          headers:
            - 'Accept-Version'
            - 'X-API-VERSION'
```

`default` 密钥指的是默认配置。你可以使用传递给 `@Client` 的值（通常是服务 ID）来指定特定于客户端的配置。例如：

*配置版本化*

```yaml
micronaut:
  http:
    client:
      versioning:
        greeting-service:
          headers:
            - 'Accept-Version'
            - 'X-API-VERSION'
```

上面使用了一个名为 `greeting-service` 的键，该键可用于配置用 `@Client（'greeting-service'）` 注解的客户端。

> [英文链接](https://docs.micronaut.io/3.8.4/guide/index.html#apiVersioning)

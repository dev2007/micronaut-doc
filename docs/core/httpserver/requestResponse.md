---
sidebar_position: 90
---

# 6.9 HttpRequest 与 HttpResponse

如果你需要对请求处理进行更多的控制，你可以编写一个接收完整 [HttpRequest](https://docs.micronaut.io/3.8.4/api/io/micronaut/http/HttpRequest.html) 的方法。

事实上，有几个更高级的接口可以绑定到控制器方法参数。其中包括：

*表 1. 可绑定的 Micronaut 接口*

|接口|描述|示例|
|--|--|--|
|[HttpRequest](https://docs.micronaut.io/3.8.4/api/io/micronaut/http/HttpRequest.html)|完整的 HttpRequest|`String hello(HttpRequest request)`|
|[HttpHeaders](https://docs.micronaut.io/3.8.4/api/io/micronaut/http/HttpHeaders.html)|请求中的所有 HTTP 头|`String hello(HttpHeaders headers)`|
|[HttpParameters](https://docs.micronaut.io/3.8.4/api/io/micronaut/http/HttpParameters.html)|请求中存在的所有 HTTP 参数（来自 URI 变量或请求参数）|`String hello(HttpParameters params)`|
|[Cookies](https://docs.micronaut.io/3.8.4/api/io/micronaut/http/cookie/Cookies.html)|请求中所有 cookie|`String hello(Cookies cookies)`|

:::tip 注意
如果需要请求体，则应使用具体的泛型类型来声明 [HttpRequest](https://docs.micronaut.io/3.8.4/api/io/micronaut/http/HttpRequest.html) 参数化，例如 `HttpRequest<MyClass>` 请求。否则，请求体可能无法从请求中获得。
:::

此外，为了完全控制发出的 HTTP 响应，你可以使用 [HttpResponse](https://docs.micronaut.io/3.8.4/api/io/micronaut/http/HttpResponse.html) 类的静态工厂方法，这些方法返回一个 [MutableHttpResponse](https://docs.micronaut.io/3.8.4/api/io/micronaut/http/MutableHttpResponse.html)。

以下示例使用 [HttpRequest](https://docs.micronaut.io/3.8.4/api/io/micronaut/http/HttpRequest.html) 和 [HttpResponse](https://docs.micronaut.io/3.8.4/api/io/micronaut/http/HttpResponse.html) 对象实现了前面的 `MessageController` 示例：

*请求和响应示例*

import Tabs from '@theme/Tabs';
import TabItem from '@theme/TabItem';

<Tabs>
  <TabItem value="Java" label="Java" default>

```java
import io.micronaut.http.HttpRequest;
import io.micronaut.http.HttpResponse;
import io.micronaut.http.annotation.Controller;
import io.micronaut.http.annotation.Get;
import io.micronaut.http.context.ServerRequestContext;
import reactor.core.publisher.Mono;

@Controller("/request")
public class MessageController {

@Get("/hello") // (1)
public HttpResponse<String> hello(HttpRequest<?> request) {
    String name = request.getParameters()
                         .getFirst("name")
                         .orElse("Nobody"); // (2)

    return HttpResponse.ok("Hello " + name + "!!")
             .header("X-My-Header", "Foo"); // (3)
}

}
```

  </TabItem>
  <TabItem value="Groovy" label="Groovy">

```groovy
import io.micronaut.http.HttpRequest
import io.micronaut.http.HttpResponse
import io.micronaut.http.annotation.Controller
import io.micronaut.http.annotation.Get
import io.micronaut.http.context.ServerRequestContext
import reactor.core.publisher.Mono


@Controller("/request")
class MessageController {

@Get("/hello") // (1)
HttpResponse<String> hello(HttpRequest<?> request) {
    String name = request.parameters
                         .getFirst("name")
                         .orElse("Nobody") // (2)

    HttpResponse.ok("Hello " + name + "!!")
             .header("X-My-Header", "Foo") // (3)
}

}
```

  </TabItem>
  <TabItem value="Kotlin" label="Kotlin">

```kt
import io.micronaut.http.HttpRequest
import io.micronaut.http.HttpResponse
import io.micronaut.http.annotation.Controller
import io.micronaut.http.annotation.Get
import io.micronaut.http.context.ServerRequestContext
import reactor.core.publisher.Mono
import reactor.util.context.ContextView


@Controller("/request")
class MessageController {

@Get("/hello") // (1)
fun hello(request: HttpRequest<*>): HttpResponse<String> {
    val name = request.parameters
                      .getFirst("name")
                      .orElse("Nobody") // (2)

    return HttpResponse.ok("Hello $name!!")
            .header("X-My-Header", "Foo") // (3)
}

}
```

  </TabItem>
</Tabs>

1. 该方法被映射到 URI `/hello` 并接受 [HttpRequest](https://docs.micronaut.io/3.8.4/api/io/micronaut/http/HttpRequest.html)
2. [HttpRequest](https://docs.micronaut.io/3.8.4/api/io/micronaut/http/HttpRequest.html) 用于获取名为 `name` 的查询参数的值。
3. [HttpResponse.ok(T)](https://docs.micronaut.io/3.8.4/api/io/micronaut/http/HttpResponse.html#ok-T-) 方法返回一个带有文本主体的 [MutableHttpResponse](https://docs.micronaut.io/3.8.4/api/io/micronaut/http/MutableHttpResponse.html)。一个名为 `X-My-Header` 的头也被添加到响应中。

[HttpRequest](https://docs.micronaut.io/3.8.4/api/io/micronaut/http/HttpRequest.html) 也可以通过 [ServerRequestContext](https://docs.micronaut.io/3.8.4/api/io/micronaut/http/context/ServerRequestContext.html) 从静态上下文中获得。

*使用 ServerRequestContext*

<Tabs>
  <TabItem value="Java" label="Java" default>

```java
import io.micronaut.http.HttpRequest;
import io.micronaut.http.HttpResponse;
import io.micronaut.http.annotation.Controller;
import io.micronaut.http.annotation.Get;
import io.micronaut.http.context.ServerRequestContext;
import reactor.core.publisher.Mono;

@Controller("/request")
public class MessageController {

@Get("/hello-static") // (1)
public HttpResponse<String> helloStatic() {
    HttpRequest<?> request = ServerRequestContext.currentRequest() // (1)
            .orElseThrow(() -> new RuntimeException("No request present"));
    String name = request.getParameters()
            .getFirst("name")
            .orElse("Nobody");

    return HttpResponse.ok("Hello " + name + "!!")
            .header("X-My-Header", "Foo");
}

}
```

  </TabItem>
  <TabItem value="Groovy" label="Groovy">

```groovy
import io.micronaut.http.HttpRequest
import io.micronaut.http.HttpResponse
import io.micronaut.http.annotation.Controller
import io.micronaut.http.annotation.Get
import io.micronaut.http.context.ServerRequestContext
import reactor.core.publisher.Mono


@Controller("/request")
class MessageController {

@Get("/hello-static") // (1)
HttpResponse<String> helloStatic() {
    HttpRequest<?> request = ServerRequestContext.currentRequest() // (1)
            .orElseThrow(() -> new RuntimeException("No request present"))
    String name = request.parameters
            .getFirst("name")
            .orElse("Nobody")

    HttpResponse.ok("Hello " + name + "!!")
            .header("X-My-Header", "Foo")
}

}
```

  </TabItem>
  <TabItem value="Kotlin" label="Kotlin">

```kt
import io.micronaut.http.HttpRequest
import io.micronaut.http.HttpResponse
import io.micronaut.http.annotation.Controller
import io.micronaut.http.annotation.Get
import io.micronaut.http.context.ServerRequestContext
import reactor.core.publisher.Mono
import reactor.util.context.ContextView


@Controller("/request")
class MessageController {

@Get("/hello-static") // (1)
fun helloStatic(): HttpResponse<String> {
    val request: HttpRequest<*> = ServerRequestContext.currentRequest<Any>() // (1)
        .orElseThrow { RuntimeException("No request present") }
    val name = request.parameters
        .getFirst("name")
        .orElse("Nobody")
    return HttpResponse.ok("Hello $name!!")
        .header("X-My-Header", "Foo")
}

}
```

  </TabItem>
</Tabs>

1. [ServerRequestContext](https://docs.micronaut.io/3.8.4/api/io/micronaut/http/context/ServerRequestContext.html) 用于检索请求。

:::danger 警告
一般来说，[ServerRequestContext](https://docs.micronaut.io/3.8.4/api/io/micronaut/http/context/ServerRequestContext.html) 在响应流中是可用的，但推荐的方法是将请求作为参数使用，如前面的示例所示。如果下游方法中需要请求，则应将其作为参数传递给这些方法。在某些情况下，由于使用了其他线程来发送数据，因此上下文不会传播。
:::

对于 Project Reactor 的用户来说，使用 ServerRequestContext 的另一种选择是使用 Project Reactor 的上下文功能来检索请求。由于 Micronaut 框架使用 Project Reactor 作为其默认的响应流实现，因此 Project Reactor 的用户可以通过在上下文中访问请求而受益。例如：

*使用 Project Reactor 上下文*

<Tabs>
  <TabItem value="Java" label="Java" default>

```java
import io.micronaut.http.HttpRequest;
import io.micronaut.http.HttpResponse;
import io.micronaut.http.annotation.Controller;
import io.micronaut.http.annotation.Get;
import io.micronaut.http.context.ServerRequestContext;
import reactor.core.publisher.Mono;

@Controller("/request")
public class MessageController {

@Get("/hello-reactor")
public Mono<HttpResponse<String>> helloReactor() {
    return Mono.deferContextual(ctx -> { // (1)
        HttpRequest<?> request = ctx.get(ServerRequestContext.KEY); // (2)
        String name = request.getParameters()
                .getFirst("name")
                .orElse("Nobody");

        return Mono.just(HttpResponse.ok("Hello " + name + "!!")
                .header("X-My-Header", "Foo"));
    });
}

}
```

  </TabItem>
  <TabItem value="Groovy" label="Groovy">

```groovy
import io.micronaut.http.HttpRequest
import io.micronaut.http.HttpResponse
import io.micronaut.http.annotation.Controller
import io.micronaut.http.annotation.Get
import io.micronaut.http.context.ServerRequestContext
import reactor.core.publisher.Mono


@Controller("/request")
class MessageController {

@Get("/hello-reactor")
Mono<HttpResponse<String>> helloReactor() {
    Mono.deferContextual(ctx -> { // (1)
        HttpRequest<?> request = ctx.get(ServerRequestContext.KEY) // (2)
        String name = request.parameters
                .getFirst("name")
                .orElse("Nobody")

        Mono.just(HttpResponse.ok("Hello " + name + "!!")
                .header("X-My-Header", "Foo"))
    })
}

}
```

  </TabItem>
  <TabItem value="Kotlin" label="Kotlin">

```kt
import io.micronaut.http.HttpRequest
import io.micronaut.http.HttpResponse
import io.micronaut.http.annotation.Controller
import io.micronaut.http.annotation.Get
import io.micronaut.http.context.ServerRequestContext
import reactor.core.publisher.Mono
import reactor.util.context.ContextView


@Controller("/request")
class MessageController {

@Get("/hello-reactor")
fun helloReactor(): Mono<HttpResponse<String>?>? {
    return Mono.deferContextual { ctx: ContextView ->  // (1)
        val request = ctx.get<HttpRequest<*>>(ServerRequestContext.KEY) // (2)
        val name = request.parameters
            .getFirst("name")
            .orElse("Nobody")
        Mono.just(HttpResponse.ok("Hello $name!!")
                .header("X-My-Header", "Foo"))
    }
}

}
```

  </TabItem>
</Tabs>

1. Mono 是通过引用上下文创建的
2. 从上下文中检索请求

使用上下文来检索请求是响应流的最佳方法，因为 Project Reactor 传播上下文，并且它不依赖于像 [ServerRequestContext](https://docs.micronaut.io/3.8.4/api/io/micronaut/http/context/ServerRequestContext.html) 这样的本地线程。

> [英文链接](https://docs.micronaut.io/3.9.4/guide/index.html#requestResponse)

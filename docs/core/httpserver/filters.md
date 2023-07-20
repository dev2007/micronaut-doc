---
sidebar_position: 230
---

# 6.23 过滤器

Micronaut HTTP 服务器支持将过滤器应用于请求/响应处理，其方式与传统 Java 应用程序中的 Servlet 过滤器类似（但是响应式）。

过滤器支持以下用例：
- 传入 [HttpRequest](https://docs.micronaut.io/3.8.4/api/io/micronaut/http/HttpRequest.html) 的装饰
- 修改传出的 [HttpResponse](https://docs.micronaut.io/3.8.4/api/io/micronaut/http/HttpResponse.html)
- 实施贯穿各领域的问题，如安全、追踪等。

对于服务器应用程序，可以实现 [HttpServerFilter](https://docs.micronaut.io/3.8.4/api/io/micronaut/http/filter/HttpServerFilter.html) 接口 `doFilter` 方法。

`doFilter` 方法接受 [HttpRequest](https://docs.micronaut.io/3.8.4/api/io/micronaut/http/HttpRequest.html) 和 [ServerFilterChain](https://docs.micronaut.io/3.8.4/api/io/micronaut/http/filter/ServerFilterChain.html) 的一个实例。

`ServerFilterChain` 接口包含一个已解析的过滤器链，其中链中的最后一个条目是匹配的路由。 [ServerFilterChain.proceed(io.micronaut.http.HttpRequest)](https://docs.micronaut.io/3.8.4/api/io/micronaut/http/filter/ServerFilterChain.html#proceed-io.micronaut.http.HttpRequest-) 方法恢复对请求的处理。

`proceed(...)` 方法返回一个 Reactive Streams [Publisher](http://www.reactive-streams.org/reactive-streams-1.0.3-javadoc/org/reactivestreams/Publisher.html)，它会发出要返回给客户端的响应。过滤器的实现者可以订阅 [Publisher](http://www.reactive-streams.org/reactive-streams-1.0.3-javadoc/org/reactivestreams/Publisher.html)，并在将响应返回给客户端之前对发出的 [MutableHttpResponse](https://docs.micronaut.io/3.8.4/api/io/micronaut/http/MutableHttpResponse.html) 进行变异以修改响应。

为了将这些概念付诸实践，我们来看一个例子。

:::danger 危险
过滤器在事件循环中执行，因此阻塞操作必须卸载到另一个线程池。
:::

## 写一个过滤器

假设你希望使用某个外部系统将每个请求跟踪到 Micronaut “Hello World” 示例。该系统可以是数据库或分布式跟踪服务，并且可能需要 I/O 操作。

你不应该在您的过滤器中阻止底层的 Netty 事件循环；相反，过滤器应该在任何 I/O 完成后继续执行。

例如，考虑使用 [Project Reactor](https://projectreactor.io/) 组成 I/O 操作的 `TraceService`：

*使用响应流的 TraceService 示例*

import Tabs from '@theme/Tabs';
import TabItem from '@theme/TabItem';

<Tabs>
  <TabItem value="Java" label="Java" default>

```java
import io.micronaut.http.HttpRequest;
import org.reactivestreams.Publisher;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import jakarta.inject.Singleton;
import reactor.core.publisher.Mono;
import reactor.core.scheduler.Schedulers;

@Singleton
public class TraceService {

    private static final Logger LOG = LoggerFactory.getLogger(TraceService.class);

    Publisher<Boolean> trace(HttpRequest<?> request) {
        return Mono.fromCallable(() -> { // (1)
            LOG.debug("Tracing request: {}", request.getUri());
            // trace logic here, potentially performing I/O (2)
            return true;
        }).subscribeOn(Schedulers.boundedElastic()) // (3)
                .flux();
    }
}
```

  </TabItem>
  <TabItem value="Groovy" label="Groovy">

```groovy
import io.micronaut.http.HttpRequest
import org.slf4j.Logger
import org.slf4j.LoggerFactory

import jakarta.inject.Singleton
import reactor.core.publisher.Flux
import reactor.core.publisher.Mono
import reactor.core.scheduler.Schedulers

import java.util.concurrent.Callable


@Singleton
class TraceService {

    private static final Logger LOG = LoggerFactory.getLogger(TraceService.class)

    Flux<Boolean> trace(HttpRequest<?> request) {
        Mono.fromCallable(() ->  {  // (1)
            LOG.debug('Tracing request: {}', request.uri)
            // trace logic here, potentially performing I/O (2)
            return true
        }).flux().subscribeOn(Schedulers.boundedElastic()) // (3)

    }
}
```

  </TabItem>
  <TabItem value="Kotlin" label="Kotlin">

```kt
import io.micronaut.http.HttpRequest
import org.slf4j.LoggerFactory
import jakarta.inject.Singleton
import reactor.core.publisher.Flux
import reactor.core.publisher.Mono
import reactor.core.scheduler.Schedulers


@Singleton
class TraceService {

    private val LOG = LoggerFactory.getLogger(TraceService::class.java)

    internal fun trace(request: HttpRequest<*>): Flux<Boolean> {
        return Mono.fromCallable {
            // (1)
            LOG.debug("Tracing request: {}", request.uri)
            // trace logic here, potentially performing I/O (2)
            true
        }.subscribeOn(Schedulers.boundedElastic()) // (3)
            .flux()
    }
}
```

  </TabItem>
</Tabs>

1. Mono 类型创建的逻辑执行潜在的阻塞操作，以写入请求中的跟踪数据
2. 由于这只是一个例子，还没有执行更多的逻辑
3. `Schedulers.boundedElastic` 执行逻辑

然后，你可以将此实现注入到过滤器定义中：

*HttpServerFilter 示例*

<Tabs>
  <TabItem value="Java" label="Java" default>

```java
import io.micronaut.http.HttpRequest;
import io.micronaut.http.MutableHttpResponse;
import io.micronaut.http.annotation.Filter;
import io.micronaut.http.filter.HttpServerFilter;
import io.micronaut.http.filter.ServerFilterChain;
import org.reactivestreams.Publisher;
import reactor.core.publisher.Flux;

@Filter("/hello/**") // (1)
public class TraceFilter implements HttpServerFilter { // (2)

    private final TraceService traceService;

    public TraceFilter(TraceService traceService) { // (3)
        this.traceService = traceService;
    }

}
```

  </TabItem>
  <TabItem value="Groovy" label="Groovy">

```groovy
import io.micronaut.http.HttpRequest
import io.micronaut.http.MutableHttpResponse
import io.micronaut.http.annotation.Filter
import io.micronaut.http.filter.HttpServerFilter
import io.micronaut.http.filter.ServerFilterChain
import org.reactivestreams.Publisher

@Filter("/hello/**") // (1)
class TraceFilter implements HttpServerFilter { // (2)

    private final TraceService traceService

    TraceFilter(TraceService traceService) { // (3)
        this.traceService = traceService
    }

}
```

  </TabItem>
  <TabItem value="Kotlin" label="Kotlin">

```kt
import io.micronaut.http.HttpRequest
import io.micronaut.http.MutableHttpResponse
import io.micronaut.http.annotation.Filter
import io.micronaut.http.filter.HttpServerFilter
import io.micronaut.http.filter.ServerFilterChain
import org.reactivestreams.Publisher

@Filter("/hello/**") // (1)
class TraceFilter(// (2)
    private val traceService: TraceService)// (3)
    : HttpServerFilter {

}
```

  </TabItem>
</Tabs>

1. [Filter](https://docs.micronaut.io/3.8.4/api/io/micronaut/http/annotation/Filter.html) 注解定义筛选器匹配的 URI 模式
2. 该类实现 [HttpServerFilter](https://docs.micronaut.io/3.8.4/api/io/micronaut/http/filter/HttpServerFilter.html) 接口
3. 先前定义的 `TraceService` 是通过构造函数注入的

最后一步是编写 [HttpServerFilter](https://docs.micronaut.io/3.8.4/api/io/micronaut/http/filter/HttpServerFilter.html) 接口的 `doFilter` 实现。

*doFilter 实现*

<Tabs>
  <TabItem value="Java" label="Java" default>

```java
@Override
public Publisher<MutableHttpResponse<?>> doFilter(HttpRequest<?> request,
                                                  ServerFilterChain chain) {
    return Flux.from(traceService
            .trace(request)) // (1)
            .switchMap(aBoolean -> chain.proceed(request)) // (2)
            .doOnNext(res ->
                res.getHeaders().add("X-Trace-Enabled", "true") // (3)
            );
}
```

  </TabItem>
  <TabItem value="Groovy" label="Groovy">

```groovy
@Override
Publisher<MutableHttpResponse<?>> doFilter(HttpRequest<?> request,
                                           ServerFilterChain chain) {
    traceService
            .trace(request) // (1)
            .switchMap({ aBoolean -> chain.proceed(request) }) // (2)
            .doOnNext({ res ->
                res.headers.add("X-Trace-Enabled", "true") // (3)
            })
}
```

  </TabItem>
  <TabItem value="Kotlin" label="Kotlin">

```kt
override fun doFilter(request: HttpRequest<*>,
                      chain: ServerFilterChain): Publisher<MutableHttpResponse<*>> {
    return traceService.trace(request) // (1)
        .switchMap { aBoolean -> chain.proceed(request) } // (2)
        .doOnNext { res ->
            res.headers.add("X-Trace-Enabled", "true") // (3)
        }
}
```

  </TabItem>
</Tabs>

1. 调用 `TraceService` 来跟踪请求
2. 如果调用成功，筛选器将使用 [Project Reactor](https://projectreactor.io/) 的 `switchMap` 方法恢复请求处理，该方法调用 [ServerFilterChain](https://docs.micronaut.io/3.8.4/api/io/micronaut/http/filter/ServerFilterChain.html) 的继续方法
3. 最后，[Project Reactor](https://projectreactor.io/) 的 `doOnNext` 方法将一个 `X-Trace-Enabled` 头添加到响应中。

前面的示例演示了一些关键概念，例如在处理请求和修改传出响应之前以非阻塞方式执行逻辑。

:::note 提示
示例使用 [Project Reactor](https://projectreactor.io/)，但是您可以使用任何支持响应式流规范的响应式框架
:::

[Filter](https://docs.micronaut.io/3.8.4/api/io/micronaut/http/annotation/Filter.html) 可以通过设置 `patternStyle` 来使用不同样式的图案进行路径匹配。默认情况下，它使用 [AntPathMatcher](https://docs.micronaut.io/3.8.4/api/io/micronaut/core/util/AntPathMatcher.html) 进行路径匹配。使用 Ant 时，映射使用以下规则匹配 URL：

- `?` 匹配一个字符
- `*` 匹配零个或多个字符
- `**` 匹配路径中的零个子目录或多个子目录

*表 1.@Filter 注解路径匹配示例*

|模式|示例匹配路径|
|--|--|
|`/**`|任意路径|
|`customer/j?y`|customer/joy、customer/jay|
|`customer/*/id`|customer/adam/id、com/amy/id|
|`customer/**`|customer/adam、customer/adam/id、customer/adam/name|
|`customer/*/.html`|customer/index.html、customer/adam/profile.html、customer/adam/job/description.html 另一种选择是基于正则表达式的匹配。若要使用正则表达式，请设置 `patternStyle=FilterPatternStyle.REGEX`。`pattern` 属性应包含一个正则表达式，该正则表达式应与提供的URL完全匹配（使用 [Matcher#matches](https://docs.oracle.com/javase/8/docs/api/java/util/regex/Matcher.html#matches--)）。注意：首选使用 `FilterPatternStyle.ANT`，因为模式匹配比使用正则表达式更具性能。当无法使用 Ant 正确编写模式时，应使用 FilterPatternStyle.REGEX。== 错误状态 从 `chain.proceed` 返回的发布者不应发出错误。在上游过滤器发出错误或路由本身引发异常的情况下，应该发出错误响应而不是异常。在某些情况下，可能需要知道错误响应的原因，为此，如果响应是由于发出或抛出异常而创建的，则响应上存在一个属性。原始原因存储为属性 [EXCEPTION](https://docs.micronaut.io/3.8.4/api/io/micronaut/http/HttpAttributes.html#EXCEPTION)。|

> [英文链接](https://docs.micronaut.io/3.9.4/guide/index.html#filters)

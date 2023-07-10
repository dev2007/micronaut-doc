---
sidebar_position: 20
---

# 7.2 用 ProxyHttpClient 来代理请求

微服务环境中的一个常见需求是将网关微服务中的请求代理给其他后端微服务。

常规的 [HttpClient](https://docs.micronaut.io/latest/api/io/micronaut/http/client/HttpClient.html) API 是围绕简化消息交换而设计的，并不是为代理请求而设计的。对于这种情况，请使用 [ProxyHttpClient](https://docs.micronaut.io/latest/api/io/micronaut/http/client/ProxyHttpClient.html)，它可以从 HTTP 服务器过滤器中使用，以代理请求到后端微服务。

下面的例子演示了将 URI `/proxy` 下的请求改写为 URI `/real` 到同一台服务器上（尽管在真实环境中，你通常会代理到另一台服务器）：

*重写原始请求的代理过滤器*

import Tabs from '@theme/Tabs';
import TabItem from '@theme/TabItem';

<Tabs>
  <TabItem value="Java" label="Java" default>

```java
import io.micronaut.core.async.publisher.Publishers;
import io.micronaut.core.util.StringUtils;
import io.micronaut.http.HttpRequest;
import io.micronaut.http.MutableHttpResponse;
import io.micronaut.http.annotation.Filter;
import io.micronaut.http.client.ProxyHttpClient;
import io.micronaut.http.filter.HttpServerFilter;
import io.micronaut.http.filter.ServerFilterChain;
import io.micronaut.runtime.server.EmbeddedServer;
import org.reactivestreams.Publisher;

@Filter("/proxy/**")
public class ProxyFilter implements HttpServerFilter { // (1)

    private final ProxyHttpClient client;
    private final EmbeddedServer embeddedServer;

    public ProxyFilter(ProxyHttpClient client,
                       EmbeddedServer embeddedServer) { // (2)
        this.client = client;
        this.embeddedServer = embeddedServer;
    }

    @Override
    public Publisher<MutableHttpResponse<?>> doFilter(HttpRequest<?> request,
                                                      ServerFilterChain chain) {
        return Publishers.map(client.proxy( // (3)
                request.mutate() // (4)
                        .uri(b -> b // (5)
                                .scheme("http")
                                .host(embeddedServer.getHost())
                                .port(embeddedServer.getPort())
                                .replacePath(StringUtils.prependUri(
                                        "/real",
                                        request.getPath().substring("/proxy".length())
                                ))
                        )
                        .header("X-My-Request-Header", "XXX") // (6)
        ), response -> response.header("X-My-Response-Header", "YYY"));
    }
}
```

  </TabItem>
  <TabItem value="Groovy" label="Groovy">

```groovy
import io.micronaut.core.async.publisher.Publishers
import io.micronaut.core.util.StringUtils
import io.micronaut.http.HttpRequest
import io.micronaut.http.MutableHttpResponse
import io.micronaut.http.annotation.Filter
import io.micronaut.http.client.ProxyHttpClient
import io.micronaut.http.filter.HttpServerFilter
import io.micronaut.http.filter.ServerFilterChain
import io.micronaut.http.uri.UriBuilder
import io.micronaut.runtime.server.EmbeddedServer
import org.reactivestreams.Publisher

@Filter("/proxy/**")
class ProxyFilter implements HttpServerFilter { // (1)

    private final ProxyHttpClient client
    private final EmbeddedServer embeddedServer

    ProxyFilter(ProxyHttpClient client,
                EmbeddedServer embeddedServer) { // (2)
        this.client = client
        this.embeddedServer = embeddedServer
    }

    @Override
    Publisher<MutableHttpResponse<?>> doFilter(HttpRequest<?> request,
                                               ServerFilterChain chain) {
        Publishers.map(client.proxy( // (3)
                request.mutate() // (4)
                        .uri { UriBuilder b -> // (5)
                            b.with {
                                scheme("http")
                                host(embeddedServer.host)
                                port(embeddedServer.port)
                                replacePath(StringUtils.prependUri(
                                        "/real",
                                        request.path.substring("/proxy".length())
                                ))
                            }
                        }
                        .header("X-My-Request-Header", "XXX") // (6)
        ), { it.header("X-My-Response-Header", "YYY") })
    }
}
```

  </TabItem>
  <TabItem value="Kotlin" label="Kotlin">

```kt
import io.micronaut.core.async.publisher.Publishers
import io.micronaut.core.util.StringUtils
import io.micronaut.http.HttpRequest
import io.micronaut.http.MutableHttpResponse
import io.micronaut.http.annotation.Filter
import io.micronaut.http.client.ProxyHttpClient
import io.micronaut.http.filter.HttpServerFilter
import io.micronaut.http.filter.ServerFilterChain
import io.micronaut.http.uri.UriBuilder
import io.micronaut.runtime.server.EmbeddedServer
import org.reactivestreams.Publisher

@Filter("/proxy/**")
class ProxyFilter(
    private val client: ProxyHttpClient, // (2)
    private val embeddedServer: EmbeddedServer
) : HttpServerFilter { // (1)

    override fun doFilter(request: HttpRequest<*>,
                          chain: ServerFilterChain): Publisher<MutableHttpResponse<*>> {
        return Publishers.map(client.proxy( // (3)
            request.mutate() // (4)
                .uri { b: UriBuilder -> // (5)
                    b.apply {
                        scheme("http")
                        host(embeddedServer.host)
                        port(embeddedServer.port)
                        replacePath(StringUtils.prependUri(
                            "/real",
                            request.path.substring("/proxy".length))
                        )
                    }
                }
                .header("X-My-Request-Header", "XXX") // (6)
        ), { response: MutableHttpResponse<*> -> response.header("X-My-Response-Header", "YYY") })
    }
}
```

  </TabItem>
</Tabs>

1. 该过滤器扩展了 [HttpServerFilter](https://docs.micronaut.io/latest/api/io/micronaut/http/filter/HttpServerFilter.html)
2. [ProxyHttpClient](https://docs.micronaut.io/latest/api/io/micronaut/http/client/ProxyHttpClient.html) 被注入构造函数中。
3. `proxy` 方法代理了该请求
4. 请求被改变以修改URI并包括一个额外的头。
5. [UriBuilder](https://docs.micronaut.io/latest/api/io/micronaut/http/uri/UriBuilder.html) API 重写 URI
6. 包括额外的请求和响应标头

:::tip 注意
[ProxyHttpClient](https://docs.micronaut.io/latest/api/io/micronaut/http/client/ProxyHttpClient.html) API 是一个低级别的 API，可以用来建立一个更高级别的抽象，如 API 网关。
:::

> [英文链接](https://docs.micronaut.io/latest/guide/#proxyClient)
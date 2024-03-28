---
sidebar_position: 40
---

# 7.4 HTTP 客户端过滤器

针对第三方 API 或调用其他微服务时，你经常需要在一组请求中包含相同的 HTTP 头信息或 URL 参数。

为了简化这一过程，你可以定义 [HttpClientFilter](https://micronaut-projects.github.io/micronaut-docs-mn3/3.9.4/api/io/micronaut/http/filter/HttpClientFilter.html) 类，将其应用于所有匹配的 HTTP 客户端请求。

举个例子，比如你想创建一个客户端与 [Bintray REST API](https://bintray.com/docs/api/) 通信。为每个 HTTP 调用都指定身份验证会很繁琐。

要解决这个问题，你可以定义一个过滤器。下面是一个 `BintrayService`：

import Tabs from '@theme/Tabs';
import TabItem from '@theme/TabItem';

<Tabs>
  <TabItem value="Java" label="Java" default>

```java
class BintrayApi {
    public static final String URL = 'https://api.bintray.com'
}

@Singleton
class BintrayService {
    final HttpClient client;
    final String org;

    BintrayService(
            @Client(BintrayApi.URL) HttpClient client,           // (1)
            @Value("${bintray.organization}") String org ) {
        this.client = client;
        this.org = org;
    }

    Flux<HttpResponse<String>> fetchRepositories() {
        return Flux.from(client.exchange(HttpRequest.GET(
                "/repos/" + org), String.class)); // (2)
    }

    Flux<HttpResponse<String>> fetchPackages(String repo) {
        return Flux.from(client.exchange(HttpRequest.GET(
                "/repos/" + org + "/" + repo + "/packages"), String.class)); // (2)
    }
}
```

  </TabItem>
  <TabItem value="Groovy" label="Groovy">

```groovy
class BintrayApi {
    public static final String URL = 'https://api.bintray.com'
}

@Singleton
class BintrayService {
    final HttpClient client
    final String org

    BintrayService(
            @Client(BintrayApi.URL) HttpClient client, // (1)
            @Value('${bintray.organization}') String org ) {
        this.client = client
        this.org = org
    }

    Flux<HttpResponse<String>> fetchRepositories() {
        client.exchange(HttpRequest.GET("/repos/$org"), String) // (2)
    }

    Flux<HttpResponse<String>> fetchPackages(String repo) {
        client.exchange(HttpRequest.GET("/repos/${org}/${repo}/packages"), String) // (2)
    }
}
```

  </TabItem>
  <TabItem value="Kotlin" label="Kotlin">

```kt
class BintrayApi {
    public static final String URL = 'https://api.bintray.com'
}

@Singleton
class BintrayService {
    final HttpClient client
    final String org

    BintrayService(
            @Client(BintrayApi.URL) HttpClient client, // (1)
            @Value('${bintray.organization}') String org ) {
        this.client = client
        this.org = org
    }

    Flux<HttpResponse<String>> fetchRepositories() {
        client.exchange(HttpRequest.GET("/repos/$org"), String) // (2)
    }

    Flux<HttpResponse<String>> fetchPackages(String repo) {
        client.exchange(HttpRequest.GET("/repos/${org}/${repo}/packages"), String) // (2)
    }
}
```

  </TabItem>
</Tabs>

1. 为 Bintray 应用程序注入 [ReactorHttpClient](https://micronaut-projects.github.io/micronaut-reactor/latest/api/io/micronaut/reactor/http/client/ReactorHttpClient.html)
2. 组织可通过配置进行配置

Bintray API 是安全的。要进行身份验证，需要为每个请求添加一个 `Authorization` 头。你可以修改 `fetchRepositories` 和 `fetchPackages` 方法，为每个请求添加必要的 HTTP 头信息，但使用过滤器要简单得多：

<Tabs>
  <TabItem value="Java" label="Java" default>

```java
@Filter("/repos/**") // (1)
class BintrayFilter implements HttpClientFilter {

    final String username;
    final String token;

    BintrayFilter(
            @Value("${bintray.username}") String username, // (2)
            @Value("${bintray.token}") String token ) { // (2)
        this.username = username;
        this.token = token;
    }

    @Override
    public Publisher<? extends HttpResponse<?>> doFilter(MutableHttpRequest<?> request,
                                                         ClientFilterChain chain) {
        return chain.proceed(
                request.basicAuth(username, token) // (3)
        );
    }
}
```

  </TabItem>
  <TabItem value="Groovy" label="Groovy">

```groovy
@Filter('/repos/**') // (1)
class BintrayFilter implements HttpClientFilter {

    final String username
    final String token

    BintrayFilter(
            @Value('${bintray.username}') String username, // (2)
            @Value('${bintray.token}') String token ) { // (2)
        this.username = username
        this.token = token
    }

    @Override
    Publisher<? extends HttpResponse<?>> doFilter(MutableHttpRequest<?> request,
                                                  ClientFilterChain chain) {
        chain.proceed(
                request.basicAuth(username, token) // (3)
        )
    }
}
```

  </TabItem>
  <TabItem value="Kotlin" label="Kotlin">

```kt
@Filter("/repos/**") // (1)
internal class BintrayFilter(
        @param:Value("\${bintray.username}") val username: String, // (2)
        @param:Value("\${bintray.token}") val token: String)// (2)
    : HttpClientFilter {

    override fun doFilter(request: MutableHttpRequest<*>, chain: ClientFilterChain): Publisher<out HttpResponse<*>> {
        return chain.proceed(
            request.basicAuth(username, token) // (3)
        )
    }
}
```

  </TabItem>
</Tabs>

1. 你可以使用客户端过滤器只匹配路径的子集。
2. `username` 和 `token` 通过配置注入
3. `basicAuth` 方法包含 HTTP Basic 凭证

现在，当你调用 `bintrayService.fetchRepositories()` 方法时，请求中会包含授权 HTTP 头信息。

**在 HttpClientFilter 中注入另一个客户端**

要创建 [ReactorHttpClient](https://micronaut-projects.github.io/micronaut-reactor/latest/api/io/micronaut/reactor/http/client/ReactorHttpClient.html)，Micronaut 需要解析所有 `HttpClientFilter` 实例，这在将另一个 [ReactorHttpClient](https://micronaut-projects.github.io/micronaut-reactor/latest/api/io/micronaut/reactor/http/client/ReactorHttpClient.html) 或 `@Client` Bean 注入 `HttpClientFilter` 实例时会产生循环依赖关系。

要解决这个问题，可使用 [BeanProvider](https://micronaut-projects.github.io/micronaut-docs-mn3/3.9.4/api/io/micronaut/context/BeanProvider.html) 接口将另一个 [ReactorHttpClient](https://micronaut-projects.github.io/micronaut-reactor/latest/api/io/micronaut/reactor/http/client/ReactorHttpClient.html) 或 `@Client` Bean 注入 `HttpClientFilter` 实例。

下面的示例实现了一个过滤器，允许在 [Google Cloud Run 服务之间进行认证](https://cloud.google.com/run/docs/authenticating/service-to-service)，演示了如何使用 [BeanProvider](https://micronaut-projects.github.io/micronaut-docs-mn3/3.9.4/api/io/micronaut/context/BeanProvider.html) 注入另一个客户端：

<Tabs>
  <TabItem value="Java" label="Java" default>

```java
import io.micronaut.context.BeanProvider;
import io.micronaut.context.annotation.Requires;
import io.micronaut.context.env.Environment;
import io.micronaut.http.HttpRequest;
import io.micronaut.http.HttpResponse;
import io.micronaut.http.MutableHttpRequest;
import io.micronaut.http.annotation.Filter;
import io.micronaut.http.client.HttpClient;
import io.micronaut.http.filter.ClientFilterChain;
import io.micronaut.http.filter.HttpClientFilter;
import org.reactivestreams.Publisher;
import reactor.core.publisher.Mono;

import java.io.UnsupportedEncodingException;
import java.net.URI;
import java.net.URLEncoder;

@Requires(env = Environment.GOOGLE_COMPUTE)
@Filter(patterns = "/google-auth/api/**")
public class GoogleAuthFilter implements HttpClientFilter {

    private final BeanProvider<HttpClient> authClientProvider;

    public GoogleAuthFilter(BeanProvider<HttpClient> httpClientProvider) { // (1)
        this.authClientProvider = httpClientProvider;
    }

    @Override
    public Publisher<? extends HttpResponse<?>> doFilter(MutableHttpRequest<?> request,
                                                         ClientFilterChain chain) {
        return Mono.fromCallable(() -> encodeURI(request))
                .flux()
                .flatMap(uri -> authClientProvider.get().retrieve(HttpRequest.GET(uri) // (2)
                        .header("Metadata-Flavor", "Google")))
                .flatMap(t -> chain.proceed(request.bearerAuth(t)));
    }

    private String encodeURI(MutableHttpRequest<?> request) throws UnsupportedEncodingException {
        URI fullURI = request.getUri();
        String receivingURI = fullURI.getScheme() + "://" + fullURI.getHost();
        return "http://metadata/computeMetadata/v1/instance/service-accounts/default/identity?audience=" +
                URLEncoder.encode(receivingURI, "UTF-8");
    }
}
```

  </TabItem>
  <TabItem value="Groovy" label="Groovy">

```groovy
import io.micronaut.context.annotation.Requires
import io.micronaut.context.env.Environment
import io.micronaut.context.BeanProvider
import io.micronaut.http.HttpResponse
import io.micronaut.http.MutableHttpRequest
import io.micronaut.http.annotation.Filter
import io.micronaut.http.client.HttpClient
import io.micronaut.http.filter.ClientFilterChain
import io.micronaut.http.filter.HttpClientFilter
import org.reactivestreams.Publisher
import reactor.core.publisher.Flux
import reactor.core.publisher.Mono

import static io.micronaut.http.HttpRequest.GET

@Requires(env = Environment.GOOGLE_COMPUTE)
@Filter(patterns = "/google-auth/api/**")
class GoogleAuthFilter implements HttpClientFilter {

    private final BeanProvider<HttpClient> authClientProvider

    GoogleAuthFilter(BeanProvider<HttpClient> httpClientProvider) { // (1)
        this.authClientProvider = httpClientProvider
    }

    @Override
    Publisher<? extends HttpResponse<?>> doFilter(MutableHttpRequest<?> request,
                                                  ClientFilterChain chain) {
        Flux<String> token = Mono.fromCallable(() -> encodeURI(request))
                .flatMap(authURI -> authClientProvider.get().retrieve(GET(authURI).header( // (2)
                        "Metadata-Flavor", "Google"
                )))

        return token.flatMap(t -> chain.proceed(request.bearerAuth(t)))
    }

    private static String encodeURI(MutableHttpRequest<?> request) {
        String receivingURI = "$request.uri.scheme://$request.uri.host"
        "http://metadata/computeMetadata/v1/instance/service-accounts/default/identity?audience=" +
                URLEncoder.encode(receivingURI, "UTF-8")
    }
}
```

  </TabItem>
  <TabItem value="Kotlin" label="Kotlin">

```kt
import io.micronaut.context.BeanProvider
import io.micronaut.context.annotation.Requires
import io.micronaut.context.env.Environment
import io.micronaut.http.HttpRequest
import io.micronaut.http.HttpResponse
import io.micronaut.http.MutableHttpRequest
import io.micronaut.http.annotation.Filter
import io.micronaut.http.client.HttpClient
import io.micronaut.http.filter.ClientFilterChain
import io.micronaut.http.filter.HttpClientFilter
import org.reactivestreams.Publisher
import reactor.core.publisher.Mono
import java.net.URLEncoder

@Requires(env = [Environment.GOOGLE_COMPUTE])
@Filter(patterns = ["/google-auth/api/**"])
class GoogleAuthFilter (
    private val authClientProvider: BeanProvider<HttpClient>) : HttpClientFilter { // (1)

    override fun doFilter(request: MutableHttpRequest<*>,
                          chain: ClientFilterChain): Publisher<out HttpResponse<*>?> {
        return Mono.fromCallable { encodeURI(request) }
            .flux()
            .map { authURI: String ->
                authClientProvider.get().retrieve(HttpRequest.GET<Any>(authURI)
                    .header("Metadata-Flavor", "Google") // (2)
                )
            }.flatMap { t -> chain.proceed(request.bearerAuth(t.toString())) }
    }

    private fun encodeURI(request: MutableHttpRequest<*>): String {
        val receivingURI = "${request.uri.scheme}://${request.uri.host}"
        return "http://metadata/computeMetadata/v1/instance/service-accounts/default/identity?audience=" +
                URLEncoder.encode(receivingURI, "UTF-8")
    }

}
```

  </TabItem>
</Tabs>

1. [BeanProvider](https://micronaut-projects.github.io/micronaut-docs-mn3/3.9.4/api/io/micronaut/context/BeanProvider.html) 接口用于注入另一个客户端，避免循环引用。
2. `Provider` 接口的 `get()` 方法用于获取客户端实例。

**通过注解进行筛选匹配**

对于无论 URL 如何都应将过滤器应用于客户端的情况，过滤器可以通过同时应用于过滤器和客户端的注解进行匹配。下面是一个客户端：

<Tabs>
  <TabItem value="Java" label="Java" default>

```java
import io.micronaut.http.annotation.Get;
import io.micronaut.http.client.annotation.Client;

@BasicAuth // (1)
@Client("/message")
public interface BasicAuthClient {

    @Get
    String getMessage();
}
```

  </TabItem>
  <TabItem value="Groovy" label="Groovy">

```groovy
import io.micronaut.http.annotation.Get
import io.micronaut.http.client.annotation.Client

@BasicAuth // (1)
@Client("/message")
interface BasicAuthClient {

    @Get
    String getMessage()
}
```

  </TabItem>
  <TabItem value="Kotlin" label="Kotlin">

```kt
import io.micronaut.http.annotation.Get
import io.micronaut.http.client.annotation.Client

@BasicAuth // (1)
@Client("/message")
interface BasicAuthClient {

    @Get
    fun getMessage(): String
}
```

  </TabItem>
</Tabs>

1. 客户端应用 `@BasicAuth` 注解

以下过滤器将过滤客户端请求：

<Tabs>
  <TabItem value="Java" label="Java" default>

```java
import io.micronaut.http.HttpResponse;
import io.micronaut.http.MutableHttpRequest;
import io.micronaut.http.filter.ClientFilterChain;
import io.micronaut.http.filter.HttpClientFilter;
import org.reactivestreams.Publisher;

import jakarta.inject.Singleton;

@BasicAuth // (1)
@Singleton // (2)
public class BasicAuthClientFilter implements HttpClientFilter {

    @Override
    public Publisher<? extends HttpResponse<?>> doFilter(MutableHttpRequest<?> request,
                                                         ClientFilterChain chain) {
        return chain.proceed(request.basicAuth("user", "pass"));
    }
}
```

  </TabItem>
  <TabItem value="Groovy" label="Groovy">

```groovy
import io.micronaut.http.HttpResponse
import io.micronaut.http.MutableHttpRequest
import io.micronaut.http.filter.ClientFilterChain
import io.micronaut.http.filter.HttpClientFilter
import org.reactivestreams.Publisher

import jakarta.inject.Singleton

@BasicAuth // (1)
@Singleton // (2)
class BasicAuthClientFilter implements HttpClientFilter {

    @Override
    Publisher<? extends HttpResponse<?>> doFilter(MutableHttpRequest<?> request,
                                                  ClientFilterChain chain) {
        chain.proceed(request.basicAuth("user", "pass"))
    }
}
```

  </TabItem>
  <TabItem value="Kotlin" label="Kotlin">

```kt
import io.micronaut.http.HttpResponse
import io.micronaut.http.MutableHttpRequest
import io.micronaut.http.filter.ClientFilterChain
import io.micronaut.http.filter.HttpClientFilter
import org.reactivestreams.Publisher

import jakarta.inject.Singleton

@BasicAuth // (1)
@Singleton // (2)
class BasicAuthClientFilter : HttpClientFilter {

    override fun doFilter(request: MutableHttpRequest<*>,
                          chain: ClientFilterChain): Publisher<out HttpResponse<*>> {
        return chain.proceed(request.basicAuth("user", "pass"))
    }
}
```

  </TabItem>
</Tabs>

1. 同样的注解 `@BasicAuth` 也应用于过滤器
2. 通常情况下，`@Filter` 注解会使过滤器默认为单子。由于未使用 `@Filter` 注解，因此必须应用所需的作用域

`@BasicAuth` 注解只是一个示例，可以用自己的注解代替。

<Tabs>
  <TabItem value="Java" label="Java" default>

```java
import io.micronaut.http.annotation.FilterMatcher;

import java.lang.annotation.Documented;
import java.lang.annotation.Retention;
import java.lang.annotation.Target;

import static java.lang.annotation.ElementType.PARAMETER;
import static java.lang.annotation.ElementType.TYPE;
import static java.lang.annotation.RetentionPolicy.RUNTIME;

@FilterMatcher // (1)
@Documented
@Retention(RUNTIME)
@Target({TYPE, PARAMETER})
public @interface BasicAuth {
}
```

  </TabItem>
  <TabItem value="Groovy" label="Groovy">

```groovy
import io.micronaut.http.annotation.FilterMatcher;

import java.lang.annotation.Documented;
import java.lang.annotation.Retention;
import java.lang.annotation.Target;

import static java.lang.annotation.ElementType.PARAMETER;
import static java.lang.annotation.ElementType.TYPE;
import static java.lang.annotation.RetentionPolicy.RUNTIME;

@FilterMatcher // (1)
@Documented
@Retention(RUNTIME)
@Target({TYPE, PARAMETER})
public @interface BasicAuth {
}
```

  </TabItem>
  <TabItem value="Kotlin" label="Kotlin">

```kt
import io.micronaut.http.annotation.FilterMatcher

import java.lang.annotation.Documented
import java.lang.annotation.Retention
import java.lang.annotation.Target

import static java.lang.annotation.ElementType.PARAMETER
import static java.lang.annotation.ElementType.TYPE
import static java.lang.annotation.RetentionPolicy.RUNTIME

@FilterMatcher // (1)
@Documented
@Retention(RUNTIME)
@Target([TYPE, PARAMETER])
@interface BasicAuth {
}
```

  </TabItem>
</Tabs>

1. 自定义注解的唯一要求是必须包含 [@FilterMatcher](https://micronaut-projects.github.io/micronaut-docs-mn3/3.9.4/api/io/micronaut/http/annotation/FilterMatcher.html) 注解

> [英文链接](https://micronaut-projects.github.io/micronaut-docs-mn3/3.9.4/guide/index.html#clientFilter)

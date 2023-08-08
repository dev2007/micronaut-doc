---
sidebar_position: 200
---

# 6.20 书写响应数据

**响应式书写响应数据**

Micronaut 的 HTTP 服务器通过返回一个 [Publisher](http://www.reactive-streams.org/reactive-streams-1.0.3-javadoc/org/reactivestreams/Publisher.html) 来支持写入响应数据块，该发布服务器发送可以编码到 HTTP 响应的对象。

下表总结了示例返回类型签名以及服务器处理它们时表现出的行为：

|响应类型|描述|
|--|--|
|`Publisher<String>`|一个 [Publisher](http://www.reactive-streams.org/reactive-streams-1.0.3-javadoc/org/reactivestreams/Publisher.html) 将每个内容块作为字符串发送|
|`Flux<byte[]>`|一个 [Flux](https://projectreactor.io/docs/core/release/api/reactor/core/publisher/Flux.html) 将每个内容块作为 `byte[]` 无阻塞的发送|
|`Flux<ByteBuf>`|一个 Reactor `Flux` 将每个内容块作为 Netty `ByteBuf` 发送|
|`Flux<Book>`|当发送 POJO 时，默认情况下，每个发出的对象都被无阻塞的编码为 JSON|
|`Flowable<byte[]>`|一个 [Flux](https://projectreactor.io/docs/core/release/api/reactor/core/publisher/Flux.html) 将每个内容块作为 `byte[]` 无阻塞的发送|
|`Flowable<ByteBuf>`|一个 Reactor [Flux](https://projectreactor.io/docs/core/release/api/reactor/core/publisher/Flux.html) 将每个内容块作为 Netty `ByteBuf` 发送|
|`Flowable<Book>`|当发送 POJO 时, 默认情况下，每个发出的对象都被无阻塞的编码为 JSON|

当返回响应式类型时，服务器使用分块的 `Transfer-Encoding` 并继续写入数据，直到调用 [Publisher](http://www.reactive-streams.org/reactive-streams-1.0.3-javadoc/org/reactivestreams/Publisher.html) `onComplete` 方法为止。

服务器从 [Publisher](http://www.reactive-streams.org/reactive-streams-1.0.3-javadoc/org/reactivestreams/Publisher.html) 请求一个项目，写入该项目，然后请求下一个项目（控制背压）。

:::tip 注意
由 [Publisher](http://www.reactive-streams.org/reactive-streams-1.0.3-javadoc/org/reactivestreams/Publisher.html) 的实现来调度任何阻塞 I/O 工作，这些工作由订阅发布器的结果来完成的。
:::

:::tip 注意
要使用 [Project Reactor](https://projectreactor.io/) 的 `Flux` 或 `Mono`，你需要在项目中添加 Micronaut Reactor 依赖，以引入必需的转换器。
:::

:::tip 注意
要使用 [RxJava](https://github.com/ReactiveX/RxJava) 的 `Flowable`、`Single` 或 `Maybe`，你需要将 Micronaut RxJava 依赖项添加到你的项目中，以引入必需的转换器。
:::

**执行阻塞 I/O**

在某些情况下，你可能希望集成不支持非阻塞I/O的库。

**Writable**

在这种情况下，你可以从任何控制器方法返回一个 [Writable](https://micronaut-projects.github.io/micronaut-docs-mn3/3.9.4/api/io/micronaut/core/io/Writable.html) 对象。[Writable](https://micronaut-projects.github.io/micronaut-docs-mn3/3.9.4/api/io/micronaut/core/io/Writable.html) 接口有各种签名，允许写入传统的阻塞流，如 [Writer](https://docs.oracle.com/javase/8/docs/api/java/io/Writer.html) 或 [OutputStream](https://docs.oracle.com/javase/8/docs/api/java/io/OutputStream.html)。

当返回 [Writable](https://micronaut-projects.github.io/micronaut-docs-mn3/3.9.4/api/io/micronaut/core/io/Writable.html) 时，阻塞 I/O 操作会转移到 I/O 线程池，因此不会阻塞 Netty 事件循环。

:::tip 注意
有关如何配置 I/O 线程池以满足应用程序要求的详细信息，参阅配置[服务器线程池](/core/httpserver/serverConfiguration.html#配置服务器线程池)部分。
:::

以下示例演示了如何将此 API 与 Groovy 的 `SimpleTemplateEngine` 结合使用来编写服务器端模板：

*使用 Writable 执行阻塞 I/O*

import Tabs from '@theme/Tabs';
import TabItem from '@theme/TabItem';

<Tabs>
  <TabItem value="Java" label="Java" default>

```java
import groovy.text.SimpleTemplateEngine;
import groovy.text.Template;
import io.micronaut.core.io.Writable;
import io.micronaut.core.util.CollectionUtils;
import io.micronaut.http.MediaType;
import io.micronaut.http.annotation.Controller;
import io.micronaut.http.annotation.Get;
import io.micronaut.http.server.exceptions.HttpServerException;

@Controller("/template")
public class TemplateController {

    private final SimpleTemplateEngine templateEngine = new SimpleTemplateEngine();
    private final Template template = initTemplate(); // (1)

    @Get(value = "/welcome", produces = MediaType.TEXT_PLAIN)
    Writable render() { // (2)
        return writer -> template.make( // (3)
            CollectionUtils.mapOf(
                    "firstName", "Fred",
                    "lastName", "Flintstone"
            )
        ).writeTo(writer);
    }

    private Template initTemplate() {
        try {
            return templateEngine.createTemplate(
                    "Dear $firstName $lastName. Nice to meet you."
            );
        } catch (Exception e) {
            throw new HttpServerException("Cannot create template");
        }
    }
}
```

  </TabItem>
  <TabItem value="Groovy" label="Groovy">

```groovy
import groovy.text.SimpleTemplateEngine
import groovy.text.Template
import io.micronaut.core.io.Writable
import io.micronaut.http.MediaType
import io.micronaut.http.annotation.Controller
import io.micronaut.http.annotation.Get
import io.micronaut.http.server.exceptions.HttpServerException

@Controller("/template")
class TemplateController {

    private final SimpleTemplateEngine templateEngine = new SimpleTemplateEngine()
    private final Template template = initTemplate() // (1)

    @Get(value = "/welcome", produces = MediaType.TEXT_PLAIN)
    Writable render() { // (2)
        { writer ->
            template.make( // (3)
                    firstName: "Fred",
                    lastName: "Flintstone"
            ).writeTo(writer)
        }
    }

    private Template initTemplate() {
        try {
            return templateEngine.createTemplate(
                    'Dear $firstName $lastName. Nice to meet you.'
            )
        } catch (Exception e) {
            throw new HttpServerException("Cannot create template")
        }
    }
}
```

  </TabItem>
  <TabItem value="Kotlin" label="Kotlin">

```kt
import groovy.text.SimpleTemplateEngine
import groovy.text.Template
import io.micronaut.core.io.Writable
import io.micronaut.http.MediaType
import io.micronaut.http.annotation.Controller
import io.micronaut.http.annotation.Get
import io.micronaut.http.server.exceptions.HttpServerException
import java.io.Writer

@Controller("/template")
class TemplateController {

    private val templateEngine = SimpleTemplateEngine()
    private val template = initTemplate() // (1)

    @Get(value = "/welcome", produces = [MediaType.TEXT_PLAIN])
    internal fun render(): Writable { // (2)
        return { writer: Writer ->
            template.make( // (3)
                    mapOf(
                        "firstName" to "Fred",
                        "lastName" to "Flintstone"
                    )
            ).writeTo(writer)
        } as Writable
    }

    private fun initTemplate(): Template {
        return try {
            templateEngine.createTemplate(
                "Dear \$firstName \$lastName. Nice to meet you."
            )
        } catch (e: Exception) {
            throw HttpServerException("Cannot create template")
        }
    }
}
```

  </TabItem>
</Tabs>

1. 控制器创建一个简单的模板
2. 控制器方法返回一个 [Writable](https://micronaut-projects.github.io/micronaut-docs-mn3/3.9.4/api/io/micronaut/core/io/Writable.html)
3. 返回的函数接收一个 [Writer](https://docs.oracle.com/javase/8/docs/api/java/io/Writer.html) 并调用模板上的 `writeTo`

**InputStream**

另一个选项是返回一个输入流。这对于许多与暴露流的其他 API 交互场景非常有用。

*使用 InputStream 执行阻塞 I/O*

<Tabs>
  <TabItem value="Java" label="Java" default>

```java
@Get(value = "/write", produces = MediaType.TEXT_PLAIN)
InputStream write() {
    byte[] bytes = "test".getBytes(StandardCharsets.UTF_8);
    return new ByteArrayInputStream(bytes); // (1)
}
```

  </TabItem>
  <TabItem value="Groovy" label="Groovy">

```groovy
@Get(value = "/write", produces = MediaType.TEXT_PLAIN)
InputStream write() {
    byte[] bytes = "test".getBytes(StandardCharsets.UTF_8);
    new ByteArrayInputStream(bytes) // (1)
}
```

  </TabItem>
  <TabItem value="Kotlin" label="Kotlin">

```kt
@Get(value = "/write", produces = [MediaType.TEXT_PLAIN])
fun write(): InputStream {
    val bytes = "test".toByteArray(StandardCharsets.UTF_8)
    return ByteArrayInputStream(bytes) // (1)
}
```

  </TabItem>
</Tabs>

1. 返回输入流，其内容将作为响应体

:::tip 注意
如果在事件循环上执行控制器方法，则流的读取将被卸载到IO线程池。
:::

**404 响应**

通常，当你在持久层或类似场景中找不到项目时，你希望响应 404（Not Found，未找到）。

请参见以下示例：

<Tabs>
  <TabItem value="Java" label="Java" default>

```java
@Controller("/books")
public class BooksController {

    @Get("/stock/{isbn}")
    public Map stock(String isbn) {
        return null; //(1)
    }

    @Get("/maybestock/{isbn}")
    @SingleResult
    public Publisher<Map> maybestock(String isbn) {
        return Mono.empty(); //(2)
    }
}
```

  </TabItem>
  <TabItem value="Groovy" label="Groovy">

```groovy
@Controller("/books")
class BooksController {

    @Get("/stock/{isbn}")
    Map stock(String isbn) {
        null //(1)
    }

    @Get("/maybestock/{isbn}")
    Mono<Map> maybestock(String isbn) {
        Mono.empty() //(2)
    }
}
```

  </TabItem>
  <TabItem value="Kotlin" label="Kotlin">

```kt
@Controller("/books")
class BooksController {

    @Get("/stock/{isbn}")
    fun stock(isbn: String): Map<*, *>? {
        return null //(1)
    }

    @Get("/maybestock/{isbn}")
    fun maybestock(isbn: String): Mono<Map<*, *>> {
        return Mono.empty() //(2)
    }
}
```

  </TabItem>
</Tabs>

1. 返回 `null` 将触发 404（Not Found，未找到）响应。
2. 返回空 `Mono` 会触发 404（Not Found，未找到）响应。

:::tip 注意
如果内容类型为 JSON，则使用空的 `Publisher` 或 `Flux` 进行响应会导致返回空数组。
:::

> [英文链接](https://docs.micronaut.io/3.9.4/guide/index.html#serverIO)

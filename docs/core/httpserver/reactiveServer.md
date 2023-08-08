---
sidebar_position: 130
---

# 6.13 响应式 HTTP 请求处理

如前所述，Micronaut 是在 Netty 上构建的，Netty 是围绕事件循环模型和非阻塞 I/O 设计的。Micronaut 在与请求线程（事件循环线程）相同的线程中执行 [@Controller](https://micronaut-projects.github.io/micronaut-docs-mn3/3.9.4/api/io/micronaut/http/annotation/Controller.html) bean 中定义的代码。

这使得如果你执行任何阻塞 I/O 操作（例如与 Hibernate/JPA 或 JDBC 的交互），将这些任务卸载到一个不阻塞事件循环的单独线程池中变得至关重要。

例如，以下配置将 I/O 线程池配置为具有 75 个线程的固定线程池（类似于 Tomcat 等传统阻塞服务器在每个请求线程模型中使用的线程）：

*配置 IO 线程池*

```yaml
micronaut:
  executors:
    io:
      type: fixed
      nThreads: 75
```

要在 [@Controller](https://micronaut-projects.github.io/micronaut-docs-mn3/3.9.4/api/io/micronaut/http/annotation/Controller.html) bean 中使用这个线程池，你有许多选项。最简单的是使用 [@ExecuteOn](https://micronaut-projects.github.io/micronaut-docs-mn3/3.9.4/api/io/micronaut/scheduling/annotation/ExecuteOn.html) 注解，它可以在类型或方法级别声明，以指示在哪个配置的线程池上运行控制器的方法：

*使用 @ExecuteOn*

import Tabs from '@theme/Tabs';
import TabItem from '@theme/TabItem';

<Tabs>
  <TabItem value="Java" label="Java" default>

```java
import io.micronaut.docs.http.server.reactive.PersonService;
import io.micronaut.docs.ioc.beans.Person;
import io.micronaut.http.annotation.Controller;
import io.micronaut.http.annotation.Get;
import io.micronaut.scheduling.TaskExecutors;
import io.micronaut.scheduling.annotation.ExecuteOn;

@Controller("/executeOn/people")
public class PersonController {

    private final PersonService personService;

    PersonController(PersonService personService) {
        this.personService = personService;
    }

    @Get("/{name}")
    @ExecuteOn(TaskExecutors.IO) // (1)
    Person byName(String name) {
        return personService.findByName(name);
    }
}
```

  </TabItem>
  <TabItem value="Groovy" label="Groovy">

```groovy
import io.micronaut.docs.http.server.reactive.PersonService
import io.micronaut.docs.ioc.beans.Person
import io.micronaut.http.annotation.Controller
import io.micronaut.http.annotation.Get
import io.micronaut.scheduling.TaskExecutors
import io.micronaut.scheduling.annotation.ExecuteOn

@Controller("/executeOn/people")
class PersonController {

    private final PersonService personService

    PersonController(PersonService personService) {
        this.personService = personService
    }

    @Get("/{name}")
    @ExecuteOn(TaskExecutors.IO) // (1)
    Person byName(String name) {
        personService.findByName(name)
    }
}
```

  </TabItem>
  <TabItem value="Kotlin" label="Kotlin">

```kt
import io.micronaut.docs.http.server.reactive.PersonService
import io.micronaut.docs.ioc.beans.Person
import io.micronaut.http.annotation.Controller
import io.micronaut.http.annotation.Get
import io.micronaut.scheduling.TaskExecutors
import io.micronaut.scheduling.annotation.ExecuteOn

@Controller("/executeOn/people")
class PersonController (private val personService: PersonService) {

    @Get("/{name}")
    @ExecuteOn(TaskExecutors.IO) // (1)
    fun byName(name: String): Person {
        return personService.findByName(name)
    }
}
```

  </TabItem>
</Tabs>

1. [@ExecuteOn](https://micronaut-projects.github.io/micronaut-docs-mn3/3.9.4/api/io/micronaut/scheduling/annotation/ExecuteOn.html) 注解用于在 I/O 线程池上执行操作

[@ExecuteOn](https://micronaut-projects.github.io/micronaut-docs-mn3/3.9.4/api/io/micronaut/scheduling/annotation/ExecuteOn.html) 注解的值可以是在 `micronat.executors` 下定义的任何命名的执行器。

:::note 提示
一般来说，对于数据库操作，你需要配置一个与数据库连接池中指定的最大连接数相匹配的线程池。
:::

[@ExecuteOn](https://micronaut-projects.github.io/micronaut-docs-mn3/3.9.4/api/io/micronaut/scheduling/annotation/ExecuteOn.html) 注解的另一种选择是使用你选择的响应库提供的工具。Project Reactor 或 RxJava 等响应式实现具有 `subscribeOn` 方法，该方法允许你更改用哪个线程执行用户代码。例如：

*响应式 subscribeOn 示例*

<Tabs>
  <TabItem value="Java" label="Java" default>

```java
import io.micronaut.docs.ioc.beans.Person;
import io.micronaut.http.annotation.Controller;
import io.micronaut.http.annotation.Get;
import io.micronaut.scheduling.TaskExecutors;
import jakarta.inject.Named;
import org.reactivestreams.Publisher;
import reactor.core.publisher.Mono;
import reactor.core.scheduler.Scheduler;
import reactor.core.scheduler.Schedulers;
import io.micronaut.core.async.annotation.SingleResult;
import java.util.concurrent.ExecutorService;

@Controller("/subscribeOn/people")
public class PersonController {

    private final Scheduler scheduler;
    private final PersonService personService;

    PersonController(
            @Named(TaskExecutors.IO) ExecutorService executorService, // (1)
            PersonService personService) {
        this.scheduler = Schedulers.fromExecutorService(executorService);
        this.personService = personService;
    }

    @Get("/{name}")
    @SingleResult
    Publisher<Person> byName(String name) {
        return Mono
                .fromCallable(() -> personService.findByName(name)) // (2)
                .subscribeOn(scheduler); // (3)
    }
}
```

  </TabItem>
  <TabItem value="Groovy" label="Groovy">

```groovy
import io.micronaut.docs.ioc.beans.Person
import io.micronaut.http.annotation.Controller
import io.micronaut.http.annotation.Get
import io.micronaut.scheduling.TaskExecutors
import jakarta.inject.Named
import reactor.core.publisher.Mono
import reactor.core.scheduler.Scheduler
import reactor.core.scheduler.Schedulers
import java.util.concurrent.ExecutorService

@Controller("/subscribeOn/people")
class PersonController {

    private final Scheduler scheduler
    private final PersonService personService

    PersonController(
            @Named(TaskExecutors.IO) ExecutorService executorService, // (1)
            PersonService personService) {
        this.scheduler = Schedulers.fromExecutorService(executorService)
        this.personService = personService
    }

    @Get("/{name}")
    Mono<Person> byName(String name) {
        return Mono
                .fromCallable({ -> personService.findByName(name) }) // (2)
                .subscribeOn(scheduler) // (3)
    }
}
```

  </TabItem>
  <TabItem value="Kotlin" label="Kotlin">

```kt
import io.micronaut.docs.ioc.beans.Person
import io.micronaut.http.annotation.Controller
import io.micronaut.http.annotation.Get
import io.micronaut.scheduling.TaskExecutors
import java.util.concurrent.ExecutorService
import jakarta.inject.Named
import reactor.core.publisher.Mono
import reactor.core.scheduler.Scheduler
import reactor.core.scheduler.Schedulers


@Controller("/subscribeOn/people")
class PersonController internal constructor(
    @Named(TaskExecutors.IO) executorService: ExecutorService, // (1)
    private val personService: PersonService) {

    private val scheduler: Scheduler = Schedulers.fromExecutorService(executorService)

    @Get("/{name}")
    fun byName(name: String): Mono<Person> {
        return Mono
            .fromCallable { personService.findByName(name) } // (2)
            .subscribeOn(scheduler) // (3)
    }
}
```

  </TabItem>
</Tabs>

1. 已注入配置的 I/O 执行器服务
2. `Mono::fromCallable` 方法包装阻塞操作
3. [Project Reactor](https://projectreactor.io/) `subscribeOn` 方法调度 I/O 线程池上的操作

## 6.13.1 使用 @Body 注解

要解析请求体，首先向 Micronaut 指示哪个参数接收带有 [Body](https://micronaut-projects.github.io/micronaut-docs-mn3/3.9.4/api/io/micronaut/http/annotation/Body.html) 注解的数据。

以下示例实现了一个简单的回显服务器，该服务器回显请求中发送的正文：

*使用 @Body 注解*

<Tabs>
  <TabItem value="Java" label="Java" default>

```java
import io.micronaut.http.HttpResponse;
import io.micronaut.http.MediaType;
import io.micronaut.http.annotation.Body;
import io.micronaut.http.annotation.Controller;
import io.micronaut.http.annotation.Post;
import javax.validation.constraints.Size;

@Controller("/receive")
public class MessageController {

@Post(value = "/echo", consumes = MediaType.TEXT_PLAIN) // (1)
String echo(@Size(max = 1024) @Body String text) { // (2)
    return text; // (3)
}

}
```

  </TabItem>
  <TabItem value="Groovy" label="Groovy">

```groovy
import io.micronaut.http.HttpResponse
import io.micronaut.http.MediaType
import io.micronaut.http.annotation.Body
import io.micronaut.http.annotation.Controller
import io.micronaut.http.annotation.Post
import javax.validation.constraints.Size

@Controller("/receive")
class MessageController {

@Post(value = "/echo", consumes = MediaType.TEXT_PLAIN) // (1)
String echo(@Size(max = 1024) @Body String text) { // (2)
    text // (3)
}

}
```

  </TabItem>
  <TabItem value="Kotlin" label="Kotlin">

```kt
import io.micronaut.http.HttpResponse
import io.micronaut.http.MediaType
import io.micronaut.http.annotation.Body
import io.micronaut.http.annotation.Controller
import io.micronaut.http.annotation.Post
import javax.validation.constraints.Size

@Controller("/receive")
open class MessageController {

@Post(value = "/echo", consumes = [MediaType.TEXT_PLAIN]) // (1)
open fun echo(@Size(max = 1024) @Body text: String): String { // (2)
    return text // (3)
}

}
```

  </TabItem>
</Tabs>

1. [Post](https://micronaut-projects.github.io/micronaut-docs-mn3/3.9.4/api/io/micronaut/http/annotation/Post.html) 注解与 `text/plain` 的 [MediaType](https://micronaut-projects.github.io/micronaut-docs-mn3/3.9.4/api/io/micronaut/http/MediaType.html) 一起使用（默认为 `application/json`）。
2. [Body](https://micronaut-projects.github.io/micronaut-docs-mn3/3.9.4/api/io/micronaut/http/annotation/Body.html) 注解与 `javax.validation.constraints.Size` 一起使用，后者将请求体的大小限制为最多 1KB。此约束并不限制服务器读取/缓冲的数据量。
3. 请求体作为方法的结果返回

请注意，读取请求体是以非阻塞的方式完成的，因为请求内容是在数据变得可用时读取的，并累积到传递给方法的 String 中。

:::note 提示
`application.yml` 中的 `micronaut.server.maxRequestSize` 设置限制了服务器读取/缓冲的数据大小（默认最大请求大小为 10MB）`@Size` **不能**替代此设置。
:::

无论限制如何，对于大量数据，将数据累积到内存中的字符串中可能会导致服务器内存紧张。更好的方法是在你的项目中包括一个 Reactive 库（如`Reactor`、`RxJava` 或 `Akka`），该库支持响应流的实现并流式传输它可用的数据：

*使用响应流读取请求体*

<Tabs>
  <TabItem value="Java" label="Java" default>

```java
import io.micronaut.http.HttpResponse;
import io.micronaut.http.MediaType;
import io.micronaut.http.annotation.Body;
import io.micronaut.http.annotation.Controller;
import io.micronaut.http.annotation.Post;
import javax.validation.constraints.Size;

import org.reactivestreams.Publisher;
import reactor.core.publisher.Flux;
import io.micronaut.core.async.annotation.SingleResult;

@Controller("/receive")
public class MessageController {

@Post(value = "/echo-publisher", consumes = MediaType.TEXT_PLAIN) // (1)
@SingleResult
Publisher<HttpResponse<String>> echoFlow(@Body Publisher<String> text) { //(2)
    return Flux.from(text)
            .collect(StringBuffer::new, StringBuffer::append) // (3)
            .map(buffer -> HttpResponse.ok(buffer.toString()));
}

}
```

  </TabItem>
  <TabItem value="Groovy" label="Groovy">

```groovy
import io.micronaut.http.HttpResponse
import io.micronaut.http.MediaType
import io.micronaut.http.annotation.Body
import io.micronaut.http.annotation.Controller
import io.micronaut.http.annotation.Post
import javax.validation.constraints.Size

import org.reactivestreams.Publisher
import io.micronaut.core.async.annotation.SingleResult
import reactor.core.publisher.Flux

@Controller("/receive")
class MessageController {

@Post(value = "/echo-publisher", consumes = MediaType.TEXT_PLAIN) // (1)
@SingleResult
Publisher<HttpResponse<String>> echoFlow(@Body Publisher<String> text) { // (2)
    return Flux.from(text)
            .collect({ x -> new StringBuffer() }, { StringBuffer sb, String s -> sb.append(s) }) // (3)
            .map({ buffer -> HttpResponse.ok(buffer.toString()) });
}

}
```

  </TabItem>
  <TabItem value="Kotlin" label="Kotlin">

```kt
import io.micronaut.http.HttpResponse
import io.micronaut.http.MediaType
import io.micronaut.http.annotation.Body
import io.micronaut.http.annotation.Controller
import io.micronaut.http.annotation.Post
import javax.validation.constraints.Size

import org.reactivestreams.Publisher
import io.micronaut.core.async.annotation.SingleResult
import reactor.core.publisher.Flux

@Controller("/receive")
open class MessageController {

@Post(value = "/echo-publisher", consumes = [MediaType.TEXT_PLAIN]) // (1)
@SingleResult
open fun echoFlow(@Body text: Publisher<String>): Publisher<HttpResponse<String>> { //(2)
    return Flux.from(text)
        .collect({ StringBuffer() }, { obj, str -> obj.append(str) }) // (3)
        .map { buffer -> HttpResponse.ok(buffer.toString()) }
}

}
```

  </TabItem>
</Tabs>

1. 在这种情况下，方法被更改为接收并返回发布服务器类型。
2. 此示例使用 [Project Reactor](https://projectreactor.io/) 并返回单个项。因此，响应类型也使用 [SingleResult](https://micronaut-projects.github.io/micronaut-docs-mn3/3.9.4/api/io/micronaut/core/async/annotation/SingleResult.html) 进行注解。Micronaut 仅在操作完成后才发出响应，而不会阻塞。
3. 在这个模拟示例中，`collect` 方法用于累积数据，但例如，它可以逐块将数据写入日志服务、数据库等

:::caution 警告
不需要转换的类型的 Body 参数会导致 Micronaut 跳过对请求的解码！
:::

## 6.13.2 响应式（Reactive）响应

上一节介绍了使用 [Project Reactor](https://projectreactor.io/) 和 Micronaut 进行响应式编程的概念。

Micronaut 支持从任何控制器方法返回常见的响应类型，如 [Mono](https://projectreactor.io/docs/core/release/api/reactor/core/publisher/Mono.html)（或 RxJava 中的 [Single Maybe Observable](http://reactivex.io/RxJava/2.x/javadoc/io/reactivex/Maybe.html) 类型）、[Publisher](http://www.reactive-streams.org/reactive-streams-1.0.3-javadoc/org/reactivestreams/Publisher.html) 或 [CompletableFuture](https://docs.oracle.com/javase/8/docs/api/java/util/concurrent/CompletableFuture.html) 的实例。

:::tip 注意
要使用 [Project Reactor](https://projectreactor.io/) 的 `Flux` 或 `Mono`，你需要在项目中添加 Micronaut Reactor 依赖项，以包括必要的转换器。
:::

:::tip 注意
要使用 [RxJava](https://github.com/ReactiveX/RxJava) 的 `Flowable`、`Single` 或 `Maybe`，你需要将 Micronaut RxJava 依赖项添加到你的项目中，以包括必要的转换器。
:::

使用 [Body](https://micronaut-projects.github.io/micronaut-docs-mn3/3.9.4/api/io/micronaut/http/annotation/Body.html) 注解指定为请求主体的参数也可以是响应类型或 [CompletableFuture](https://docs.oracle.com/javase/8/docs/api/java/util/concurrent/CompletableFuture.html)。

当返回反应类型时，Micronaut 在与请求相同的线程（Netty Event Loop 线程）上订阅返回的反应类型。因此，重要的是，如果你执行任何阻塞操作，请将这些操作卸载到适当配置的线程池中，例如使用 [Project Reactor](https://projectreactor.io/) 或 `RxJava subscribeOn（..）` 工具或 [@ExecuteOn](https://micronaut-projects.github.io/micronaut-docs-mn3/3.9.4/api/io/micronaut/scheduling/annotation/ExecuteOn.html)。

::note 提示 
有关 Micronaut 设置的线程池以及如何配置线程池的信息，参阅[配置线程池](/core/threadPools.html#6291-配置服务线程池)一节。
:::

总之，下表说明了一些常见的响应类型及其处理：

*表 1. Micronaut 响应类型*

|类型|描述|示例签名|
|--|--|--|
|[Publisher](http://www.reactive-streams.org/reactive-streams-1.0.3-javadoc/org/reactivestreams/Publisher.html)|实现 [Publisher](http://www.reactive-streams.org/reactive-streams-1.0.3-javadoc/org/reactivestreams/Publisher.html) 接口的任意类型|`Publisher<String> hello()`|
|[CompletableFuture](https://docs.oracle.com/javase/8/docs/api/java/util/concurrent/CompletableFuture.html)|一个 Java `CompletableFuture` 实体|`CompletableFuture<String> hello()`|
|[HttpResponse](https://micronaut-projects.github.io/micronaut-docs-mn3/3.9.4/api/io/micronaut/http/HttpResponse.html)|一个 HttpResponse 及可选的响应体|`HttpResponse<Publisher<String>> hello()`|
|[CharSequence](https://docs.oracle.com/javase/8/docs/api/java/lang/CharSequence.html)|任意 CharSequence 的实现|`String hello()`|
|T|任意简单的 POJO 类型|`Book show()`|

:::note 提示
返回响应式类型时，其类型会影响返回的响应。例如，当返回 [Flux](https://projectreactor.io/docs/core/release/api/reactor/core/publisher/Flux.html) 时，Micronaut 无法知道响应的大小，因此使用了 `Chunked` 的 `Transfer-Encoding` 类型。而对于发出单个结果的类型，如 [Mono](https://projectreactor.io/docs/core/release/api/reactor/core/publisher/Mono.html)，则填充 `Content-Length` 头。
:::

> [英文链接](https://docs.micronaut.io/3.9.4/guide/index.html#reactiveServer)

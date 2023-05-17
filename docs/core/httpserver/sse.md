---
sidebar_position: 250
---

# 6.25 服务器发送事件

Micronaut 的 HTTP 服务器支持使用 [Event](https://docs.micronaut.io/3.8.4/api/io/micronaut/http/sse/Event.html) API 发送[服务器发送事件（SSE）](https://en.wikipedia.org/wiki/Server-sent_events)。

为了从服务器上发送事件，返回一个响应式流 [Publisher](http://www.reactive-streams.org/reactive-streams-1.0.3-javadoc/org/reactivestreams/Publisher.html)，它发送的是 [Event](https://docs.micronaut.io/3.8.4/api/io/micronaut/http/sse/Event.html) 类型的对象。

[Publisher](http://www.reactive-streams.org/reactive-streams-1.0.3-javadoc/org/reactivestreams/Publisher.html) 本身可以从后台任务、通过事件系统等发布事件。

举个例子，想象一下一个新闻头条的事件流；你可以定义一个数据类，如下：

*Headline*

import Tabs from '@theme/Tabs';
import TabItem from '@theme/TabItem';

<Tabs>
  <TabItem value="Java" label="Java" default>

```java
public class Headline {

    private String title;
    private String description;

    public Headline() {}

    public Headline(String title, String description) {
        this.title = title;
        this.description = description;
    }

    public String getTitle() {
        return title;
    }

    public String getDescription() {
        return description;
    }

    public void setTitle(String title) {
        this.title = title;
    }

    public void setDescription(String description) {
        this.description = description;
    }
}
```

  </TabItem>
  <TabItem value="Groovy" label="Groovy">

```groovy
class Headline {

    String title
    String description

    Headline() {}

    Headline(String title, String description) {
        this.title = title;
        this.description = description;
    }
}
```

  </TabItem>
  <TabItem value="Kotlin" label="Kotlin">

```kt
class Headline {

    var title: String? = null
    var description: String? = null

    constructor()

    constructor(title: String, description: String) {
        this.title = title
        this.description = description
    }
}
```

  </TabItem>
</Tabs>

要发送新闻标题事件，编写一个控制器，使用你喜欢的任何响应式库返回一个 [Event](https://docs.micronaut.io/3.8.4/api/io/micronaut/http/sse/Event.html) 实例的 [Publisher](http://www.reactive-streams.org/reactive-streams-1.0.3-javadoc/org/reactivestreams/Publisher.html)。下面的例子通过 `generate` 方法使用 [Project Reactor](https://projectreactor.io/) 的 [Flux](https://projectreactor.io/docs/core/release/api/reactor/core/publisher/Flux.html)：

*从控制器发布服务器发送事件*

<Tabs>
  <TabItem value="Java" label="Java" default>

```java
import io.micronaut.http.MediaType;
import io.micronaut.http.annotation.Controller;
import io.micronaut.http.annotation.Get;
import io.micronaut.http.sse.Event;
import io.micronaut.scheduling.TaskExecutors;
import io.micronaut.scheduling.annotation.ExecuteOn;
import org.reactivestreams.Publisher;
import reactor.core.publisher.Flux;

@Controller("/headlines")
public class HeadlineController {

    @ExecuteOn(TaskExecutors.IO)
    @Get(produces = MediaType.TEXT_EVENT_STREAM)
    public Publisher<Event<Headline>> index() { // (1)
        String[] versions = {"1.0", "2.0"}; // (2)
        return Flux.generate(() -> 0, (i, emitter) -> { // (3)
            if (i < versions.length) {
                emitter.next( // (4)
                    Event.of(new Headline("Micronaut " + versions[i] + " Released", "Come and get it"))
                );
            } else {
                emitter.complete(); // (5)
            }
            return ++i;
        });
    }
}
```

  </TabItem>
  <TabItem value="Groovy" label="Groovy">

```groovy
import io.micronaut.http.MediaType
import io.micronaut.http.annotation.Controller
import io.micronaut.http.annotation.Get
import io.micronaut.http.sse.Event
import io.micronaut.scheduling.TaskExecutors
import io.micronaut.scheduling.annotation.ExecuteOn
import org.reactivestreams.Publisher
import reactor.core.publisher.Flux

@Controller("/headlines")
class HeadlineController {

    @ExecuteOn(TaskExecutors.IO)
    @Get(produces = MediaType.TEXT_EVENT_STREAM)
    Publisher<Event<Headline>> index() { // (1)
        String[] versions = ["1.0", "2.0"] // (2)
        Flux.generate(() -> 0, (i, emitter) -> {
            if (i < versions.length) {
                emitter.next( // (4)
                        Event.of(new Headline("Micronaut ${versions[i]} Released", "Come and get it"))
                )
            } else {
                emitter.complete() // (5)
            }
            return i + 1
        })
    }
}
```

  </TabItem>
  <TabItem value="Kotlin" label="Kotlin">

```kt
import io.micronaut.http.MediaType
import io.micronaut.http.annotation.Controller
import io.micronaut.http.annotation.Get
import io.micronaut.http.sse.Event
import io.micronaut.scheduling.TaskExecutors
import io.micronaut.scheduling.annotation.ExecuteOn
import org.reactivestreams.Publisher
import reactor.core.publisher.Flux
import reactor.core.publisher.SynchronousSink
import java.util.concurrent.Callable
import java.util.function.BiFunction


@Controller("/headlines")
class HeadlineController {

    @ExecuteOn(TaskExecutors.IO)
    @Get(produces = [MediaType.TEXT_EVENT_STREAM])
    fun index(): Publisher<Event<Headline>> { // (1)
        val versions = arrayOf("1.0", "2.0") // (2)
        return Flux.generate(
            { 0 },
            BiFunction { i: Int, emitter: SynchronousSink<Event<Headline>> ->  // (3)
                if (i < versions.size) {
                    emitter.next( // (4)
                        Event.of(
                            Headline(
                                "Micronaut " + versions[i] + " Released", "Come and get it"
                            )
                        )
                    )
                } else {
                    emitter.complete() // (5)
                }
                return@BiFunction i + 1
            })
    }
}
```

  </TabItem>
</Tabs>

1. 控制器方法返回一个 [Event](https://docs.micronaut.io/3.8.4/api/io/micronaut/http/sse/Event.html) 的 [Publisher](http://www.reactive-streams.org/reactive-streams-1.0.3-javadoc/org/reactivestreams/Publisher.html)
2. 每个版本的 Micronaut 都会发出一个 jeadline
3. [Flux](https://projectreactor.io/docs/core/release/api/reactor/core/publisher/Flux.html) 类型的 `generate` 方法生成一个 [Publisher](http://www.reactive-streams.org/reactive-streams-1.0.3-javadoc/org/reactivestreams/Publisher.html)。`generate` 方法接受一个初始值和一个接受该值和一个 [Emitter](http://reactivex.io/RxJava/2.x/javadoc/io/reactivex/Emitter.html) 的lambda。请注意，这个例子是在与控制器动作相同的线程上执行的，但你可以使用 `subscribeOn` 或映射一个现有的 “热” [Flux](https://projectreactor.io/docs/core/release/api/reactor/core/publisher/Flux.html)。
4. [Emitter](http://reactivex.io/RxJava/2.x/javadoc/io/reactivex/Emitter.html) 接口的 `onNext` 方法发射的是 [Event](https://docs.micronaut.io/3.8.4/api/io/micronaut/http/sse/Event.html) 类型的对象。[Event.of(ET)](https://docs.micronaut.io/3.8.4/api/io/micronaut/http/sse/Event.html#of-ET-) 工厂方法构建了事件。
5. [Emitter](http://reactivex.io/RxJava/2.x/javadoc/io/reactivex/Emitter.html) 接口的 `onComplete` 方法指示何时完成发送服务器发送的事件。

:::tip 提示
你通常想在一个单独的执行器上安排 SSE 事件流。前面的例子使用 [@ExecuteOn](https://docs.micronaut.io/3.8.4/api/io/micronaut/scheduling/annotation/ExecuteOn.html) 在 I/O 执行器上执行该流。
:::

上面的例子发回了 `text/event-stream` 类型的响应，对于每一个发出的事件，之前的 `Headline` 类型将被转换为 JSON，导致响应，例如：

*服务器发送事件响应输出*

```json
 data: {"title":"Micronaut 1.0 Released","description":"Come and get it"}
 data: {"title":"Micronaut 2.0 Released","description":"Come and get it"}
 ```

 你可以使用 [Event](https://docs.micronaut.io/3.8.4/api/io/micronaut/http/sse/Event.html) 接口的方法来定制发回的服务器发送事件数据，包括关联事件 id、评论、重试超时等。

> [英文链接](https://docs.micronaut.io/3.8.4/guide/index.html#sse)

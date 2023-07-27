---
sidebar_position: 10
---

# 7.1 使用低级 HTTP 客户端

[HttpClient](https://docs.micronaut.io/3.8.4/api/io/micronaut/http/client/HttpClient.html) 接口构成了低级 API 的基础。这个接口声明了一些方法来帮助缓解执行 HTTP 请求和接收响应。

[HttpClient](https://docs.micronaut.io/3.8.4/api/io/micronaut/http/client/HttpClient.html) 接口中的大多数方法都返回 响应式流 [Publisher](http://www.reactive-streams.org/reactive-streams-1.0.3-javadoc/org/reactivestreams/Publisher.html) 实例，这并不总是最有用的工作接口。

Micronaut 的 Reactor HTTP 客户端依赖性带有一个名为 [ReactorHttpClient](https://micronaut-projects.github.io/micronaut-reactor/latest/api/io/micronaut/reactor/http/client/ReactorHttpClient.html) 的子接口。它提供了一个 HttpClient 接口的变体，返回项目 [Reactor Flux](https://projectreactor.io/) 类型。

## 7.1.1  发送你的第一个 HTTP 请求

**获取一个 HttpClient**

有几种方法可以获得对 HttpClient 的引用。最常见的是使用客户端注解。比如说

*注入一个 HTTP 客户端*

```java
@Client("https://api.twitter.com/1.1") @Inject HttpClient httpClient;
```

上面的示例注入了一个面向 Twitter API 的客户端。

```kt
@field:Client("\${myapp.api.twitter.url}") @Inject lateinit var httpClient: HttpClient
```

上面的 Kotlin 示例注入了一个使用配置路径面向 Twitter API 的客户端。请注意 `"\${path.to.config}"` 上所需的转义（反斜杠），由于 Kotlin 字符串插值，这是必需的。

[Client](https://docs.micronaut.io/3.8.4/api/io/micronaut/http/client/annotation/Client.html) 注解也是一个自定义作用域，用于管理 [HttpClient](https://docs.micronaut.io/3.8.4/api/io/micronaut/http/client/HttpClient.html) 实例的创建，并确保在应用程序关闭时停止这些实例。

传递给 [Client](https://docs.micronaut.io/3.8.4/api/io/micronaut/http/client/annotation/Client.html) 注解的值可以是以下值之一：

- 一个绝对的 URI，例如：`https://api.twitter.com/1.1`
- 一个相对的 URI，在这种情况下，目标服务器将是当前的服务器（用于测试）
- 一个服务标识符。关于这个主题的更多信息，参阅[服务发现](/core/cloud/serviceDiscovery)一节。

另一种创建 `HttpClient` 的方法是使用 [HttpClient](https://docs.micronaut.io/3.8.4/api/io/micronaut/http/client/HttpClient.html) 的静态 `create` 方法，然而这种方法并不被推荐，因为你必须确保你手动关闭客户端，当然，对于创建的客户端也不会发生依赖注入。

**执行 HTTP GET**

一般来说，在使用 `HttpClient` 时，有两种方法值得关注。第一个是 `retrieve`，它执行一个 HTTP 请求，并以你请求的任何类型（默认是一个字符串）返回主体作为发布者。

`retrieve` 方法接受一个 [HttpRequest](https://docs.micronaut.io/3.8.4/api/io/micronaut/http/HttpRequest.html) 或一个指向你希望请求的端点的字符串 URI。

下面的例子显示了如何使用 `retrieve` 来执行一个 HTTP GET，并接收作为一个字符串的响应体：

*使用 retrieve*

import Tabs from '@theme/Tabs';
import TabItem from '@theme/TabItem';

<Tabs>
  <TabItem value="Java" label="Java" default>

```java
String uri = UriBuilder.of("/hello/{name}")
                       .expand(Collections.singletonMap("name", "John"))
                       .toString();
assertEquals("/hello/John", uri);

String result = client.toBlocking().retrieve(uri);

assertEquals("Hello John", result);
```

  </TabItem>
  <TabItem value="Groovy" label="Groovy">

```groovy
when:
String uri = UriBuilder.of("/hello/{name}")
                       .expand(name: "John")
then:
"/hello/John" == uri

when:
String result = client.toBlocking().retrieve(uri)

then:
"Hello John" == result
```

  </TabItem>
  <TabItem value="Kotlin" label="Kotlin">

```kt
when:
String uri = UriBuilder.of("/hello/{name}")
                       .expand(name: "John")
then:
"/hello/John" == uri

when:
String result = client.toBlocking().retrieve(uri)

then:
"Hello John" == result
```

  </TabItem>
</Tabs>

请注意，在这个例子中，为了说明问题，我们调用 `toBlocking()` 来返回客户端的一个阻塞版本。然而，在生产代码中，你不应该这样做，而应该依靠 Micronaut HTTP 服务器的非阻塞特性。

例如，下面的 `@Controller` 方法以非阻塞的方式调用另一个端点：

*无阻塞使用 HTTP 客户端*

<Tabs>
  <TabItem value="Java" label="Java" default>

```java
import io.micronaut.http.annotation.Body;
import io.micronaut.http.annotation.Controller;
import io.micronaut.http.annotation.Get;
import io.micronaut.http.annotation.Post;
import io.micronaut.http.annotation.Status;
import io.micronaut.http.client.HttpClient;
import io.micronaut.http.client.annotation.Client;
import org.reactivestreams.Publisher;
import reactor.core.publisher.Mono;
import io.micronaut.core.async.annotation.SingleResult;
import static io.micronaut.http.HttpRequest.GET;
import static io.micronaut.http.HttpStatus.CREATED;
import static io.micronaut.http.MediaType.TEXT_PLAIN;

@Get("/hello/{name}")
@SingleResult
Publisher<String> hello(String name) { // (1)
    return Mono.from(httpClient.retrieve(GET("/hello/" + name))); // (2)
}
```

  </TabItem>
  <TabItem value="Groovy" label="Groovy">

```groovy
import io.micronaut.http.annotation.Body
import io.micronaut.http.annotation.Controller
import io.micronaut.http.annotation.Get
import io.micronaut.http.annotation.Post
import io.micronaut.http.annotation.Status
import io.micronaut.http.client.HttpClient
import io.micronaut.http.client.annotation.Client
import org.reactivestreams.Publisher
import io.micronaut.core.async.annotation.SingleResult
import reactor.core.publisher.Mono
import static io.micronaut.http.HttpRequest.GET
import static io.micronaut.http.HttpStatus.CREATED
import static io.micronaut.http.MediaType.TEXT_PLAIN

@Get("/hello/{name}")
@SingleResult
Publisher<String> hello(String name) { // (1)
    Mono.from(httpClient.retrieve( GET("/hello/" + name))) // (2)
}
```

  </TabItem>
  <TabItem value="Kotlin" label="Kotlin">

```kt
import io.micronaut.http.HttpRequest.GET
import io.micronaut.http.HttpStatus.CREATED
import io.micronaut.http.MediaType.TEXT_PLAIN
import io.micronaut.http.annotation.Body
import io.micronaut.http.annotation.Controller
import io.micronaut.http.annotation.Get
import io.micronaut.http.annotation.Post
import io.micronaut.http.annotation.Status
import io.micronaut.http.client.HttpClient
import io.micronaut.http.client.annotation.Client
import org.reactivestreams.Publisher
import reactor.core.publisher.Flux
import io.micronaut.core.async.annotation.SingleResult

@Get("/hello/{name}")
@SingleResult
internal fun hello(name: String): Publisher<String> { // (1)
    return Flux.from(httpClient.retrieve(GET<Any>("/hello/$name")))
                     .next() // (2)
}
```

  </TabItem>
</Tabs>

1. `hello` 方法返回一个 [Mono](https://projectreactor.io/docs/core/release/api/reactor/core/publisher/Mono.html)，这个 Mono可能发出也可能不发出一个项目。如果没有发出一个项目，就会返回 404。
2. 调用 `retrieve` 方法，返回一个 [Flux](https://projectreactor.io/docs/core/release/api/reactor/core/publisher/Flux.html)。它有一个 `firstElement` 方法，返回第一个发出的项目或什么都没有。

:::note 提示
使用 Reactor（或 RxJava，如果你愿意的话），你可以轻松有效地组成多个 HTTP 客户端调用，而不会出现阻塞（这限制了你的应用程序的吞吐量和可伸缩性）。
:::

**调试/跟踪 HTTP 客户端**

为了调试从 HTTP 客户端发送和接收的请求，你可以通过 `logback.xml` 文件启用跟踪记录：

*logback.xml*

```xml
<logger name="io.micronaut.http.client" level="TRACE"/>
```

**客户端特定的调试/跟踪**

要启用特定于客户端的日志记录，你可以为所有 HTTP 客户端配置默认记录器。你还可以使用特定客户端配置为不同的客户端配置不同的记录器。例如，在 `application.yml` 中：

*application.yml*

```yaml
micronaut:
  http:
    client:
      logger-name: mylogger
    services:
      otherClient:
        logger-name: other.client
```

在 `logback.xml` 中启用日志。

*logback.xml*

```xml
<logger name="mylogger" level="DEBUG"/>
<logger name="other.client" level="TRACE"/>
```

**定制 HTTP 请求**

前面的例子演示了使用 [HttpRequest](https://docs.micronaut.io/3.8.4/api/io/micronaut/http/HttpRequest.html) 接口的静态方法来构造一个 [MutableHttpRequest](https://docs.micronaut.io/3.8.4/api/io/micronaut/http/MutableHttpRequest.html) 实例。就像它的名字一样，MutableHttpRequest 可以被突变，包括添加头文件、自定义请求体等的能力。比如说：

*传递一个 HttpRequest 来检索*

<Tabs>
  <TabItem value="Java" label="Java" default>

```java
Flux<String> response = Flux.from(client.retrieve(
        GET("/hello/John")
        .header("X-My-Header", "SomeValue")
));
```

  </TabItem>
  <TabItem value="Groovy" label="Groovy">

```groovy
Flux<String> response = Flux.from(client.retrieve(
        GET("/hello/John")
        .header("X-My-Header", "SomeValue")
));
```

  </TabItem>
  <TabItem value="Kotlin" label="Kotlin">

```kt
val response = client.retrieve(
        GET<Any>("/hello/John")
                .header("X-My-Header", "SomeValue")
)
```

  </TabItem>
</Tabs>

上面的例子在发送前给响应添加了一个头（`X-My-Header`）。[MutableHttpRequest](https://docs.micronaut.io/3.8.4/api/io/micronaut/http/MutableHttpRequest.html) 接口有更多的方便方法，可以很容易地以普通方式修改请求。

**读取 JSON 响应**

微服务通常使用一种消息编码格式，如 JSON。Micronaut 的 HTTP 客户端利用 Jackson 进行 JSON 解析，因此任何 Jackson 可以解码的类型都可以作为第二个参数传递给 `retrieve`。

例如，考虑下面这个返回 JSON 响应的 `@Controller` 方法：

*从控制器返回 JSON*

<Tabs>
  <TabItem value="Java" label="Java" default>

```java
@Get("/greet/{name}")
Message greet(String name) {
    return new Message("Hello " + name);
}
```

  </TabItem>
  <TabItem value="Groovy" label="Groovy">

```groovy
@Get("/greet/{name}")
Message greet(String name) {
    return new Message("Hello " + name);
}
```

  </TabItem>
  <TabItem value="Kotlin" label="Kotlin">

```kt
@Get("/greet/{name}")
internal fun greet(name: String): Message {
    return Message("Hello $name")
}
```

  </TabItem>
</Tabs>

上面的方法返回一个消息类型的 POJO，看起来像：

*消息 POJO*

<Tabs>
  <TabItem value="Java" label="Java" default>

```java
import com.fasterxml.jackson.annotation.JsonCreator;
import com.fasterxml.jackson.annotation.JsonProperty;

public class Message {

    private final String text;

    @JsonCreator
    public Message(@JsonProperty("text") String text) {
        this.text = text;
    }

    public String getText() {
        return text;
    }
}
```

  </TabItem>
  <TabItem value="Groovy" label="Groovy">

```groovy
import com.fasterxml.jackson.annotation.JsonCreator
import com.fasterxml.jackson.annotation.JsonProperty

class Message {

    final String text

    @JsonCreator
    Message(@JsonProperty("text") String text) {
        this.text = text
    }
}
```

  </TabItem>
  <TabItem value="Kotlin" label="Kotlin">

```kt
import com.fasterxml.jackson.annotation.JsonCreator
import com.fasterxml.jackson.annotation.JsonProperty

class Message {

    final String text

    @JsonCreator
    Message(@JsonProperty("text") String text) {
        this.text = text
    }
}
```

  </TabItem>
</Tabs>

:::tip 提示
Jackson 注解被用来映射构造函数
:::

在客户端上，可以使用 `retrieve` 方法调用此终结点并将 JSON 解码为映射，如下所示：

*将响应体解码为 Map*

<Tabs>
  <TabItem value="Java" label="Java" default>

```java
Flux<Map> response = Flux.from(client.retrieve(
        GET("/greet/John"), Map.class
));
```

  </TabItem>
  <TabItem value="Groovy" label="Groovy">

```groovy
Flux<Map> response = Flux.from(client.retrieve(
        GET("/greet/John"), Map.class
));
```

  </TabItem>
  <TabItem value="Kotlin" label="Kotlin">

```kt
var response: Flux<Map<*, *>> = Flux.from(client.retrieve(
        GET<Any>("/greet/John"), Map::class.java
))
```

  </TabItem>
</Tabs>

上面的例子将响应解码成一个代表 JSON 的 [Map](https://docs.oracle.com/javase/8/docs/api/java/util/Map.html)。你可以使用 `Argument.of(..)` 方法来定制键和值的类型：

*将响应体解码为一个 Map*

<Tabs>
  <TabItem value="Java" label="Java" default>

```java
response = Flux.from(client.retrieve(
        GET("/greet/John"),
        Argument.of(Map.class, String.class, String.class) // (1)
));
```

  </TabItem>
  <TabItem value="Groovy" label="Groovy">

```groovy
response = Flux.from(client.retrieve(
        GET("/greet/John"),
        Argument.of(Map.class, String.class, String.class) // (1)
));
```

  </TabItem>
  <TabItem value="Kotlin" label="Kotlin">

```kt
response = Flux.from(client.retrieve(
        GET<Any>("/greet/John"),
        Argument.of(Map::class.java, String::class.java, String::class.java) // (1)
))
```

  </TabItem>
</Tabs>

1. `Argument.of` 方法返回一个 `Map`，其中键和值的类型是 `String`。

虽然以 Map 形式检索 JSON 是可取的，但通常你想把对象解码成 POJO。要做到这一点，可以通过类型来代替：

*将响应体解码为一个 POJO*

<Tabs>
  <TabItem value="Java" label="Java" default>

```java
Flux<Message> response = Flux.from(client.retrieve(
        GET("/greet/John"), Message.class
));

assertEquals("Hello John", response.blockFirst().getText());
```

  </TabItem>
  <TabItem value="Groovy" label="Groovy">

```groovy
when:
Flux<Message> response = Flux.from(client.retrieve(
        GET("/greet/John"), Message
))

then:
"Hello John" == response.blockFirst().getText()
```

  </TabItem>
  <TabItem value="Kotlin" label="Kotlin">

```kt
val response = Flux.from(client.retrieve(
        GET<Any>("/greet/John"), Message::class.java
))

response.blockFirst().text shouldBe "Hello John"
```

  </TabItem>
</Tabs>

注意你如何在客户端和服务器上使用相同的 Java 类型。这其中的含义是，通常你会定义一个通用的 API 项目，在这个项目中你定义了定义你的 API 的接口和类型。

**解码其他内容类型**

如果与你通信的服务器使用的自定义内容类型不是 JSON，默认情况下，Micronaut 的 HTTP 客户端将不知道如何解码这种类型。

为了解决这个问题，将 [MediaTypeCodec](https://docs.micronaut.io/3.8.4/api/io/micronaut/http/codec/MediaTypeCodec.html) 注册为一个 Bean，它将被自动拾取并用于解码（或编码）消息。

**接收完整的 HTTP 响应**

有时仅仅接收响应体是不够的，你需要从响应中获得其他信息，如头文件、cookies 等。在这种情况下，可以使用 `exchange` 方法而不是 `retrieve`：

*接收完整的 HTTP 响应*

<Tabs>
  <TabItem value="Java" label="Java" default>

```java
Flux<HttpResponse<Message>> call = Flux.from(client.exchange(
        GET("/greet/John"), Message.class // (1)
));

HttpResponse<Message> response = call.blockFirst();
Optional<Message> message = response.getBody(Message.class); // (2)
// check the status
assertEquals(HttpStatus.OK, response.getStatus()); // (3)
// check the body
assertTrue(message.isPresent());
assertEquals("Hello John", message.get().getText());
```

  </TabItem>
  <TabItem value="Groovy" label="Groovy">

```groovy
when:
Flux<HttpResponse<Message>> call = Flux.from(client.exchange(
        GET("/greet/John"), Message // (1)
))

HttpResponse<Message> response = call.blockFirst();
Optional<Message> message = response.getBody(Message) // (2)
// check the status
then:
HttpStatus.OK == response.getStatus() // (3)
// check the body
message.isPresent()
"Hello John" == message.get().getText()
```

  </TabItem>
  <TabItem value="Kotlin" label="Kotlin">

```kt
val call = client.exchange(
        GET<Any>("/greet/John"), Message::class.java // (1)
)

val response = Flux.from(call).blockFirst()
val message = response.getBody(Message::class.java) // (2)
// check the status
response.status shouldBe HttpStatus.OK // (3)
// check the body
message.isPresent shouldBe true
message.get().text shouldBe "Hello John"
```

  </TabItem>
</Tabs>

1. `exchange` 方法接收 [HttpResponse](https://docs.micronaut.io/3.8.4/api/io/micronaut/http/HttpResponse.html)
2. 使用响应的 `getBody(..)` 方法检索正文。
3. 响应的其他方面，如 [HttpStatus](https://docs.micronaut.io/3.8.4/api/io/micronaut/http/HttpStatus.html)，可以被检查。

上面的例子接收完整的 [HttpResponse](https://docs.micronaut.io/3.8.4/api/io/micronaut/http/HttpResponse.html)，你可以从中获得头信息和其他有用的信息

## 7.1.2 发送一个请求体

到目前为止，所有的例子都使用了相同的 HTTP 方法，即 `GET`。[HttpRequest](https://docs.micronaut.io/3.8.4/api/io/micronaut/http/HttpRequest.html) 接口为所有不同的 HTTP 方法提供了工厂方法。下表对它们进行了总结：

*表 1. HttpRequest 工厂方法*

|方法|描述|允许请求体|
|--|--|--|
|[HttpRequest.GET(java.lang.String)](https://docs.micronaut.io/latest/api/io/micronaut/http/HttpRequest.html#GET-java.lang.String-)|构造一个 HTTP `GET` 请求|false|
|[HttpRequest.OPTIONS(java.lang.String)](https://docs.micronaut.io/latest/api/io/micronaut/http/HttpRequest.html#OPTIONS-java.lang.String-)|构造一个 HTTP `OPTIONS` 请求|false|
|[HttpRequest.HEAD(java.lang.String)](https://docs.micronaut.io/latest/api/io/micronaut/http/HttpRequest.html#HEAD-java.lang.String-)|构造一个 HTTP `HEAD` 请求|false|
|[HttpRequest.POST(java.lang.String,T)](https://docs.micronaut.io/latest/api/io/micronaut/http/HttpRequest.html#POST-java.lang.String-T-)|构造一个 HTTP POST 请求|true|
|[HttpRequest.PUT(java.lang.String,T)](https://docs.micronaut.io/latest/api/io/micronaut/http/HttpRequest.html#PUT-java.lang.String-T-)|构造一个 HTTP PUT 请求|true|
|[HttpRequest.PATCH(java.lang.String,T)](https://docs.micronaut.io/latest/api/io/micronaut/http/HttpRequest.html#PATCH-java.lang.String-T-)|构造一个 HTTP `PATCH` 请求|true|
|[HttpRequest.DELETE(java.lang.String)](https://docs.micronaut.io/latest/api/io/micronaut/http/HttpRequest.html#DELETE-java.lang.String-)|构造一个 HTTP `DELETE` 请求|true|

还存在一个创建方法来为任何 [HttpMethod](https://docs.micronaut.io/latest/api/io/micronaut/http/HttpMethod.html) 类型构建一个请求。由于 `POST`、`PUT` 和 `PATCH` 方法需要一个请求体，所以需要第二个参数，即 body 对象。

下面的例子演示了如何发送一个简单的 `String` 请求体：

*发送一个 `String` 请求体*

<Tabs>
  <TabItem value="Java" label="Java" default>

```java
Flux<HttpResponse<String>> call = Flux.from(client.exchange(
        POST("/hello", "Hello John") // (1)
            .contentType(MediaType.TEXT_PLAIN_TYPE)
            .accept(MediaType.TEXT_PLAIN_TYPE), // (2)
        String.class // (3)
));
```

  </TabItem>
  <TabItem value="Groovy" label="Groovy">

```groovy
Flux<HttpResponse<String>> call = Flux.from(client.exchange(
        POST("/hello", "Hello John") // (1)
            .contentType(MediaType.TEXT_PLAIN_TYPE)
            .accept(MediaType.TEXT_PLAIN_TYPE), // (2)
        String.class // (3)
));
```

  </TabItem>
  <TabItem value="Kotlin" label="Kotlin">

```kt
Flux<HttpResponse<String>> call = Flux.from(client.exchange(
        POST("/hello", "Hello John") // (1)
            .contentType(MediaType.TEXT_PLAIN_TYPE)
            .accept(MediaType.TEXT_PLAIN_TYPE), // (2)
        String // (3)
))
```

  </TabItem>
</Tabs>

1. 使用 `POST` 方法；第一个参数是 URI，第二个参数是请求体。
2. 内容类型和接受类型被设置为 `text/plain`（默认是 `application/json`）。
3. 预期的响应类型是一个 `String`

### 发送 JSON

前面的例子发送的是纯文本。要发送 JSON，只要 Jackson 能够编码，就把要编码的对象传给 JSON（无论是 Map 还是 POJO）。

例如，你可以从上一节中创建一个 `Message`，并将其传递给 `POST` 方法：

*发送一个 JSON 体*

<Tabs>
  <TabItem value="Java" label="Java" default>

```java
Flux<HttpResponse<Message>> call = Flux.from(client.exchange(
        POST("/greet", new Message("Hello John")), // (1)
        Message.class // (2)
));
```

  </TabItem>
  <TabItem value="Groovy" label="Groovy">

```groovy
Flux<HttpResponse<Message>> call = Flux.from(client.exchange(
        POST("/greet", new Message("Hello John")), // (1)
        Message // (2)
))
```

  </TabItem>
  <TabItem value="Kotlin" label="Kotlin">

```kt
val call = client.exchange(
        POST("/greet", Message("Hello John")), Message::class.java // (2)
)
```

  </TabItem>
</Tabs>

1. 一个 Message 的实例被创建并传递给 POST 方法
2. 同一个类对响应进行解码

在上面的示例中，以下 JSON 作为请求体发送：

*结果 JSON*

```json
{"text":"Hello John"}
```

JSON 可以使用 [Jackson 注解](https://github.com/FasterXML/jackson-annotations)进行定制。

---

### 使用 URI 模板

如果在 URI 中包括对象的一些属性，你可以使用 URI 模板。

例如，假设你有一个带有 `title` 属性的 `Book` 类。你可以在 URI 模板中包含 `title`，然后从 `Book` 的一个实例中填充它。比如说：

*用 URI 模板发送一个 JSON 体*

<Tabs>
  <TabItem value="Java" label="Java" default>

```java
Flux<HttpResponse<Book>> call = Flux.from(client.exchange(
        POST("/amazon/book/{title}", new Book("The Stand")),
        Book.class
));
```

  </TabItem>
  <TabItem value="Groovy" label="Groovy">

```groovy
Flux<HttpResponse<Book>> call = client.exchange(
        POST("/amazon/book/{title}", new Book("The Stand")),
        Book
);
```

  </TabItem>
  <TabItem value="Kotlin" label="Kotlin">

```kt
val call = client.exchange(
        POST("/amazon/book/{title}", Book("The Stand")),
        Book::class.java
)
```

  </TabItem>
</Tabs>

在上述情况下，`title` 属性被包含在 URI 中。

---

### 发送表单数据

你也可以将 POJO 或 Map 编码为表单数据而不是 JSON。只需在 post 请求中设置内容类型为 `application/x-www-form-urlencoded`：

*发送表单数据*

<Tabs>
  <TabItem value="Java" label="Java" default>

```java
Flux<HttpResponse<Book>> call = Flux.from(client.exchange(
        POST("/amazon/book/{title}", new Book("The Stand"))
        .contentType(MediaType.APPLICATION_FORM_URLENCODED),
        Book.class
));
```

  </TabItem>
  <TabItem value="Groovy" label="Groovy">

```groovy
Flux<HttpResponse<Book>> call = client.exchange(
        POST("/amazon/book/{title}", new Book("The Stand"))
        .contentType(MediaType.APPLICATION_FORM_URLENCODED),
        Book
)
```

  </TabItem>
  <TabItem value="Kotlin" label="Kotlin">

```kt
val call = client.exchange(
        POST("/amazon/book/{title}", Book("The Stand"))
                .contentType(MediaType.APPLICATION_FORM_URLENCODED),
        Book::class.java
)
```

  </TabItem>
</Tabs>

请注意，Jackson 也可以绑定表单数据，所以要自定义绑定过程，请使用 [Jackson 注解](https://github.com/FasterXML/jackson-annotations)。

## 7.1.3 Multipart 客户端上传

Micronaut HTTP 客户端支持多部分（multipart）请求。要建立一个多部分请求，将内容类型设置为 `multipart/form-data`，并将请求体设置为 [MultipartBody](https://docs.micronaut.io/latest/api/io/micronaut/http/client/multipart/MultipartBody.html) 的一个实例。

比如说：

*创建请求体*

<Tabs>
  <TabItem value="Java" label="Java" default>

```java
import io.micronaut.http.client.multipart.MultipartBody;

String toWrite = "test file";
File file = File.createTempFile("data", ".txt");
FileWriter writer = new FileWriter(file);
writer.write(toWrite);
writer.close();

MultipartBody requestBody = MultipartBody.builder()     // (1)
        .addPart(                                       // (2)
            "data",
            file.getName(),
            MediaType.TEXT_PLAIN_TYPE,
            file
        ).build();                                      // (3)
```

  </TabItem>
  <TabItem value="Groovy" label="Groovy">

```groovy
import io.micronaut.http.multipart.CompletedFileUpload
import io.micronaut.http.multipart.StreamingFileUpload
import io.micronaut.http.client.multipart.MultipartBody
import org.reactivestreams.Publisher

File file = new File(uploadDir, "data.txt")
file.text = "test file"
file.createNewFile()


MultipartBody requestBody = MultipartBody.builder()     // (1)
        .addPart(                                       // (2)
            "data",
            file.name,
            MediaType.TEXT_PLAIN_TYPE,
            file
        ).build()                                       // (3)
```

  </TabItem>
  <TabItem value="Kotlin" label="Kotlin">

```kt
import io.micronaut.http.client.multipart.MultipartBody

val toWrite = "test file"
val file = File.createTempFile("data", ".txt")
val writer = FileWriter(file)
writer.write(toWrite)
writer.close()

val requestBody = MultipartBody.builder()     // (1)
        .addPart(                             // (2)
                "data",
                file.name,
                MediaType.TEXT_PLAIN_TYPE,
                file
        ).build()                             // (3)
```

  </TabItem>
</Tabs>

1. 创建一个 MultipartBody 构建器，用于向请求体添加部件。
2. 向请求体添加一个部件，在本例中是一个文件。在 [MultipartBody.Builder](https://docs.micronaut.io/latest/api/io/micronaut/http/client/multipart/MultipartBody.Builder.html) 中有这个方法的不同变化。
3. 构建方法将构建器中的所有部件组装成一个 MultipartBody。至少要一个部件。

*创建一个请求*

<Tabs>
  <TabItem value="Java" label="Java" default>

```java
HttpRequest.POST("/multipart/upload", requestBody)    // (1)
           .contentType(MediaType.MULTIPART_FORM_DATA_TYPE) // (2)
```

  </TabItem>
  <TabItem value="Groovy" label="Groovy">

```groovy
HttpRequest.POST("/multipart/upload", requestBody)    // (1)
           .contentType(MediaType.MULTIPART_FORM_DATA_TYPE) // (2)
```

  </TabItem>
  <TabItem value="Kotlin" label="Kotlin">

```kt
HttpRequest.POST("/multipart/upload", requestBody)    // (1)
           .contentType(MediaType.MULTIPART_FORM_DATA_TYPE) // (2)
```

  </TabItem>
</Tabs>

1. 带有不同类型数据的多部分请求体。
2. 设置请求的 content-type 头为 `multipart/form-data`。

## 7.1.4 通过 HTTP 流式传输 JSON

Micronaut 的 HTTP 客户端包括通过 [ReactorStreamingHttpClient](https://micronaut-projects.github.io/micronaut-reactor/latest/api/io/micronaut/reactor/http/client/ReactorStreamingHttpClient.html) 接口支持 HTTP 上的流数据，其中包括流的具体方法，包括：

*表 1. HTTP 流式方法*

|方法|描述|
|--|--|
|`dataStream(HttpRequest<I> request)`|以一个 [ByteBuffer](https://docs.micronaut.io/latest/api/io/micronaut/core/io/buffer/ByteBuffer.html) 的 [Flux](https://projectreactor.io/docs/core/release/api/reactor/core/publisher/Flux.html) 返回一个流|
|`exchangeStream(HttpRequest<I> request)`|以一个 [ByteBuffer](https://docs.micronaut.io/latest/api/io/micronaut/core/io/buffer/ByteBuffer.html) 的 [Flux](https://projectreactor.io/docs/core/release/api/reactor/core/publisher/Flux.html) 返回 [HttpResponse](https://docs.micronaut.io/latest/api/io/micronaut/http/HttpResponse.html)|
|`jsonStream(HttpRequest<I> request)`|返回一个 JSON 对象的非阻塞流|

要使用 JSON 流，在服务器上声明一个控制器方法，返回一个 JSON 对象的 `application/x-json` 流。比如说：

*在服务器上流化 JSON*

<Tabs>
  <TabItem value="Java" label="Java" default>

```java
import io.micronaut.http.MediaType;
import io.micronaut.http.annotation.Controller;
import io.micronaut.http.annotation.Get;
import org.reactivestreams.Publisher;
import reactor.core.publisher.Flux;
import reactor.core.publisher.Mono;
import java.time.Duration;
import java.time.ZonedDateTime;
import java.time.temporal.ChronoUnit;

@Get(value = "/headlines", processes = MediaType.APPLICATION_JSON_STREAM) // (1)
Publisher<Headline> streamHeadlines() {
    return Mono.fromCallable(() -> {  // (2)
        Headline headline = new Headline();
        headline.setText("Latest Headline at " + ZonedDateTime.now());
        return headline;
    }).repeat(100) // (3)
      .delayElements(Duration.of(1, ChronoUnit.SECONDS)); // (4)
}
```

  </TabItem>
  <TabItem value="Groovy" label="Groovy">

```groovy
import io.micronaut.http.MediaType
import io.micronaut.http.annotation.Controller
import io.micronaut.http.annotation.Get
import reactor.core.publisher.Flux
import reactor.core.publisher.Mono

import java.time.Duration
import java.time.ZonedDateTime
import java.time.temporal.ChronoUnit
import java.util.concurrent.TimeUnit

@Get(value = "/headlines", processes = MediaType.APPLICATION_JSON_STREAM) // (1)
Flux<Headline> streamHeadlines() {
    Mono.fromCallable({ // (2)
        new Headline(text: "Latest Headline at ${ZonedDateTime.now()}")
    }).repeat(100) // (3)
            .delayElements(Duration.of(1, ChronoUnit.SECONDS)) // (4)
}
```

  </TabItem>
  <TabItem value="Kotlin" label="Kotlin">

```kt
import io.micronaut.http.MediaType.APPLICATION_JSON_STREAM
import io.micronaut.http.annotation.Controller
import io.micronaut.http.annotation.Get
import reactor.core.publisher.Flux
import reactor.core.publisher.Mono
import java.time.Duration
import java.time.ZonedDateTime
import java.time.temporal.ChronoUnit
import java.util.concurrent.TimeUnit.SECONDS

@Get(value = "/headlines", processes = [APPLICATION_JSON_STREAM]) // (1)
internal fun streamHeadlines(): Flux<Headline> {
    return Mono.fromCallable { // (2)
        val headline = Headline()
        headline.text = "Latest Headline at ${ZonedDateTime.now()}"
        headline
    }.repeat(100) // (3)
     .delayElements(Duration.of(1, ChronoUnit.SECONDS)) // (4)
}
```

  </TabItem>
</Tabs>

1. `streamHeadlines` 方法生成 `application/x-json` 流
2. 一个 [Flux](https://projectreactor.io/docs/core/release/api/reactor/core/publisher/Flux.html) 是由一个可调用的函数创建的（注意在该函数中没有发生阻塞，所以这是好的，否则你应该订阅一个I/O线程池）。
3. [Flux](https://projectreactor.io/docs/core/release/api/reactor/core/publisher/Flux.html) 重复了 100 次
4. [Flux](https://projectreactor.io/docs/core/release/api/reactor/core/publisher/Flux.html) 发出项目，每个项目之间有一秒钟的延迟。

:::tip 注意
服务器不一定要用 Micronaut 编写，任何支持 JSON 流的服务器都可以。
:::

然后在客户端，使用 `jsonStream` 订阅该流，每当服务器发出一个 JSON 对象时，客户端将解码并消费它：

*在客户端上流化 JSON*

<Tabs>
  <TabItem value="Java" label="Java" default>

```java
Flux<Headline> headlineStream = Flux.from(client.jsonStream(
        GET("/streaming/headlines"), Headline.class)); // (1)
CompletableFuture<Headline> future = new CompletableFuture<>(); // (2)
headlineStream.subscribe(new Subscriber<Headline>() {
    @Override
    public void onSubscribe(Subscription s) {
        s.request(1); // (3)
    }

    @Override
    public void onNext(Headline headline) {
        System.out.println("Received Headline = " + headline.getText());
        future.complete(headline); // (4)
    }

    @Override
    public void onError(Throwable t) {
        future.completeExceptionally(t); // (5)
    }

    @Override
    public void onComplete() {
        // no-op // (6)
    }
});
```

  </TabItem>
  <TabItem value="Groovy" label="Groovy">

```groovy
Flux<Headline> headlineStream = Flux.from(client.jsonStream(
        GET("/streaming/headlines"), Headline)) // (1)
CompletableFuture<Headline> future = new CompletableFuture<>() // (2)
headlineStream.subscribe(new Subscriber<Headline>() {
    @Override
    void onSubscribe(Subscription s) {
        s.request(1) // (3)
    }

    @Override
    void onNext(Headline headline) {
        println "Received Headline = $headline.text"
        future.complete(headline) // (4)
    }

    @Override
    void onError(Throwable t) {
        future.completeExceptionally(t) // (5)
    }

    @Override
    void onComplete() {
        // no-op // (6)
    }
})
```

  </TabItem>
  <TabItem value="Kotlin" label="Kotlin">

```kt
val headlineStream = client.jsonStream(
    GET<Any>("/streaming/headlines"), Headline::class.java) // (1)
val future = CompletableFuture<Headline>() // (2)
headlineStream.subscribe(object : Subscriber<Headline> {
    override fun onSubscribe(s: Subscription) {
        s.request(1) // (3)
    }

    override fun onNext(headline: Headline) {
        println("Received Headline = ${headline.text!!}")
        future.complete(headline) // (4)
    }

    override fun onError(t: Throwable) {
        future.completeExceptionally(t) // (5)
    }

    override fun onComplete() {
        // no-op // (6)
    }
})
```

  </TabItem>
</Tabs>

1. `jsonStream` 方法返回一个 [Flux](https://projectreactor.io/docs/core/release/api/reactor/core/publisher/Flux.html)
2. 一个 `CompletableFuture` 被用来接收一个值，但是你对每个发射的项目做什么是特定的应用
3. [Subscription](http://www.reactive-streams.org/reactive-streams-1.0.3-javadoc/org/reactivestreams/Subscription.html) 请求一个单项。你可以使用 [Subscription](http://www.reactive-streams.org/reactive-streams-1.0.3-javadoc/org/reactivestreams/Subscription.html) 来调节背压和需求。
4. 当一个项目被发射出来时，`onNext` 方法被调用。
5. `onError` 方法在发生错误时被调用。
6. 当所有的 `Headline` 实例都被发出时，`onComplete` 方法被调用。

请注意，在上面的例子中，服务器和客户端都没有执行任何阻塞式 I/O

## 7.1.5 配置 HTTP 客户端

**用于所有客户端的全局配置**

默认的 HTTP 客户端配置是一个名为 [DefaultHttpClientConfiguration](https://docs.micronaut.io/latest/api/io/micronaut/http/client/DefaultHttpClientConfiguration.html) 的[配置属性](/core/config.html#44-配置属性)，允许配置所有 HTTP 客户端的默认行为。例如，在你的配置文件（如 `application.yml`）中：

*改变默认的 HTTP 客户端配置*

<Tabs>
  <TabItem value="Properties" label="Properties">

```properties
micronaut.http.client.read-timeout=5s
```

  </TabItem>
  <TabItem value="Yaml" label="Yaml">

```yaml
micronaut:
  http:
    client:
      read-timeout: 5s
```

  </TabItem>
    <TabItem value="Toml" label="Toml">

```toml
[micronaut]
  [micronaut.http]
    [micronaut.http.client]
      read-timeout="5s"
```

  </TabItem>
    <TabItem value="Groovy" label="Groovy">

```groovy
micronaut {
  http {
    client {
      readTimeout = "5s"
    }
  }
}
```

  </TabItem>
    <TabItem value="Hoon" label="Hoon">

```hoon
{
  micronaut {
    http {
      client {
        read-timeout = "5s"
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
      "client": {
        "read-timeout": "5s"
      }
    }
  }
}
```

  </TabItem>
</Tabs>

上面的例子设置了 [HttpClientConfiguration](https://docs.micronaut.io/latest/api/io/micronaut/http/client/HttpClientConfiguration.html) 类的 `readTimeout` 属性。

**客户端特定配置**

要对每个客户进行单独的配置，有几个选项。你可以在你的配置文件（例如 `application.yml`）中手动配置[服务发现](/core/cloud/cloudConfiguraiton.html#825-手动服务发现配置)，并应用每个客户端的配置：

*手动配置 HTTP 服务*

<Tabs>
  <TabItem value="Properties" label="Properties">

```properties
micronaut.http.services.foo.urls[0]=http://foo1
micronaut.http.services.foo.urls[1]=http://foo2
micronaut.http.services.foo.read-timeout=5s
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
        read-timeout: 5s
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
        read-timeout="5s"
```

  </TabItem>
    <TabItem value="Groovy" label="Groovy">

```groovy
micronaut {
  http {
    services {
      foo {
        urls = ["http://foo1", "http://foo2"]
        readTimeout = "5s"
      }
    }
  }
}
```

  </TabItem>
    <TabItem value="Hoon" label="Hoon">

```hoon
{
  micronaut {
    http {
      services {
        foo {
          urls = ["http://foo1", "http://foo2"]
          read-timeout = "5s"
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
          "urls": ["http://foo1", "http://foo2"],
          "read-timeout": "5s"
        }
      }
    }
  }
}
```

  </TabItem>
</Tabs>

- `read-timeout` 被应用于 `foo` 客户端。

:::warning 警告
这个客户端配置可以和 `@Client` 注解一起使用，可以直接注入一个 `HttpClient` 或者在客户端接口上使用。在任何情况下，除了服务 id，注解上的所有其他属性都将被忽略。
:::

然后，注入命名的客户端配置：

*注入一个 HTTP 客户端*

```java
@Client("foo") @Inject ReactorHttpClient httpClient;
```

你也可以定义一个从 [HttpClientConfiguration](https://docs.micronaut.io/latest/api/io/micronaut/http/client/HttpClientConfiguration.html) 扩展而来的 bean，并确保 `javax.inject.Named` 注解对其进行适当命名：

*定义一个 HTTP 客户端配置 Bean*

```java
@Named("twitter")
@Singleton
class TwitterHttpClientConfiguration extends HttpClientConfiguration {
   public TwitterHttpClientConfiguration(ApplicationConfiguration configuration) {
        super(configuration);
    }
}
```

如果你通过[服务发现](/core/cloud/serviceDiscovery)使用 `@Client` 注入一个名为 `twitter` 的服务，这个配置将被拾取：

*注入一个 HTTP 客户端*

```java
@Client("twitter") @Inject ReactorHttpClient httpClient;
```

另外，如果你不使用服务发现，你可以使用 `@Client` 的配置成员来指代一个特定的类型：

*注入一个 HTTP 客户端*

```java
@Client(value = "https://api.twitter.com/1.1",
        configuration = TwitterHttpClientConfiguration.class)
@Inject
ReactorHttpClient httpClient;
```

**使用 HTTP 客户端连接池**

一个处理大量请求的客户端会从启用 HTTP 客户端连接池中受益。下面的配置为fooclient启用了连接池：

*手动配置 HTTP 服务*

<Tabs>
  <TabItem value="Properties" label="Properties">

```properties
micronaut.http.services.foo.urls[0]=http://foo1
micronaut.http.services.foo.urls[1]=http://foo2
micronaut.http.services.foo.pool.enabled=true
micronaut.http.services.foo.pool.max-connections=50
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
        pool:
          enabled: true
          max-connections: 50
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
        [micronaut.http.services.foo.pool]
          enabled=true
          max-connections=50
```

  </TabItem>
    <TabItem value="Groovy" label="Groovy">

```groovy
micronaut {
  http {
    services {
      foo {
        urls = ["http://foo1", "http://foo2"]
        pool {
          enabled = true
          maxConnections = 50
        }
      }
    }
  }
}
```

  </TabItem>
    <TabItem value="Hoon" label="Hoon">

```hoon
{
  micronaut {
    http {
      services {
        foo {
          urls = ["http://foo1", "http://foo2"]
          pool {
            enabled = true
            max-connections = 50
          }
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
          "urls": ["http://foo1", "http://foo2"],
          "pool": {
            "enabled": true,
            "max-connections": 50
          }
        }
      }
    }
  }
}
```

  </TabItem>
</Tabs>

- `pool` 启用该池，并为其设置最大连接数。

参见 [ConnectionPoolConfiguration](https://docs.micronaut.io/latest/api/io/micronaut/http/client/HttpClientConfiguration.ConnectionPoolConfiguration.html) 的 API，了解可用的池配置选项的详情。

**配置事件循环组**

默认情况下，Micronaut 为工作线程和所有 HTTP 客户端线程共享一个共同的 Netty `EventLoopGroup`。

这个 `EventLoopGroup` 可以通过 `micronaut.netty.event-loops.default` 属性进行配置：

*配置默认的事件循环*

<Tabs>
  <TabItem value="Properties" label="Properties">

```properties
micronaut.netty.event-loops.default.num-threads=10
micronaut.netty.event-loops.default.prefer-native-transport=true
```

  </TabItem>
  <TabItem value="Yaml" label="Yaml">

```yaml
micronaut:
  netty:
    event-loops:
      default:
        num-threads: 10
        prefer-native-transport: true
```

  </TabItem>
    <TabItem value="Toml" label="Toml">

```toml
[micronaut]
  [micronaut.netty]
    [micronaut.netty.event-loops]
      [micronaut.netty.event-loops.default]
        num-threads=10
        prefer-native-transport=true
```

  </TabItem>
    <TabItem value="Groovy" label="Groovy">

```groovy
micronaut {
  netty {
    eventLoops {
      'default' {
        numThreads = 10
        preferNativeTransport = true
      }
    }
  }
}
```

  </TabItem>
    <TabItem value="Hoon" label="Hoon">

```hoon
{
  micronaut {
    netty {
      event-loops {
        default {
          num-threads = 10
          prefer-native-transport = true
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
    "netty": {
      "event-loops": {
        "default": {
          "num-threads": 10,
          "prefer-native-transport": true
        }
      }
    }
  }
}
```

  </TabItem>
</Tabs>

你也可以使用 `micronaut.netty.event-loops` 设置来配置一个或多个额外的事件循环。下表总结了这些属性：

*表 1. [DefaultEventLoopGroupConfiguration](https://docs.micronaut.io/latest/api/io/micronaut/http/netty/channel/DefaultEventLoopGroupConfiguration.html) 的配置属性*

|属性|类型|描述|
|--|--|--|
|micronaut.netty.event-loops.*.num-threads|int||
|micronaut.netty.event-loops.*.io-ratio|java.lang.Integer||
|micronaut.netty.event-loops.*.prefer-native-transport|boolean||
|micronaut.netty.event-loops.*.executor|java.lang.String||
|micronaut.netty.event-loops.*.shutdown-quiet-period|java.time.Duration||
|micronaut.netty.event-loops.*.shutdown-timeout|java.time.Duration||

例如，如果你与 HTTP 客户端的交互涉及 CPU 密集型工作，可能值得为一个或所有客户端配置一个单独的 EventLoopGroup。

下面的例子配置了一个名为 "other" 的额外事件循环组，有10个线程：

*配置额外的事件循环*

<Tabs>
  <TabItem value="Properties" label="Properties">

```properties
micronaut.netty.event-loops.other.num-threads=10
micronaut.netty.event-loops.other.prefer-native-transport=true
```

  </TabItem>
  <TabItem value="Yaml" label="Yaml">

```yaml
micronaut:
  netty:
    event-loops:
      other:
        num-threads: 10
        prefer-native-transport: true
```

  </TabItem>
    <TabItem value="Toml" label="Toml">

```toml
[micronaut]
  [micronaut.netty]
    [micronaut.netty.event-loops]
      [micronaut.netty.event-loops.other]
        num-threads=10
        prefer-native-transport=true
```

  </TabItem>
    <TabItem value="Groovy" label="Groovy">

```groovy
micronaut {
  netty {
    eventLoops {
      other {
        numThreads = 10
        preferNativeTransport = true
      }
    }
  }
}
```

  </TabItem>
    <TabItem value="Hoon" label="Hoon">

```hoon
{
  micronaut {
    netty {
      event-loops {
        other {
          num-threads = 10
          prefer-native-transport = true
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
    "netty": {
      "event-loops": {
        "other": {
          "num-threads": 10,
          "prefer-native-transport": true
        }
      }
    }
  }
}
```

  </TabItem>
</Tabs>

一旦配置了一个额外的事件循环，你就可以改变 HTTP 客户端的配置来使用它：

*改变客户端使用的事件循环组*

<Tabs>
  <TabItem value="Properties" label="Properties">

```properties
micronaut.http.client.event-loop-group=other
```

  </TabItem>
  <TabItem value="Yaml" label="Yaml">

```yaml
micronaut:
  http:
    client:
      event-loop-group: other
```

  </TabItem>
    <TabItem value="Toml" label="Toml">

```toml
[micronaut]
  [micronaut.http]
    [micronaut.http.client]
      event-loop-group="other"
```

  </TabItem>
    <TabItem value="Groovy" label="Groovy">

```groovy
micronaut {
  http {
    client {
      eventLoopGroup = "other"
    }
  }
}
```

  </TabItem>
    <TabItem value="Hoon" label="Hoon">

```hoon
{
  micronaut {
    http {
      client {
        event-loop-group = "other"
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
      "client": {
        "event-loop-group": "other"
      }
    }
  }
}
```

  </TabItem>
</Tabs>

## 7.1.6 错误响应

如果一个 HTTP 响应返回的代码是 400 或更高，就会创建一个 [HttpClientResponseException](https://docs.micronaut.io/latest/api/io/micronaut/http/client/exceptions/HttpClientResponseException.html)。该异常包含原始响应。这个异常如何被抛出，取决于方法的返回类型。

对于阻塞式客户端，该异常被抛出，并且应该被调用者捕获和处理。对于反应式客户端，该异常通过发布者作为一个错误来传递。

## 7.1.7 绑定错误

通常你想消耗一个端点，并在请求成功时绑定到一个 POJO，而在发生错误时绑定到另一个 POJO。下面的例子显示了如何调用具有成功和错误类型的 `exchange`。

<Tabs>
  <TabItem value="Java" label="Java" default>

```java
@Controller("/books")
public class BooksController {

    @Get("/{isbn}")
    public HttpResponse find(String isbn) {
        if (isbn.equals("1680502395")) {
            Map<String, Object> m = new HashMap<>();
            m.put("status", 401);
            m.put("error", "Unauthorized");
            m.put("message", "No message available");
            m.put("path", "/books/" + isbn);
            return HttpResponse.status(HttpStatus.UNAUTHORIZED).body(m);
        }

        return HttpResponse.ok(new Book("1491950358", "Building Microservices"));
    }
}
```

  </TabItem>
  <TabItem value="Groovy" label="Groovy">

```groovy
@Controller("/books")
class BooksController {

    @Get("/{isbn}")
    HttpResponse find(String isbn) {
        if (isbn == "1680502395") {
            Map<String, Object> m = [
                    status : 401,
                    error  : "Unauthorized",
                    message: "No message available",
                    path   : "/books/" + isbn]
            return HttpResponse.status(HttpStatus.UNAUTHORIZED).body(m)
        }

        return HttpResponse.ok(new Book("1491950358", "Building Microservices"))
    }
}
```

  </TabItem>
  <TabItem value="Kotlin" label="Kotlin">

```kt
@Controller("/books")
class BooksController {

    @Get("/{isbn}")
    fun find(isbn: String): HttpResponse<*> {
        if (isbn == "1680502395") {
            val m = mapOf(
                "status" to 401,
                "error" to "Unauthorized",
                "message" to "No message available",
                "path" to "/books/$isbn"
            )
            return HttpResponse.status<Any>(HttpStatus.UNAUTHORIZED).body(m)
        }

        return HttpResponse.ok(Book("1491950358", "Building Microservices"))
    }
}
```

  </TabItem>
</Tabs>

---

<Tabs>
  <TabItem value="Java" label="Java" default>

```java
@Test
public void afterAnHttpClientExceptionTheResponseBodyCanBeBoundToAPOJO() {
    try {
        client.toBlocking().exchange(HttpRequest.GET("/books/1680502395"),
                Argument.of(Book.class), // (1)
                Argument.of(CustomError.class)); // (2)
    } catch (HttpClientResponseException e) {
        assertEquals(HttpStatus.UNAUTHORIZED, e.getResponse().getStatus());
        Optional<CustomError> jsonError = e.getResponse().getBody(CustomError.class);
        assertTrue(jsonError.isPresent());
        assertEquals(401, jsonError.get().status);
        assertEquals("Unauthorized", jsonError.get().error);
        assertEquals("No message available", jsonError.get().message);
        assertEquals("/books/1680502395", jsonError.get().path);
    }
}
```

  </TabItem>
  <TabItem value="Groovy" label="Groovy">

```groovy
def "after an HttpClientException the response body can be bound to a POJO"() {
    when:
    client.toBlocking().exchange(HttpRequest.GET("/books/1680502395"),
            Argument.of(Book), // (1)
            Argument.of(CustomError)) // (2)

    then:
    def e = thrown(HttpClientResponseException)
    e.response.status == HttpStatus.UNAUTHORIZED

    when:
    Optional<CustomError> jsonError = e.response.getBody(CustomError)

    then:
    jsonError.isPresent()
    jsonError.get().status == 401
    jsonError.get().error == 'Unauthorized'
    jsonError.get().message == 'No message available'
    jsonError.get().path == '/books/1680502395'
}
```

  </TabItem>
  <TabItem value="Kotlin" label="Kotlin">

```kt
"after an httpclient exception the response body can be bound to a POJO" {
    try {
        client.toBlocking().exchange(HttpRequest.GET<Any>("/books/1680502395"),
                Argument.of(Book::class.java), // (1)
                Argument.of(CustomError::class.java)) // (2)
    } catch (e: HttpClientResponseException) {
        e.response.status shouldBe HttpStatus.UNAUTHORIZED
    }
}
```

  </TabItem>
</Tabs>

1. 成功类型
2. 错误类型

> [英文链接](https://docs.micronaut.io/3.9.4/guide/index.html#lowLevelHttpClient)

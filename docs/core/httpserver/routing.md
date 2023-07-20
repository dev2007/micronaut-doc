---
sidebar_position: 30
---

# 6.3 HTTP 路由

上一节中使用的 [@Controller](https://docs.micronaut.io/3.8.4/api/io/micronaut/http/annotation/Controller.html) 注解是允许你控制 HTTP 路由构造的[几个注解](https://docs.micronaut.io/3.8.4/api/io/micronaut/http/annotation/package-summary.html)之一。

## URI 路径

`@Controller` 注解的值是 [RFC-6570 URI 模板](https://tools.ietf.org/html/rfc6570)，因此可以使用 URI 模板规范定义的语法将 URI 变量嵌入到路径中。

:::tip 注意
包括 Spring 在内的许多其他框架都实现了 URI 模板规范
:::

实际实现由 [UriMatchTemplate](https://docs.micronaut.io/3.8.4/api/io/micronaut/http/uri/UriMatchTemplate.html) 类处理，该类扩展了 [UriTemplate](https://docs.micronaut.io/3.8.4/api/io/micronaut/http/uri/UriMatchTemplate.html)。

你可以在应用程序中使用此类来构建 URI，例如：

*使用 UriTemplate*

import Tabs from '@theme/Tabs';
import TabItem from '@theme/TabItem';

<Tabs>
  <TabItem value="Java" label="Java" default>

```java
UriMatchTemplate template = UriMatchTemplate.of("/hello/{name}");

assertTrue(template.match("/hello/John").isPresent()); // (1)
assertEquals("/hello/John", template.expand( // (2)
        Collections.singletonMap("name", "John")
));
```

  </TabItem>
  <TabItem value="Groovy" label="Groovy">

```groovy
given:
UriMatchTemplate template = UriMatchTemplate.of("/hello/{name}")

expect:
template.match("/hello/John").isPresent() // (1)
template.expand(["name": "John"]) == "/hello/John" // (2)
```

  </TabItem>
  <TabItem value="Kotlin" label="Kotlin">

```kt
val template = UriMatchTemplate.of("/hello/{name}")

assertTrue(template.match("/hello/John").isPresent) // (1)
assertEquals("/hello/John", template.expand(mapOf("name" to "John")))  // (2)
```

  </TabItem>
</Tabs>

1. 使用 `match` 方法匹配路径
2. 使用 `expand` 方法将模板扩展为 URI

---

## URI 路径变量

URI 变量可以通过方法参数引用。例如：

*URI 变量示例*

<Tabs>
  <TabItem value="Java" label="Java" default>

```java
import io.micronaut.http.annotation.Controller;
import io.micronaut.http.annotation.Get;
import io.micronaut.http.annotation.PathVariable;

@Controller("/issues") // (1)
public class IssuesController {

    @Get("/{number}") // (2)
    public String issue(@PathVariable Integer number) { // (3)
        return "Issue # " + number + "!"; // (4)
    }
}
```

  </TabItem>
  <TabItem value="Groovy" label="Groovy">

```groovy
import io.micronaut.http.annotation.Controller
import io.micronaut.http.annotation.Get
import io.micronaut.http.annotation.PathVariable

@Controller("/issues") // (1)
class IssuesController {

    @Get("/{number}") // (2)
    String issue(@PathVariable Integer number) { // (3)
        "Issue # " + number + "!" // (4)
    }
}
```

  </TabItem>
  <TabItem value="Kotlin" label="Kotlin">

```kt
import io.micronaut.http.annotation.Controller
import io.micronaut.http.annotation.Get
import io.micronaut.http.annotation.PathVariable

@Controller("/issues") // (1)
class IssuesController {

    @Get("/{number}") // (2)
    fun issue(@PathVariable number: Int): String { // (3)
        return "Issue # $number!" // (4)
    }
}
```

  </TabItem>
</Tabs>

1. `@Controller` 注解指定的基本 URI 为 `/issues`
2. [Get](https://docs.micronaut.io/3.8.4/api/io/micronaut/http/annotation/Get.html) 注解将该方法映射到 HTTP [Get](https://docs.micronaut.io/3.8.4/api/io/micronaut/http/annotation/Get.html)，其中 URI 变量嵌入到名为 `number` 的 URI 中
3. 方法参数可以选择性地使用 [PathVariable](https://docs.micronaut.io/3.8.4/api/io/micronaut/http/annotation/PathVariable.html) 进行注解
4. URI 变量的值在实现中被引用

Micronaut 为上述控制器映射 URI `/issues/{number}`。我们可以通过编写单元测试来断言这种情况：

*测试 URI 变量*

<Tabs>
  <TabItem value="Java" label="Java" default>

```java
import io.micronaut.context.ApplicationContext;
import io.micronaut.http.client.HttpClient;
import io.micronaut.http.client.exceptions.HttpClientResponseException;
import io.micronaut.runtime.server.EmbeddedServer;
import org.junit.AfterClass;
import org.junit.BeforeClass;
import org.junit.Test;

import static org.junit.Assert.assertEquals;
import static org.junit.Assert.assertNotNull;
import static org.junit.jupiter.api.Assertions.assertThrows;

public class IssuesControllerTest {

    private static EmbeddedServer server;
    private static HttpClient client;

    @BeforeClass // (1)
    public static void setupServer() {
        server = ApplicationContext.run(EmbeddedServer.class);
        client = server
                    .getApplicationContext()
                    .createBean(HttpClient.class, server.getURL());
    }

    @AfterClass // (2)
    public static void stopServer() {
        if (server != null) {
            server.stop();
        }
        if (client != null) {
            client.stop();
        }
    }

    @Test
    public void testIssue() {
        String body = client.toBlocking().retrieve("/issues/12"); // (3)

        assertNotNull(body);
        assertEquals("Issue # 12!", body); // (4)
    }

    @Test
    public void testShowWithInvalidInteger() {
        HttpClientResponseException e = assertThrows(HttpClientResponseException.class, () ->
                client.toBlocking().exchange("/issues/hello"));

        assertEquals(400, e.getStatus().getCode()); // (5)
    }

    @Test
    public void testIssueWithoutNumber() {
        HttpClientResponseException e = assertThrows(HttpClientResponseException.class, () ->
                client.toBlocking().exchange("/issues/"));

        assertEquals(404, e.getStatus().getCode()); // (6)
    }
}
```

  </TabItem>
  <TabItem value="Groovy" label="Groovy">

```groovy
import io.micronaut.context.ApplicationContext
import io.micronaut.http.client.HttpClient
import io.micronaut.http.client.exceptions.HttpClientResponseException
import io.micronaut.runtime.server.EmbeddedServer
import spock.lang.AutoCleanup
import spock.lang.Shared
import spock.lang.Specification

class IssuesControllerTest extends Specification {

    @Shared
    @AutoCleanup // (2)
    EmbeddedServer embeddedServer = ApplicationContext.run(EmbeddedServer) // (1)

    @Shared
    @AutoCleanup // (2)
    HttpClient client = HttpClient.create(embeddedServer.URL) // (1)

    void "test issue"() {
        when:
        String body = client.toBlocking().retrieve("/issues/12") // (3)

        then:
        body != null
        body == "Issue # 12!" // (4)
    }

    void "/issues/{number} with an invalid Integer number responds 400"() {
        when:
        client.toBlocking().exchange("/issues/hello")

        then:
        def e = thrown(HttpClientResponseException)
        e.status.code == 400 // (5)
    }

    void "/issues/{number} without number responds 404"() {
        when:
        client.toBlocking().exchange("/issues/")

        then:
        def e = thrown(HttpClientResponseException)
        e.status.code == 404 // (6)
    }
}
```

  </TabItem>
  <TabItem value="Kotlin" label="Kotlin">

```kt
import io.kotest.matchers.shouldBe
import io.kotest.matchers.shouldNotBe
import io.kotest.assertions.throwables.shouldThrow
import io.kotest.core.spec.style.StringSpec
import io.micronaut.context.ApplicationContext
import io.micronaut.http.client.HttpClient
import io.micronaut.http.client.exceptions.HttpClientResponseException
import io.micronaut.runtime.server.EmbeddedServer

class IssuesControllerTest: StringSpec() {

    val embeddedServer = autoClose( // (2)
        ApplicationContext.run(EmbeddedServer::class.java) // (1)
    )

    val client = autoClose( // (2)
        embeddedServer.applicationContext.createBean(
            HttpClient::class.java,
            embeddedServer.url) // (1)
    )

    init {
        "test issue" {
            val body = client.toBlocking().retrieve("/issues/12") // (3)

            body shouldNotBe null
            body shouldBe "Issue # 12!" // (4)
        }

        "test issue with invalid integer" {
            val e = shouldThrow<HttpClientResponseException> {
                client.toBlocking().exchange<Any>("/issues/hello")
            }

            e.status.code shouldBe 400 // (5)
        }

        "test issue without number" {
            val e = shouldThrow<HttpClientResponseException> {
                client.toBlocking().exchange<Any>("/issues/")
            }

            e.status.code shouldBe 404 // (6)
        }
    }
}
```

  </TabItem>
</Tabs>

1. 嵌入式服务器和 HTTP 客户端启动
2. 测试完成后将清理服务器和客户端
3. 测试向 URI `/issues/12` 发送请求
4. 然后断言响应为“Issue # 12”
5. 另一个测试断言，当在 URL 中发送无效数字时，返回 400 响应
6. 另一个测试断言，当 URL 中没有提供数字时，返回 404 响应。要执行的路由需要存在的变量。

请注意，上一个示例中的 URI 模板要求指定 `number` 变量。你可以使用以下语法指定可选的 URI 模板：`/issues{/number}`，且使用 `@Nullable` 注解 `number` 变量。

下表提供了 URI 模板及其匹配内容的示例：

*表 1. URI 模板匹配*

|模板|描述|匹配 URI|
|--|--|--|
|/books/{id}|简单匹配|/books/1|
|/books/{id:2}|最多两个字符的变量|/books/10|
|/books{/id}|可选的 URI 变量|/books/10 或 /books|
|/book{/id:[a-zA-Z]+}|带正则的可选 URI 变量|/books/foo|
|/books{?max,offset}|可选查询变量|/books?max=10&offset=10|
|/books{/path:.*}{.ext}|带扩展名的正则路径匹配|/books/foo/bar.xml|

## URI 保留字符匹配

默认情况下，[RFC-6570 URI 模板](https://tools.ietf.org/html/rfc6570)规范定义的 URI 变量不能包括保留字符，如 `/`、`?` 等

如果你希望匹配或扩展整个路径，这可能会有问题。根据[规范第 3.2.3 节](https://tools.ietf.org/html/rfc6570#section-3.2.3)，你可以使用保留扩展或使用 `+` 运算符进行匹配。

例如，URI `/books/{+path}` 与 `/books/foo` 和/ `books/foo/bar` 都匹配，因为 `+` 表示变量 `path` 应该包括保留字符（在本例中为 `/`）。

---

## 路由注解

上一个示例使用 [@Get](https://docs.micronaut.io/3.8.4/api/io/micronaut/http/annotation/Get.html) 注解来添加一个接受 HTTP [GET](https://docs.micronaut.io/3.8.4/api/io/micronaut/http/HttpMethod.html#GET) 请求的方法。下表总结了可用的注解以及它们如何映射到 HTTP 方法：

*表 2. HTTP 路由注解*

|注解|HTTP 方法|
|--|--|
|[@Delete](https://docs.micronaut.io/3.8.4/api/io/micronaut/http/annotation/Delete.html)|[DELETE](https://docs.micronaut.io/3.8.4/api/io/micronaut/http/HttpMethod.html#DELETE)|
|[@Get](https://docs.micronaut.io/3.8.4/api/io/micronaut/http/annotation/Get.html)|[GET](https://docs.micronaut.io/3.8.4/api/io/micronaut/http/HttpMethod.html#GET)|
|[@Head](https://docs.micronaut.io/3.8.4/api/io/micronaut/http/annotation/Head.html)|[HEAD](https://docs.micronaut.io/3.8.4/api/io/micronaut/http/HttpMethod.html#HEAD)|
|[@Options](https://docs.micronaut.io/3.8.4/api/io/micronaut/http/annotation/Options.html)|[OPTIONS](https://docs.micronaut.io/3.8.4/api/io/micronaut/http/HttpMethod.html#OPTIONS)|
|[@Patch](https://docs.micronaut.io/3.8.4/api/io/micronaut/http/annotation/Patch.html)|[PATCH](https://docs.micronaut.io/3.8.4/api/io/micronaut/http/HttpMethod.html#PATCH)|
|[@Put](https://docs.micronaut.io/3.8.4/api/io/micronaut/http/annotation/Put.html)|[PUT](https://docs.micronaut.io/3.8.4/api/io/micronaut/http/HttpMethod.html#PUT)|
|[@Post](https://docs.micronaut.io/3.8.4/api/io/micronaut/http/annotation/Post.html)|[POST](https://docs.micronaut.io/3.8.4/api/io/micronaut/http/HttpMethod.html#POST)|
|[@Trace](https://docs.micronaut.io/3.8.4/api/io/micronaut/http/annotation/Trace.html)|[TRACE](https://docs.micronaut.io/3.8.4/api/io/micronaut/http/HttpMethod.html#TRACE)|

:::tip 注意
所有方法注解默认为 `/` 。
:::

---

## 多个 URI

每个路由注解都支持多个 URI 模板。对于每个模板，都会创建一条路由。例如，此功能对于更改 API 的路径并保留现有路径以实现向后兼容性非常有用。例如：

*多个 URI*

<Tabs>
  <TabItem value="Java" label="Java" default>

```java
import io.micronaut.http.annotation.Controller;
import io.micronaut.http.annotation.Get;

@Controller("/hello")
public class BackwardCompatibleController {

    @Get(uris = {"/{name}", "/person/{name}"}) // (1)
    public String hello(String name) { // (2)
        return "Hello, " + name;
    }
}
```

  </TabItem>
  <TabItem value="Groovy" label="Groovy">

```groovy
import io.micronaut.http.annotation.Controller
import io.micronaut.http.annotation.Get

@Controller("/hello")
class BackwardCompatibleController {

    @Get(uris = ["/{name}", "/person/{name}"]) // (1)
    String hello(String name) { // (2)
        "Hello, $name"
    }
}
```

  </TabItem>
  <TabItem value="Kotlin" label="Kotlin">

```kt
import io.micronaut.http.annotation.Controller
import io.micronaut.http.annotation.Get

@Controller("/hello")
class BackwardCompatibleController {

    @Get(uris = ["/{name}", "/person/{name}"]) // (1)
    fun hello(name: String): String { // (2)
        return "Hello, $name"
    }
}
```

  </TabItem>
</Tabs>

1. 指定多个模板
2. 正常绑定到模板参数

:::tip 注意
使用多个模板时，路由验证更加复杂。如果一个通常需要的变量不存在于所有模板中，则该变量被认为是可选的，因为它可能不存在于方法的每次执行中。
:::

---

## 以编程方式构建路由

如果你不喜欢使用注释，而是在代码中声明所有路由，那么永远不要担心，Micronaut 有一个灵活的 [RouteBuilder](https://docs.micronaut.io/3.8.4/api/io/micronaut/web/router/RouteBuilder.html) API，可以轻松地以编程方式定义路由。

首先，基于 [DefaultRouteBuilder](https://docs.micronaut.io/3.8.4/api/io/micronaut/web/router/DefaultRouteBuilder.html) 实现子类，并将要路由到的控制器注入到方法中，然后定义路由：

*URI 变量示例*

<Tabs>
  <TabItem value="Java" label="Java" default>

```java
import io.micronaut.context.ExecutionHandleLocator;
import io.micronaut.web.router.DefaultRouteBuilder;

import jakarta.inject.Inject;
import jakarta.inject.Singleton;

@Singleton
public class MyRoutes extends DefaultRouteBuilder { // (1)

    public MyRoutes(ExecutionHandleLocator executionHandleLocator,
                    UriNamingStrategy uriNamingStrategy) {
        super(executionHandleLocator, uriNamingStrategy);
    }

    @Inject
    void issuesRoutes(IssuesController issuesController) { // (2)
        GET("/issues/show/{number}", issuesController, "issue", Integer.class); // (3)
    }
}
```

  </TabItem>
  <TabItem value="Groovy" label="Groovy">

```groovy
import io.micronaut.context.ExecutionHandleLocator
import io.micronaut.core.convert.ConversionService
import io.micronaut.web.router.GroovyRouteBuilder

import jakarta.inject.Inject
import jakarta.inject.Singleton

@Singleton
class MyRoutes extends GroovyRouteBuilder { // (1)

    MyRoutes(ExecutionHandleLocator executionHandleLocator,
             UriNamingStrategy uriNamingStrategy,
             ConversionService conversionService) {
        super(executionHandleLocator, uriNamingStrategy, conversionService)
    }

    @Inject
    void issuesRoutes(IssuesController issuesController) { // (2)
        GET("/issues/show/{number}", issuesController.&issue) // (3)
    }
}
```

  </TabItem>
  <TabItem value="Kotlin" label="Kotlin">

```kt
import io.micronaut.context.ExecutionHandleLocator
import io.micronaut.web.router.DefaultRouteBuilder
import io.micronaut.web.router.RouteBuilder
import jakarta.inject.Inject
import jakarta.inject.Singleton

@Singleton
class MyRoutes(executionHandleLocator: ExecutionHandleLocator,
               uriNamingStrategy: RouteBuilder.UriNamingStrategy) :
        DefaultRouteBuilder(executionHandleLocator, uriNamingStrategy) { // (1)

    @Inject
    fun issuesRoutes(issuesController: IssuesController) { // (2)
        GET("/issues/show/{number}", issuesController, "issue", Int::class.java) // (3)
    }
}
```

  </TabItem>
</Tabs>

1. 路由定义应为 [DefaultRouteBuilder](https://docs.micronaut.io/3.8.4/api/io/micronaut/web/router/DefaultRouteBuilder.html) 的子类
2. 使用 @Inject 注入一个带有要路由到的控制器的方法
3. 使用诸如 [RouteBuilder::GET(String,Class,String,Class…​)](https://docs.micronaut.io/3.8.4/api/io/micronaut/web/router/RouteBuilder.html) 以路由到控制器方法。请注意，即使使用了 issues 控制器，路由也不知道其 `@controller` 注解，因此必须指定完整路径。

:::note 提示
不幸的是，由于类型擦除，Java 方法 lambda 引用不能与 API 一起使用。对于 Groovy，有一个 `GroovyRouteBuilder` 类，它可以被子类化，允许传递 Groovy 方法引用。
:::

---

## 路由编译时验证

Micronaut 支持在编译时使用验证库验证路由参数。若要开始，请将 `validation` 依赖项添加到你的构建中：

*build.gradle*

```groovy
annotationProcessor "io.micronaut:micronaut-validation" // Java only
kapt "io.micronaut:micronaut-validation" // Kotlin only
implementation "io.micronaut:micronaut-validation"
```

有了对 classpath 的正确依赖，路由参数将在编译时自动检查。如果满足以下任一条件，编译将失败：

- URI 模板包含一个可选的变量，但方法参数没有用 `@Nullable` 注解，或者是 `java.util.optional`。

可选变量是一个允许路由匹配URI的变量，即使该值不存在。例如 `/foo{/bar}` 将请求与 `/foo` 和 `/foo/abc` 相匹配。非可选的变体是 `/foo/{bar}`。详细信息，参阅 [URI 路径变量](#uri-路径变量)部分。

- URI 模板包含方法参数中缺少的变量。

:::tip 注意
要禁用路由编译时验证，请设置系统属性 `-Dmicronaut.route.validation=false`。对于使用 Gradle 的 Java 和 Kotlin 用户，可以通过从 `annotationProcessor`/`kapt` 范围中删除 `validation` 依赖项来实现相同的效果。
:::

---

## 路由非标准 HTTP 方法

`@CustomHttpMethod` 注解支持客户端或服务器的非标准 HTTP 方法。像 [RFC-4918 Webdav](https://tools.ietf.org/html/rfc4918) 这样的规范需要额外的方法，例如 `REPORT` 或 `LOCK`。

*路由示例*

```java
@CustomHttpMethod(method = "LOCK", value = "/{name}")
String lock(String name)
```

此注解可以在任何可以使用标准方法注解的地方使用，包括控制器和声明式 HTTP 客户端。

> [英文链接](https://docs.micronaut.io/3.9.4/guide/index.html#routing)

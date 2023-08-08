---
sidebar_position: 40
---

# 6.4 简单请求绑定

上一节中的示例演示了 Micronaut 如何让你绑定 URI 路径变量中的方法参数。本节显示如何绑定请求其他部分的参数。

## 绑定注解

所有绑定注解都支持自定义要与其 `name` 成员绑定的变量的名称。

下表总结了注解及其用途，并提供了示例：

*表 1. 参数绑定注解*

|注解|描述|示例|
|--|--|--|
|[@Body](https://micronaut-projects.github.io/micronaut-docs-mn3/3.9.4/api/io/micronaut/http/annotation/Body.html)|从请求体绑定|@Body String body|
|[@CookieValue](https://micronaut-projects.github.io/micronaut-docs-mn3/3.9.4/api/io/micronaut/http/annotation/CookieValue.html)|从 cookie 绑定一个参数|@CookieValue String myCookie|
|[@Header](https://micronaut-projects.github.io/micronaut-docs-mn3/3.9.4/api/io/micronaut/http/annotation/Header.html)|从 HTTP 头绑定一个参数|@Header String requestId|
|[@QueryValue](https://micronaut-projects.github.io/micronaut-docs-mn3/3.9.4/api/io/micronaut/http/annotation/QueryValue.html)|从请求查询参数绑定|@QueryValue String myParam|
|[@Part](https://micronaut-projects.github.io/micronaut-docs-mn3/3.9.4/api/io/micronaut/http/annotation/Part.html)|从 multipart 请求绑定|@Part CompletedFileUpload file|
|[@RequestAttribute](https://micronaut-projects.github.io/micronaut-docs-mn3/3.9.4/api/io/micronaut/http/annotation/RequestAttribute.html)|从请求属性绑定。属性通常在过滤器中创建|@RequestAttribute String myAttribute|
|[@PathVariable](https://micronaut-projects.github.io/micronaut-docs-mn3/3.9.4/api/io/micronaut/http/annotation/PathVariable.html)|从请求路径中绑定|@PathVariable String id|
|[@RequestBean](https://micronaut-projects.github.io/micronaut-docs-mn3/3.9.4/api/io/micronaut/http/annotation/RequestBean.html)|将任何可绑定的值绑定到单个Bean对象|@RequestBean MyBean bean|

当绑定注解中未指定值时，将使用方法参数名称。换句话说，以下两种方法是等效的，并且都是从名为 `myCookie` 的 cookie 绑定的：

import Tabs from '@theme/Tabs';
import TabItem from '@theme/TabItem';

<Tabs>
  <TabItem value="Java" label="Java" default>

```java
@Get("/cookieName")
public String cookieName(@CookieValue("myCookie") String myCookie) {
    // ...
}

@Get("/cookieInferred")
public String cookieInferred(@CookieValue String myCookie) {
    // ...
}
```

  </TabItem>
  <TabItem value="Groovy" label="Groovy">

```groovy
@Get("/cookieName")
String cookieName(@CookieValue("myCookie") String myCookie) {
    // ...
}

@Get("/cookieInferred")
String cookieInferred(@CookieValue String myCookie) {
    // ...
}
```

  </TabItem>
  <TabItem value="Kotlin" label="Kotlin">

```kt
@Get("/cookieName")
fun cookieName(@CookieValue("myCookie") myCookie: String): String {
    // ...
}

@Get("/cookieInferred")
fun cookieInferred(@CookieValue myCookie: String): String {
    // ...
}
```

  </TabItem>
</Tabs>

由于变量名中不允许使用连字符，因此可能需要在注解中设置名称。以下定义是等效的：

<Tabs>
  <TabItem value="Java" label="Java" default>

```java
@Get("/headerName")
public String headerName(@Header("Content-Type") String contentType) {
    // ...
}

@Get("/headerInferred")
public String headerInferred(@Header String contentType) {
    // ...
}
```

  </TabItem>
  <TabItem value="Groovy" label="Groovy">

```groovy
@Get("/headerName")
String headerName(@Header("Content-Type") String contentType) {
    // ...
}

@Get("/headerInferred")
String headerInferred(@Header String contentType) {
    // ...
}
```

  </TabItem>
  <TabItem value="Kotlin" label="Kotlin">

```kt
@Get("/headerName")
fun headerName(@Header("Content-Type") contentType: String): String {
    // ...
}

@Get("/headerInferred")
fun headerInferred(@Header contentType: String): String {
    // ...
}
```

  </TabItem>
</Tabs>

---

## 流支持

Micronaut 还支持将请求体绑定到 `InputStream`。如果方法正在读取流，则必须将方法执行卸载到另一个线程池，以避免阻塞事件循环。

*使用 InputStream 执行阻塞 I/O*

<Tabs>
  <TabItem value="Java" label="Java" default>

```java
@Post(value = "/read", processes = MediaType.TEXT_PLAIN)
@ExecuteOn(TaskExecutors.IO) // (1)
String read(@Body InputStream inputStream) throws IOException { // (2)
    return IOUtils.readText(new BufferedReader(new InputStreamReader(inputStream))); // (3)
}
```

  </TabItem>
  <TabItem value="Groovy" label="Groovy">

```groovy
@Post(value = "/read", processes = MediaType.TEXT_PLAIN)
@ExecuteOn(TaskExecutors.IO) // (1)
String read(@Body InputStream inputStream) throws IOException { // (2)
    IOUtils.readText(new BufferedReader(new InputStreamReader(inputStream))) // (3)
}
```

  </TabItem>
  <TabItem value="Kotlin" label="Kotlin">

```kt
@Post(value = "/read", processes = [MediaType.TEXT_PLAIN])
@ExecuteOn(TaskExecutors.IO) // (1)
fun read(@Body inputStream: InputStream): String { // (2)
    return IOUtils.readText(BufferedReader(InputStreamReader(inputStream))) // (3)
}
```

  </TabItem>
</Tabs>

1. 控制器方法在 IO 线程池上执行
2. 请求体作为输入流传递给方法
3. 流被读取

---

## 从多个查询值绑定

与其从请求的单个部分进行绑定，不如将所有查询值（例如）绑定到 POJO。这可以通过在 URI 模板中使用分解运算符 `(?pojo*)` 来实现。例如：

*绑定请求参数到 POJO*

<Tabs>
  <TabItem value="Java" label="Java" default>

```java
import io.micronaut.http.HttpStatus;
import io.micronaut.http.annotation.Controller;
import io.micronaut.http.annotation.Get;
import io.micronaut.core.annotation.Nullable;

import javax.validation.Valid;

@Controller("/api")
public class BookmarkController {

    @Get("/bookmarks/list{?paginationCommand*}")
    public HttpStatus list(@Valid @Nullable PaginationCommand paginationCommand) {
        return HttpStatus.OK;
    }
}
```

  </TabItem>
  <TabItem value="Groovy" label="Groovy">

```groovy
import io.micronaut.http.HttpStatus
import io.micronaut.http.annotation.Controller
import io.micronaut.http.annotation.Get

import javax.annotation.Nullable
import javax.validation.Valid

@Controller("/api")
class BookmarkController {

    @Get("/bookmarks/list{?paginationCommand*}")
    HttpStatus list(@Valid @Nullable PaginationCommand paginationCommand) {
        HttpStatus.OK
    }
}
```

  </TabItem>
  <TabItem value="Kotlin" label="Kotlin">

```kt
import io.micronaut.http.HttpStatus
import io.micronaut.http.annotation.Controller
import io.micronaut.http.annotation.Get
import javax.validation.Valid

@Controller("/api")
open class BookmarkController {

    @Get("/bookmarks/list{?paginationCommand*}")
    open fun list(@Valid paginationCommand: PaginationCommand): HttpStatus {
        return HttpStatus.OK
    }
}
```

  </TabItem>
</Tabs>

---

## 从多个可绑定值绑定

除了只绑定查询值，还可以将任何可绑定值绑定到 POJO（例如，将 `HttpRequest`、`@PathVariable`、`@QueryValue` 和 `@Header` 绑定到单个 POJO）。这可以通过 `@RequestBean` 注解和自定义 Bean 类来实现，该类具有带可绑定注解的字段，或者可以按类型绑定的字段（例如 `HttpRequest`、`BasicAuth`、`Authentication` 等）。

例如：

*绑定可绑定值到 POJO*

<Tabs>
  <TabItem value="Java" label="Java" default>

```java
@Controller("/api")
public class MovieTicketController {

    // You can also omit query parameters like:
    // @Get("/movie/ticket/{movieId}
    @Get("/movie/ticket/{movieId}{?minPrice,maxPrice}")
    public HttpStatus list(@Valid @RequestBean MovieTicketBean bean) {
        return HttpStatus.OK;
    }
}
```

  </TabItem>
  <TabItem value="Groovy" label="Groovy">

```groovy
@Controller("/api")
class MovieTicketController {

    // You can also omit query parameters like:
    // @Get("/movie/ticket/{movieId}
    @Get("/movie/ticket/{movieId}{?minPrice,maxPrice}")
    HttpStatus list(@Valid @RequestBean MovieTicketBean bean) {
        HttpStatus.OK
    }
}
```

  </TabItem>
  <TabItem value="Kotlin" label="Kotlin">

```kt
@Controller("/api")
open class MovieTicketController {

    // You can also omit query parameters like:
    // @Get("/movie/ticket/{movieId}
    @Get("/movie/ticket/{movieId}{?minPrice,maxPrice}")
    open fun list(@Valid @RequestBean bean: MovieTicketBean): HttpStatus {
        return HttpStatus.OK
    }

}
```

  </TabItem>
</Tabs>

它使用了以下 Bean 类：

*Bean 定义*

<Tabs>
  <TabItem value="Java" label="Java" default>

```java
@Introspected
public class MovieTicketBean {

    private HttpRequest<?> httpRequest;

    @PathVariable
    private String movieId;

    @Nullable
    @QueryValue
    @PositiveOrZero
    private Double minPrice;

    @Nullable
    @QueryValue
    @PositiveOrZero
    private Double maxPrice;

    public MovieTicketBean(HttpRequest<?> httpRequest,
                           String movieId,
                           Double minPrice,
                           Double maxPrice) {
        this.httpRequest = httpRequest;
        this.movieId = movieId;
        this.minPrice = minPrice;
        this.maxPrice = maxPrice;
    }

    public HttpRequest<?> getHttpRequest() {
        return httpRequest;
    }

    public String getMovieId() {
        return movieId;
    }

    @Nullable
    public Double getMaxPrice() {
        return maxPrice;
    }

    @Nullable
    public Double getMinPrice() {
        return minPrice;
    }
}
```

  </TabItem>
  <TabItem value="Groovy" label="Groovy">

```groovy
@Introspected
class MovieTicketBean {

    private HttpRequest<?> httpRequest

    @PathVariable
    String movieId

    @Nullable
    @QueryValue
    @PositiveOrZero
    Double minPrice

    @Nullable
    @QueryValue
    @PositiveOrZero
    Double maxPrice
}
```

  </TabItem>
  <TabItem value="Kotlin" label="Kotlin">

```kt
@Introspected
data class MovieTicketBean(
    val httpRequest: HttpRequest<Any>,
    @field:PathVariable val movieId: String,
    @field:QueryValue @field:PositiveOrZero @field:Nullable val minPrice: Double,
    @field:QueryValue @field:PositiveOrZero @field:Nullable val maxPrice: Double
)
```

  </TabItem>
</Tabs>

bean类必须使用 `@Introspected` 进行自省。它可以是以下其中一种：

1. 有 setter 和 getter 的可变 Bean 类
2. 具有 getter 和全参数构造函数（或构造函数或静态方法上的 `@Creator` 注解）的不可变 Bean 类。构造函数的参数必须与字段名匹配，这样对象就可以在没有反射的情况下实例化。

:::caution 警告
由于 Java 在字节码中不保留参数名，所以必须使用 `-parameters` 编译代码，才能使用另一个 jar 中的不可变 bean 类。另一种选择是在源代码中扩展 Bean 类。
:::

---

## 可绑定类型

通常，任何可以通过 [ConversionService](https://micronaut-projects.github.io/micronaut-docs-mn3/3.9.4/api/io/micronaut/core/convert/ConversionService.html) API 从 String 表示转换为 Java 类型的类型都可以绑定到。

这包括最常见的 Java 类型，但是可以通过创建 TypeConverter 类型的 @Singleton bean 来注册其他 TypeConverter 实例。

对可为 NULL 的值要特别提及。例如，考虑以下示例：

<Tabs>
  <TabItem value="Java" label="Java" default>

```java
@Get("/headerInferred")
public String headerInferred(@Header String contentType) {
    // ...
}
```

  </TabItem>
  <TabItem value="Groovy" label="Groovy">

```groovy
@Get("/headerInferred")
String headerInferred(@Header String contentType) {
    // ...
}
```

  </TabItem>
  <TabItem value="Kotlin" label="Kotlin">

```kt
@Get("/headerInferred")
fun headerInferred(@Header contentType: String): String {
    // ...
}
```

  </TabItem>
</Tabs>

在这种情况下，如果请求中不存在 HTTP 头 `Content-Type`，则该路由被认为是无效的，因为它不能被满足，并且返回 HTTP 400 `BAD Request`。

要使 `Content-Type` 头可选，你可以改为写入：

<Tabs>
  <TabItem value="Java" label="Java" default>

```java
@Get("/headerNullable")
public String headerNullable(@Nullable @Header String contentType) {
    // ...
}
```

  </TabItem>
  <TabItem value="Groovy" label="Groovy">

```groovy
@Get("/headerNullable")
String headerNullable(@Nullable @Header String contentType) {
    // ...
}
```

  </TabItem>
  <TabItem value="Kotlin" label="Kotlin">

```kt
@Get("/headerNullable")
fun headerNullable(@Header contentType: String?): String? {
    // ...
}
```

  </TabItem>
</Tabs>

如果请求中没有头，则会传递一个 `null` 字符串。

:::tip 注意
也可以使用 `java.util.Optional`，但对于方法参数而言，并不鼓励。
:::

此外，任何符合 [RFC-1123](https://docs.oracle.com/javase/8/docs/api/java/time/format/DateTimeFormatter.html#RFC_1123_DATE_TIME) 的 `DateTime` 都可以绑定到一个参数。或者，可以使用 [Format](https://micronaut-projects.github.io/micronaut-docs-mn3/3.9.4/api/io/micronaut/core/convert/format/Format.html) 注解自定义格式：

<Tabs>
  <TabItem value="Java" label="Java" default>

```java
@Get("/date")
public String date(@Header ZonedDateTime date) {
    // ...
}

@Get("/dateFormat")
public String dateFormat(@Format("dd/MM/yyyy hh:mm:ss a z") @Header ZonedDateTime date) {
    // ...
}
```

  </TabItem>
  <TabItem value="Groovy" label="Groovy">

```groovy
@Get("/date")
String date(@Header ZonedDateTime date) {
    // ...
}

@Get("/dateFormat")
String dateFormat(@Format("dd/MM/yyyy hh:mm:ss a z") @Header ZonedDateTime date) {
    // ...
}
```

  </TabItem>
  <TabItem value="Kotlin" label="Kotlin">

```kt
@Get("/date")
fun date(@Header date: ZonedDateTime): String {
    // ...
}

@Get("/dateFormat")
fun dateFormat(@Format("dd/MM/yyyy hh:mm:ss a z") @Header date: ZonedDateTime): String {
    // ...
}
```

  </TabItem>
</Tabs>

---

## 基于类型的绑定参数

某些参数是通过其类型而不是注解来识别的。下表总结了参数类型及其用途，并提供了一个示例：

|类型|描述|示例|
|--|--|--|
|[BasicAuth](https://micronaut-projects.github.io/micronaut-docs-mn3/3.9.4/api/io/micronaut/http/BasicAuth.html)|允许绑定基本授权凭据|BasicAuth basicAuth|

## 变量消除

Micronaut 尝试按以下顺序填充方法参数：

1. URI 变量，如 `/{id}`。
2. 如果请求是 `GET` 请求（例如 `?foo=bar`），则根据查询参数。
3. 如果有一个 `@Body`，并且请求允许该请求体，请将该请求体绑定到它。
4. 如果请求可以有一个请求体，并且没有定义 `@Body`，那么尝试解析主体（JSON 或表单数据）并从主体绑定方法参数。
5. 最后，如果无法填充方法参数，则返回 `400 BAD REQUEST`



> [英文链接](https://docs.micronaut.io/3.9.4/guide/index.html#binding)

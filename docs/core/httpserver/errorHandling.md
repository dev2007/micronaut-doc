---
sidebar_position: 170
---

# 6.17 错误处理

有时候，分布式应用程序会发生不好的事情。有一个好的方法来处理错误是很重要的。

## 6.17.1 状态处理器

[@Error](https://docs.micronaut.io/3.8.4/api/io/micronaut/http/annotation/Error.html) 注解支持定义异常类或 HTTP 状态。用[@Error](https://docs.micronaut.io/3.8.4/api/io/micronaut/http/annotation/Error.html) 注解的方法必须在用 [@Controller](https://docs.micronaut.io/3.8.4/api/io/micronaut/http/annotation/Controller.html) 注解的类中用定义。注解还支持全局和局部的概念，局部是默认的。

本地错误处理程序只响应由于路由与同一控制器中的另一个方法匹配而引发的异常。全局错误处理程序可以作为任何抛出的异常的结果调用。在解析要执行的处理程序时，总是首先搜索本地错误处理程序。

:::note 提示
为异常定义错误处理程序时，可以将异常实例指定为方法的参数，并省略注解的异常属性。
:::

## 6.17.2 本地错误处理

例如，以下方法为声明控制器的作用域处理来自 Jackson 的 JSON 解析异常：

*本地异常处理器*

import Tabs from '@theme/Tabs';
import TabItem from '@theme/TabItem';

<Tabs>
  <TabItem value="Java" label="Java" default>

```java
@Error
public HttpResponse<JsonError> jsonError(HttpRequest request, JsonParseException e) { // (1)
    JsonError error = new JsonError("Invalid JSON: " + e.getMessage()) // (2)
            .link(Link.SELF, Link.of(request.getUri()));

    return HttpResponse.<JsonError>status(HttpStatus.BAD_REQUEST, "Fix Your JSON")
            .body(error); // (3)
}
```

  </TabItem>
  <TabItem value="Groovy" label="Groovy">

```groovy
@Error
HttpResponse<JsonError> jsonError(HttpRequest request, JsonParseException e) { // (1)
    JsonError error = new JsonError("Invalid JSON: " + e.message) // (2)
            .link(Link.SELF, Link.of(request.uri))

    HttpResponse.<JsonError>status(HttpStatus.BAD_REQUEST, "Fix Your JSON")
            .body(error) // (3)
}
```

  </TabItem>
  <TabItem value="Kotlin" label="Kotlin">

```kt
@Error
fun jsonError(request: HttpRequest<*>, e: JsonParseException): HttpResponse<JsonError> { // (1)
    val error = JsonError("Invalid JSON: ${e.message}") // (2)
            .link(Link.SELF, Link.of(request.uri))

    return HttpResponse.status<JsonError>(HttpStatus.BAD_REQUEST, "Fix Your JSON")
            .body(error) // (3)
}
```

  </TabItem>
</Tabs>

1. 声明了一个显式处理 `JsonParseException` 的方法
2. 返回 [JsonError](https://docs.micronaut.io/3.8.4/api/io/micronaut/http/hateoas/JsonError.html) 的一个实例。
3. 返回自定义响应以处理错误

*本地状态处理器*

<Tabs>
  <TabItem value="Java" label="Java" default>

```java
@Error(status = HttpStatus.NOT_FOUND)
public HttpResponse<JsonError> notFound(HttpRequest request) { // (1)
    JsonError error = new JsonError("Person Not Found") // (2)
            .link(Link.SELF, Link.of(request.getUri()));

    return HttpResponse.<JsonError>notFound()
            .body(error); // (3)
}
```

  </TabItem>
  <TabItem value="Groovy" label="Groovy">

```groovy
@Error(status = HttpStatus.NOT_FOUND)
HttpResponse<JsonError> notFound(HttpRequest request) { // (1)
    JsonError error = new JsonError("Person Not Found") // (2)
            .link(Link.SELF, Link.of(request.uri))

    HttpResponse.<JsonError>notFound()
            .body(error) // (3)
}
```

  </TabItem>
  <TabItem value="Kotlin" label="Kotlin">

```kt
@Error(status = HttpStatus.NOT_FOUND)
fun notFound(request: HttpRequest<*>): HttpResponse<JsonError> { // (1)
    val error = JsonError("Person Not Found") // (2)
            .link(Link.SELF, Link.of(request.uri))

    return HttpResponse.notFound<JsonError>()
            .body(error) // (3)
}
```

  </TabItem>
</Tabs>

1. [Error](https://docs.micronaut.io/3.8.4/api/io/micronaut/http/annotation/Error.html) 声明要处理的 [HttpStatus](https://docs.micronaut.io/3.8.4/api/io/micronaut/http/HttpStatus.html) 错误代码（在本例中为 404）
2. 为所有 404 响应返回 [JsonError](https://docs.micronaut.io/3.8.4/api/io/micronaut/http/hateoas/JsonError.html) 实例
3. 返回 [NOT_FOUND](https://docs.micronaut.io/3.8.4/api/io/micronaut/http/HttpStatus.html#NOT_FOUND) 响应

## 6.17.3 全局错误处理

*全局错误处理器*

<Tabs>
  <TabItem value="Java" label="Java" default>

```java
@Error(global = true) // (1)
public HttpResponse<JsonError> error(HttpRequest request, Throwable e) {
    JsonError error = new JsonError("Bad Things Happened: " + e.getMessage()) // (2)
            .link(Link.SELF, Link.of(request.getUri()));

    return HttpResponse.<JsonError>serverError()
            .body(error); // (3)
}
```

  </TabItem>
  <TabItem value="Groovy" label="Groovy">

```groovy
@Error(global = true) // (1)
HttpResponse<JsonError> error(HttpRequest request, Throwable e) {
    JsonError error = new JsonError("Bad Things Happened: " + e.message) // (2)
            .link(Link.SELF, Link.of(request.uri))

    HttpResponse.<JsonError>serverError()
            .body(error) // (3)
}
```

  </TabItem>
  <TabItem value="Kotlin" label="Kotlin">

```kt
@Error(global = true) // (1)
fun error(request: HttpRequest<*>, e: Throwable): HttpResponse<JsonError> {
    val error = JsonError("Bad Things Happened: ${e.message}") // (2)
            .link(Link.SELF, Link.of(request.uri))

    return HttpResponse.serverError<JsonError>()
            .body(error) // (3)
}
```

  </TabItem>
</Tabs>

1. [@Error](https://docs.micronaut.io/3.8.4/api/io/micronaut/http/annotation/Error.html) 将该方法声明为全局错误处理程序
2. 为所有错误返回 [JsonError](https://docs.micronaut.io/3.8.4/api/io/micronaut/http/hateoas/JsonError.html) 实例
3. 返回 [INTERNAL_SERVER_ERROR](https://docs.micronaut.io/3.8.4/api/io/micronaut/http/HttpStatus.html#INTERNAL_SERVER_ERROR) 响应

*全局状态处理器*

<Tabs>
  <TabItem value="Java" label="Java" default>

```java
@Error(status = HttpStatus.NOT_FOUND)
public HttpResponse<JsonError> notFound(HttpRequest request) { // (1)
    JsonError error = new JsonError("Person Not Found") // (2)
            .link(Link.SELF, Link.of(request.getUri()));

    return HttpResponse.<JsonError>notFound()
            .body(error); // (3)
}
```

  </TabItem>
  <TabItem value="Groovy" label="Groovy">

```groovy
@Error(status = HttpStatus.NOT_FOUND)
HttpResponse<JsonError> notFound(HttpRequest request) { // (1)
    JsonError error = new JsonError("Person Not Found") // (2)
            .link(Link.SELF, Link.of(request.uri))

    HttpResponse.<JsonError>notFound()
            .body(error) // (3)
}
```

  </TabItem>
  <TabItem value="Kotlin" label="Kotlin">

```kt
@Error(status = HttpStatus.NOT_FOUND)
fun notFound(request: HttpRequest<*>): HttpResponse<JsonError> { // (1)
    val error = JsonError("Person Not Found") // (2)
            .link(Link.SELF, Link.of(request.uri))

    return HttpResponse.notFound<JsonError>()
            .body(error) // (3)
}
```

  </TabItem>
</Tabs>

1. [@Error](https://docs.micronaut.io/3.8.4/api/io/micronaut/http/annotation/Error.html) 声明要处理的 [HttpStatus](https://docs.micronaut.io/3.8.4/api/io/micronaut/http/HttpStatus.html) 错误代码（在本例中为 404）
2. 为所有 404 响应返回 [JsonError](https://docs.micronaut.io/3.8.4/api/io/micronaut/http/hateoas/JsonError.html) 实例
3. 返回 [NOT_FOUND](https://docs.micronaut.io/3.8.4/api/io/micronaut/http/HttpStatus.html#NOT_FOUND) 响应

:::caution 警告
关于 [@Error](https://docs.micronaut.io/3.8.4/api/io/micronaut/http/annotation/Error.html) 注解需要注意的几点。不能声明相同的全局 `@Error` 注解。不能在同一控制器中声明相同的非全局 `@Error` 注解。如果具有相同参数的 `@Error` 注解以全局形式存在，而另一个以本地形式存在，则本地注解优先。
:::

## 6.17.4 ExceptionHandler

或者，你可以实现 [ExceptionHandler](https://docs.micronaut.io/3.8.4/api/io/micronaut/http/server/exceptions/ExceptionHandler.html)，这是一个用于处理 HTTP 请求执行过程中发生的异常的通用钩子。

:::caution 警告
捕获异常的 `@Error` 注解优先于捕获同一异常的 `ExceptionHandler` 的实现。
:::

### 6.17.4.1 内置异常处理器

Micronaut 提供了几个内置的处理器。

|异常|处理器|
|--|--|
|`javax.validation.ConstraintViolationException`|[ConstraintExceptionHandler](https://docs.micronaut.io/3.8.4/api/io/micronaut/validation/exceptions/ConstraintExceptionHandler.html)|
|[ContentLengthExceededException](https://docs.micronaut.io/3.8.4/api/io/micronaut/http/exceptions/ContentLengthExceededException.html)|[ContentLengthExceededHandler](https://docs.micronaut.io/3.8.4/api/io/micronaut/http/server/exceptions/ContentLengthExceededHandler.html)|
|[ConversionErrorException](https://docs.micronaut.io/3.8.4/api/io/micronaut/core/convert/exceptions/ConversionErrorException.html)|[ConversionErrorHandler](https://docs.micronaut.io/3.8.4/api/io/micronaut/http/server/exceptions/ConversionErrorHandler.html)|
|[DuplicateRouteException](https://docs.micronaut.io/3.8.4/api/io/micronaut/web/router/exceptions/DuplicateRouteException.html)|[DuplicateRouteHandler](https://docs.micronaut.io/3.8.4/api/io/micronaut/http/server/exceptions/DuplicateRouteHandler.html)|
|[HttpStatusException](https://docs.micronaut.io/3.8.4/api/io/micronaut/http/exceptions/HttpStatusException.html)|[HttpStatusHandler](https://docs.micronaut.io/3.8.4/api/io/micronaut/http/server/exceptions/HttpStatusHandler.html)|
|`com.fasterxml.jackson.core.JsonProcessingException`|[JsonExceptionHandler](https://docs.micronaut.io/3.8.4/api/io/micronaut/http/server/exceptions/JsonExceptionHandler.html)|
|`java.net.URISyntaxException`|[URISyntaxHandler](https://docs.micronaut.io/3.8.4/api/io/micronaut/http/server/exceptions/URISyntaxHandler.html)|
|[UnsatisfiedArgumentException](https://docs.micronaut.io/3.8.4/api/io/micronaut/core/bind/exceptions/UnsatisfiedArgumentException.html)|[UnsatisfiedArgumentHandler](https://docs.micronaut.io/3.8.4/api/io/micronaut/http/server/exceptions/UnsatisfiedArgumentHandler.html)|
|[UnsatisfiedRouteException](https://docs.micronaut.io/3.8.4/api/io/micronaut/web/router/exceptions/UnsatisfiedRouteException.html)|[UnsatisfiedRouteHandler](https://docs.micronaut.io/3.8.4/api/io/micronaut/http/server/exceptions/UnsatisfiedRouteHandler.html)|
|`org.grails.datastore.mapping.validation.ValidationException`|[ValidationExceptionHandler](https://docs.micronaut.io/3.8.4/api/io/micronaut/http/server/exceptions/UnsatisfiedRouteHandler.html)|

### 6.17.4.2 自定义异常处理器

想象一下，当一本书缺货时，你的电子商务应用程序抛出 `OutOfStockException`：

<Tabs>
  <TabItem value="Java" label="Java" default>

```java
public class OutOfStockException extends RuntimeException {
}
```

  </TabItem>
  <TabItem value="Groovy" label="Groovy">

```groovy
class OutOfStockException extends RuntimeException {
}
```

  </TabItem>
  <TabItem value="Kotlin" label="Kotlin">

```kt
class OutOfStockException : RuntimeException()
```

  </TabItem>
</Tabs>

添加到 `BookController`：

<Tabs>
  <TabItem value="Java" label="Java" default>

```java
@Controller("/books")
public class BookController {

    @Produces(MediaType.TEXT_PLAIN)
    @Get("/stock/{isbn}")
    Integer stock(String isbn) {
        throw new OutOfStockException();
    }
}
```

  </TabItem>
  <TabItem value="Groovy" label="Groovy">

```groovy
@Controller("/books")
class BookController {

    @Produces(MediaType.TEXT_PLAIN)
    @Get("/stock/{isbn}")
    Integer stock(String isbn) {
        throw new OutOfStockException()
    }
}
```

  </TabItem>
  <TabItem value="Kotlin" label="Kotlin">

```kt
@Controller("/books")
class BookController {

    @Produces(MediaType.TEXT_PLAIN)
    @Get("/stock/{isbn}")
    internal fun stock(isbn: String): Int? {
        throw OutOfStockException()
    }
}
```

  </TabItem>
</Tabs>

如果不处理异常，服务器将返回 500（Internal Server Error，内部服务器错误）状态代码。

要在抛出 `OutOfStockException` 时以 400 Bad Request 作为响应，可以注册 `ExceptionHandler`：

<Tabs>
  <TabItem value="Java" label="Java" default>

```java
@Produces
@Singleton
@Requires(classes = {OutOfStockException.class, ExceptionHandler.class})
public class OutOfStockExceptionHandler implements ExceptionHandler<OutOfStockException, HttpResponse> {

    private final ErrorResponseProcessor<?> errorResponseProcessor;

    public OutOfStockExceptionHandler(ErrorResponseProcessor<?> errorResponseProcessor) {
        this.errorResponseProcessor = errorResponseProcessor;
    }

    @Override
    public HttpResponse handle(HttpRequest request, OutOfStockException e) {
        return errorResponseProcessor.processResponse(ErrorContext.builder(request)
                .cause(e)
                .errorMessage("No stock available")
                .build(), HttpResponse.badRequest()); // (1)
    }
}
```

  </TabItem>
  <TabItem value="Groovy" label="Groovy">

```groovy
@Produces
@Singleton
@Requires(classes = [OutOfStockException, ExceptionHandler])
class OutOfStockExceptionHandler implements ExceptionHandler<OutOfStockException, HttpResponse> {

    private final ErrorResponseProcessor<?> errorResponseProcessor

    OutOfStockExceptionHandler(ErrorResponseProcessor<?> errorResponseProcessor) {
        this.errorResponseProcessor = errorResponseProcessor
    }

    @Override
    HttpResponse handle(HttpRequest request, OutOfStockException e) {
        errorResponseProcessor.processResponse(ErrorContext.builder(request)
                .cause(e)
                .errorMessage("No stock available")
                .build(), HttpResponse.badRequest()) // (1)
    }
}
```

  </TabItem>
  <TabItem value="Kotlin" label="Kotlin">

```kt
@Produces
@Singleton
@Requirements(
    Requires(classes = [OutOfStockException::class, ExceptionHandler::class])
)
class OutOfStockExceptionHandler(private val errorResponseProcessor: ErrorResponseProcessor<Any>) :
    ExceptionHandler<OutOfStockException, HttpResponse<*>> {

    override fun handle(request: HttpRequest<*>, exception: OutOfStockException): HttpResponse<*> {
        return errorResponseProcessor.processResponse(
                ErrorContext.builder(request)
                    .cause(exception)
                    .errorMessage("No stock available")
                    .build(), HttpResponse.badRequest<Any>()) // (1)
    }
}
```

  </TabItem>
</Tabs>

1. 默认的 [ErrorResponseProcessor](https://docs.micronaut.io/3.8.4/api/io/micronaut/http/server/exceptions/response/ErrorResponseProcessor.html) 用于创建响应的主体

## 6.17.5 错误格式化

Micronaut 通过 [ErrorResponseProcessor](https://docs.micronaut.io/3.8.4/api/io/micronaut/http/server/exceptions/response/ErrorResponseProcessor.html) 类型的 bean 生成错误响应体。

默认的响应主体是 [vnd.error](https://github.com/blongden/vnd.error)，但是您可以创建自己的 [ErrorResponseProcessor](https://docs.micronaut.io/3.8.4/api/io/micronaut/http/server/exceptions/response/ErrorResponseProcessor.html) 类型的实现来控制响应。

如果需要自定义响应而不是与错误相关的项，则需要重写正在处理异常的异常处理程序。

> [英文链接](https://docs.micronaut.io/3.9.4/guide/index.html#errorHandling)

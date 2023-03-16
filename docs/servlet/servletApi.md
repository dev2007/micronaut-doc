---
sidebar_position: 30
---

# 3. 使用 Servlet API

通常，在构建应用程序时，可以遵循 [HTTP 服务器的文档](../core/httpServer.html)。默认 HTTP 服务器的所有非 Netty 特定功能对于 Servlet 容器都应该相同（如果发现差异，请[报告问题](https://github.com/micronaut-projects/micronaut-servlet/issues)）。

Micronaut Servlet 中有几个额外的扩展，可以更容易地使用 Servlet API，这些扩展将在以下部分中详细介绍。

**注入 Servlet 请求和响应**

你可以直接接收 `HttpServlet` 请求和 `HttpServlet` 响应对象作为参数：

*使用 Request 和 Response*

```java
@Get("/hello")
void process(
        HttpServletRequest request, (1)
        HttpServletResponse response) (2)
        throws IOException {
    response.addHeader(HttpHeaders.CONTENT_TYPE, MediaType.TEXT_PLAIN);
    response.setStatus(HttpStatus.ACCEPTED.getCode());
    try (final PrintWriter writer = response.getWriter()) {
        writer.append("Hello ").append(request.getParameter("name"));
        writer.flush();
    }
}
```

1. request 对象
2. response 对象

**具有可读和可写功能的简化 I/O 代码**

使用 Micronaut 的 `Readable` 和 `Writable` 接口，可以简化对响应的写入和对请求的读取：

*使用 Readable 和 Writable *

```java
import io.micronaut.core.io.Readable;
import io.micronaut.core.io.Writable;

@Post(value = "/writable", processes = "text/plain")
Writable readAndWrite(@Body Readable readable) throws IOException {
    return out -> {
        try (BufferedReader reader = new BufferedReader(readable.asReader())) {
            out.append("Hello ").append(reader.readLine());
        }
    };
}
```

**使用 @Part 支持 Multipart**

通过使用注解 `io.micronaut.http.annotation.Part` 注入零件的功能，Multipart 支持得到了改进。例如：

*使用 @Part*

```java
@Post(value = "/multipart", consumes = MediaType.MULTIPART_FORM_DATA, produces = "text/plain")
String multipart(
        String attribute, (1)
        @Part("one") Person person, (2)
        @Part("two") String text, (3)
        @Part("three") byte[] bytes, (4)
        @Part("four") javax.servlet.http.Part raw, (5)
        @Part("five") CompletedPart part) { (6)
    return "Ok";
}
```

1. 你可以接收仅具有与属性名称匹配的参数名称的属性
2. 具有 `application/json` 内容类型的部件可以绑定到 POJO
3. 你可以将 part 读取为文本
4. 你可以将 part 读取为 `byte[]`
5. 你可以接收 raw `javax.servlet.http.Part`
6. 你可以接收 Micronaut 的 `CompletedPart` 接口，该接口也可与 Netty 配合使用

> [英文链接](https://micronaut-projects.github.io/micronaut-servlet/3.3.5/guide/index.html#servletApi)

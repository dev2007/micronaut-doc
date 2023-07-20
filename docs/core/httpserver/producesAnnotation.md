---
sidebar_position: 110
---

# 6.11 响应 Content-Type

默认情况下，Micronaut 控制器操作会生成 `application/json`。但是，你可以使用 `@Produces` 注解或 HTTP 方法注解的 `produces` 成员更改响应的内容类型。

import Tabs from '@theme/Tabs';
import TabItem from '@theme/TabItem';

<Tabs>
  <TabItem value="Java" label="Java" default>

```java
import io.micronaut.context.annotation.Requires;
import io.micronaut.http.HttpResponse;
import io.micronaut.http.MediaType;
import io.micronaut.http.annotation.Controller;
import io.micronaut.http.annotation.Get;
import io.micronaut.http.annotation.Produces;

@Controller("/produces")
public class ProducesController {

    @Get // (1)
    public HttpResponse index() {
        return HttpResponse.ok().body("{\"msg\":\"This is JSON\"}");
    }

    @Produces(MediaType.TEXT_HTML)
    @Get("/html") // (2)
    public String html() {
        return "<html><title><h1>HTML</h1></title><body></body></html>";
    }

    @Get(value = "/xml", produces = MediaType.TEXT_XML) // (3)
    public String xml() {
        return "<html><title><h1>XML</h1></title><body></body></html>";
    }
}
```

  </TabItem>
  <TabItem value="Groovy" label="Groovy">

```groovy
import io.micronaut.context.annotation.Requires
import io.micronaut.http.HttpResponse
import io.micronaut.http.MediaType
import io.micronaut.http.annotation.Controller
import io.micronaut.http.annotation.Get
import io.micronaut.http.annotation.Produces

@Controller("/produces")
class ProducesController {

    @Get // (1)
    HttpResponse index() {
        HttpResponse.ok().body('{"msg":"This is JSON"}')
    }

    @Produces(MediaType.TEXT_HTML) // (2)
    @Get("/html")
    String html() {
        "<html><title><h1>HTML</h1></title><body></body></html>"
    }

    @Get(value = "/xml", produces = MediaType.TEXT_XML) // (3)
    String xml() {
        "<html><title><h1>XML</h1></title><body></body></html>"
    }
}
```

  </TabItem>
  <TabItem value="Kotlin" label="Kotlin">

```kt
import io.micronaut.context.annotation.Requires
import io.micronaut.http.HttpResponse
import io.micronaut.http.MediaType
import io.micronaut.http.annotation.Controller
import io.micronaut.http.annotation.Get
import io.micronaut.http.annotation.Produces

@Controller("/produces")
class ProducesController {

    @Get // (1)
    fun index(): HttpResponse<*> {
        return HttpResponse.ok<Any>().body("{\"msg\":\"This is JSON\"}")
    }

    @Produces(MediaType.TEXT_HTML)
    @Get("/html") // (2)
    fun html(): String {
        return "<html><title><h1>HTML</h1></title><body></body></html>"
    }

    @Get(value = "/xml", produces = [MediaType.TEXT_XML]) // (3)
    fun xml(): String {
        return "<html><title><h1>XML</h1></title><body></body></html>"
    }
}
```

  </TabItem>
</Tabs>

1. 默认内容类型为 JSON
2. 用 `@Produces` 注解控制器操作以更改响应内容类型。
3. 设置方法注释的 `produces` 成员也会更改内容类型。

> [英文链接](https://docs.micronaut.io/3.9.4/guide/index.html#producesAnnotation)

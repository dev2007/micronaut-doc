---
sidebar_position: 120
---

# 6.12 接受的请求 Content-Type

默认情况下，Micronaut 控制器操作使用 `application/json`。`@Consumes` 注解或任何 HTTP 方法注解的 `consumes` 成员都支持使用其他内容类型。

import Tabs from '@theme/Tabs';
import TabItem from '@theme/TabItem';

<Tabs>
  <TabItem value="Java" label="Java" default>

```java
import io.micronaut.context.annotation.Requires;
import io.micronaut.http.HttpResponse;
import io.micronaut.http.MediaType;
import io.micronaut.http.annotation.Consumes;
import io.micronaut.http.annotation.Controller;
import io.micronaut.http.annotation.Post;

@Controller("/consumes")
public class ConsumesController {

    @Post // (1)
    public HttpResponse index() {
        return HttpResponse.ok();
    }

    @Consumes({MediaType.APPLICATION_FORM_URLENCODED, MediaType.APPLICATION_JSON}) // (2)
    @Post("/multiple")
    public HttpResponse multipleConsumes() {
        return HttpResponse.ok();
    }

    @Post(value = "/member", consumes = MediaType.TEXT_PLAIN) // (3)
    public HttpResponse consumesMember() {
        return HttpResponse.ok();
    }
}
```

  </TabItem>
  <TabItem value="Groovy" label="Groovy">

```groovy
import io.micronaut.context.annotation.Requires
import io.micronaut.http.HttpResponse
import io.micronaut.http.MediaType
import io.micronaut.http.annotation.Consumes
import io.micronaut.http.annotation.Controller
import io.micronaut.http.annotation.Post

@Controller("/consumes")
class ConsumesController {

    @Post // (1)
    HttpResponse index() {
        HttpResponse.ok()
    }

    @Consumes([MediaType.APPLICATION_FORM_URLENCODED, MediaType.APPLICATION_JSON]) // (2)
    @Post("/multiple")
    HttpResponse multipleConsumes() {
        HttpResponse.ok()
    }

    @Post(value = "/member", consumes = MediaType.TEXT_PLAIN) // (3)
    HttpResponse consumesMember() {
        HttpResponse.ok()
    }
}
```

  </TabItem>
  <TabItem value="Kotlin" label="Kotlin">

```kt
import io.micronaut.context.annotation.Requires
import io.micronaut.http.HttpResponse
import io.micronaut.http.MediaType
import io.micronaut.http.annotation.Consumes
import io.micronaut.http.annotation.Controller
import io.micronaut.http.annotation.Post

@Controller("/consumes")
class ConsumesController {

    @Post // (1)
    fun index(): HttpResponse<*> {
        return HttpResponse.ok<Any>()
    }

    @Consumes(MediaType.APPLICATION_FORM_URLENCODED, MediaType.APPLICATION_JSON) // (2)
    @Post("/multiple")
    fun multipleConsumes(): HttpResponse<*> {
        return HttpResponse.ok<Any>()
    }

    @Post(value = "/member", consumes = [MediaType.TEXT_PLAIN]) // (3)
    fun consumesMember(): HttpResponse<*> {
        return HttpResponse.ok<Any>()
    }
}
```

  </TabItem>
</Tabs>

1. 默认情况下，控制器操作使用 `application/json` 类型的 `Content-Type` 请求。
2. `@Consumes` 注解为传入请求获取支持的媒体类型的 `String[]`。
3. 还可以使用方法注解的 `consumers` 成员来指定内容类型。

**自定义已处理的内容类型**

通常，只有当内容类型为 `application/json` 时，才会进行 JSON 解析。其他 [MediaTypeCodec](https://micronaut-projects.github.io/micronaut-docs-mn3/3.9.4/api/io/micronaut/http/codec/MediaTypeCodec.html) 类的行为类似，因为它们具有可以处理的预定义内容类型。要扩展给定编解码器处理的媒体类型列表，请提供将存储在 [CodecConfiguration](https://micronaut-projects.github.io/micronaut-docs-mn3/3.9.4/api/io/micronaut/http/codec/CodecConfiguration.html) 中的配置：

```yaml
micronaut:
  codec:
    json:
      additionalTypes:
        - text/javascript
        - ...
```

> [英文链接](https://docs.micronaut.io/3.9.4/guide/index.html#consumesAnnotation)

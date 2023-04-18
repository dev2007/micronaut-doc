---
sidebar_position: 100
---

# 6.10 响应状态

默认情况下，Micronau t控制器操作会以 200 HTTP 状态代码进行响应。

如果操作返回 `HttpResponse`，请使用 `status` 方法配置响应的状态代码。

import Tabs from '@theme/Tabs';
import TabItem from '@theme/TabItem';

<Tabs>
  <TabItem value="Java" label="Java" default>

```java
@Get(value = "/http-response", produces = MediaType.TEXT_PLAIN)
public HttpResponse httpResponse() {
    return HttpResponse.status(HttpStatus.CREATED).body("success");
}
```

  </TabItem>
  <TabItem value="Groovy" label="Groovy">

```groovy
@Get(value = "/http-response", produces = MediaType.TEXT_PLAIN)
HttpResponse httpResponse() {
    HttpResponse.status(HttpStatus.CREATED).body("success")
}
```

  </TabItem>
  <TabItem value="Kotlin" label="Kotlin">

```kt
@Get(value = "/http-response", produces = [MediaType.TEXT_PLAIN])
fun httpResponse(): HttpResponse<String> {
    return HttpResponse.status<String>(HttpStatus.CREATED).body("success")
}
```

  </TabItem>
</Tabs>

你也可以使用 `@Status` 注解。

<Tabs>
  <TabItem value="Java" label="Java" default>

```java
@Status(HttpStatus.CREATED)
@Get(produces = MediaType.TEXT_PLAIN)
public String index() {
    return "success";
}
```

  </TabItem>
  <TabItem value="Groovy" label="Groovy">

```groovy
@Status(HttpStatus.CREATED)
@Get(produces = MediaType.TEXT_PLAIN)
String index() {
    "success"
}
```

  </TabItem>
  <TabItem value="Kotlin" label="Kotlin">

```kt
@Status(HttpStatus.CREATED)
@Get(produces = [MediaType.TEXT_PLAIN])
fun index(): String {
    return "success"
}
```

  </TabItem>
</Tabs>

甚至用 `HttpStatus` 进行响应

<Tabs>
  <TabItem value="Java" label="Java" default>

```java
@Get("/http-status")
public HttpStatus httpStatus() {
    return HttpStatus.CREATED;
}
```

  </TabItem>
  <TabItem value="Groovy" label="Groovy">

```groovy
@Get("/http-status")
HttpStatus httpStatus() {
    HttpStatus.CREATED
}
```

  </TabItem>
  <TabItem value="Kotlin" label="Kotlin">

```kt
@Get("/http-status")
fun httpStatus(): HttpStatus {
    return HttpStatus.CREATED
}
```

  </TabItem>
</Tabs>

> [英文链接](https://docs.micronaut.io/3.8.4/guide/index.html#statusAnnotation)

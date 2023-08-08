---
sidebar_position: 10
---

# 15.1 创建端点

除[内置端点](/core/management/providedEndpoints.html)外，`management` 依赖还支持创建自定义端点。这些端点可以像内置端点一样启用和配置，并可用于检索和返回任何指标或其他应用数据。

## 15.1.1 端点注解

使用 [Endpoint](https://micronaut-projects.github.io/micronaut-docs-mn3/3.9.4/api/io/micronaut/management/endpoint/annotation/Endpoint.html) 注解一个类，并提供（至少）一个端点 id，就可以创建一个端点。

*FooEndpoint.java*

```java
@Endpoint("foo")
class FooEndpoint {
    ...
}
```

如果为注解提供了一个字符串参数，它将被用作端点 ID。

也可以为注解提供附加（命名）参数。下表描述了 `@Endpoint` 的其他可能参数：

*表 1.端点参数*

|参数|描述|端点示例|
|--|--|--|
|`String id`|端点 id（或名字）|`@Endpoint(id = "foo")`|
|`String prefix`|配置端点时使用的前缀（参阅[端点配置](/#1514-端点配置)）。|`@Endpoint(prefix = "foo")`|
|`boolean defaultEnabled`|设置未设置配置时是否启用端点（参阅[端点配置](/#1514-端点配置)）。|`@Endpoint(defaultEnabled = false)`|
|`boolean defaultSensitive`|如果未设置配置，则设置端点是否敏感（请参阅端点配置）。|`@Endpoint(defaultSensitive = false)`|

### 自定义端点示例

下面的 Endpoint 类示例创建了一个可在 `/date` 访问的端点：

*CurrentDateEndpoint*

import Tabs from '@theme/Tabs';
import TabItem from '@theme/TabItem';

<Tabs>
  <TabItem value="Java" label="Java" default>

```java
import io.micronaut.management.endpoint.annotation.Endpoint;

@Endpoint(id = "date",
          prefix = "custom",
          defaultEnabled = true,
          defaultSensitive = false)
public class CurrentDateEndpoint {

//.. endpoint methods

}
```

  </TabItem>
  <TabItem value="Groovy" label="Groovy">

```groovy
import io.micronaut.management.endpoint.annotation.Endpoint;

@Endpoint(id = "date",
          prefix = "custom",
          defaultEnabled = true,
          defaultSensitive = false)
public class CurrentDateEndpoint {

//.. endpoint methods

}
```

  </TabItem>
  <TabItem value="Kotlin" label="Kotlin">

```kt
import io.micronaut.management.endpoint.annotation.Endpoint

@Endpoint(id = "date",
          prefix = "custom",
          defaultEnabled = true,
          defaultSensitive = false)
class CurrentDateEndpoint {

//.. endpoint methods

}
```

  </TabItem>
</Tabs>

## 15.1.2 端点方法

端点响应 `GET`（"read"）、`POST`（"write"）和 `DELETE`（"delete"）请求。要从端点返回响应，请使用以下注解之一注解其公共方法：

*表 1.端点方法注解*

|注解|描述|
|--|--|
|[Read](https://micronaut-projects.github.io/micronaut-docs-mn3/3.9.4/api/io/micronaut/management/endpoint/annotation/Read.html)|响应为 `GET` 请求|
|[Write](https://micronaut-projects.github.io/micronaut-docs-mn3/3.9.4/api/io/micronaut/management/endpoint/annotation/Write.html)|响应为 `POST` 请求|
|[Delete](https://micronaut-projects.github.io/micronaut-docs-mn3/3.9.4/api/io/micronaut/management/endpoint/annotation/Delete.html)|响应为 `DELETE` 请求|

### Read 方法

使用读取注解对方法进行注解，可使其响应 GET 请求。

*CurrentDateEndpoint*

<Tabs>
  <TabItem value="Java" label="Java" default>

```java
import io.micronaut.management.endpoint.annotation.Endpoint;

import io.micronaut.management.endpoint.annotation.Read;

@Endpoint(id = "date",
          prefix = "custom",
          defaultEnabled = true,
          defaultSensitive = false)
public class CurrentDateEndpoint {

private Date currentDate;

@Read
public Date currentDate() {
    return currentDate;
}

}
```

  </TabItem>
  <TabItem value="Groovy" label="Groovy">

```groovy
import io.micronaut.management.endpoint.annotation.Endpoint;

import io.micronaut.management.endpoint.annotation.Read;

@Endpoint(id = "date",
          prefix = "custom",
          defaultEnabled = true,
          defaultSensitive = false)
public class CurrentDateEndpoint {

private Date currentDate;

@Read
public Date currentDate() {
    return currentDate;
}

}
```

  </TabItem>
  <TabItem value="Kotlin" label="Kotlin">

```kt
import io.micronaut.management.endpoint.annotation.Endpoint

import io.micronaut.management.endpoint.annotation.Read

@Endpoint(id = "date",
          prefix = "custom",
          defaultEnabled = true,
          defaultSensitive = false)
class CurrentDateEndpoint {

private Date currentDate

@Read
Date currentDate() {
    currentDate
}

}
```

  </TabItem>
</Tabs>

上述方法会响应以下请求：

```bash
$ curl -X GET localhost:55838/date

1526085903689
```

Read 注解接受一个可选的 produces 参数，用于设置从该方法返回的媒体类型（默认为 application/json）：

*CurrentDateEndpoint*

<Tabs>
  <TabItem value="Java" label="Java" default>

```java
import io.micronaut.management.endpoint.annotation.Endpoint;

import io.micronaut.management.endpoint.annotation.Read;

import io.micronaut.http.MediaType;
import io.micronaut.management.endpoint.annotation.Selector;

@Endpoint(id = "date",
          prefix = "custom",
          defaultEnabled = true,
          defaultSensitive = false)
public class CurrentDateEndpoint {

private Date currentDate;

@Read(produces = MediaType.TEXT_PLAIN) //(1)
public String currentDatePrefix(@Selector String prefix) {
    return prefix + ": " + currentDate;
}

}
```

  </TabItem>
  <TabItem value="Groovy" label="Groovy">

```groovy
import io.micronaut.management.endpoint.annotation.Endpoint

import io.micronaut.management.endpoint.annotation.Read

import io.micronaut.http.MediaType
import io.micronaut.management.endpoint.annotation.Selector

@Endpoint(id = "date",
          prefix = "custom",
          defaultEnabled = true,
          defaultSensitive = false)
class CurrentDateEndpoint {

private Date currentDate

@Read(produces = MediaType.TEXT_PLAIN) //(1)
String currentDatePrefix(@Selector String prefix) {
    "$prefix: $currentDate"
}

}
```

  </TabItem>
  <TabItem value="Kotlin" label="Kotlin">

```kt
import io.micronaut.management.endpoint.annotation.Endpoint

import io.micronaut.management.endpoint.annotation.Read

import io.micronaut.http.MediaType
import io.micronaut.management.endpoint.annotation.Selector

@Endpoint(id = "date", prefix = "custom", defaultEnabled = true, defaultSensitive = false)
class CurrentDateEndpoint {

private var currentDate: Date? = null

@Read(produces = [MediaType.TEXT_PLAIN]) //(1)
fun currentDatePrefix(@Selector prefix: String): String {
    return "$prefix: $currentDate"
}

}
```

  </TabItem>
</Tabs>

1. 支持的媒体类型由 [MediaType](https://micronaut-projects.github.io/micronaut-docs-mn3/3.9.4/api/io/micronaut/http/MediaType.html) 表示

上述方法会响应以下请求：

```bash
$ curl -X GET localhost:8080/date/the_date_is

the_date_is: Fri May 11 19:24:21 CDT
```

---

### Write 方法

使用 Write 注解对方法进行注解后，该方法就会响应 POST 请求。

*CurrentDateEndpoint*

<Tabs>
  <TabItem value="Java" label="Java" default>

```java
import io.micronaut.management.endpoint.annotation.Endpoint;

import io.micronaut.management.endpoint.annotation.Write;

import io.micronaut.http.MediaType;
import io.micronaut.management.endpoint.annotation.Selector;

@Endpoint(id = "date",
          prefix = "custom",
          defaultEnabled = true,
          defaultSensitive = false)
public class CurrentDateEndpoint {

private Date currentDate;

@Write
public String reset() {
    currentDate = new Date();

    return "Current date reset";
}

}
```

  </TabItem>
  <TabItem value="Groovy" label="Groovy">

```groovy
import io.micronaut.management.endpoint.annotation.Endpoint

import io.micronaut.management.endpoint.annotation.Write

import io.micronaut.http.MediaType
import io.micronaut.management.endpoint.annotation.Selector

@Endpoint(id = "date",
          prefix = "custom",
          defaultEnabled = true,
          defaultSensitive = false)
class CurrentDateEndpoint {

private Date currentDate

@Write
String reset() {
    currentDate = new Date()

    return "Current date reset"
}

}
```

  </TabItem>
  <TabItem value="Kotlin" label="Kotlin">

```kt
import io.micronaut.management.endpoint.annotation.Endpoint

import io.micronaut.management.endpoint.annotation.Write

import io.micronaut.http.MediaType
import io.micronaut.management.endpoint.annotation.Selector

@Endpoint(id = "date", prefix = "custom", defaultEnabled = true, defaultSensitive = false)
class CurrentDateEndpoint {

private var currentDate: Date? = null

@Write
fun reset(): String {
    currentDate = Date()

    return "Current date reset"
}

}
```

  </TabItem>
</Tabs>

上述方法会响应以下请求：

```bash
$ curl -X POST http://localhost:39357/date

Current date reset
```

[Write](https://micronaut-projects.github.io/micronaut-docs-mn3/3.9.4/api/io/micronaut/management/endpoint/annotation/Write.html) 注解接受一个可选的 `consumes` 参数，用于设置方法接受的媒体类型（默认为 `application/json`）：

*MessageEndpoint*

<Tabs>
  <TabItem value="Java" label="Java" default>

```java
import io.micronaut.context.annotation.Requires;
import io.micronaut.management.endpoint.annotation.Endpoint;

import io.micronaut.management.endpoint.annotation.Write;

import io.micronaut.http.MediaType;

@Endpoint(id = "message", defaultSensitive = false)
public class MessageEndpoint {

String message;

@Write(consumes = MediaType.APPLICATION_FORM_URLENCODED, produces = MediaType.TEXT_PLAIN)
public String updateMessage(String newMessage) {
    this.message = newMessage;

    return "Message updated";
}

}
```

  </TabItem>
  <TabItem value="Groovy" label="Groovy">

```groovy
import io.micronaut.management.endpoint.annotation.Endpoint

import io.micronaut.management.endpoint.annotation.Write

import io.micronaut.http.MediaType

@Endpoint(id = "message", defaultSensitive = false)
class MessageEndpoint {

String message

@Write(consumes = MediaType.APPLICATION_FORM_URLENCODED, produces = MediaType.TEXT_PLAIN)
String updateMessage(String newMessage) {  //(1)
    message = newMessage

    return "Message updated"
}

}
```

  </TabItem>
  <TabItem value="Kotlin" label="Kotlin">

```kt
import io.micronaut.context.annotation.Requires
import io.micronaut.management.endpoint.annotation.Endpoint

import io.micronaut.management.endpoint.annotation.Write

import io.micronaut.http.MediaType

@Endpoint(id = "message", defaultSensitive = false)
class MessageEndpoint {

internal var message: String? = null

@Write(consumes = [MediaType.APPLICATION_FORM_URLENCODED], produces = [MediaType.TEXT_PLAIN])
fun updateMessage(newMessage: String): String {  //(1)
    this.message = newMessage

    return "Message updated"
}

}
```

  </TabItem>
</Tabs>

上述方法会响应以下请求：

```bash
$ curl -X POST http://localhost:65013/message -H 'Content-Type: application/x-www-form-urlencoded' -d $'newMessage=A new message'

Message updated
```

---

### Delete 方法

用 [Delete](https://micronaut-projects.github.io/micronaut-docs-mn3/3.9.4/api/io/micronaut/management/endpoint/annotation/Delete.html) 注解注解一个方法，会使其响应 `DELETE` 请求。

*MessageEndpoint*

<Tabs>
  <TabItem value="Java" label="Java" default>

```java
import io.micronaut.context.annotation.Requires;
import io.micronaut.management.endpoint.annotation.Endpoint;

import io.micronaut.management.endpoint.annotation.Delete;

@Endpoint(id = "message", defaultSensitive = false)
public class MessageEndpoint {

String message;

@Delete
public String deleteMessage() {
    this.message = null;

    return "Message deleted";
}

}
```

  </TabItem>
  <TabItem value="Groovy" label="Groovy">

```groovy
import io.micronaut.context.annotation.Requires;
import io.micronaut.management.endpoint.annotation.Endpoint;

import io.micronaut.management.endpoint.annotation.Delete;

@Endpoint(id = "message", defaultSensitive = false)
public class MessageEndpoint {

String message;

@Delete
public String deleteMessage() {
    this.message = null;

    return "Message deleted";
}

}
```

  </TabItem>
  <TabItem value="Kotlin" label="Kotlin">

```kt
import io.micronaut.management.endpoint.annotation.Endpoint

import io.micronaut.management.endpoint.annotation.Delete

@Endpoint(id = "message", defaultSensitive = false)
class MessageEndpoint {

String message

@Delete
String deleteMessage() {
    message = null

    return "Message deleted"
}

}
```

  </TabItem>
</Tabs>

上述方法会响应以下请求：

```bash
$ curl -X DELETE http://localhost:65013/message

Message deleted
```

## 15.1.3 端点敏感度

端点敏感度可通过端点注解和配置对整个端点进行控制。不过，单个方法的配置可以独立于整个端点。[@Sensitive](https://micronaut-projects.github.io/micronaut-docs-mn3/3.9.4/api/io/micronaut/management/endpoint/annotation/Sensitive.html) 注解可应用于方法，以控制其敏感性。

*AlertsEndpoint*

<Tabs>
  <TabItem value="Java" label="Java" default>

```java
import io.micronaut.http.MediaType;
import io.micronaut.management.endpoint.annotation.Delete;
import io.micronaut.management.endpoint.annotation.Endpoint;
import io.micronaut.management.endpoint.annotation.Read;
import io.micronaut.management.endpoint.annotation.Sensitive;
import io.micronaut.management.endpoint.annotation.Write;

import java.util.List;
import java.util.concurrent.CopyOnWriteArrayList;

@Endpoint(id = "alerts", defaultSensitive = false) // (1)
public class AlertsEndpoint {

    private final List<String> alerts = new CopyOnWriteArrayList<>();

    @Read
    List<String> getAlerts() {
        return alerts;
    }

    @Delete
    @Sensitive(true)  // (2)
    void clearAlerts() {
        alerts.clear();
    }

    @Write(consumes = MediaType.TEXT_PLAIN)
    @Sensitive(property = "add.sensitive", defaultValue = true) // (3)
    void addAlert(String alert) {
        alerts.add(alert);
    }
}
```

  </TabItem>
  <TabItem value="Groovy" label="Groovy">

```groovy
import io.micronaut.http.MediaType
import io.micronaut.management.endpoint.annotation.Delete
import io.micronaut.management.endpoint.annotation.Endpoint
import io.micronaut.management.endpoint.annotation.Read
import io.micronaut.management.endpoint.annotation.Sensitive
import io.micronaut.management.endpoint.annotation.Write

import java.util.concurrent.CopyOnWriteArrayList

@Endpoint(id = "alerts", defaultSensitive = false) // (1)
class AlertsEndpoint {

    private final List<String> alerts = new CopyOnWriteArrayList<>();

    @Read
    List<String> getAlerts() {
        alerts
    }

    @Delete
    @Sensitive(true) // (2)
    void clearAlerts() {
        alerts.clear()
    }

    @Write(consumes = MediaType.TEXT_PLAIN)
    @Sensitive(property = "add.sensitive", defaultValue = true) // (3)
    void addAlert(String alert) {
        alerts << alert
    }
}
```

  </TabItem>
  <TabItem value="Kotlin" label="Kotlin">

```kt
import io.micronaut.http.MediaType
import io.micronaut.management.endpoint.annotation.Delete
import io.micronaut.management.endpoint.annotation.Endpoint
import io.micronaut.management.endpoint.annotation.Read
import io.micronaut.management.endpoint.annotation.Sensitive
import io.micronaut.management.endpoint.annotation.Write
import java.util.concurrent.CopyOnWriteArrayList

@Endpoint(id = "alerts", defaultSensitive = false) // (1)
class AlertsEndpoint {

    private val alerts: MutableList<String> = CopyOnWriteArrayList()

    @Read
    fun getAlerts(): List<String> {
        return alerts
    }

    @Delete
    @Sensitive(true)  // (2)
    fun clearAlerts() {
        alerts.clear()
    }

    @Write(consumes = [MediaType.TEXT_PLAIN])
    @Sensitive(property = "add.sensitive", defaultValue = true)  // (3)
    fun addAlert(alert: String) {
        alerts.add(alert)
    }
}
```

  </TabItem>
</Tabs>

1. 默认情况下，端点不敏感，并使用默认的 `endpoints` 前缀。
2. 该方法始终敏感，与其他因素无关
3. 将 `property` 值附加到前缀和 id 上，以查找配置值

如果设置了配置关键字 `endpoints.alerts.add.sensitive`，该值将决定 `addAlert` 方法的敏感度。

1. `endpoint` 是第一个标记，因为它是 endpoint 注解中 `prefix` 的默认值，在本例中没有明确设置。
2. `alerts` 是下一个标记，因为它是端点 id； 3.
3. `add.sensitive` 是下一个标记，因为这是设置给 [@Sensitive](https://micronaut-projects.github.io/micronaut-docs-mn3/3.9.4/api/io/micronaut/management/endpoint/annotation/Sensitive.html) 注解的 `property` 成员的值。

如果未设置配置键，则使用 `defaultValue`（默认为 `true`）。

## 15.1.4 端点配置

带有 `endpoints` 前缀的端点可通过其默认端点 id 进行配置。如果存在 id 为 `foo` 的端点，则可通过 `endpoints.foo` 进行配置。此外，还可以通过 `all` 前缀提供默认值。

例如，考虑以下端点。

*FooEndpoint.java*

```java
@Endpoint("foo")
class FooEndpoint {
    ...
}
```

默认情况下，端点已启用。要禁用端点，请将 `endpoints.foo.enabled` 设置为 `false`。如果未设置 `endpoints.foo.enabled`，且 `endpoints.all.enabled` 为 `false`，端点将被禁用。

该端点的配置值优先于所有端点的配置值。如果 `endpoints.foo.enabled` 为 `true`，而 `endpoints.all.enabled` 为 `false`，端点将被启用。

对于所有端点，可以设置以下配置值。

<Tabs>
  <TabItem value="Properties" label="Properties">

```properties
endpoints.<any endpoint id>.enabled=Boolean
endpoints.<any endpoint id>.sensitive=Boolean
```

  </TabItem>
  <TabItem value="Yaml" label="Yaml">

```yaml
endpoints:
  <any endpoint id>:
    enabled: Boolean
    sensitive: Boolean
```

  </TabItem>
    <TabItem value="Toml" label="Toml">

```toml
[endpoints]
  sensitive="Boolean"
```

  </TabItem>
    <TabItem value="Groovy" label="Groovy">

```groovy
endpoints {
  <any endpoint id> {
    enabled = "Boolean"
    sensitive = "Boolean"
  }
}
```

  </TabItem>
    <TabItem value="Hoon" label="Hoon">

```hocon
{
  endpoints {
    <any endpoint id> {
      enabled = "Boolean"
      sensitive = "Boolean"
    }
  }
}
```

  </TabItem>
    <TabItem value="JSON" label="JSON">

```json
{
  "endpoints": {
    "<any endpoint id>": {
      "enabled": "Boolean",
      "sensitive": "Boolean"
    }
  }
}
```

  </TabItem>
</Tabs>

:::tip 注意
默认情况下，所有端点的基本路径都是 `/`。如果希望端点在不同的基本路径下可用，请配置 `endpoints.all.path`。例如，如果值设置为 `/endpoints/`，那么相对于上下文路径，`foo` 端点将可在 `/endpoints/foo` 下访问。需要注意的是，`endpoints.all.path` 的前面和后面的 `/` 都是必需的，除非设置了 `micronaut.server.context-path`，在这种情况下，前面的 `/` 就不是必需的了。
:::

> [英文链接](https://micronaut-projects.github.io/micronaut-docs-mn3/3.9.4/guide/index.html#buildingEndpoints)

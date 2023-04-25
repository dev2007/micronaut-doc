---
sidebar_position: 140
---

# 6.14 使用 Jackson 的 JSON 绑定

目前最常见的数据交换格式是 JSON。

事实上，[Controller](https://docs.micronaut.io/3.8.4/api/io/micronaut/http/annotation/Controller.html) 注解中的默认值指定 Micronaut 中的控制器默认处理和响应 JSON。

为了以非阻塞的方式实现这一点，Micronaut 基于 [Jackson](https://github.com/FasterXML/jackson) 异步 JSON 解析 API 和 Netty 的基础上构建，从而以非阻塞方式读取传入的 JSON。

## 通过响应式框架绑定

然而，从开发人员的角度来看，你通常只能使用普通的旧 Java 对象（Plain Old Java Objects，POJO），并且可以选择使用 [RxJava](https://github.com/ReactiveX/RxJava) 或 [Project Reactor](https://projectreactor.io/) 等响应式框架。以下是一个控制器的示例，该控制器以非阻塞的方式从 JSON 读取并保存传入的 POJO：

*使用响应式流读取 POJO*

import Tabs from '@theme/Tabs';
import TabItem from '@theme/TabItem';

<Tabs>
  <TabItem value="Java" label="Java" default>

```java
@Controller("/people")
public class PersonController {

    Map<String, Person> inMemoryDatastore = new ConcurrentHashMap<>();

@Post("/saveReactive")
@SingleResult
public Publisher<HttpResponse<Person>> save(@Body Publisher<Person> person) { // (1)
    return Mono.from(person).map(p -> {
                inMemoryDatastore.put(p.getFirstName(), p); // (2)
                return HttpResponse.created(p); // (3)
            }
    );
}

}
```

  </TabItem>
  <TabItem value="Groovy" label="Groovy">

```groovy
@Controller("/people")
class PersonController {

    Map<String, Person> inMemoryDatastore = new ConcurrentHashMap<>()

@Post("/saveReactive")
@SingleResult
Publisher<HttpResponse<Person>> save(@Body Publisher<Person> person) { // (1)
    Mono.from(person).map({ p ->
        inMemoryDatastore.put(p.getFirstName(), p) // (2)
        HttpResponse.created(p) // (3)
    })
}

}
```

  </TabItem>
  <TabItem value="Kotlin" label="Kotlin">

```kt
@Controller("/people")
class PersonController {

    internal var inMemoryDatastore: MutableMap<String, Person> = ConcurrentHashMap()

@Post("/saveReactive")
@SingleResult
fun save(@Body person: Publisher<Person>): Publisher<HttpResponse<Person>> { // (1)
    return Mono.from(person).map { p ->
        inMemoryDatastore[p.firstName] = p // (2)
        HttpResponse.created(p) // (3)
    }
}

}
```

  </TabItem>
</Tabs>

1. 该方法接收一个发布器，该发布器在读取 JSON 后发出 POJO
2. `map` 方法将实例存储在 `Map` 中
3. 返回 [HttpResponse](https://docs.micronaut.io/3.8.4/api/io/micronaut/http/HttpResponse.html)

使用命令行中的 cURL，可以将 JSON POST 到 `/people` URI:

*使用 cURL 发送 JSON*

```bash
$ curl -X POST localhost:8080/people -d '{"firstName":"Fred","lastName":"Flintstone","age":45}'
```

## 使用 CompletableFuture 绑定

也可以使用CompletableFuture API编写与上一示例相同的方法：

*使用 CompletableFuture 读取 JSON*

<Tabs>
  <TabItem value="Java" label="Java" default>

```java
@Controller("/people")
public class PersonController {

    Map<String, Person> inMemoryDatastore = new ConcurrentHashMap<>();

@Post("/saveFuture")
public CompletableFuture<HttpResponse<Person>> save(@Body CompletableFuture<Person> person) {
    return person.thenApply(p -> {
                inMemoryDatastore.put(p.getFirstName(), p);
                return HttpResponse.created(p);
            }
    );
}

}
```

  </TabItem>
  <TabItem value="Groovy" label="Groovy">

```groovy
@Controller("/people")
class PersonController {

    Map<String, Person> inMemoryDatastore = new ConcurrentHashMap<>()

@Post("/saveFuture")
CompletableFuture<HttpResponse<Person>> save(@Body CompletableFuture<Person> person) {
    person.thenApply({ p ->
        inMemoryDatastore.put(p.getFirstName(), p)
        HttpResponse.created(p)
    })
}

}
```

  </TabItem>
  <TabItem value="Kotlin" label="Kotlin">

```kt
@Controller("/people")
class PersonController {

    internal var inMemoryDatastore: MutableMap<String, Person> = ConcurrentHashMap()

@Post("/saveFuture")
fun save(@Body person: CompletableFuture<Person>): CompletableFuture<HttpResponse<Person>> {
    return person.thenApply { p ->
        inMemoryDatastore[p.firstName] = p
        HttpResponse.created(p)
    }
}

}
```

  </TabItem>
</Tabs>

上面的例子使用 `thenApply` 方法来实现与前面的例子相同的效果。

---

## 使用 POJO 绑定

然而，你可以同样简单的这样写：

*绑定 JSON POJO*

<Tabs>
  <TabItem value="Java" label="Java" default>

```java
@Controller("/people")
public class PersonController {

    Map<String, Person> inMemoryDatastore = new ConcurrentHashMap<>();

@Post
public HttpResponse<Person> save(@Body Person person) {
    inMemoryDatastore.put(person.getFirstName(), person);
    return HttpResponse.created(person);
}

}
```

  </TabItem>
  <TabItem value="Groovy" label="Groovy">

```groovy
@Controller("/people")
class PersonController {

    Map<String, Person> inMemoryDatastore = new ConcurrentHashMap<>()

@Post
HttpResponse<Person> save(@Body Person person) {
    inMemoryDatastore.put(person.getFirstName(), person)
    HttpResponse.created(person)
}

}
```

  </TabItem>
  <TabItem value="Kotlin" label="Kotlin">

```kt
@Controller("/people")
class PersonController {

    internal var inMemoryDatastore: MutableMap<String, Person> = ConcurrentHashMap()

@Post
fun save(@Body person: Person): HttpResponse<Person> {
    inMemoryDatastore[person.firstName] = person
    return HttpResponse.created(person)
}

}
```

  </TabItem>
</Tabs>

Micronaut 只在以非阻塞方式读取数据后才执行你的方法。

:::note 注意
Jackson 产生的输出可以通过多种方式进行定制，从定义 Jackson 模块到使用 [Jackson 注解](https://github.com/FasterXML/jackson-annotations/wiki/Jackson-Annotations)
:::

---

## Jackson 配置

Jackson ObjectMapper 可以通过使用 [JacksonConfiguration](https://docs.micronaut.io/3.8.4/api/io/micronaut/jackson/JacksonConfiguration.html) 类进行配置来进行配置。

所有 Jackson 配置键都以 `jackson` 开头。

||||
|--|--|--|
|`dateFormat`|String|日期格式|
|`locale`|String|使用 [Locale.forLanguageTag](https://docs.oracle.com/javase/8/docs/api/java/util/Locale.html#forLanguageTag-java.lang.String-)。示例：`en-US`|
|`timeZone`|String|使用 [TimeZone.getTimeZone](https://docs.oracle.com/javase/8/docs/api/java/util/TimeZone.html#getTimeZone-java.lang.String-)。示例：`PST`|
|`serializationInclusion`|String|一种 [JsonInclude.Include](https://fasterxml.github.io/jackson-annotations/javadoc/2.9/com/fasterxml/jackson/annotation/JsonInclude.Include.html)。示例：`ALWAYS`|
|`propertyNamingStrategy`|String|[PropertyNamingStrategy](https://fasterxml.github.io/jackson-databind/javadoc/2.9/com/fasterxml/jackson/databind/PropertyNamingStrategy.html) 实体名字。示例：`SNAKE_CASE`|
|`defaultTyping`|String|枚举 [defaultTypeingObjectMapper.DefaultTyping](https://fasterxml.github.io/jackson-databind/javadoc/2.9/com/fasterxml/jackson/databind/ObjectMapper.DefaultTyping.html) 中多态类型处理的全局。示例：`NON_FINAL`|

示例：

```yaml
jackson:
  serializationInclusion: ALWAYS
```

**特性**

所有功能都可以使用其名称作为键和布尔值进行配置，以指示启用或禁用。

||||
|--|--|--|
|serialization|Map|[SerializationFeature](https://fasterxml.github.io/jackson-databind/javadoc/2.9/com/fasterxml/jackson/databind/SerializationFeature.html)|
|deserialization|Map|[DeserializationFeature](https://fasterxml.github.io/jackson-databind/javadoc/2.9/com/fasterxml/jackson/databind/DeserializationFeature.html)|
|mapper|Map|[MapperFeature](https://fasterxml.github.io/jackson-databind/javadoc/2.9/com/fasterxml/jackson/databind/MapperFeature.html)|
|parser|Map|[JsonParser.Feature](https://fasterxml.github.io/jackson-core/javadoc/2.9/com/fasterxml/jackson/core/JsonParser.Feature.html)|
|generator|Map|[JsonGenerator.Feature](https://fasterxml.github.io/jackson-core/javadoc/2.9/com/fasterxml/jackson/core/JsonGenerator.Feature.html)|
|factory|Map|[JsonFactory.Feature](https://fasterxml.github.io/jackson-core/javadoc/2.9/com/fasterxml/jackson/core/JsonFactory.Feature.html)|

示例：

```yaml
jackson:
  serialization:
    indentOutput: true
    writeDatesAsTimestamps: false
  deserialization:
    useBigIntegerForInts: true
    failOnUnknownProperties: false
```

**进一步自定义 JsonFactory**

在某些情况下，你可能希望在功能配置之外自定义 ObjectMapper 使用的 `JsonFactory`（例如，允许自定义字符转义）。这可以通过提供自己的 `JsonFactory` bean 来实现，也可以通过提供 `BeanCreatedEventListener<JsonFactory>` 来在启动时配置默认 bean。

**支持 @JsonView**

如果在 `application.yml` 中将 `jackson.json-view.enabled` 设置为 `true`，则可以在控制器方法上使用 `@JsonView` 注解。

Jackson 的 `@JsonView` 注解允许你根据响应控制公开哪些属性。有关更多信息，参阅 [Jackson JSON 视图](https://www.baeldung.com/jackson-json-view-annotation)。

**Bean**

除了配置之外，还可以注册 bean 来定制 Jackson。扩展以下任何类的所有 bean 都会向对象映射器注册：

- [Module](https://fasterxml.github.io/jackson-databind/javadoc/2.9/com/fasterxml/jackson/databind/Module.html)

- [JsonDeserializer](https://fasterxml.github.io/jackson-databind/javadoc/2.9/com/fasterxml/jackson/databind/JsonDeserializer.html)

- [JsonSerializer](https://fasterxml.github.io/jackson-databind/javadoc/2.9/com/fasterxml/jackson/databind/JsonSerializer.html)

- [KeyDeserializer](https://fasterxml.github.io/jackson-databind/javadoc/2.9/com/fasterxml/jackson/databind/KeyDeserializer.html)

- [BeanDeserializerModifier](https://fasterxml.github.io/jackson-databind/javadoc/2.9/com/fasterxml/jackson/databind/deser/BeanDeserializerModifier.html)

- [BeanSerializerModifier](https://fasterxml.github.io/jackson-databind/javadoc/2.9/com/fasterxml/jackson/databind/ser/BeanSerializerModifier.html)

**服务加载器**

通过服务加载器注册的任何模块也会添加到默认的对象映射器中。

**数字精度**

在 JSON 解析过程中，框架可以将任何传入的数据转换为中间对象模型。默认情况下，此模型使用 `BigInteger`、`long` 和 `double` 作为数值。这意味着一些可以用 `BigDecimal` 表示的信息可能会丢失。例如，即使反序列化的目标类型使用 `BigDecimal`，也可能会截断具有许多无法用双精度表示的小数位数的数字。关于尾零的元数据（`BigDecimal.precision()`），例如 `0.12` 和 `0.120` 之间的差，也会被丢弃。

如果你需要完全准确的数字类型，请使用以下配置：

```yaml
jackson:
  deserialization:
    useBigIntegerForInts: true
    useBigDecimalForFloats: true
```

> [英文链接](https://docs.micronaut.io/3.8.4/guide/index.html#jsonBinding)

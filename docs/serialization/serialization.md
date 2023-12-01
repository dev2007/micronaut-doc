---
description: Micronaut 序列化
keywords: [micronaut,micronaut 文档,micronaut 中文文档,文档,Micronaut 序列化,序列化,反序列化,serialization,deserialization,json,jackson,fastjson]
---

# Micronaut 序列化

使用构建时信息在 Micronaut 应用程序中实现序列化/反序列化。

## 1. 简介

Micronaut Serialization 是一个允许将对象序列化和反序列化为 JSON 等常见序列化格式的库。

它使用不使用反射的构建时 [Bean 自省](/core/ioc#315-bean-自省)，并允许使用各种常见注解模型，包括 [Jackson 注解](https://fasterxml.github.io/jackson-annotations/javadoc/2.12/com/fasterxml/jackson/annotation/package-summary.html)、JSON-B 注解或 [BSON 注解](https://mongodb.github.io/mongo-java-driver/3.5/javadoc/?org/bson/codecs/pojo/annotations/package-summary.html)。

Micronaut 序列化可用于在 Micronaut 应用程序中替代使用 Jackson Databind，并允许在许多不同的编码运行时（包括 Jackson Core、JSON-P 或 BSON）之上进行序列化。

### 1.1 为什么要 Micronaut 序列化？

本项目的目标是在构建时几乎完全替代 Jackson Databind，它不依赖反射，运行时占用空间更小。下文概述了提供 Jackson 替代品的原因。

**内存性能**

Micronaut 序列化消耗的内存更少，运行时占用的空间也小得多。作为比较，Micronaut 序列化是一个 380KB 的 JAR 文件，而 Jackson Databind 超过 2MB。这使得原生图像构建的图像大小减少了 5MB。
消除反射和更小的占用空间也减少了运行时的内存消耗。

**安全性**

与 Jackson 不同，你不能将任意对象序列化或反序列化为 JSON。在现代应用程序中，允许任意序列化往往是安全问题的根源。相反，使用 Micronaut 序列化，要允许类型被序列化或反序列化，你必须执行以下操作之一：

1. 在源代码中的类型级别声明 [@Serdeable](https://micronaut-projects.github.io/micronaut-serialization/latest/api/io/micronaut/serde/annotation/Serdeable.html) 注解，以允许类型被序列化或反序列化。
2. 如果无法修改源代码，且该类型是外部类型，则可以使用 [@SerdeImport](https://micronaut-projects.github.io/micronaut-serialization/latest/api/io/micronaut/serde/annotation/SerdeImport.html) 来导入该类型。请注意，这种方法只考虑公共成员。
3. 为序列化定义一个 [Serializer](https://micronaut-projects.github.io/micronaut-serialization/latest/api/io/micronaut/serde/Serializer.html) 类型的 Bean 和/或为反序列化定义一个 [Deserializer](https://micronaut-projects.github.io/micronaut-serialization/latest/api/io/micronaut/serde/Deserializer.html) 类型的 Bean。

**类型安全**

Jackson 提供了一种基于注解的编程模型，其中包括许多开发人员需要注意的规则，如果违反这些规则，可能会导致运行时异常。
在使用 JSON 绑定注解时，Micronaut 序列化添加了编译时正确性检查。

**运行时可移植性**

Micronaut 序列化将运行时与实际源代码级注解模型解耦，而 Jackson 则与 Jackson 注解耦合。这意味着你可以使用相同的运行时，但可以选择使用 [Jackson 注解](https://fasterxml.github.io/jackson-annotations/javadoc/2.12/com/fasterxml/jackson/annotation/package-summary.html)、[JSON-B 注解](https://jakarta.ee/specifications/jsonb/2.0/apidocs/jakarta/json/bind/annotation/package-summary.html)或 [BSON 注解](https://mongodb.github.io/mongo-java-driver/3.5/javadoc/?org/bson/codecs/pojo/annotations/package-summary.html)。

如果在 webtier 中同时使用 JSON 和 MongoDB 等文档数据库，则无需使用多个 JSON 解析器和基于反射的元模型，因此内存消耗更少。

## 2. 发布历史

关于此项目，你可以在此处找到发布版本列表（含发布说明）：

https://github.com/micronaut-projects/micronaut-serialization/releases

## 3. 快速入门

使用 Micronaut 序列化有多种方法，包括选择注解模型和运行时。

不过，第一步是配置必要的注解处理器依赖关系：

import Tabs from '@theme/Tabs';
import TabItem from '@theme/TabItem';

<Tabs>
  <TabItem value="Gradle" label="Gradle">

```groovy
annotationProcessor("io.micronaut.serde:micronaut-serde-processor:2.2.0")
```

  </TabItem>
  <TabItem value="Maven" label="Maven">

```xml
<annotationProcessorPaths>
    <path>
        <groupId>io.micronaut.serde</groupId>
        <artifactId>micronaut-serde-processor</artifactId>
        <version>2.2.0</version>
    </path>
</annotationProcessorPaths>
```

  </TabItem>
</Tabs>

然后，你应根据需要选择基于注解的编程模型和运行时实现的组合。

### 3.1 Jackson 注解 & Jackson 核心

要替换 Jackson Databind，但继续使用 [Jackson 注解](https://fasterxml.github.io/jackson-annotations/javadoc/2.12/com/fasterxml/jackson/annotation/package-summary.html)作为编程模型和 Jackson Core 作为运行时，请将应用程序中的 `micronaut-jackson-databind` 模块替换为 `micronaut-serde-jackson`。

在 `dependencies` 中添加以下制品：

<Tabs>
  <TabItem value="Gradle" label="Gradle">

```groovy
implementation("io.micronaut.serde:micronaut-serde-jackson:2.2.0")
```

  </TabItem>
  <TabItem value="Maven" label="Maven">

```xml
<dependency>
    <groupId>io.micronaut.serde</groupId>
    <artifactId>micronaut-serde-jackson</artifactId>
    <version>2.2.0</version>
</dependency>
```

  </TabItem>
</Tabs>

有了正确的依赖，现在就可以定义要序列化的对象了：

<Tabs>
  <TabItem value="Java" label="Java" default>

```java
package example;

import com.fasterxml.jackson.annotation.JsonCreator;
import com.fasterxml.jackson.annotation.JsonProperty;
import io.micronaut.serde.annotation.Serdeable;

@Serdeable // (1)
public class Book {
    private final String title;
    @JsonProperty("qty") // (2)
    private final int quantity;

    @JsonCreator // (3)
    public Book(String title, int quantity) {
        this.title = title;
        this.quantity = quantity;
    }

    public String getTitle() {
        return title;
    }

    public int getQuantity() {
        return quantity;
    }
}
```

  </TabItem>
  <TabItem value="Groovy" label="Groovy">

```groovy
package example

import com.fasterxml.jackson.annotation.JsonCreator
import com.fasterxml.jackson.annotation.JsonProperty
import io.micronaut.serde.annotation.Serdeable

@Serdeable // (1)
class Book {
    final String title
    @JsonProperty("qty") // (2)
    final int quantity

    @JsonCreator
    Book(String title, int quantity) { // (3)
        this.title = title
        this.quantity = quantity
    }
}
```

  </TabItem>
  <TabItem value="Kotlin" label="Kotlin">

```kt
package example

import com.fasterxml.jackson.annotation.JsonProperty
import io.micronaut.serde.annotation.Serdeable

@Serdeable // (1)
data class Book (
    val title: String, // (2)
    @JsonProperty("qty") val quantity: Int
)
```

  </TabItem>
</Tabs>

1. 该类型使用 [@Serdeable](https://micronaut-projects.github.io/micronaut-serialization/latest/api/io/micronaut/serde/annotation/Serdeable.html) 进行注解，以实现序列化/反序列化。
2. 你可以从 Jackson 注解中使用 `@JsonProperty`
3. 可以使用 Jackson 注解中的 `@JsonCreator`

:::note 提示
如果不想添加 Micronaut 序列化注解，也可以添加类型级的 Jackson 注解，如 `@JsonClassDescription`、`@JsonRootName` 或 `@JsonTypeName`
:::

一旦有了可以序列化和反序列化的类型，你就可以使用 [ObjectMapper](https://micronaut-projects.github.io/micronaut-serialization/latest/api/io/micronaut/serde/ObjectMapper.html) 接口来进行序列化和反序列化：

<Tabs>
  <TabItem value="Java" label="Java" default>

```java
package example;

import io.micronaut.serde.ObjectMapper;
import io.micronaut.test.extensions.junit5.annotation.MicronautTest;
import org.junit.jupiter.api.Test;
import java.io.IOException;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertNotNull;

@MicronautTest
public class BookTest {

    @Test
    void testWriteReadBook(ObjectMapper objectMapper) throws IOException {
        String result = objectMapper.writeValueAsString(new Book("The Stand", 50));

        Book book = objectMapper.readValue(result, Book.class);
        assertNotNull(book);
        assertEquals(
                "The Stand", book.getTitle()
        );
        assertEquals(50, book.getQuantity());
    }
}
```

  </TabItem>
  <TabItem value="Groovy" label="Groovy">

```groovy
package example

import io.micronaut.serde.ObjectMapper
import io.micronaut.test.extensions.spock.annotation.MicronautTest
import jakarta.inject.Inject
import spock.lang.Specification

@MicronautTest
class BookTest extends Specification {
    @Inject ObjectMapper objectMapper

    void "test read/write book"() {
        when:
        String result = objectMapper.writeValueAsString(new Book("The Stand", 50));
        Book book = objectMapper.readValue(result, Book.class);

        then:
        book != null
        book.title == "The Stand"
        book.quantity == 50
    }
}
```

  </TabItem>
  <TabItem value="Kotlin" label="Kotlin">

```kt
package example

import io.micronaut.serde.ObjectMapper
import io.micronaut.test.extensions.junit5.annotation.MicronautTest
import org.junit.jupiter.api.Assertions
import org.junit.jupiter.api.Test

@MicronautTest
class BookTest {
    @Test
    fun testWriteReadBook(objectMapper: ObjectMapper) {
        val result = objectMapper.writeValueAsString(Book("The Stand", 50))
        val book = objectMapper.readValue(result, Book::class.java)
        Assertions.assertNotNull(book)
        Assertions.assertEquals(
            "The Stand", book.title
        )
        Assertions.assertEquals(50, book.quantity)
    }
}
```

  </TabItem>
</Tabs>

### 3.2 JSON-B 注解和 JSON-P

要完全移除对 Jackson 的所有依赖，并在源代码中使用 JSON-B 注解和运行时的 JSON-P，请将 `micronaut-jackson-databind` 和 `micronaut-jackson-core` 模块替换为 `micronaut-serde-jsonp`。

在 `dependencies` 块中添加以下制品：

<Tabs>
  <TabItem value="Gradle" label="Gradle">

```groovy
implementation("io.micronaut.serde:micronaut-serde-jsonp:2.2.0")
```

  </TabItem>
  <TabItem value="Maven" label="Maven">

```xml
<dependency>
    <groupId>io.micronaut.serde</groupId>
    <artifactId>micronaut-serde-jsonp</artifactId>
    <version>2.2.0</version>
</dependency>
```

  </TabItem>
</Tabs>

:::caution 警告
如果你的第三方依赖项直接依赖于 Jackson Databind，可能无法选择省略它。
:::

有了正确的依赖关系，现在就可以定义要序列化的对象了：

1. 使用 [@Serdeable](https://micronaut-projects.github.io/micronaut-serialization/latest/api/io/micronaut/serde/annotation/Serdeable.html) 对类型进行注解，以实现序列化/反序列化
2. 可以使用 JSON-B 注解中的 `@JsonbProperty`
3. 可以使用 JSON-B 注解中的` @JsonbCreator`

有了可序列化和反序列化的类型后，你就可以使用 [ObjectMapper](https://micronaut-projects.github.io/micronaut-serialization/latest/api/io/micronaut/serde/ObjectMapper.html) 接口来进行序列化和反序列化：

<Tabs>
  <TabItem value="Java" label="Java" default>

```java
package example;

import io.micronaut.serde.ObjectMapper;
import io.micronaut.test.extensions.junit5.annotation.MicronautTest;
import org.junit.jupiter.api.Test;
import java.io.IOException;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertNotNull;

@MicronautTest
public class BookTest {

    @Test
    void testWriteReadBook(ObjectMapper objectMapper) throws IOException {
        String result = objectMapper.writeValueAsString(new Book("The Stand", 50));

        Book book = objectMapper.readValue(result, Book.class);
        assertNotNull(book);
        assertEquals(
                "The Stand", book.getTitle()
        );
        assertEquals(50, book.getQuantity());
    }
}
```

  </TabItem>
  <TabItem value="Groovy" label="Groovy">

```groovy
package example

import io.micronaut.serde.ObjectMapper
import io.micronaut.test.extensions.spock.annotation.MicronautTest
import jakarta.inject.Inject
import spock.lang.Specification

@MicronautTest
class BookTest extends Specification {
    @Inject ObjectMapper objectMapper

    void "test read/write book"() {
        when:
        String result = objectMapper.writeValueAsString(new Book("The Stand", 50));
        Book book = objectMapper.readValue(result, Book.class);

        then:
        book != null
        book.title == "The Stand"
        book.quantity == 50
    }
}
```

  </TabItem>
  <TabItem value="Kotlin" label="Kotlin">

```kt
package example

import io.micronaut.serde.ObjectMapper
import io.micronaut.test.extensions.junit5.annotation.MicronautTest
import org.junit.jupiter.api.Assertions
import org.junit.jupiter.api.Test

@MicronautTest
class BookTest {
    @Test
    fun testWriteReadBook(objectMapper: ObjectMapper) {
        val result = objectMapper.writeValueAsString(Book("The Stand", 50))
        val book = objectMapper.readValue(result, Book::class.java)
        Assertions.assertNotNull(book)
        Assertions.assertEquals(
            "The Stand", book.title
        )
        Assertions.assertEquals(50, book.quantity)
    }
}
```

  </TabItem>
</Tabs>

### 3.3 BSON 注解和 BSON

要完全移除对 Jackson 的所有依赖，并在源代码中使用 [BSON 注解](https://mongodb.github.io/mongo-java-driver/3.5/javadoc/?org/bson/codecs/pojo/annotations/package-summary.html)以及在运行时使用 BSON，你应该用 `micronaut-serde-bson` 替换应用程序中的 `micronaut-jackson-databind` 和 `micronaut-jackson-core` 模块。

在 `dependencies` 块中添加以下制品：

<Tabs>
  <TabItem value="Gradle" label="Gradle">

```groovy
implementation("io.micronaut.serde:micronaut-serde-bson:2.2.0")
```

  </TabItem>
  <TabItem value="Maven" label="Maven">

```xml
<dependency>
    <groupId>io.micronaut.serde</groupId>
    <artifactId>micronaut-serde-bson</artifactId>
    <version>2.2.0</version>
</dependency>
```

  </TabItem>
</Tabs>

:::caution 警告
如果你的第三方依赖直接依赖于 Jackson Databind，可能无法选择省略它。
:::

有了正确的依赖关系，现在就可以定义要序列化的对象了：
1. 使用 [@Serdeable](https://micronaut-projects.github.io/micronaut-serialization/latest/api/io/micronaut/serde/annotation/Serdeable.html) 对类型进行注解，以实现序列化/反序列化
2. 可以使用 BSON 注解中的 `@BsonProperty`
3. 可以使用 BSON 注解中的 `@BsonCreator`

有了可以序列化和反序列化的类型后，你就可以使用 [ObjectMapper](https://micronaut-projects.github.io/micronaut-serialization/latest/api/io/micronaut/serde/ObjectMapper.html) 接口来进行序列化和反序列化：

<Tabs>
  <TabItem value="Java" label="Java" default>

```java
package example;

import io.micronaut.serde.ObjectMapper;
import io.micronaut.test.extensions.junit5.annotation.MicronautTest;
import org.junit.jupiter.api.Test;
import java.io.IOException;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertNotNull;

@MicronautTest
public class BookTest {

    @Test
    void testWriteReadBook(ObjectMapper objectMapper) throws IOException {
        String result = objectMapper.writeValueAsString(new Book("The Stand", 50));

        Book book = objectMapper.readValue(result, Book.class);
        assertNotNull(book);
        assertEquals(
                "The Stand", book.getTitle()
        );
        assertEquals(50, book.getQuantity());
    }
}
```

  </TabItem>
  <TabItem value="Groovy" label="Groovy">

```groovy
package example

import io.micronaut.serde.ObjectMapper
import io.micronaut.test.extensions.spock.annotation.MicronautTest
import jakarta.inject.Inject
import spock.lang.Specification

@MicronautTest
class BookTest extends Specification {
    @Inject ObjectMapper objectMapper

    void "test read/write book"() {
        when:
        String result = objectMapper.writeValueAsString(new Book("The Stand", 50));
        Book book = objectMapper.readValue(result, Book.class);

        then:
        book != null
        book.title == "The Stand"
        book.quantity == 50
    }
}
```

  </TabItem>
  <TabItem value="Kotlin" label="Kotlin">

```kt
package example

import io.micronaut.serde.ObjectMapper
import io.micronaut.test.extensions.junit5.annotation.MicronautTest
import org.junit.jupiter.api.Assertions
import org.junit.jupiter.api.Test

@MicronautTest
class BookTest {
    @Test
    fun testWriteReadBook(objectMapper: ObjectMapper) {
        val result = objectMapper.writeValueAsString(Book("The Stand", 50))
        val book = objectMapper.readValue(result, Book::class.java)
        Assertions.assertNotNull(book)
        Assertions.assertEquals(
            "The Stand", book.title
        )
        Assertions.assertEquals(50, book.quantity)
    }
}
```

  </TabItem>
</Tabs>

## 4. Jackson 注解

Micronaut 序列化支持可用的 [Jackson 注解](https://fasterxml.github.io/jackson-annotations/javadoc/2.12/com/fasterxml/jackson/annotation/package-summary.html)子集。

主要区别在于 Micronaut Serialization 使用构建时 [Bean 自省](https://docs.micronaut.io/latest/guide/#introspection)，这意味着只支持可访问的 getter 和 setter（以及 Java 17 记录），并且 [@JsonAutoDetect](https://fasterxml.github.io/jackson-annotations/javadoc/2.12/com/fasterxml/jackson/annotation/JsonAutoDetect.html) 不能用于自定义映射。

:::note 提示
不过，你可以使用 `AccessKind` 字段启用字段。参阅 [Bean 自省](/core/ioc#315-bean-自省)文档中的 "Bean 字段 "部分。
:::

支持的 Jackson 注解和成员的完整列表如下表所示。

:::tip 注意
如果使用了不支持的注解或成员，将导致编译错误。
:::

|Jackson 注解|支持|说明|
|--|--|--|
|[@JsonAlias](https://fasterxml.github.io/jackson-annotations/javadoc/2.12/com/fasterxml/jackson/annotation/JsonAlias.html)|✅||
|[@JacksonInject](https://fasterxml.github.io/jackson-annotations/javadoc/2.12/com/fasterxml/jackson/annotation/JacksonInject.html)|❌||
|[@JsonAnyGetter](https://fasterxml.github.io/jackson-annotations/javadoc/2.12/com/fasterxml/jackson/annotation/JsonAnyGetter.html)|✅||不支持的成员：`enabled`|
|[@JsonAnySetter](https://fasterxml.github.io/jackson-annotations/javadoc/2.12/com/fasterxml/jackson/annotation/JsonAnyGetter.html)|✅||不支持的成员：`enabled`|
|[@JsonAutoDetect](https://fasterxml.github.io/jackson-annotations/javadoc/2.12/com/fasterxml/jackson/annotation/JsonAutoDetect.html)|❌||
|[@JsonBackReference](https://fasterxml.github.io/jackson-annotations/javadoc/2.12/com/fasterxml/jackson/annotation/JsonBackReference.html)|✅||
|[@JsonClassDescription](https://fasterxml.github.io/jackson-annotations/javadoc/2.12/com/fasterxml/jackson/annotation/JsonClassDescription.html)|✅||
|[@JsonCreator](https://fasterxml.github.io/jackson-annotations/javadoc/2.12/com/fasterxml/jackson/annotation/JsonCreator.html)|✅||
|[@JsonEnumDefaultValue](https://fasterxml.github.io/jackson-annotations/javadoc/2.12/com/fasterxml/jackson/annotation/JsonEnumDefaultValue.html)|❌||
|[@JsonFilter](https://fasterxml.github.io/jackson-annotations/javadoc/2.12/com/fasterxml/jackson/annotation/JsonFilter.html)|✅|只在类型中支持，实现了 `io.micronaut.serde.PropertyFilter` 接口|
|[@JsonFormat](https://fasterxml.github.io/jackson-annotations/javadoc/2.12/com/fasterxml/jackson/annotation/JsonFormat.html)|✅||不支持的成员：`shape`、`with` 和 `without`|
|[@JsonGetter](https://fasterxml.github.io/jackson-annotations/javadoc/2.12/com/fasterxml/jackson/annotation/JsonGetter.html)|✅||
|[@JsonIdentityInfo](https://fasterxml.github.io/jackson-annotations/javadoc/2.12/com/fasterxml/jackson/annotation/JsonIdentityInfo.html)|❌||
|[@JsonIdentityReference](https://fasterxml.github.io/jackson-annotations/javadoc/2.12/com/fasterxml/jackson/annotation/JsonIdentityReference.html)|❌||
|[@JsonIgnore](https://fasterxml.github.io/jackson-annotations/javadoc/2.12/com/fasterxml/jackson/annotation/JsonIgnore.html)|✅|不支持的成员：`enabled`|
|[@JsonIgnoreProperties](https://fasterxml.github.io/jackson-annotations/javadoc/2.12/com/fasterxml/jackson/annotation/JsonIgnoreProperties.html)|✅||
|[@JsonIgnoreType](https://fasterxml.github.io/jackson-annotations/javadoc/2.12/com/fasterxml/jackson/annotation/JsonIgnoreType.html)|✅||
|[@JsonInclude](https://fasterxml.github.io/jackson-annotations/javadoc/2.12/com/fasterxml/jackson/annotation/JsonInclude.html)|✅|不支持的成员：`content`、`contentFilter`、`valueFilter`|
|[@JsonKey](https://fasterxml.github.io/jackson-annotations/javadoc/2.12/com/fasterxml/jackson/annotation/JsonKey.html)|❌||
|[@JsonManagedReference](https://fasterxml.github.io/jackson-annotations/javadoc/2.12/com/fasterxml/jackson/annotation/JsonManagedReference.html)|✅||
|[@JsonMerge](https://fasterxml.github.io/jackson-annotations/javadoc/2.12/com/fasterxml/jackson/annotation/JsonMerge.html)|❌||
|[@JsonProperty](https://fasterxml.github.io/jackson-annotations/javadoc/2.12/com/fasterxml/jackson/annotation/JsonProperty.html)|✅||
|[@JsonPropertyDescription](https://fasterxml.github.io/jackson-annotations/javadoc/2.12/com/fasterxml/jackson/annotation/JsonPropertyDescription.html)|✅||
|[@JsonPropertyOrder](https://fasterxml.github.io/jackson-annotations/javadoc/2.12/com/fasterxml/jackson/annotation/JsonPropertyOrder.html)|✅||
|[@JsonRawValue](https://fasterxml.github.io/jackson-annotations/javadoc/2.12/com/fasterxml/jackson/annotation/JsonRawValue.html)|❌|由于安全原因不支持|
|[@JsonRootName](https://fasterxml.github.io/jackson-annotations/javadoc/2.12/com/fasterxml/jackson/annotation/JsonRootName.html)|✅||
|[@JsonSetter](https://fasterxml.github.io/jackson-annotations/javadoc/2.12/com/fasterxml/jackson/annotation/JsonSetter.html)|✅|`不支持的成员：null` 和 `contentNull`|
|[@JsonSubTypes](https://fasterxml.github.io/jackson-annotations/javadoc/2.12/com/fasterxml/jackson/annotation/JsonSubTypes.html)|✅||
|[@JsonTypeId](https://fasterxml.github.io/jackson-annotations/javadoc/2.12/com/fasterxml/jackson/annotation/JsonTypeId.html)|❌||
|[@JsonTypeInfo](https://fasterxml.github.io/jackson-annotations/javadoc/2.12/com/fasterxml/jackson/annotation/JsonTypeInfo.html)|✅|仅 `WRAPPER_OBJECT` 和 `PROPERTY` 可用于 `include`，且仅 `CLASS` 和 `NAME` 用于 `use`。|
|[@JsonTypeName](https://fasterxml.github.io/jackson-annotations/javadoc/2.12/com/fasterxml/jackson/annotation/JsonTypeName.html)|✅||
|[@JsonUnwrapped](https://fasterxml.github.io/jackson-annotations/javadoc/2.12/com/fasterxml/jackson/annotation/JsonUnwrapped.html)|✅|不支持的成员：`enabled`|
|[@JsonValue](https://fasterxml.github.io/jackson-annotations/javadoc/2.12/com/fasterxml/jackson/annotation/JsonValue.html)|✅|不支持的成员：`value`|
|[@JsonView](https://fasterxml.github.io/jackson-annotations/javadoc/2.12/com/fasterxml/jackson/annotation/JsonView.html)|✅||

此外，还包括对 3 个 jackson-databind 注解的有限支持，以便在需要同时支持 jackson-databind 和 Micronaut 序列化的情况下实现可移植性：

|注解|说明|
|--|--|
|[@JsonNaming](https://fasterxml.github.io/jackson-databind/javadoc/2.13/com/fasterxml/jackson/databind/annotation/JsonNaming.html)|只能使用内置的[命名策略](https://fasterxml.github.io/jackson-databind/javadoc/2.13/com/fasterxml/jackson/databind/PropertyNamingStrategies.html)|
|[@JsonSerialize](https://fasterxml.github.io/jackson-databind/javadoc/2.13/com/fasterxml/jackson/databind/annotation/JsonSerialize.html)|只能作为成员|
|[@JsonDeserialize](https://fasterxml.github.io/jackson-databind/javadoc/2.13/com/fasterxml/jackson/databind/annotation/JsonDeserialize.html)|只能作为成员|

请注意，在使用这些注解时，建议将 `jackson-databind` 设置为 `compileOnly` 依赖，因为运行时并不需要它。例如 Gradle：

*`jackson-databind` 作为 `compileOnly` 域*

```groovy
compileOnly("com.fasterxml.jackson.core:jackson-databind")
```

或者 Maven：

*`jackson-databind` 作为 `provided` 域*

```xml
<dependency>
  <groupId>com.fasterxml.jackson.core</groupId>
  <artifactId>jackson-databind</artifactId>
  <scope>provided</scope>
</dependency>
```

### 4.1 自定义属性过滤器

自定义属性过滤器可以通过实现 [PropertyFilter](https://micronaut-projects.github.io/micronaut-serialization/latest/api/io/micronaut/serde/PropertyFilter.html) 接口来编写。

例如，给定以下类：

<Tabs>
  <TabItem value="Java" label="Java" default>

```java
package example;

import com.fasterxml.jackson.annotation.JsonFilter;
import io.micronaut.serde.annotation.Serdeable;

@Serdeable
@JsonFilter("person-filter") // (1)
public class Person {
    private final String name;
    private final String preferredName;

    public Person(String name, String preferredName) {
        this.name = name;
        this.preferredName = preferredName;
    }

    public String getName() {
        return name;
    }

    public String getPreferredName() {
        return preferredName;
    }
}
```

  </TabItem>
  <TabItem value="Groovy" label="Groovy">

```groovy
package example

import com.fasterxml.jackson.annotation.JsonFilter
import io.micronaut.serde.annotation.Serdeable

@Serdeable
@JsonFilter("person-filter") // (1)
class Person {
    String name
    String preferredName
}
```

  </TabItem>
  <TabItem value="Kotlin" label="Kotlin">

```kt
package example

import com.fasterxml.jackson.annotation.JsonFilter
import io.micronaut.serde.annotation.Serdeable

@Serdeable
@JsonFilter("person-filter") // (1)
data class Person(
    val name: String,
    val preferredName: String?
)
```

  </TabItem>
</Tabs>

1. 使用 jackson `JsonFilter` 注解要求使用名为 `person-filter` 的过滤器。

自定义属性过滤器的定义如下：

<Tabs>
  <TabItem value="Java" label="Java" default>

```java
package example;

import io.micronaut.serde.PropertyFilter;
import io.micronaut.serde.Serializer;
import jakarta.inject.Named;
import jakarta.inject.Singleton;

@Singleton
@Named("person-filter") // (1)
public class PersonFilter implements PropertyFilter {

    @Override
    public boolean shouldInclude(
        Serializer.EncoderContext encoderContext, Serializer<Object> propertySerializer,
        Object bean, String propertyName, Object propertyValue
    ) {
        if (bean instanceof Person) { // (2)
            Person person = (Person) bean;
            if (propertyName.equals("name")) {
                return person.getPreferredName() == null;
            } else if (propertyName.equals("preferredName")) {
                return person.getPreferredName() != null;
            }
        }
        return true;
    }
}
```

  </TabItem>
  <TabItem value="Groovy" label="Groovy">

```groovy
package example

import io.micronaut.serde.PropertyFilter
import io.micronaut.serde.Serializer
import jakarta.inject.Named
import jakarta.inject.Singleton

@Singleton
@Named("person-filter") // (1)
class PersonFilter implements PropertyFilter {

    @Override
    boolean shouldInclude(
        Serializer.EncoderContext encoderContext, Serializer<Object> propertySerializer,
        Object bean, String propertyName, Object propertyValue
    ) {
        if (bean instanceof Person) { // (2)
            if (propertyName == "name") {
                return bean.preferredName == null
            } else if (propertyName == "preferredName") {
                return bean.preferredName != null
            }
        }
        return true
    }
}
```

  </TabItem>
  <TabItem value="Kotlin" label="Kotlin">

```kt
package example

import io.micronaut.serde.PropertyFilter
import io.micronaut.serde.Serializer
import jakarta.inject.Named
import jakarta.inject.Singleton

@Singleton
@Named("person-filter") // (1)
class PersonFilter : PropertyFilter {

    override fun shouldInclude(
            encoderContext: Serializer.EncoderContext,
            propertySerializer: Serializer<Any>,
            bean: Any,
            propertyName: String,
            propertyValue: Any?
    ): Boolean {
        if (bean is Person) { // (2)
            if (propertyName == "name") {
                return bean.preferredName == null
            } else if (propertyName == "preferredName") {
                return bean.preferredName != null
            }
        }
        return true
    }
}
```

  </TabItem>
</Tabs>

1. 创建一个带有与过滤器名称匹配的 `Named` 注解的单例。
2. 为 `Person` 类实现自定义筛选。

当设置了 `preferredName` 字段时，过滤器会省略 `name` 字段：

<Tabs>
  <TabItem value="Java" label="Java" default>

```java
package example;

import io.micronaut.serde.ObjectMapper;
import io.micronaut.test.extensions.junit5.annotation.MicronautTest;
import org.junit.jupiter.api.Test;

import java.io.IOException;

import static org.junit.jupiter.api.Assertions.assertEquals;

@MicronautTest
public class PersonFilterTest {

    @Test
    void testWritePersonWithoutPreferredName(ObjectMapper objectMapper) throws IOException {
        String result = objectMapper.writeValueAsString(new Person("Adam", null));
        assertEquals("{\"name\":\"Adam\"}", result);
    }

    @Test
    void testWritePersonWithPreferredName(ObjectMapper objectMapper) throws IOException {
        String result = objectMapper.writeValueAsString(new Person("Adam", "Ad"));
        assertEquals("{\"preferredName\":\"Ad\"}", result);
    }
}
```

  </TabItem>
  <TabItem value="Groovy" label="Groovy">

```groovy
package example

import io.micronaut.serde.ObjectMapper
import io.micronaut.test.extensions.spock.annotation.MicronautTest
import jakarta.inject.Inject
import spock.lang.Specification

@MicronautTest
class PersonFilterTest extends Specification {
    @Inject ObjectMapper objectMapper

    void "test write person without preferred name"() {
        when:
        String result = objectMapper.writeValueAsString(new Person(name: "Adam"))

        then:
        '{"name":"Adam"}' == result
    }

    void "test write person with preferred name"() {
        when:
        String result = objectMapper.writeValueAsString(new Person(name: "Adam", preferredName: "Ad"))

        then:
        '{"preferredName":"Ad"}' == result
    }
}
```

  </TabItem>
  <TabItem value="Kotlin" label="Kotlin">

```kt
package example

import io.micronaut.serde.ObjectMapper
import io.micronaut.test.extensions.junit5.annotation.MicronautTest
import org.junit.jupiter.api.Assertions
import org.junit.jupiter.api.Test
import java.io.IOException

@MicronautTest
class PersonFilterTest {

    @Test
    fun testWritePersonWithoutPreferredName(objectMapper: ObjectMapper) {
        val result = objectMapper.writeValueAsString(Person("Adam", null))
        Assertions.assertEquals("{\"name\":\"Adam\"}", result)
    }

    @Test
    fun testWritePersonWithPreferredName(objectMapper: ObjectMapper) {
        val result = objectMapper.writeValueAsString(Person("Adam", "Ad"))
        Assertions.assertEquals("{\"preferredName\":\"Ad\"}", result)
    }
}
```

  </TabItem>
</Tabs>

## 5. JSON-B 注解

Micronaut 序列化支持可用 [JSON-B](https://jakarta.ee/specifications/jsonb/2.0/apidocs/jakarta/json/bind/annotation/package-summary.html) 注解的子集。

请注意，只支持注解而不支持运行时 API，因此建议只将 JSON-B 作为编译依赖。例如 Gradle：

*`jakarta.json.bind-api` 作为 `compileOnly` 域*

```groovy
compileOnly("jakarta.json.bind:jakarta.json.bind-api:2.0.0")
```

或 Maven：

*`jakarta.json.bind-api` 作为 `provided` 域*

```xml
<dependency>
  <groupId>jakarta.json.bind</groupId>
  <artifactId>jakarta.json.bind-api</artifactId>
  <version>2.0.0</version>
  <scope>provided</scope>
</dependency>
```

|Jackson 注解|支持|说明|
|--|--|--|
|[@JsonbCreator](https://jakarta.ee/specifications/jsonb/2.0/apidocs/jakarta/json/bind/annotation/JsonbCreator.html)|✅||
|[@JsonbDateFormat](https://jakarta.ee/specifications/jsonb/2.0/apidocs/jakarta/json/bind/annotation/JsonbDateFormat.html)|✅||
|[@JsonbNillable](https://jakarta.ee/specifications/jsonb/2.0/apidocs/jakarta/json/bind/annotation/JsonbNillable.html)|✅||
|[@JsonbNumberFormat](https://jakarta.ee/specifications/jsonb/2.0/apidocs/jakarta/json/bind/annotation/JsonbNumberFormat.html)|✅||
|[@JsonbProperty](https://jakarta.ee/specifications/jsonb/2.0/apidocs/jakarta/json/bind/annotation/JsonbProperty.html)|✅||
|[@JsonbPropertyOrder](https://jakarta.ee/specifications/jsonb/2.0/apidocs/jakarta/json/bind/annotation/JsonbTransient.html)|✅||
|[@JsonbTransient](https://jakarta.ee/specifications/jsonb/2.0/apidocs/jakarta/json/bind/annotation/JsonbTransient.html)|✅||
|[@JsonbTypeAdapter](https://jakarta.ee/specifications/jsonb/2.0/apidocs/jakarta/json/bind/annotation/JsonbTypeAdapter.html)|❌|暴露运行时 API|
|[@JsonbTypeDeserializer](https://jakarta.ee/specifications/jsonb/2.0/apidocs/jakarta/json/bind/annotation/JsonbTypeDeserializer.html)|❌|暴露运行时 API|
|[@JsonbTypeSerializer](https://jakarta.ee/specifications/jsonb/2.0/apidocs/jakarta/json/bind/annotation/JsonbTypeSerializer.html)|❌|暴露运行时 API|
|[@JsonbVisibility](https://jakarta.ee/specifications/jsonb/2.0/apidocs/jakarta/json/bind/annotation/JsonbVisibility.html)|❌|必需反射|

## 6. BSON 注解

支持全套 [BSON 注解](https://mongodb.github.io/mongo-java-driver/3.5/javadoc/?org/bson/codecs/pojo/annotations/package-summary.html)。

请注意，使用 BSON 时，你可以通过注入 [BsonBinaryMapper](https://micronaut-projects.github.io/micronaut-serialization/latest/api/io/micronaut/serde/bson/BsonBinaryMapper.html)（二进制）或 [BsonJsonMapper](https://micronaut-projects.github.io/micronaut-serialization/latest/api/io/micronaut/serde/bson/BsonJsonMapper.html)（JSON）中的一个，将 JSON 和 BSON 二进制都编码成 BSON 二进制。

## 7. 自定义序列化器和反序列化器

通过分别实现 [Serializer](https://micronaut-projects.github.io/micronaut-serialization/latest/api/io/micronaut/serde/Serializer.html) 和 [ Deserializer](https://micronaut-projects.github.io/micronaut-serialization/latest/api/io/micronaut/serde/Deserializer.html) 接口并定义能够处理特定类型的 Bean，可以编写类型的自定义序列化器和反序列化器。

例如，给定以下类：

<Tabs>
  <TabItem value="Java" label="Java" default>

```java
package example;

public final class Point {
    private final int x, y;

    private Point(int x, int y) {
        this.x = x;
        this.y = y;
    }

    public int[] coords() {
        return new int[] { x, y };
    }

    public static Point valueOf(int x, int y) {
        return new Point(x, y);
    }
}
```

  </TabItem>
  <TabItem value="Groovy" label="Groovy">

```groovy
package example

final class Point {
    private final int x, y

    private Point(int x, int y) {
        this.x = x
        this.y = y
    }

    int[] coords() {
        return new int[] { x, y }
    }

    static Point valueOf(int x, int y) {
        return new Point(x, y)
    }
}
```

  </TabItem>
  <TabItem value="Kotlin" label="Kotlin">

```kt
package example

class Point private constructor(private val x: Int, private val y: Int) {
    fun coords(): IntArray {
        return intArrayOf(x, y)
    }

    companion object {
        fun valueOf(x: Int, y: Int): Point {
            return Point(x, y)
        }
    }
}
```

  </TabItem>
</Tabs>

自定义 serde（组合序列化器和反序列化器）的实现方法如下：

<Tabs>
  <TabItem value="Java" label="Java" default>

```java
package example;

import io.micronaut.core.type.Argument;
import io.micronaut.serde.Decoder;
import io.micronaut.serde.Encoder;
import io.micronaut.serde.Serde;
import jakarta.inject.Singleton;

import java.io.IOException;
import java.util.Objects;

@Singleton // (1)
public class PointSerde implements Serde<Point> { // (2)
    @Override
    public Point deserialize(
            Decoder decoder,
            DecoderContext context,
            Argument<? super Point> type) throws IOException {
        try (Decoder array = decoder.decodeArray()) { // (3)
            int x = array.decodeInt();
            int y = array.decodeInt();
            return Point.valueOf(x, y); // (4)
        }
    }

    @Override
    public void serialize(
            Encoder encoder,
            EncoderContext context,
            Argument<? extends Point> type, Point value) throws IOException {
        Objects.requireNonNull(value, "Point cannot be null"); // (5)
        int[] coords = value.coords();
        try (Encoder array = encoder.encodeArray(type)) { // (6)
            array.encodeInt(coords[0]);
            array.encodeInt(coords[1]);
        }
    }
}
```

  </TabItem>
  <TabItem value="Groovy" label="Groovy">

```groovy
package example

import io.micronaut.core.type.Argument
import io.micronaut.serde.Decoder
import io.micronaut.serde.Encoder
import io.micronaut.serde.Serde
import jakarta.inject.Singleton

@Singleton // (1)
class PointSerde implements Serde<Point> { // (2)
    @Override
    Point deserialize(
            Decoder decoder,
            DecoderContext context,
            Argument<? super Point> type) throws IOException {
        Decoder array = decoder.decodeArray() // (3)
        int x = array.decodeInt()
        int y = array.decodeInt()
        array.finishStructure() // (4)
        return Point.valueOf(x, y) // (5)
    }

    @Override
    void serialize(
            Encoder encoder,
            EncoderContext context,
            Argument<? extends Point> type,
            Point value) throws IOException {
        Objects.requireNonNull(value, "Point cannot be null") // (6)
        int[] coords = value.coords()
        Encoder array = encoder.encodeArray(type) // (7)
        array.encodeInt(coords[0])
        array.encodeInt(coords[1])
        array.finishStructure() // (8)
    }
}
```

  </TabItem>
  <TabItem value="Kotlin" label="Kotlin">

```kt
package example

import io.micronaut.core.type.Argument
import io.micronaut.serde.*
import jakarta.inject.Singleton

@Singleton // (1)
class PointSerde : Serde<Point> { // (2)
    override fun deserialize(
            decoder: Decoder,
            context: Deserializer.DecoderContext,
            type: Argument<in Point>
    ): Point {
        decoder.decodeArray().use { // (3)
            val x = it.decodeInt()
            val y = it.decodeInt()
            return Point.valueOf(x, y) // (4)
        }
    }

    override fun serialize(
            encoder: Encoder,
            context: Serializer.EncoderContext,
            type: Argument<out Point>,
            value: Point
    ) {
        val coords = value.coords()
        encoder.encodeArray(type).use { // (6)
            it.encodeInt(coords[0])
            it.encodeInt(coords[1])
        }
    }
}
```

  </TabItem>
</Tabs>

1. 通过使用 `@Singleton` 作用域对 [Serde](https://micronaut-projects.github.io/micronaut-serialization/latest/api/io/micronaut/serde/Serde.html) 进行注解，使其成为一个 Bean。
2. 为给定类型实现 [Serde](https://micronaut-projects.github.io/micronaut-serialization/latest/api/io/micronaut/serde/Serde.html) 接口。
3. [Decoder](https://micronaut-projects.github.io/micronaut-serialization/latest/api/io/micronaut/serde/Decoder.html) 接口用于使用 `try-with-resources` 开始对数组进行解码。
4. 返回解码后的对象
5. `value` 可以是 `null`，解码器应处理是否允许 `null`
6. [Encoder](https://micronaut-projects.github.io/micronaut-serialization/latest/api/io/micronaut/serde/Encoder.html) 接口用于通过 encodeArray 方法使用 `try-with-resources` 开始对数组进行编码。

现在你可以序列化和反序列化 `Point` 类型的类：

<Tabs>
  <TabItem value="Java" label="Java" default>

```java
package example;

import io.micronaut.serde.ObjectMapper;
import io.micronaut.test.extensions.junit5.annotation.MicronautTest;
import org.junit.jupiter.api.Assertions;
import org.junit.jupiter.api.Test;

import java.io.IOException;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertNotNull;

@MicronautTest
public class PointTest {

    @Test
    void testWriteReadPoint(ObjectMapper objectMapper) throws IOException {
        String result = objectMapper.writeValueAsString(
                Point.valueOf(50, 100)
        );
        Point point = objectMapper.readValue(result, Point.class);
        assertNotNull(point);
        int[] coords = point.coords();
        assertEquals(50, coords[0]);
        assertEquals(100, coords[1]);
    }
}
```

  </TabItem>
  <TabItem value="Groovy" label="Groovy">

```groovy
package example

import io.micronaut.serde.ObjectMapper
import io.micronaut.test.extensions.spock.annotation.MicronautTest
import jakarta.inject.Inject
import spock.lang.Specification

@MicronautTest
class PointTest extends Specification {
    @Inject ObjectMapper objectMapper

    void "test read/write point"() {
        given:
        String result = objectMapper.writeValueAsString(
                Point.valueOf(50, 100)
        )
        Point point = objectMapper.readValue(result, Point.class)

        expect:
        point != null
        int[] coords = point.coords()
        coords[0] == 50
        coords[1] == 100
    }
}
```

  </TabItem>
  <TabItem value="Kotlin" label="Kotlin">

```kt
package example

import io.micronaut.serde.ObjectMapper
import io.micronaut.test.extensions.junit5.annotation.MicronautTest
import org.junit.jupiter.api.Assertions
import org.junit.jupiter.api.Test

@MicronautTest
class PointTest {
    @Test
    fun testWriteReadPoint(objectMapper: ObjectMapper) {
        val result = objectMapper.writeValueAsString(
            Point.valueOf(50, 100)
        )
        val point = objectMapper.readValue(result, Point::class.java)
        Assertions.assertNotNull(point)
        val coords = point.coords()
        Assertions.assertEquals(50, coords[0])
        Assertions.assertEquals(100, coords[1])
    }
}
```

  </TabItem>
</Tabs>

**序列化器选择**

请注意，如果存在多个 [Serializer](https://micronaut-projects.github.io/micronaut-serialization/latest/api/io/micronaut/serde/Serializer.html) Bean，你将收到 `NonUniqueBeanException` 异常，在这种情况下，你有多种选择：

1. 将 `@Primary` 添加到序列化器中，这样它就会被选中
2. 添加具有更高优先级值的 `@Order`，这样它就会被选中

**反序列化器选择**

在反序列化过程中，有多个可能的反序列化器选项是很常见的。例如，一个 `HashSet` 可以被反序列化为一个 `Collection` 和一个 `Set`。

在这种情况下，你应该声明一个 @Order 注解更高的优先级值，以控制默认选择哪个反序列化器。

**属性级序列化器或反序列化器**

你还可以使用 `@Serializable(using=..)` 和/或 `@Deserializable(using=..)` 注解，按字段、构造函数、方法等自定义序列化器和/或反序列化器。

:::note 注意
在这种情况下，给定类型通常会有多个序列化器/解序列化器，因此应使用 `@Primary` 或 `@Secondary` 来自定义 bean 属性，以便默认选择其中一个。
:::

<Tabs>
  <TabItem value="Java" label="Java" default>

```java
package example;

import java.io.IOException;
import java.util.Objects;

import io.micronaut.context.annotation.Secondary;
import io.micronaut.core.type.Argument;
import io.micronaut.serde.Decoder;
import io.micronaut.serde.Encoder;
import io.micronaut.serde.Serde;
import jakarta.inject.Singleton;

@Singleton
@Secondary // (1)
public class ReversePointSerde implements Serde<Point> {
    @Override
    public Point deserialize(
            Decoder decoder,
            DecoderContext context,
            Argument<? super Point> type) throws IOException {
        Decoder array = decoder.decodeArray();
        int y = array.decodeInt(); // (2)
        int x = array.decodeInt();
        array.finishStructure();
        return Point.valueOf(x, y);
    }

    @Override
    public void serialize(
            Encoder encoder,
            EncoderContext context,
            Argument<? extends Point> type, Point value) throws IOException {
        Objects.requireNonNull(value, "Point cannot be null");
        int[] coords = value.coords();
        Encoder array = encoder.encodeArray(type);
        array.encodeInt(coords[1]); // (3)
        array.encodeInt(coords[0]);
        array.finishStructure();
    }
}
```

  </TabItem>
  <TabItem value="Groovy" label="Groovy">

```groovy
package example

import io.micronaut.context.annotation.Secondary
import io.micronaut.core.type.Argument
import io.micronaut.serde.Decoder
import io.micronaut.serde.Encoder
import io.micronaut.serde.Serde
import jakarta.inject.Singleton

@Singleton
@Secondary // (1)
class ReversePointSerde implements Serde<Point> {
    @Override
    Point deserialize(
            Decoder decoder,
            DecoderContext context,
            Argument<? super Point> type) throws IOException {
        Decoder array = decoder.decodeArray()
        int y = array.decodeInt() // (2)
        int x = array.decodeInt()
        array.finishStructure()
        return Point.valueOf(x, y)
    }

    @Override
    void serialize(
            Encoder encoder,
            EncoderContext context,
            Argument<? extends Point> type,
            Point value) throws IOException {
        Objects.requireNonNull(value, "Point cannot be null")
        int[] coords = value.coords()
        Encoder array = encoder.encodeArray(type)
        array.encodeInt(coords[1]) // (3)
        array.encodeInt(coords[0])
        array.finishStructure()
    }
}
```

  </TabItem>
  <TabItem value="Kotlin" label="Kotlin">

```kt
package example

import io.micronaut.context.annotation.Secondary
import io.micronaut.core.type.Argument
import io.micronaut.serde.*
import jakarta.inject.Singleton
import java.util.*

@Singleton
@Secondary // (1)
class ReversePointSerde : Serde<Point> {
    override fun deserialize(
            decoder: Decoder,
            context: Deserializer.DecoderContext,
            type: Argument<in Point>
    ): Point {
        val array = decoder.decodeArray()
        val y = array.decodeInt() // (2)
        val x = array.decodeInt()
        array.finishStructure()
        return Point.valueOf(x, y)
    }

    override fun serialize(
            encoder: Encoder,
            context: Serializer.EncoderContext,
            type: Argument<out Point>,
            value: Point
    ) {
        Objects.requireNonNull(value, "Point cannot be null")
        val coords = value.coords()
        val array = encoder.encodeArray(type)
        array.encodeInt(coords[1]) // (3)
        array.encodeInt(coords[0])
        array.finishStructure()
    }
}
```

  </TabItem>
</Tabs>

1. 将此 bean 设为 `@Secondary`，以便主 `Serde` 默认以正确的顺序序列化
2. 坐标以相反的顺序存储

然后，你可以在字段、参数、方法等级别定义注解，以便仅在这种情况下自定义序列化/解序列化：

<Tabs>
  <TabItem value="Java" label="Java" default>

```java
package example;

import io.micronaut.serde.annotation.Serdeable;

@Serdeable
public class Place {
    @Serdeable.Serializable(using = ReversePointSerde.class) // (1)
    @Serdeable.Deserializable(using = ReversePointSerde.class) // (2)
    private final Point point;

    @Serdeable.Serializable(using = ReversePointSerde.class)
    private final Point pointCustomSer;

    @Serdeable.Deserializable(using = ReversePointSerde.class)
    private final Point pointCustomDes;

    public Place(Point point, Point pointCustomSer, Point pointCustomDes) {
        this.point = point;
        this.pointCustomSer = pointCustomSer;
        this.pointCustomDes = pointCustomDes;
    }

    public Point getPoint() {
        return point;
    }

    public Point getPointCustomSer() {
        return pointCustomSer;
    }

    public Point getPointCustomDes() {
        return pointCustomDes;
    }
}
```

  </TabItem>
  <TabItem value="Groovy" label="Groovy">

```groovy
package example

import io.micronaut.serde.annotation.Serdeable

@Serdeable
class Place {
    @Serdeable.Serializable(using = ReversePointSerde.class) // (1)
    @Serdeable.Deserializable(using = ReversePointSerde.class) // (2)
    final Point point

    @Serdeable.Serializable(using = ReversePointSerde.class)
    final Point pointCustomSer

    @Serdeable.Deserializable(using = ReversePointSerde.class)
    final Point pointCustomDes

    Place(Point point, Point pointCustomSer, Point pointCustomDes) {
        this.point = point
        this.pointCustomSer = pointCustomSer
        this.pointCustomDes = pointCustomDes
    }
}
```

  </TabItem>
  <TabItem value="Kotlin" label="Kotlin">

```kt
package example

import io.micronaut.serde.annotation.Serdeable
import io.micronaut.serde.annotation.Serdeable.Deserializable
import io.micronaut.serde.annotation.Serdeable.Serializable

@Serdeable
data class Place(
        @Deserializable(using = ReversePointSerde::class) // (1)
        @Serializable(using = ReversePointSerde::class) // (2)
        val point: Point,

        @Serdeable.Serializable(using = example.ReversePointSerde::class)
        val pointCustomSer: Point,

        @Deserializable(using = ReversePointSerde::class)
        val pointCustomDes: Point
)
```

  </TabItem>
</Tabs>

1. `@Serializable(using=..)` 表示使用 `ReversePointSerde` 来序列化坐标
2. `@Serializable(using=..)` 表示使用 `ReversePointSerde` 反序列化坐标


## 8. 启用外部类的序列化

与 Jackson 不同，Micronaut 序列化不允许任意序列化任何类型。正如上一节[自定义序列化器](#7-自定义序列化器和反序列化器)中提到的，序列化外部类型的一个选择是定义一个自定义序列化器，不过也可以在编译期间使用 [@SerdeImport](https://micronaut-projects.github.io/micronaut-serialization/latest/api/io/micronaut/serde/annotation/SerdeImport.html) 注解导入类型。

例如考虑以下类型：

<Tabs>
  <TabItem value="Java" label="Java" default>

```java
package example;

public class Product {
    private final String name;
    private final int quantity;

    public Product(String name, int quantity) {
        this.name = name;
        this.quantity = quantity;
    }

    public String getName() {
        return name;
    }

    public int getQuantity() {
        return quantity;
    }
}
```

  </TabItem>
  <TabItem value="Groovy" label="Groovy">

```groovy
package example

class Product {
    final String name
    final int quantity

    Product(String name, int quantity) {
        this.name = name
        this.quantity = quantity
    }
}
```

  </TabItem>
  <TabItem value="Kotlin" label="Kotlin">

```kt
package example

class Product(val name: String, val quantity: Int)
```

  </TabItem>
</Tabs>

该类型没有序列化注解，尝试序列化该类型将导致错误。

要解决这个问题，可以在项目的中心位置（通常是 `Application` 类）添加 [@SerdeImport](https://micronaut-projects.github.io/micronaut-serialization/latest/api/io/micronaut/serde/annotation/SerdeImport.html)：

```java
@SerdeImport(Product.class)
```

请注意，如果你希望对导入的类进行自定义，可以额外提供一个 mixin 类。例如：

<Tabs>
  <TabItem value="Java" label="Java" default>

```java
package example;

import com.fasterxml.jackson.annotation.JsonProperty;

public interface ProductMixin {
    @JsonProperty("p_name")
    String getName();

    @JsonProperty("p_quantity")
    int getQuantity();
}
```

  </TabItem>
  <TabItem value="Groovy" label="Groovy">

```groovy
package example

import com.fasterxml.jackson.annotation.JsonProperty

interface ProductMixin {
    @JsonProperty("p_name")
    String getName()

    @JsonProperty("p_quantity")
    int getQuantity()
}
```

  </TabItem>
  <TabItem value="Kotlin" label="Kotlin">

```kt
package example

import com.fasterxml.jackson.annotation.JsonProperty

interface ProductMixin {
    @get:JsonProperty("p_name")
    val name: String

    @get:JsonProperty("p_quantity")
    val quantity: Int
}
```

  </TabItem>
</Tabs>

然后就可以在声明 `SerdeImport` 时使用该 mixin：

<Tabs>
  <TabItem value="Java" label="Java" default>

```java
package example;

import io.micronaut.runtime.Micronaut;
import io.micronaut.serde.annotation.SerdeImport;

@SerdeImport(
    value = Product.class,
    mixin = ProductMixin.class
) // (1)
public class Application {

    public static void main(String[] args) {
        Micronaut.run(Application.class, args);
    }
}
```

  </TabItem>
  <TabItem value="Kotlin" label="Kotlin">

```kt
package example

import io.micronaut.runtime.Micronaut.*
import io.micronaut.serde.annotation.SerdeImport

fun main(args: Array<String>) {
    build()
        .args(*args)
        .packages("com.example")
        .start()
}

@SerdeImport(
    value = Product::class,
    mixin = ProductMixin::class) // (1)
class Serdes {}
```

  </TabItem>
</Tabs>

1. [@SerdeImport](https://micronaut-projects.github.io/micronaut-serialization/latest/api/io/micronaut/serde/annotation/SerdeImport.html) 用于使 `Product` 类可序列化

## 9. 自定义键转换器

使用 JSON 的键总是写成字符串，但在序列化和反序列化 Map 实例时，你可以使用字符串以外的类型，不过可能需要注册自定义 TypeConverter。

例如给出的以下类：

<Tabs>
  <TabItem value="Java" label="Java" default>

```java
package example;

import io.micronaut.serde.annotation.Serdeable;
import java.util.Map;

@Serdeable
public class Location {
    private final Map<Feature, Point> features;

    public Location(Map<Feature, Point> features) {
        this.features = features;
    }

    public Map<Feature, Point> getFeatures() {
        return features;
    }
}
```

  </TabItem>
  <TabItem value="Groovy" label="Groovy">

```groovy
package example

import io.micronaut.serde.annotation.Serdeable

@Serdeable
class Location {
    final Map<Feature, Point> features

    Location(Map<Feature, Point> features) {
        this.features = features
    }
}
```

  </TabItem>
  <TabItem value="Kotlin" label="Kotlin">

```kt
package example

import io.micronaut.serde.annotation.Serdeable

@Serdeable
data class Location(
    val features: Map<Feature, Point>
)
```

  </TabItem>
</Tabs>

这定义了键的自定义 `Feature` 类型。Micronaut 序列化不知道如何反序列化该类型，因此应与该类型一起定义一个 `TypeConverter`：

<Tabs>
  <TabItem value="Java" label="Java" default>

```java
package example;

import io.micronaut.core.convert.ConversionContext;
import io.micronaut.core.convert.TypeConverter;
import jakarta.inject.Singleton;

import java.util.Optional;

public class Feature {
    private final String name;

    public Feature(String name) {
        this.name = name;
    }

    public String name() {
        return name;
    }

    @Override
    public String toString() { // (1)
        return name;
    }

    @Singleton
    static class FeatureConverter implements TypeConverter<String, Feature> { // (2)
        @Override
        public Optional<Feature> convert(String object, Class<Feature> targetType, ConversionContext context) {
            return Optional.of(new Feature(object));
        }
    }
}
```

  </TabItem>
  <TabItem value="Groovy" label="Groovy">

```groovy
package example

import io.micronaut.core.convert.ConversionContext
import io.micronaut.core.convert.TypeConverter
import jakarta.inject.Singleton

class Feature {
    private final String name

    Feature(String name) {
        this.name = name
    }

    String name() {
        return name
    }

    @Override
    String toString() { // (1)
        return name
    }

    @Singleton
    static class FeatureConverter implements TypeConverter<String, Feature> { // (2)
        @Override
        Optional<Feature> convert(String object, Class<Feature> targetType, ConversionContext context) {
            return Optional.of(new Feature(object))
        }
    }
}
```

  </TabItem>
  <TabItem value="Kotlin" label="Kotlin">

```kt
package example

import io.micronaut.core.convert.ConversionContext
import io.micronaut.core.convert.TypeConverter
import jakarta.inject.Singleton
import java.util.*

class Feature(private val name: String) {
    fun name(): String {
        return name
    }

    override fun toString(): String { // (1)
        return name
    }
}

@Singleton
class FeatureConverter : TypeConverter<String, Feature> {
    // (2)
    override fun convert(value: String, targetType: Class<Feature>, context: ConversionContext): Optional<Feature> {
        return Optional.of(Feature(value))
    }
}
```

  </TabItem>
</Tabs>

1. 在序列化过程中，默认情况下会调用 `toString()`，但你也可以注册一个从 `Feature` 到 `String` 的 `TypeConverter` 来进行自定义。
2. 反序列化时，需要使用 `TypeConverter` 将字符串键转换为所需类型。

## 10. 仓库

你可以在此仓库中找到此项目的源代码：

https://github.com/micronaut-projects/micronaut-serialization

> [英文链接](https://micronaut-projects.github.io/micronaut-serialization/latest/guide/index.html#introduction)

---
sidebar_position: 30
---

# 7.3 使用 @Client 的声明式 HTTP 客户端

现在你已经了解了低级别的 HTTP 客户端的工作原理，让我们来看看 Micronaut 通过 [Client](https://docs.micronaut.io/latest/api/io/micronaut/http/client/annotation/Client.html) 注解对声明式客户端的支持。

基本上，`@Client` 注解可以在任何接口或抽象类上声明，通过使用[引入通知](/core/aop#52-引入通知)，抽象方法在编译时为你实现，大大简化了 HTTP 客户端的创建。

让我们从一个简单的例子开始。给出下面这个类：

*Pet.java*

import Tabs from '@theme/Tabs';
import TabItem from '@theme/TabItem';

<Tabs>
  <TabItem value="Java" label="Java" default>

```java
public class Pet {
    private String name;
    private int age;

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public int getAge() {
        return age;
    }

    public void setAge(int age) {
        this.age = age;
    }
}
```

  </TabItem>
  <TabItem value="Groovy" label="Groovy">

```groovy
class Pet {
    String name
    int age
}
```

  </TabItem>
  <TabItem value="Kotlin" label="Kotlin">

```kt
class Pet {
    var name: String? = null
    var age: Int = 0
}
```

  </TabItem>
</Tabs>

你可以定义一个共同的接口来保存新的 `Pet` 实例：

*PetOperations.java*

<Tabs>
  <TabItem value="Java" label="Java" default>

```java
import io.micronaut.http.annotation.Post;
import io.micronaut.validation.Validated;
import org.reactivestreams.Publisher;
import io.micronaut.core.async.annotation.SingleResult;
import javax.validation.constraints.Min;
import javax.validation.constraints.NotBlank;

@Validated
public interface PetOperations {
    @Post
    @SingleResult
    Publisher<Pet> save(@NotBlank String name, @Min(1L) int age);
}
```

  </TabItem>
  <TabItem value="Groovy" label="Groovy">

```groovy
import io.micronaut.http.annotation.Post
import io.micronaut.validation.Validated
import org.reactivestreams.Publisher
import io.micronaut.core.async.annotation.SingleResult
import javax.validation.constraints.Min
import javax.validation.constraints.NotBlank

@Validated
interface PetOperations {
    @Post
    @SingleResult
    Publisher<Pet> save(@NotBlank String name, @Min(1L) int age)
}
```

  </TabItem>
  <TabItem value="Kotlin" label="Kotlin">

```kt
import io.micronaut.http.annotation.Post
import io.micronaut.validation.Validated
import javax.validation.constraints.Min
import javax.validation.constraints.NotBlank
import io.micronaut.core.async.annotation.SingleResult
import org.reactivestreams.Publisher

@Validated
interface PetOperations {
    @Post
    @SingleResult
    fun save(@NotBlank name: String, @Min(1L) age: Int): Publisher<Pet>
}
```

  </TabItem>
</Tabs>

注意这个接口是如何使用 Micronaut 的 HTTP 注解的，这在服务器和客户端都是可用的。你也可以使用 `javax.validation` 约束来验证参数。

:::note 提示
请注意，一些注解，如 [Produces](https://docs.micronaut.io/latest/api/io/micronaut/http/annotation/Produces.html) 和 [Consumes](https://docs.micronaut.io/latest/api/io/micronaut/http/annotation/Consumes.html)，在服务器端和客户端的使用中具有不同的语义。例如，控制器方法（服务器端）上的 `@Produces` 表示该方法的**返回值**的格式，而客户端的 `@Produces` 表示该方法的**参数**在发送到服务器时的格式。虽然这看起来有点混乱，但考虑到服务器生产/消费与客户端之间的不同语义，这是合乎逻辑的：服务器消费一个参数并向客户端**返回**一个响应，而客户端消费一个参数并向服务器**发送**输出。
:::

此外，要使用 `javax.validation` 的功能，请将 `validation` 模块添加到你的构建中：

<Tabs>
  <TabItem value="Gradle" label="Gradle">

```groovy
implementation("io.micronaut:micronaut-validation")
```

  </TabItem>
  <TabItem value="Maven" label="Maven">

```xml
<dependency>
    <groupId>io.micronaut</groupId>
    <artifactId>micronaut-validation</artifactId>
</dependency>
```

  </TabItem>
</Tabs>

在 Micronaut 的服务器端，你可以实现 `PetOperations` 接口：

*PetController.java*

<Tabs>
  <TabItem value="Java" label="Java" default>

```java
import io.micronaut.http.annotation.Controller;
import org.reactivestreams.Publisher;
import reactor.core.publisher.Mono;
import io.micronaut.core.async.annotation.SingleResult;

@Controller("/pets")
public class PetController implements PetOperations {

    @Override
    @SingleResult
    public Publisher<Pet> save(String name, int age) {
        Pet pet = new Pet();
        pet.setName(name);
        pet.setAge(age);
        // save to database or something
        return Mono.just(pet);
    }
}
```

  </TabItem>
  <TabItem value="Groovy" label="Groovy">

```groovy
import io.micronaut.http.annotation.Controller
import org.reactivestreams.Publisher
import io.micronaut.core.async.annotation.SingleResult
import reactor.core.publisher.Mono

@Controller("/pets")
class PetController implements PetOperations {

    @Override
    @SingleResult
    Publisher<Pet> save(String name, int age) {
        Pet pet = new Pet(name: name, age: age)
        // save to database or something
        return Mono.just(pet)
    }
}
```

  </TabItem>
  <TabItem value="Kotlin" label="Kotlin">

```kt
import io.micronaut.http.annotation.Controller
import reactor.core.publisher.Mono
import io.micronaut.core.async.annotation.SingleResult
import org.reactivestreams.Publisher

@Controller("/pets")
open class PetController : PetOperations {

    @SingleResult
    override fun save(name: String, age: Int): Publisher<Pet> {
        val pet = Pet()
        pet.name = name
        pet.age = age
        // save to database or something
        return Mono.just(pet)
    }
}
```

  </TabItem>
</Tabs>

然后你可以在 `src/test/java` 中定义一个声明性的客户端，使用 `@Client` 来在编译时自动实现一个客户端：

*PetClient.java*

<Tabs>
  <TabItem value="Java" label="Java" default>

```java
import io.micronaut.http.client.annotation.Client;
import org.reactivestreams.Publisher;
import io.micronaut.core.async.annotation.SingleResult;
import javax.validation.constraints.Min;
import javax.validation.constraints.NotBlank;

@Client("/pets") // (1)
public interface PetClient extends PetOperations { // (2)

    @Override
    @SingleResult
    Publisher<Pet> save(@NotBlank String name, @Min(1L) int age); // (3)
}
```

  </TabItem>
  <TabItem value="Groovy" label="Groovy">

```groovy
import io.micronaut.http.client.annotation.Client
import org.reactivestreams.Publisher
import io.micronaut.core.async.annotation.SingleResult

@Client("/pets") // (1)
interface PetClient extends PetOperations { // (2)

    @Override
    @SingleResult
    Publisher<Pet> save(String name, int age) // (3)
}
```

  </TabItem>
  <TabItem value="Kotlin" label="Kotlin">

```kt
import io.micronaut.http.client.annotation.Client
import io.micronaut.core.async.annotation.SingleResult
import org.reactivestreams.Publisher

@Client("/pets") // (1)
interface PetClient : PetOperations { // (2)

    @SingleResult
    override fun save(name: String, age: Int): Publisher<Pet> // (3)
}
```

  </TabItem>
</Tabs>

1. 客户端注解用于相对于当前服务器的值，在本例中为 `/pets`。
2. 该接口延伸自 `PetOperations`
3. `save` 方法被重写了。见下面的警告。

:::warning 警告
注意在上面的例子中，我们覆盖了 `save` 方法。如果你在编译时没有使用 `-parameters` 选项，这是必要的，因为否则 Java 不会在字节码中保留参数名称。如果你在编译时使用了 `-parameters`，则不需要覆盖。此外，当覆盖方法时，你应该确保再次声明任何验证注解，因为这些注解不是[继承](https://docs.oracle.com/javase/8/docs/api/java/lang/annotation/Inherited.html)的。
:::

一旦你定义了一个客户端，你就可以在你需要它的地方 `@Inject` 它。
回顾一下，`@Client` 的值可以是：
- 一个绝对的 URI，例如：https://api.twitter.com/1.1
- 一个相对的 URI，在这种情况下，目标服务器是当前的服务器（对测试有用）。
- 一个服务标识符。关于这个主题的更多信息，参阅[服务发现](/core/cloud/serviceDiscovery)一节。

在生产中，你通常使用服务ID和服务发现来自动发现服务。

关于上面例子中的save方法，需要注意的另一件重要事情是，它返回一个 [Single](http://reactivex.io/RxJava/2.x/javadoc/io/reactivex/Single.html) 类型。

这是一个非阻塞的响应式类型——通常你希望你的 HTTP 客户端不阻塞。在某些情况下，你可能希望 HTTP 客户端会阻塞（例如在单元测试中），但这是很罕见的。

下表说明了可用于 [@Client](https://docs.micronaut.io/latest/api/io/micronaut/http/client/annotation/Client.html) 的常见返回类型：

*表 1.Micronaut 返回类型*

|类型|描述|示例签名|
|--|--|--|
|[Publisher](http://www.reactive-streams.org/reactive-streams-1.0.3-javadoc/org/reactivestreams/Publisher.html)|实现 [Publisher](http://www.reactive-streams.org/reactive-streams-1.0.3-javadoc/org/reactivestreams/Publisher.html) 接口的任意类型|`Flux<String> hello()`|
|[HttpResponse](https://docs.micronaut.io/latest/api/io/micronaut/http/HttpResponse.html)|一个 [HttpResponse](https://docs.micronaut.io/latest/api/io/micronaut/http/HttpResponse.html) 以及可选的响应体类型|`Mono<HttpResponse<String>> hello()`|
|[Publisher](http://www.reactive-streams.org/reactive-streams-1.0.3-javadoc/org/reactivestreams/Publisher.html)|[Publisher](http://www.reactive-streams.org/reactive-streams-1.0.3-javadoc/org/reactivestreams/Publisher.html) 的实现并发射一个 POJO|`Mono<Book> hello()`|
|[CompletableFuture](https://docs.oracle.com/javase/8/docs/api/java/util/concurrent/CompletableFuture.html)|一个 Java `CompletableFuture` 实体|`CompletableFuture<String> hello()`|
|[CharSequence](https://docs.oracle.com/javase/8/docs/api/java/lang/CharSequence.html)|一个阻塞的本地类型，比如 `String`|`String hello()`|
|T|任意简单的 POJO 类型|`Book show()`|

一般来说，任何可以转换为 [Publisher](http://www.reactive-streams.org/reactive-streams-1.0.3-javadoc/org/reactivestreams/Publisher.html) 接口的响应式类型都支持作为返回类型，包括（但不限于）由 RxJava 1.x、RxJava 2.x 和 Reactor 3.x 定义的响应式类型。

也支持返回 [CompletableFuture](https://docs.oracle.com/javase/8/docs/api/java/util/concurrent/CompletableFuture.html) 实例。请注意，返回任何其他类型都会*导致阻塞请求*，除了用于测试外，不建议使用该类型。

## 7.3.1 自定义参数绑定

前面的例子介绍了一个使用方法参数来表示 POST 请求正文的简单例子：

*PetOperations.java*

```java
@Post
@SingleResult
Publisher<Pet> save(@NotBlank String name, @Min(1L) int age);
```

此 `save` 方法执行 HTTP `POST`，默认情况下有以下 JSON：

```json
{"name":"Dino", "age":10}
```

然而，你可能想自定义作为主体发送的内容、参数、URI 变量等。在这方面，[@Client](https://docs.micronaut.io/latest/api/io/micronaut/http/client/annotation/Client.html) 注解是非常灵活的，它支持与 Micronaut 的 HTTP 服务器相同的 [io.micronaut.http.annotation](https://docs.micronaut.io/latest/api/io/micronaut/http/annotation/package-summary.html)。

例如，下面定义了一个 URI 模板，name 参数被用作 URI 模板的一部分，而 @Body 声明了要发送给服务器的内容由 `Pet` POJO 表示：

*PetOperations.java*

```java
@Post("/{name}")
Mono<Pet> save(
    @NotBlank String name, (1)
    @Body @Valid Pet pet) (2)
```

1. 名字参数，作为 URI 的一部分包括在内，并声明 `@NotBlank`
2. `pet` 参数，用于编码正文，并声明 `@Valid`

下表总结了参数注解及其目的，并提供了一个例子：

*表 1. 参数绑定注解*

|注解|描述|示例|
|--|--|--|
|[@Body](https://docs.micronaut.io/latest/api/io/micronaut/http/annotation/Body.html)|指定请求体的参数|`@Body String body`|
|[@CookieValue](https://docs.micronaut.io/latest/api/io/micronaut/http/annotation/CookieValue.html)|指定作为 cookies 发送的参数|`@CookieValue String myCookie`|
|[@Header](https://docs.micronaut.io/latest/api/io/micronaut/http/annotation/Header.html)|指定作为 HTTP 头发送的参数|`@Header String requestId`|
|[@QueryValue](https://docs.micronaut.io/latest/api/io/micronaut/http/annotation/QueryValue.html)|用于绑定的自定义 URI 参数的名称|`@QueryValue("userAge") Integer age`|
|[@PathVariable](https://docs.micronaut.io/latest/api/io/micronaut/http/annotation/PathVariable.html)|以独占方式从路径变量中绑定参数|`@PathVariable Long id`|
|[@RequestAttribute](https://docs.micronaut.io/latest/api/io/micronaut/http/annotation/RequestAttribute.html)|指定要设置为请求属性的参数|`@RequestAttribute Integer locationId`|

:::danger 注意
始终使用 [@Produces](https://docs.micronaut.io/latest/api/io/micronaut/http/annotation/Produces.html) 或 [@Consumes](https://docs.micronaut.io/latest/api/io/micronaut/http/annotation/Consumes.html)，而不是为 `Content-Type` 或 `Accept` 提供一个头。
:::

### 查询值格式化

[Format](https://docs.micronaut.io/latest/api/io/micronaut/core/convert/format/Format.html) 注解可以与 `@QueryValue` 注解一起使用，以格式化查询值。

支持的值是：`"csv"`、`"ssv"`、`"pipes"`、`"multi"` 和 `"deep-object"`，其含义类似于 Open API v3 查询参数的样式属性。

该格式只能应用于 `java.lang.Iterable`、`java.util.Map` 或带有 [Introspected](https://docs.micronaut.io/latest/api/io/micronaut/core/annotation/Introspected.html) 注解的 POJO。下表给出了不同值的格式化的例子：

|格式|迭代的例子|Map 或 POJO 示例|
|--|--|--|
|原始值|`["Mike", "Adam", "Kate"]`|`{"name": "Mike", "age": 30"}`|
|`"CSV"`|`"param=Mike,Adam,Kate"`|`"param=name,Mike,age,30"`|
|`"SSV"`|`"param=Mike Adam Kate"`|`"param=name Mike age 30"`|
|`"PIPES"`|`"param=Mike|Adam|Kate"`|`"param=name|Mike|age|30"`|
|`"MULTI"`|`"param=Mike&param=Adam&param=Kate"`|`"name=Mike&age=30"`|
|`"DEEP_OBJECT"`|`"param[0]=Mike&param[1]=Adam&param[2]=Kate"`|`"param[name]=Mike&param[age]=30"`|

**基于类型的参数绑定**

有些参数是通过其类型而不是注解来识别的。下表总结了这些参数类型和它们的用途，并提供了一个例子：

|类型|描述|示例|
|--|--|--|
|[BasicAuth](https://docs.micronaut.io/latest/api/io/micronaut/http/BasicAuth.html)|设置 `Authorization` 头|BasicAuth basicAuth|
|[HttpHeaders](https://docs.micronaut.io/latest/api/io/micronaut/http/HttpHeaders.html)|添加多个头到请求|HttpHeaders headers|
|[Cookies](https://docs.micronaut.io/latest/api/io/micronaut/http/cookie/Cookies.html)|添加多个 cookie 到请求|Cookies cookies|
|[Cookie](https://docs.micronaut.io/latest/api/io/micronaut/http/cookie/Cookie.html)|添加 cookie 到请求|Cookie cookie|
|[Locale](https://docs.oracle.com/javase/8/docs/api/java/util/Locale.html)|设置 `Accept-Language` 头。用 [@QueryValue](https://docs.micronaut.io/latest/api/io/micronaut/http/annotation/QueryValue.html) 或 [@PathVariable](https://docs.micronaut.io/latest/api/io/micronaut/http/annotation/PathVariable.html) 进行注解，以填充 URI 变量。|Locale locale|

**自定义绑定**

[ClientArgumentRequestBinder](https://docs.micronaut.io/latest/api/io/micronaut/http/client/bind/ClientArgumentRequestBinder.html) API 将客户端参数绑定到请求中。在绑定过程中会自动使用注册为 bean 的自定义绑定器类。首先搜索基于注解的绑定器，如果没有找到一个绑定器，则搜索基于类型的绑定器。

**通过注解绑定**

要控制一个参数如何根据该参数的注解被绑定到请求中，请创建一个 [AnnotatedClientArgumentRequestBinder](https://docs.micronaut.io/latest/api/io/micronaut/http/client/bind/AnnotatedClientArgumentRequestBinder.html) 类型的 Bean。任何自定义注解都必须用 [@Bindable](https://docs.micronaut.io/latest/api/io/micronaut/core/bind/annotation/Bindable.html) 来注解。

在这个例子中，请看下面这个客户端：

*带 @Metadata 参数的客户端*

<Tabs>
  <TabItem value="Java" label="Java" default>

```java
@Client("/")
public interface MetadataClient {

    @Get("/client/bind")
    String get(@Metadata Map<String, Object> metadata);
}
```

  </TabItem>
  <TabItem value="Groovy" label="Groovy">

```groovy
@Client("/")
interface MetadataClient {

    @Get("/client/bind")
    String get(@Metadata Map metadata)
}
```

  </TabItem>
  <TabItem value="Kotlin" label="Kotlin">

```kt
@Client("/")
interface MetadataClient {

    @Get("/client/bind")
    String get(@Metadata Map metadata)
}
```

  </TabItem>
</Tabs>

该参数使用以下注解：

*@Metadata 注解*

<Tabs>
  <TabItem value="Java" label="Java" default>

```java
import io.micronaut.core.bind.annotation.Bindable;

import java.lang.annotation.Documented;
import java.lang.annotation.Retention;
import java.lang.annotation.Target;

import static java.lang.annotation.ElementType.PARAMETER;
import static java.lang.annotation.RetentionPolicy.RUNTIME;

@Documented
@Retention(RUNTIME)
@Target(PARAMETER)
@Bindable
public @interface Metadata {
}
```

  </TabItem>
  <TabItem value="Groovy" label="Groovy">

```groovy
import io.micronaut.core.bind.annotation.Bindable

import java.lang.annotation.Documented
import java.lang.annotation.Retention
import java.lang.annotation.Target

import static java.lang.annotation.ElementType.PARAMETER
import static java.lang.annotation.RetentionPolicy.RUNTIME

@Documented
@Retention(RUNTIME)
@Target(PARAMETER)
@Bindable
@interface Metadata {
}
```

  </TabItem>
  <TabItem value="Kotlin" label="Kotlin">

```kt
import io.micronaut.core.bind.annotation.Bindable
import kotlin.annotation.AnnotationRetention.RUNTIME
import kotlin.annotation.AnnotationTarget.VALUE_PARAMETER

@MustBeDocumented
@Retention(RUNTIME)
@Target(VALUE_PARAMETER)
@Bindable
annotation class Metadata
```

  </TabItem>
</Tabs>

在没有任何额外代码的情况下，客户端试图将元数据转换为一个字符串，并将其作为查询参数附加。在这种情况下，这并不是想要的效果，所以需要一个自定义的绑定器。

下面的绑定器处理传递给客户端的参数，这些参数被 `@Metadata` 注解，并突变请求以包含所需的头文件。该实现可以被修改以接受除 `Map` 之外的更多数据类型。

*注解参数绑定器*

<Tabs>
  <TabItem value="Java" label="Java" default>

```java
import io.micronaut.core.annotation.NonNull;
import io.micronaut.core.convert.ArgumentConversionContext;
import io.micronaut.core.naming.NameUtils;
import io.micronaut.core.util.StringUtils;
import io.micronaut.http.MutableHttpRequest;
import io.micronaut.http.client.bind.AnnotatedClientArgumentRequestBinder;
import io.micronaut.http.client.bind.ClientRequestUriContext;

import jakarta.inject.Singleton;
import java.util.Map;

@Singleton
public class MetadataClientArgumentBinder implements AnnotatedClientArgumentRequestBinder<Metadata> {

    @NonNull
    @Override
    public Class<Metadata> getAnnotationType() {
        return Metadata.class;
    }

    @Override
    public void bind(@NonNull ArgumentConversionContext<Object> context,
                     @NonNull ClientRequestUriContext uriContext,
                     @NonNull Object value,
                     @NonNull MutableHttpRequest<?> request) {
        if (value instanceof Map) {
            for (Map.Entry<?, ?> entry: ((Map<?, ?>) value).entrySet()) {
                String key = NameUtils.hyphenate(StringUtils.capitalize(entry.getKey().toString()), false);
                request.header("X-Metadata-" + key, entry.getValue().toString());
            }
        }
    }
}
```

  </TabItem>
  <TabItem value="Groovy" label="Groovy">

```groovy
import io.micronaut.core.annotation.NonNull
import io.micronaut.core.convert.ArgumentConversionContext
import io.micronaut.core.naming.NameUtils
import io.micronaut.core.util.StringUtils
import io.micronaut.http.MutableHttpRequest
import io.micronaut.http.client.bind.AnnotatedClientArgumentRequestBinder
import io.micronaut.http.client.bind.ClientRequestUriContext

import jakarta.inject.Singleton

@Singleton
class MetadataClientArgumentBinder implements AnnotatedClientArgumentRequestBinder<Metadata> {

    final Class<Metadata> annotationType = Metadata

    @Override
    void bind(@NonNull ArgumentConversionContext<Object> context,
              @NonNull ClientRequestUriContext uriContext,
              @NonNull Object value,
              @NonNull MutableHttpRequest<?> request) {
        if (value instanceof Map) {
            for (entry in value.entrySet()) {
                String key = NameUtils.hyphenate(StringUtils.capitalize(entry.key as String), false)
                request.header("X-Metadata-$key", entry.value as String)
            }
        }
    }
}
```

  </TabItem>
  <TabItem value="Kotlin" label="Kotlin">

```kt
import io.micronaut.core.convert.ArgumentConversionContext
import io.micronaut.core.naming.NameUtils
import io.micronaut.core.util.StringUtils
import io.micronaut.http.MutableHttpRequest
import io.micronaut.http.client.bind.AnnotatedClientArgumentRequestBinder
import io.micronaut.http.client.bind.ClientRequestUriContext
import jakarta.inject.Singleton

@Singleton
class MetadataClientArgumentBinder : AnnotatedClientArgumentRequestBinder<Metadata> {

    override fun getAnnotationType(): Class<Metadata> {
        return Metadata::class.java
    }

    override fun bind(context: ArgumentConversionContext<Any>,
                      uriContext: ClientRequestUriContext,
                      value: Any,
                      request: MutableHttpRequest<*>) {
        if (value is Map<*, *>) {
            for ((key1, value1) in value) {
                val key = NameUtils.hyphenate(StringUtils.capitalize(key1.toString()), false)
                request.header("X-Metadata-$key", value1.toString())
            }
        }
    }
}
```

  </TabItem>
</Tabs>

**按类型绑定**

为了根据参数的类型绑定到请求，创建一个类型为 [TypedClientArgumentRequestBinder](https://docs.micronaut.io/latest/api/io/micronaut/http/client/bind/TypedClientArgumentRequestBinder.html) 的 bean。

在这个例子中，请看下面的客户端：

*带有元数据参数的客户端*

<Tabs>
  <TabItem value="Java" label="Java" default>

```java
@Client("/")
public interface MetadataClient {

    @Get("/client/bind")
    String get(Metadata metadata);
}
```

  </TabItem>
  <TabItem value="Groovy" label="Groovy">

```groovy
@Client("/")
interface MetadataClient {

    @Get("/client/bind")
    String get(Metadata metadata)
}
```

  </TabItem>
  <TabItem value="Kotlin" label="Kotlin">

```kt
@Client("/")
interface MetadataClient {

    @Get("/client/bind")
    operator fun get(metadata: Metadata?): String?
}
```

  </TabItem>
</Tabs>

在没有任何额外代码的情况下，客户端试图将元数据转换为一个字符串，并将其作为查询参数附加。在这种情况下，这并不是想要的效果，所以需要一个自定义的绑定器。

下面的绑定器处理传递给客户端的 `Metadata` 类型的参数，并将请求突变为包含所需的头。

*类型化参数绑定器*

<Tabs>
  <TabItem value="Java" label="Java" default>

```java
import io.micronaut.core.annotation.NonNull;
import io.micronaut.core.convert.ArgumentConversionContext;
import io.micronaut.core.type.Argument;
import io.micronaut.http.MutableHttpRequest;
import io.micronaut.http.client.bind.ClientRequestUriContext;
import io.micronaut.http.client.bind.TypedClientArgumentRequestBinder;

import jakarta.inject.Singleton;

@Singleton
public class MetadataClientArgumentBinder implements TypedClientArgumentRequestBinder<Metadata> {

    @Override
    @NonNull
    public Argument<Metadata> argumentType() {
        return Argument.of(Metadata.class);
    }

    @Override
    public void bind(@NonNull ArgumentConversionContext<Metadata> context,
                     @NonNull ClientRequestUriContext uriContext,
                     @NonNull Metadata value,
                     @NonNull MutableHttpRequest<?> request) {
        request.header("X-Metadata-Version", value.getVersion().toString());
        request.header("X-Metadata-Deployment-Id", value.getDeploymentId().toString());
    }
}
```

  </TabItem>
  <TabItem value="Groovy" label="Groovy">

```groovy
import io.micronaut.core.annotation.NonNull
import io.micronaut.core.convert.ArgumentConversionContext
import io.micronaut.core.type.Argument
import io.micronaut.http.MutableHttpRequest
import io.micronaut.http.client.bind.ClientRequestUriContext
import io.micronaut.http.client.bind.TypedClientArgumentRequestBinder

import jakarta.inject.Singleton

@Singleton
class MetadataClientArgumentBinder implements TypedClientArgumentRequestBinder<Metadata> {

    @Override
    @NonNull
    Argument<Metadata> argumentType() {
        Argument.of(Metadata)
    }

    @Override
    void bind(@NonNull ArgumentConversionContext<Metadata> context,
              @NonNull ClientRequestUriContext uriContext,
              @NonNull Metadata value,
              @NonNull MutableHttpRequest<?> request) {
        request.header("X-Metadata-Version", value.version.toString())
        request.header("X-Metadata-Deployment-Id", value.deploymentId.toString())
    }
}
```

  </TabItem>
  <TabItem value="Kotlin" label="Kotlin">

```kt
import io.micronaut.core.convert.ArgumentConversionContext
import io.micronaut.core.type.Argument
import io.micronaut.http.MutableHttpRequest
import io.micronaut.http.client.bind.ClientRequestUriContext
import io.micronaut.http.client.bind.TypedClientArgumentRequestBinder
import jakarta.inject.Singleton

@Singleton
class MetadataClientArgumentBinder : TypedClientArgumentRequestBinder<Metadata> {

    override fun argumentType(): Argument<Metadata> {
        return Argument.of(Metadata::class.java)
    }

    override fun bind(
        context: ArgumentConversionContext<Metadata>,
        uriContext: ClientRequestUriContext,
        value: Metadata,
        request: MutableHttpRequest<*>
    ) {
        request.header("X-Metadata-Version", value.version.toString())
        request.header("X-Metadata-Deployment-Id", value.deploymentId.toString())
    }
}
```

  </TabItem>
</Tabs>

**方法上绑定**

也可以创建一个绑定器，它可以通过方法上的注解来改变请求。比如说：

*带有注解的方法的客户端*

<Tabs>
  <TabItem value="Java" label="Java" default>

```java
@Client("/")
public interface NameAuthorizedClient {

    @Get("/client/authorized-resource")
    @NameAuthorization(name="Bob") // (1)
    String get();
}
```

  </TabItem>
  <TabItem value="Groovy" label="Groovy">

```groovy
@Client("/")
public interface NameAuthorizedClient {

    @Get("/client/authorized-resource")
    @NameAuthorization(name="Bob") // (1)
    String get()
}
```

  </TabItem>
  <TabItem value="Kotlin" label="Kotlin">

```kt
@Client("/")
public interface NameAuthorizedClient {

    @Get("/client/authorized-resource")
    @NameAuthorization(name="Bob") // (1)
    fun get(): String
}
```

  </TabItem>
</Tabs>

1. `@NameAuthorization` 注解了一个方法

此注解如下定义：

*注解定义*

<Tabs>
  <TabItem value="Java" label="Java" default>

```java
@Documented
@Retention(RUNTIME)
@Target(METHOD) // (1)
@Bindable
public @interface NameAuthorization {
    @AliasFor(member = "name")
    String value() default "";

    @AliasFor(member = "value")
    String name() default "";
}
```

  </TabItem>
  <TabItem value="Groovy" label="Groovy">

```groovy
@Documented
@Retention(RUNTIME)
@Target(METHOD) // (1)
@Bindable
@interface NameAuthorization {
    @AliasFor(member = "name")
    String value() default ""

    @AliasFor(member = "value")
    String name() default ""
}
```

  </TabItem>
  <TabItem value="Kotlin" label="Kotlin">

```kt
@MustBeDocumented
@Retention(RUNTIME)
@Target(FUNCTION) // (1)
@Bindable
annotation class NameAuthorization(val name: String = "")
```

  </TabItem>
</Tabs>

1. 它被定义为在方法上使用

下面的绑定器指定了该行为：

*注解定义*

<Tabs>
  <TabItem value="Java" label="Java" default>

```java
@Singleton // (1)
public class NameAuthorizationBinder implements AnnotatedClientRequestBinder<NameAuthorization> { // (2)
    @NonNull
    @Override
    public Class<NameAuthorization> getAnnotationType() {
        return NameAuthorization.class;
    }

    @Override
    public void bind( // (3)
            @NonNull MethodInvocationContext<Object, Object> context,
            @NonNull ClientRequestUriContext uriContext,
            @NonNull MutableHttpRequest<?> request
    ) {
        context.getValue(NameAuthorization.class)
                .ifPresent(name -> uriContext.addQueryParameter("name", String.valueOf(name)));

    }
}
```

  </TabItem>
  <TabItem value="Groovy" label="Groovy">

```groovy
@Singleton // (1)
public class NameAuthorizationBinder implements AnnotatedClientRequestBinder<NameAuthorization> { // (2)
    @NonNull
    @Override
    Class<NameAuthorization> getAnnotationType() {
        return NameAuthorization.class
    }

    @Override
    void bind( // (3)
            @NonNull MethodInvocationContext<Object, Object> context,
            @NonNull ClientRequestUriContext uriContext,
            @NonNull MutableHttpRequest<?> request
    ) {
        context.getValue(NameAuthorization.class)
                .ifPresent(name -> uriContext.addQueryParameter("name", String.valueOf(name)))

    }
}
```

  </TabItem>
  <TabItem value="Kotlin" label="Kotlin">

```kt
import io.micronaut.http.client.bind.AnnotatedClientRequestBinder

@Singleton // (1)
class NameAuthorizationBinder: AnnotatedClientRequestBinder<NameAuthorization> { // (2)
    @NonNull
    override fun getAnnotationType(): Class<NameAuthorization> {
        return NameAuthorization::class.java
    }

    override fun bind( // (3)
            @NonNull context: MethodInvocationContext<Any, Any>,
            @NonNull uriContext: ClientRequestUriContext,
            @NonNull request: MutableHttpRequest<*>
    ) {
        context.getValue(NameAuthorization::class.java, "name")
                .ifPresent { name -> uriContext.addQueryParameter("name", name.toString()) }

    }
}
```

  </TabItem>
</Tabs>

1. `@Singleton` 注解将其注册在Micronaut上下文中。
2. 它实现了 `AnnotatedClientRequestBinder<NameAuthorization>`。
3. 自定义 `bind` 方法被用来实现绑定器的行为

## 7.3.2 使用 @Client 传输流

[@Client](https://docs.micronaut.io/latest/api/io/micronaut/http/client/annotation/Client.html) 注解还可以处理流式 HTTP 响应。

**使用 @Client 处理流式 JSON**

例如，要编写一个 [JSON 流式](#734-通过-HTTP-传输J-SON-流)文档章节中定义的控制器流数据的客户端，你可以定义一个返回非绑定 [Publisher](http://www.reactive-streams.org/reactive-streams-1.0.3-javadoc/org/reactivestreams/Publisher.html)（如 Reactor 的 [Flux](https://projectreactor.io/docs/core/release/api/reactor/core/publisher/Flux.html) 或 RxJava 的 [Flowable](http://reactivex.io/RxJava/2.x/javadoc/io/reactivex/Flowable.html)）的客户端：

*HeadlineClient.java*

<Tabs>
  <TabItem value="Java" label="Java" default>

```java
import io.micronaut.http.annotation.Get;
import io.micronaut.http.client.annotation.Client;
import org.reactivestreams.Publisher;
import reactor.core.publisher.Flux;
import static io.micronaut.http.MediaType.APPLICATION_JSON_STREAM;

@Client("/streaming")
public interface HeadlineClient {

    @Get(value = "/headlines", processes = APPLICATION_JSON_STREAM) // (1)
    Publisher<Headline> streamHeadlines(); // (2)

}
```

  </TabItem>
  <TabItem value="Groovy" label="Groovy">

```groovy
import io.micronaut.http.annotation.Get
import io.micronaut.http.client.annotation.Client
import org.reactivestreams.Publisher

import static io.micronaut.http.MediaType.APPLICATION_JSON_STREAM

@Client("/streaming")
interface HeadlineClient {

    @Get(value = "/headlines", processes = APPLICATION_JSON_STREAM) // (1)
    Publisher<Headline> streamHeadlines() // (2)

}
```

  </TabItem>
  <TabItem value="Kotlin" label="Kotlin">

```kt
import io.micronaut.http.MediaType.APPLICATION_JSON_STREAM
import io.micronaut.http.annotation.Get
import io.micronaut.http.client.annotation.Client
import reactor.core.publisher.Flux


@Client("/streaming")
interface HeadlineClient {

    @Get(value = "/headlines", processes = [APPLICATION_JSON_STREAM]) // (1)
    fun streamHeadlines(): Flux<Headline>  // (2)

}
```

  </TabItem>
</Tabs>

1. `@Get` 方法处理 `APPLICATION_JSON_STREAM` 类型的响应。
2. 返回类型为 `Publisher`

下面的示例展示了如何从测试中调用先前定义的 `HeadlineClient`：

*流式 HeadlineClient*

<Tabs>
  <TabItem value="Java" label="Java" default>

```java
@Test
public void testClientAnnotationStreaming() {
    try(EmbeddedServer embeddedServer = ApplicationContext.run(EmbeddedServer.class)) {
        HeadlineClient headlineClient = embeddedServer
                                            .getApplicationContext()
                                            .getBean(HeadlineClient.class); // (1)

        Mono<Headline> firstHeadline = Mono.from(headlineClient.streamHeadlines()); // (2)

        Headline headline = firstHeadline.block(); // (3)

        assertNotNull(headline);
        assertTrue(headline.getText().startsWith("Latest Headline"));
    }
}
```

  </TabItem>
  <TabItem value="Groovy" label="Groovy">

```groovy
void "test client annotation streaming"() throws Exception {
    when:
    def headlineClient = embeddedServer.applicationContext
                                       .getBean(HeadlineClient) // (1)

    Mono<Headline> firstHeadline = Mono.from(headlineClient.streamHeadlines()) // (2)

    Headline headline = firstHeadline.block() // (3)

    then:
    headline
    headline.text.startsWith("Latest Headline")
}
```

  </TabItem>
  <TabItem value="Kotlin" label="Kotlin">

```kt
"test client annotation streaming" {
    val headlineClient = embeddedServer
            .applicationContext
            .getBean(HeadlineClient::class.java) // (1)

    val firstHeadline = headlineClient.streamHeadlines().next() // (2)

    val headline = firstHeadline.block() // (3)

    headline shouldNotBe null
    headline.text shouldStartWith "Latest Headline"
}
```

  </TabItem>
</Tabs>

1. 客户端从 [ApplicationContext](https://docs.micronaut.io/latest/api/io/micronaut/context/ApplicationContext.html) 中获取
2. 下一个方法是将 [Flux](https://projectreactor.io/docs/core/release/api/reactor/core/publisher/Flux.html) 发出的第一个元素发射到 [Mono](https://projectreactor.io/docs/core/release/api/reactor/core/publisher/Mono.html) 的 `next` 中。
3. `block()` 方法检索测试结果。

**流客户端和响应类型**

上一节定义的示例希望服务器响应一个 JSON 对象流，内容类型为 `application/x-json-stream`。例如：

*一个 JSON 流*

```json
{"title":"The Stand"}
{"title":"The Shining"}
```

原因很简单，JSON 对象序列实际上不是有效的 JSON，因此响应内容类型不能是 `application/json`。要使 JSON 有效，必须返回一个数组：

*一个 JSON 数组*

```json
[
    {"title":"The Stand"},
    {"title":"The Shining"}
]
```

然而，Micronaut 的客户端通过 `application/x-json-stream` 支持单个 JSON 对象的流，也支持用 `application/json` 定义的 JSON 数组。

如果服务器返回的是 `application/json`，并且返回的是一个非单一的 [Publisher](http://www.reactive-streams.org/reactive-streams-1.0.3-javadoc/org/reactivestreams/Publisher.html)（如 Reactor 的 [Flux](https://projectreactor.io/docs/core/release/api/reactor/core/publisher/Flux.html) 或 RxJava 的 [Flowable](http://reactivex.io/RxJava/2.x/javadoc/io/reactivex/Flowable.html)），客户端会在数组元素可用时将其流化。

**流客户端及读取超时**

当从服务器流式传输响应时，底层 HTTP 客户端不会应用 [HttpClientConfiguration](https://docs.micronaut.io/latest/api/io/micronaut/http/client/HttpClientConfiguration.html) 的默认 `readTimeout` 设置（默认为 10 秒），因为流式传输响应的读取延迟可能不同于正常读取。

取而代之的是 `read-idle-timeout` 设置（默认值为 5 分钟），它决定了在连接闲置后何时关闭连接。

如果你从定义了比 5 分钟更长延迟的服务器流式传输数据，则应调整 `readIdleTimeout`。配置文件（如 `application.yml`）中的以下配置演示了如何调整：

*调整 readIdleTimeout*

<Tabs>
  <TabItem value="Properties" label="Properties">

```properties
micronaut.http.client.read-idle-timeout=10m
```

  </TabItem>
  <TabItem value="Yaml" label="Yaml">

```yaml
micronaut:
  http:
    client:
      read-idle-timeout: 10m
```

  </TabItem>
    <TabItem value="Toml" label="Toml">

```toml
[micronaut]
  [micronaut.http]
    [micronaut.http.client]
      read-idle-timeout="10m"
```

  </TabItem>
    <TabItem value="Groovy" label="Groovy">

```groovy
micronaut {
  http {
    client {
      readIdleTimeout = "10m"
    }
  }
}
```

  </TabItem>
    <TabItem value="Hoon" label="Hoon">

```hoon
{
  micronaut {
    http {
      client {
        read-idle-timeout = "10m"
      }
    }
  }
}
```

  </TabItem>
    <TabItem value="JSON" label="JSON">

```json
{
  "micronaut": {
    "http": {
      "client": {
        "read-idle-timeout": "10m"
      }
    }
  }
}
```

  </TabItem>
</Tabs>

上例将 `readIdleTimeout` 设置为 10 分钟。

**流媒体服务器发送事件**

Micronaut 为服务器发送事件（SSE）提供了一个本地客户端，由接口 [SseClient](https://docs.micronaut.io/latest/api/io/micronaut/http/client/sse/SseClient.html) 定义。

你可以使用该客户端从任何服务器发送 SSE 事件。

:::tip 提示
尽管 SSE 流通常由浏览器 `EventSource` 消费，但在某些情况下，你可能希望通过 [SseClient](https://docs.micronaut.io/latest/api/io/micronaut/http/client/sse/SseClient.html) 消耗 SSE 流，例如在单元测试中或当 Micronaut 服务作为另一个服务的网关时。
:::

[@Client](https://docs.micronaut.io/latest/api/io/micronaut/http/client/annotation/Client.html) 注解还支持消费 SSE 流。例如，请看下面的控制器方法，它产生一个 SSE 事件流：

*SSE 控制器*

<Tabs>
  <TabItem value="Java" label="Java" default>

```java
@Get(value = "/headlines", processes = MediaType.TEXT_EVENT_STREAM) // (1)
Publisher<Event<Headline>> streamHeadlines() {
    return Flux.<Event<Headline>>create((emitter) -> {  // (2)
        Headline headline = new Headline();
        headline.setText("Latest Headline at " + ZonedDateTime.now());
        emitter.next(Event.of(headline));
        emitter.complete();
    }, FluxSink.OverflowStrategy.BUFFER)
            .repeat(100) // (3)
            .delayElements(Duration.of(1, ChronoUnit.SECONDS)); // (4)
}
```

  </TabItem>
  <TabItem value="Groovy" label="Groovy">

```groovy
@Get(value = "/headlines", processes = MediaType.TEXT_EVENT_STREAM) // (1)
Flux<Event<Headline>> streamHeadlines() {
    Flux.<Event<Headline>>create( { emitter -> // (2)
        Headline headline = new Headline(text: "Latest Headline at ${ZonedDateTime.now()}")
        emitter.next(Event.of(headline))
        emitter.complete()
    }, FluxSink.OverflowStrategy.BUFFER)
            .repeat(100) // (3)
            .delayElements(Duration.of(1, ChronoUnit.SECONDS)) // (4)
}
```

  </TabItem>
  <TabItem value="Kotlin" label="Kotlin">

```kt
@Get(value = "/headlines", processes = MediaType.TEXT_EVENT_STREAM) // (1)
Flux<Event<Headline>> streamHeadlines() {
    Flux.<Event<Headline>>create( { emitter -> // (2)
        Headline headline = new Headline(text: "Latest Headline at ${ZonedDateTime.now()}")
        emitter.next(Event.of(headline))
        emitter.complete()
    }, FluxSink.OverflowStrategy.BUFFER)
            .repeat(100) // (3)
            .delayElements(Duration.of(1, ChronoUnit.SECONDS)) // (4)
}
```

  </TabItem>
</Tabs>

1. 控制器定义了一个 [@Get](https://docs.micronaut.io/latest/api/io/micronaut/http/annotation/Get.html) 注解，生成一个 `MediaType.TEXT_EVENT_STREAM`。
2. 该方法使用 Reactor 发射 `Headline` 对象。
3. `repeat` 方法重复发射 100 次
4. 每次延迟一秒

请注意，控制器的返回类型也是 [Event](https://docs.micronaut.io/latest/api/io/micronaut/http/sse/Event.html)，`Event.of` 方法创建的事件将流式传输到客户端。

要定义一个消费事件的客户端，请定义一个处理 `MediaType.TEXT_EVENT_STREAM` 的方法：

*SSE 客户端*

<Tabs>
  <TabItem value="Java" label="Java" default>

```java
@Client("/streaming/sse")
public interface HeadlineClient {

    @Get(value = "/headlines", processes = TEXT_EVENT_STREAM)
    Publisher<Event<Headline>> streamHeadlines();
}
```

  </TabItem>
  <TabItem value="Groovy" label="Groovy">

```groovy
@Client("/streaming/sse")
interface HeadlineClient {

    @Get(value = "/headlines", processes = TEXT_EVENT_STREAM)
    Publisher<Event<Headline>> streamHeadlines()
}
```

  </TabItem>
  <TabItem value="Kotlin" label="Kotlin">

```kt
@Client("/streaming/sse")
interface HeadlineClient {

    @Get(value = "/headlines", processes = [TEXT_EVENT_STREAM])
    fun streamHeadlines(): Flux<Event<Headline>>
}
```

  </TabItem>
</Tabs>

`Flux` 的通用类型可以是 [Event](https://docs.micronaut.io/latest/api/io/micronaut/http/sse/Event.html)（在这种情况下，你将收到完整的事件对象）或 POJO（在这种情况下，你将只收到由 JSON 转换的事件中包含的数据）。

## 7.3.3 错误响应

如果返回的 HTTP 响应代码为 400 或更高，则会创建一个 [HttpClientResponseException](https://docs.micronaut.io/latest/api/io/micronaut/http/client/exceptions/HttpClientResponseException.html)。该异常包含原始响应。如何抛出异常取决于方法的返回类型。

- 对于反应型响应类型，异常作为错误通过发布者传递。
- 对于阻塞型响应类型，异常被抛出，应由调用者捕获和处理。

:::danger 危险
该规则的一个例外是 HTTP 未找到（404）响应。该例外仅适用于声明式客户端。
:::

阻塞返回类型的 HTTP Not Found (404)响应**不**被视为错误条件，也**不**会抛出客户端异常。这种行为包括返回 `void` 的方法。

如果方法返回 `HttpResponse`，则返回原始响应。如果返回类型是 `Optional`，则返回空的 `Optional`。对于所有其他类型，返回 `null`。

## 7.3.4 自定义请求头

定制请求头有几种方法值得特别提及。

### 使用配置填充头

[@Header](https://docs.micronaut.io/latest/api/io/micronaut/http/annotation/Header.html) 注解可以在类型级别声明，并且是可重复的，因此可以使用注解元数据来驱动通过配置发送的请求头。
下面的示例可以说明这一点：

*通过配置定义头*

<Tabs>
  <TabItem value="Java" label="Java" default>

```java
@Client("/pets")
@Header(name="X-Pet-Client", value="${pet.client.id}")
public interface PetClient extends PetOperations {

    @Override
    @SingleResult
    Publisher<Pet> save(String name, int age);

    @Get("/{name}")
    @SingleResult
    Publisher<Pet> get(String name);
}
```

  </TabItem>
  <TabItem value="Groovy" label="Groovy">

```groovy
@Client("/pets")
@Header(name="X-Pet-Client", value='${pet.client.id}')
interface PetClient extends PetOperations {

    @Override
    @SingleResult
    Publisher<Pet> save(@NotBlank String name, @Min(1L) int age)

    @Get("/{name}")
    @SingleResult
    Publisher<Pet> get(String name)
}
```

  </TabItem>
  <TabItem value="Kotlin" label="Kotlin">

```kt
@Client("/pets")
@Header(name = "X-Pet-Client", value = "\${pet.client.id}")
interface PetClient : PetOperations {

    @SingleResult
    override fun save(name: String, age: Int): Publisher<Pet>

    @Get("/{name}")
    @SingleResult
    operator fun get(name: String): Publisher<Pet>
}
```

  </TabItem>
</Tabs>

上例在 `PetClient` 接口上定义了 [@Header](https://docs.micronaut.io/latest/api/io/micronaut/http/annotation/Header.html) 注解，该注解使用属性占位符配置读取 `pet.client.id` 属性。

然后在配置文件（如 `application.yml`）中设置以下内容以填充该值：

*配置头*

<Tabs>
  <TabItem value="Properties" label="Properties">

```properties
pet.client.id=foo
```

  </TabItem>
  <TabItem value="Yaml" label="Yaml">

```yaml
pet:
  client:
    id: foo
```

  </TabItem>
    <TabItem value="Toml" label="Toml">

```toml
[pet]
  [pet.client]
    id="foo"
```

  </TabItem>
    <TabItem value="Groovy" label="Groovy">

```groovy
pet {
  client {
    id = "foo"
  }
}
```

  </TabItem>
    <TabItem value="Hoon" label="Hoon">

```hocon
{
  pet {
    client {
      id = "foo"
    }
  }
}
```

  </TabItem>
    <TabItem value="JSON" label="JSON">

```json
{
  "pet": {
    "client": {
      "id": "foo"
    }
  }
}
```

  </TabItem>
</Tabs>

或者，你也可以提供一个 `PET_CLIENT_ID` 环境变量，该变量值就会被填入。

---

### 使用客户端过滤器填充头

另外，要动态填充标题，还可以使用[客户端过滤器](../httpclient/clientFilter)。

有关编写客户端过滤器的更多信息，参阅本指南的[客户端过滤器](../httpclient/clientFilter)部分。

## 7.3.5 自定义 Jackson 设置

如前所述，Jackson 用于将消息编码为 JSON。Micronaut HTTP 客户端配置并使用默认的 Jackson `ObjectMapper`。

你可以用配置文件（如 `application.yml`）中 [JacksonConfiguration](https://docs.micronaut.io/latest/api/io/micronaut/jackson/JacksonConfiguration.html) 类定义的属性覆盖用于构建 `ObjectMapper` 的设置。

例如，以下配置启用了 Jackson 的缩进输出：

*Jackson 配置示例*

<Tabs>
  <TabItem value="Properties" label="Properties">

```properties
jackson.serialization.indentOutput=true
```

  </TabItem>
  <TabItem value="Yaml" label="Yaml">

```yaml
jackson:
  serialization:
    indentOutput: true
```

  </TabItem>
    <TabItem value="Toml" label="Toml">

```toml
[jackson]
  [jackson.serialization]
    indentOutput=true
```

  </TabItem>
    <TabItem value="Groovy" label="Groovy">

```groovy
jackson {
  serialization {
    indentOutput = true
  }
}
```

  </TabItem>
    <TabItem value="Hoon" label="Hoon">

```hocon
{
  jackson {
    serialization {
      indentOutput = true
    }
  }
}
```

  </TabItem>
    <TabItem value="JSON" label="JSON">

```json
{
  "jackson": {
    "serialization": {
      "indentOutput": true
    }
  }
}
```

  </TabItem>
</Tabs>

不过，这些设置是全局性的，既影响 HTTP 服务器渲染 JSON 的方式，也影响 HTTP 客户端发送 JSON 的方式。有鉴于此，提供特定于客户端的 Jackson 设置有时会很有用。你可以使用客户端上的 [@JacksonFeatures](https://docs.micronaut.io/latest/api/io/micronaut/jackson/annotation/JacksonFeatures.html) 注解来实现这一点：

下面是 Micronaut 原生 Eureka 客户端（当然使用 Micronaut 的 HTTP 客户端）的一个示例：

*JacksonFeatures 示例*

```java
@Client(id = EurekaClient.SERVICE_ID,
        path = "/eureka",
        configuration = EurekaConfiguration.class)
@JacksonFeatures(
    enabledSerializationFeatures = WRAP_ROOT_VALUE,
    disabledSerializationFeatures = WRITE_SINGLE_ELEM_ARRAYS_UNWRAPPED,
    enabledDeserializationFeatures = {UNWRAP_ROOT_VALUE, ACCEPT_SINGLE_VALUE_AS_ARRAY}
)
public interface EurekaClient {
    ...
}
```

用于 JSON 的 Eureka 序列化格式使用了 Jackson 的 `WRAP_ROOT_VALUE` 序列化功能，因此它仅为该客户端启用。

:::note 提示
如果 `JacksonFeatures` 提供的自定义功能还不够，你还可以为 `ObjectMapper` 编写一个 [BeanCreatedEventListener](https://docs.micronaut.io/latest/api/io/micronaut/context/event/BeanCreatedEventListener.html)，并添加任何你需要的自定义功能。
:::

## 7.3.6 重试和断路器

从失败中恢复对于 HTTP 客户端来说至关重要，这正是 Micronaut 集成的[重试通知](../../core/aop.html#57-重试通知)的用武之地。

例如，你可以在任何 [@Client](https://docs.micronaut.io/latest/api/io/micronaut/http/client/annotation/Client.html) 接口上声明 [@Retryable](https://docs.micronaut.io/latest/api/io/micronaut/retry/annotation/Retryable.html) 或 [@CircuitBreaker](https://docs.micronaut.io/latest/api/io/micronaut/retry/annotation/CircuitBreaker.html) 注解，重试策略就会被应用：

*声明 @Retryable*

<Tabs>
  <TabItem value="Java" label="Java" default>

```java
@Client("/pets")
@Retryable
public interface PetClient extends PetOperations {

    @Override
    @SingleResult
    Publisher<Pet> save(String name, int age);
}
```

  </TabItem>
  <TabItem value="Groovy" label="Groovy">

```groovy
@Client("/pets")
@Retryable
interface PetClient extends PetOperations {

    @Override
    Mono<Pet> save(String name, int age)
}
```

  </TabItem>
  <TabItem value="Kotlin" label="Kotlin">

```kt
@Client("/pets")
@Retryable
interface PetClient : PetOperations {

    override fun save(name: String, age: Int): Mono<Pet>
}
```

  </TabItem>
</Tabs>

有关自定义重试的更多信息，参阅[重试通知](../../core/aop.html#57-重试通知)一节。

## 7.3.7 客户端回退

在分布式系统中，故障时有发生，最好做好准备并从容应对。

此外，在开发微服务时，在项目所需的其他微服务不可用的情况下开发单个微服务是很常见的。

考虑到这一点，Micronaut 提供了一种集成到[重试通知](../../core/aop.html#57-重试通知)中的原生回退机制，允许在发生故障时回退到另一种实现。

使用 [@Fallback](https://docs.micronaut.io/latest/api/io/micronaut/retry/annotation/Fallback.html) 注解，你可以声明客户端的回退实现，以便在所有可能的重试都已用尽时使用。

事实上，该机制与 Retry 并无严格的联系；你可以将任何类声明为 [@Recoverable](https://docs.micronaut.io/latest/api/io/micronaut/retry/annotation/Recoverable.html)，如果方法调用失败（或在反应式类型中出现错误），将搜索注解为 `@Fallback` 的类。

为了说明这一点，请再看一下前面声明的 `PetOperations` 接口。你可以定义一个 `PetFallback` 类，它将在失败时被调用：

*定义回退*

<Tabs>
  <TabItem value="Java" label="Java" default>

```java
@Fallback
public class PetFallback implements PetOperations {
    @Override
    @SingleResult
    public Publisher<Pet> save(String name, int age) {
        Pet pet = new Pet();
        pet.setAge(age);
        pet.setName(name);
        return Mono.just(pet);
    }
}
```

  </TabItem>
  <TabItem value="Groovy" label="Groovy">

```groovy
@Fallback
public class PetFallback implements PetOperations {
    @Override
    @SingleResult
    public Publisher<Pet> save(String name, int age) {
        Pet pet = new Pet();
        pet.setAge(age);
        pet.setName(name);
        return Mono.just(pet);
    }
}
```

  </TabItem>
  <TabItem value="Kotlin" label="Kotlin">

```kt
@Fallback
open class PetFallback : PetOperations {
    override fun save(name: String, age: Int): Mono<Pet> {
        val pet = Pet()
        pet.age = age
        pet.name = name
        return Mono.just(pet)
    }
}
```

  </TabItem>
</Tabs>

:::note 提示
如果你只需要回退来帮助针对外部微服务进行测试，你可以在 `src/test/java` 目录中定义回退，这样它们就不会包含在生产代码中。如果使用回退而不使用 hystrix，则必须在声明式客户端上指定 `@Recoverable(api=PetOperations.class)`。
:::

如你所见，回退不执行任何网络操作，非常简单，因此在外部系统宕机的情况下也能提供成功的结果。

当然，回退的实际行为取决于你。例如，你可以实现一种回退功能，在真实数据不可用时从本地缓存中提取数据，并向操作发送有关宕机的警报电子邮件或其他通知。

## 7.3.8 Netflix Hystrix 支持

:::note 提示
*使用 CLI*

如果使用 Micronaut CLI 创建项目，请使用 `netflix-hystrix` 特性在项目中配置 Hystrix：

```bash
$ mn create-app my-app --features netflix-hystrix
```
:::

[Netflix Hystrix](https://github.com/Netflix/Hystrix) 是由 Netflix 团队开发的容错库，旨在提高进程间通信的恢复能力。

Micronaut 通过 `netflix-hystrix` 模块与 Hystrix 集成，你可以将该模块添加到你的构建中：

<Tabs>
  <TabItem value="Gradle" label="Gradle">

```groovy
implementation("io.micronaut.netflix:micronaut-netflix-hystrix")
```

  </TabItem>
  <TabItem value="Maven" label="Maven">

```xml
<dependency>
    <groupId>io.micronaut.netflix</groupId>
    <artifactId>micronaut-netflix-hystrix</artifactId>
</dependency>
```

  </TabItem>
</Tabs>

### 使用 @HystrixCommand 注解

声明了上述依赖后，你就可以用 [HystrixCommand](https://micronaut-projects.github.io/micronaut-netflix/latest/api/io/micronaut/configuration/hystrix/annotation/HystrixCommand.html) 注解注解任何方法（包括在 `@Client` 接口上定义的方法），方法的执行将被包裹在 Hystrix 命令中。例如

*使用 @HystrixCommand*

```groovy
@HystrixCommand
String hello(String name) {
    return "Hello $name"
}
```

:::tip 提示
这适用于 Flux 等响应式返回类型，响应式类型将封装在 `HystrixObservableCommand` 中。
:::

[HystrixCommand](https://micronaut-projects.github.io/micronaut-netflix/latest/api/io/micronaut/configuration/hystrix/annotation/HystrixCommand.html) 注解还集成了 Micronaut 对[重试通知](../../core/aop.html#57-重试通知)和[回退](#737-客户端回退)的支持。

:::note 提示
有关如何自定义 Hystrix 线程池、组和属性的信息，参阅 [HystrixCommand](https://micronaut-projects.github.io/micronaut-netflix/latest/api/io/micronaut/configuration/hystrix/annotation/HystrixCommand.html) 的 Javadoc。
:::

---

### 启用 Hystrix 流和仪表板

通过在配置文件（如 `application.yml`）中将 `hystrix.stream.enabled` 设置为 `true`，可以启用服务器发送的事件流，将其输入 [Hystrix Dashboard](https://github.com/Netflix-Skunkworks/hystrix-dashboard)：

*启用 Hystrix 流*

<Tabs>
  <TabItem value="Properties" label="Properties">

```properties
hystrix.stream.enabled=true
```

  </TabItem>
  <TabItem value="Yaml" label="Yaml">

```yaml
hystrix:
  stream:
    enabled: true
```

  </TabItem>
    <TabItem value="Toml" label="Toml">

```toml
[hystrix]
  [hystrix.stream]
    enabled=true
```

  </TabItem>
    <TabItem value="Groovy" label="Groovy">

```groovy
hystrix {
  stream {
    enabled = true
  }
}
```

  </TabItem>
    <TabItem value="Hoon" label="Hoon">

```hocon
{
  hystrix {
    stream {
      enabled = true
    }
  }
}
```

  </TabItem>
    <TabItem value="JSON" label="JSON">

```json
{
  "hystrix": {
    "stream": {
      "enabled": true
    }
  }
}
```

  </TabItem>
</Tabs>

这就暴露了一个 `/hystrix.stream` 端点，其格式为 [Hystrix Dashboard](https://github.com/Netflix-Skunkworks/hystrix-dashboard) 所期望的格式。

> [英文链接](https://docs.micronaut.io/3.9.4/guide/#clientAnnotation)

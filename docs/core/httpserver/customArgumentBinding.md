---
sidebar_position: 50
---

# 6.5 自定义参数绑定

Micronaut 使用 [ArgumentBinderRegistry](https://docs.micronaut.io/3.8.4/api/io/micronaut/core/bind/ArgumentBinderRegistry.html) 查找能够绑定到控制器方法中参数的 [ArgumentBinder](https://docs.micronaut.io/3.8.4/api/io/micronaut/core/bind/ArgumentBinder.html) bean。默认实现在使用 [@Bindable](https://docs.micronaut.io/3.8.4/api/io/micronaut/core/bind/annotation/Bindable.html) 进行元注解的参数上查找注解。如果存在，则参数绑定器注册表将搜索支持该注解的参数绑定器。

如果找不到合适的注解，Micronaut 将尝试查找支持该参数类型的参数绑定器。

参数绑定器返回 [ArgumentBinder.BindingResult](https://docs.micronaut.io/3.8.4/api/io/micronaut/core/bind/ArgumentBinder.BindingResult.html)。绑定结果为 Micronaut 提供了比值更多的信息。绑定结果要么满足，要么不满足，要么为空，要么不为空。如果参数绑定器返回不满意的结果，则在请求处理的不同时间可能会再次调用绑定器。在读取正文和执行任何筛选器之前，首先调用参数绑定器。如果绑定器依赖于其中任何一个数据，但该数据不存在，则返回 [ArgumentBinder.BindingResult#UNSATISFIED](https://docs.micronaut.io/3.8.4/api/io/micronaut/core/bind/ArgumentBinder.BindingResult.html#EMPTY) 结果。返回 [ArgumentBinder.BindingResult#EMPTY](https://docs.micronaut.io/3.8.4/api/io/micronaut/core/bind/ArgumentBinder.BindingResult.html#EMPTY) 或满意的结果将是最终结果，并且不会为该请求再次调用绑定器。

:::tip 注意
在处理结束时，如果结果仍然是 [ArgumentBinder.BindingResult#UNSATISFIED](https://docs.micronaut.io/3.8.4/api/io/micronaut/core/bind/ArgumentBinder.BindingResult.html#UNSATISFIED)，则将其视为 [ArgumentBinder.BindingResult#EMPTY](https://docs.micronaut.io/3.8.4/api/io/micronaut/core/bind/ArgumentBinder.BindingResult.html#EMPTY)。
:::

关键特性有：

**绑定注解示例**

import Tabs from '@theme/Tabs';
import TabItem from '@theme/TabItem';

<Tabs>
  <TabItem value="Java" label="Java" default>

```java
import io.micronaut.context.annotation.AliasFor;
import io.micronaut.core.bind.annotation.Bindable;

import java.lang.annotation.Retention;
import java.lang.annotation.Target;

import static java.lang.annotation.ElementType.ANNOTATION_TYPE;
import static java.lang.annotation.ElementType.FIELD;
import static java.lang.annotation.ElementType.PARAMETER;
import static java.lang.annotation.RetentionPolicy.RUNTIME;

@Target({FIELD, PARAMETER, ANNOTATION_TYPE})
@Retention(RUNTIME)
@Bindable //(1)
public @interface ShoppingCart {

    @AliasFor(annotation = Bindable.class, member = "value")
    String value() default "";
}
```

  </TabItem>
  <TabItem value="Groovy" label="Groovy">

```groovy
import groovy.transform.CompileStatic
import io.micronaut.context.annotation.AliasFor
import io.micronaut.core.bind.annotation.Bindable

import java.lang.annotation.Retention
import java.lang.annotation.Target

import static java.lang.annotation.ElementType.ANNOTATION_TYPE
import static java.lang.annotation.ElementType.FIELD
import static java.lang.annotation.ElementType.PARAMETER
import static java.lang.annotation.RetentionPolicy.RUNTIME

@CompileStatic
@Target([FIELD, PARAMETER, ANNOTATION_TYPE])
@Retention(RUNTIME)
@Bindable //(1)
@interface ShoppingCart {
    @AliasFor(annotation = Bindable, member = "value")
    String value() default ""
}
```

  </TabItem>
  <TabItem value="Kotlin" label="Kotlin">

```kt
import io.micronaut.core.bind.annotation.Bindable
import kotlin.annotation.AnnotationRetention.RUNTIME
import kotlin.annotation.AnnotationTarget.ANNOTATION_CLASS
import kotlin.annotation.AnnotationTarget.FIELD
import kotlin.annotation.AnnotationTarget.VALUE_PARAMETER

@Target(FIELD, VALUE_PARAMETER, ANNOTATION_CLASS)
@Retention(RUNTIME)
@Bindable //(1)
annotation class ShoppingCart(val value: String = "")
```

  </TabItem>
</Tabs>

1. 绑定注释本身必须注解为 [Bindable](https://docs.micronaut.io/3.8.4/api/io/micronaut/core/bind/annotation/Bindable.html)

*注解数据绑定示例*

<Tabs>
  <TabItem value="Java" label="Java" default>

```java
import io.micronaut.core.convert.ArgumentConversionContext;
import io.micronaut.core.convert.ConversionService;
import io.micronaut.core.type.Argument;
import io.micronaut.http.HttpRequest;
import io.micronaut.http.bind.binders.AnnotatedRequestArgumentBinder;
import io.micronaut.http.cookie.Cookie;
import io.micronaut.jackson.serialize.JacksonObjectSerializer;

import jakarta.inject.Singleton;
import java.util.Map;
import java.util.Optional;

@Singleton
public class ShoppingCartRequestArgumentBinder
        implements AnnotatedRequestArgumentBinder<ShoppingCart, Object> { //(1)

    private final ConversionService<?> conversionService;
    private final JacksonObjectSerializer objectSerializer;

    public ShoppingCartRequestArgumentBinder(ConversionService<?> conversionService,
                                             JacksonObjectSerializer objectSerializer) {
        this.conversionService = conversionService;
        this.objectSerializer = objectSerializer;
    }

    @Override
    public Class<ShoppingCart> getAnnotationType() {
        return ShoppingCart.class;
    }

    @Override
    public BindingResult<Object> bind(
            ArgumentConversionContext<Object> context,
            HttpRequest<?> source) { //(2)

        String parameterName = context.getAnnotationMetadata()
                .stringValue(ShoppingCart.class)
                .orElse(context.getArgument().getName());

        Cookie cookie = source.getCookies().get("shoppingCart");
        if (cookie == null) {
            return BindingResult.EMPTY;
        }

        Optional<Map<String, Object>> cookieValue = objectSerializer.deserialize(
                cookie.getValue().getBytes(),
                Argument.mapOf(String.class, Object.class));

        return () -> cookieValue.flatMap(map -> {
            Object obj = map.get(parameterName);
            return conversionService.convert(obj, context);
        });
    }
}
```

  </TabItem>
  <TabItem value="Groovy" label="Groovy">

```groovy
import groovy.transform.CompileStatic
import io.micronaut.core.convert.ArgumentConversionContext
import io.micronaut.core.convert.ConversionService
import io.micronaut.core.type.Argument
import io.micronaut.http.HttpRequest
import io.micronaut.http.bind.binders.AnnotatedRequestArgumentBinder
import io.micronaut.http.cookie.Cookie
import io.micronaut.jackson.serialize.JacksonObjectSerializer

import jakarta.inject.Singleton

@CompileStatic
@Singleton
class ShoppingCartRequestArgumentBinder
        implements AnnotatedRequestArgumentBinder<ShoppingCart, Object> { //(1)

    private final ConversionService<?> conversionService
    private final JacksonObjectSerializer objectSerializer

    ShoppingCartRequestArgumentBinder(
            ConversionService<?> conversionService,
            JacksonObjectSerializer objectSerializer) {
        this.conversionService = conversionService
        this.objectSerializer = objectSerializer
    }

    @Override
    Class<ShoppingCart> getAnnotationType() {
        ShoppingCart
    }

    @Override
    BindingResult<Object> bind(
            ArgumentConversionContext<Object> context,
            HttpRequest<?> source) { //(2)

        String parameterName = context.annotationMetadata
                .stringValue(ShoppingCart)
                .orElse(context.argument.name)

        Cookie cookie = source.cookies.get("shoppingCart")
        if (!cookie) {
            return BindingResult.EMPTY
        }

        Optional<Map<String, Object>> cookieValue = objectSerializer.deserialize(
                cookie.value.bytes,
                Argument.mapOf(String, Object))

        return (BindingResult) { ->
            cookieValue.flatMap({value ->
                conversionService.convert(value.get(parameterName), context)
            })
        }
    }
}
```

  </TabItem>
  <TabItem value="Kotlin" label="Kotlin">

```kt
import io.micronaut.core.bind.ArgumentBinder.BindingResult
import io.micronaut.core.convert.ArgumentConversionContext
import io.micronaut.core.convert.ConversionService
import io.micronaut.core.type.Argument
import io.micronaut.http.HttpRequest
import io.micronaut.http.bind.binders.AnnotatedRequestArgumentBinder
import io.micronaut.jackson.serialize.JacksonObjectSerializer
import java.util.Optional
import jakarta.inject.Singleton

@Singleton
class ShoppingCartRequestArgumentBinder(
        private val conversionService: ConversionService<*>,
        private val objectSerializer: JacksonObjectSerializer
) : AnnotatedRequestArgumentBinder<ShoppingCart, Any> { //(1)

    override fun getAnnotationType(): Class<ShoppingCart> {
        return ShoppingCart::class.java
    }

    override fun bind(context: ArgumentConversionContext<Any>,
                      source: HttpRequest<*>): BindingResult<Any> { //(2)

        val parameterName = context.annotationMetadata
            .stringValue(ShoppingCart::class.java)
            .orElse(context.argument.name)

        val cookie = source.cookies.get("shoppingCart") ?: return BindingResult.EMPTY

        val cookieValue: Optional<Map<String, Any>> = objectSerializer.deserialize(
                cookie.value.toByteArray(),
                Argument.mapOf(String::class.java, Any::class.java))

        return BindingResult {
            cookieValue.flatMap { map: Map<String, Any> ->
                conversionService.convert(map[parameterName], context)
            }
        }
    }
}
```

  </TabItem>
</Tabs>

1. 自定义参数绑定器必须实现 [AnnotatedRequestArgumentBinder](https://docs.micronaut.io/3.8.4/api/io/micronaut/http/bind/binders/AnnotatedRequestArgumentBinder.html)，包括触发绑定器的注释类型（在本例中为 `MyBindingAnnotation`）和所需参数的类型（在此例中为 `Object`）
2. 使用自定义参数绑定逻辑覆盖 `bind` 方法——在这种情况下，我们解析带注解的参数的名称，从具有相同名称的 cookie 中提取一个值，并将该值转换为参数类型

:::note 提示
通常使用 [ConversionService](https://docs.micronaut.io/3.8.4/api/io/micronaut/core/convert/ConversionService.html) 将数据转换为参数的类型。
:::

一旦创建了绑定器，我们就可以在控制器方法中注释一个参数，该参数将使用我们指定的自定义逻辑进行绑定。

*带有此注解绑定的控制器操作*

<Tabs>
  <TabItem value="Java" label="Java" default>

```java
    @Get("/annotated")
    HttpResponse<String> checkSession(@ShoppingCart Long sessionId) { //(1)
        return HttpResponse.ok("Session:" + sessionId);
    }
    // end::method
}
```

  </TabItem>
  <TabItem value="Groovy" label="Groovy">

```groovy
    @Get("/annotated")
    HttpResponse<String> checkSession(@ShoppingCart Long sessionId) { //(1)
        HttpResponse.ok("Session:" + sessionId)
    }
    // end::method
}
```

  </TabItem>
  <TabItem value="Kotlin" label="Kotlin">

```kt
@Get("/annotated")
fun checkSession(@ShoppingCart sessionId: Long): HttpResponse<String> { //(1)
    return HttpResponse.ok("Session:$sessionId")
}
```

  </TabItem>
</Tabs>

1. 该参数已绑定到与 `MyBindingAnnotation` 关联的绑定器。如果适用，这优先于基于类型的活页夹。

**TypedRequestArgumentBinder**

基于参数类型绑定的参数绑定器必须实现 [TypedRequestArgumentBinder](https://docs.micronaut.io/3.8.4/api/io/micronaut/http/bind/binders/TypedRequestArgumentBinder.html)。例如，给出这个类：

*POJO 示例*

<Tabs>
  <TabItem value="Java" label="Java" default>

```java
import io.micronaut.core.annotation.Introspected;

@Introspected
public class ShoppingCart {

    private String sessionId;
    private Integer total;

    public String getSessionId() {
        return sessionId;
    }

    public void setSessionId(String sessionId) {
        this.sessionId = sessionId;
    }

    public Integer getTotal() {
        return total;
    }

    public void setTotal(Integer total) {
        this.total = total;
    }
}
```

  </TabItem>
  <TabItem value="Groovy" label="Groovy">

```groovy
import io.micronaut.core.annotation.Introspected

@Introspected
class ShoppingCart {
    String sessionId
    Integer total
}
```

  </TabItem>
  <TabItem value="Kotlin" label="Kotlin">

```kt
import io.micronaut.core.annotation.Introspected

@Introspected
class ShoppingCart {
    var sessionId: String? = null
    var total: Int? = null
}
```

  </TabItem>
</Tabs>

我们可以为这个类定义一个 `TypedRequestArgumentBinder`，如下所示：

*类型数据绑定示例*

<Tabs>
  <TabItem value="Java" label="Java" default>

```java
import io.micronaut.core.convert.ArgumentConversionContext;
import io.micronaut.core.type.Argument;
import io.micronaut.http.HttpRequest;
import io.micronaut.http.bind.binders.TypedRequestArgumentBinder;
import io.micronaut.http.cookie.Cookie;
import io.micronaut.jackson.serialize.JacksonObjectSerializer;

import jakarta.inject.Singleton;
import java.util.Optional;

@Singleton
public class ShoppingCartRequestArgumentBinder
        implements TypedRequestArgumentBinder<ShoppingCart> {

    private final JacksonObjectSerializer objectSerializer;

    public ShoppingCartRequestArgumentBinder(JacksonObjectSerializer objectSerializer) {
        this.objectSerializer = objectSerializer;
    }

    @Override
    public BindingResult<ShoppingCart> bind(ArgumentConversionContext<ShoppingCart> context,
                                            HttpRequest<?> source) { //(1)

        Cookie cookie = source.getCookies().get("shoppingCart");
        if (cookie == null) {
            return Optional::empty;
        }

        return () -> objectSerializer.deserialize( //(2)
                cookie.getValue().getBytes(),
                ShoppingCart.class);
    }

    @Override
    public Argument<ShoppingCart> argumentType() {
        return Argument.of(ShoppingCart.class); //(3)
    }
}
```

  </TabItem>
  <TabItem value="Groovy" label="Groovy">

```groovy
import io.micronaut.core.convert.ArgumentConversionContext
import io.micronaut.core.type.Argument
import io.micronaut.http.HttpRequest
import io.micronaut.http.bind.binders.TypedRequestArgumentBinder
import io.micronaut.http.cookie.Cookie
import io.micronaut.jackson.serialize.JacksonObjectSerializer

import jakarta.inject.Singleton

@Singleton
class ShoppingCartRequestArgumentBinder
        implements TypedRequestArgumentBinder<ShoppingCart> {

    private final JacksonObjectSerializer objectSerializer

    ShoppingCartRequestArgumentBinder(JacksonObjectSerializer objectSerializer) {
        this.objectSerializer = objectSerializer
    }

    @Override
    BindingResult<ShoppingCart> bind(ArgumentConversionContext<ShoppingCart> context,
                                     HttpRequest<?> source) { //(1)

        Cookie cookie = source.cookies.get("shoppingCart")
        if (!cookie) {
            return BindingResult.EMPTY
        }

        return () -> objectSerializer.deserialize( //(2)
                cookie.value.bytes,
                ShoppingCart)
    }

    @Override
    Argument<ShoppingCart> argumentType() {
        Argument.of(ShoppingCart) //(3)
    }
}
```

  </TabItem>
  <TabItem value="Kotlin" label="Kotlin">

```kt
import io.micronaut.core.bind.ArgumentBinder
import io.micronaut.core.bind.ArgumentBinder.BindingResult
import io.micronaut.core.convert.ArgumentConversionContext
import io.micronaut.core.type.Argument
import io.micronaut.http.HttpRequest
import io.micronaut.http.bind.binders.TypedRequestArgumentBinder
import io.micronaut.jackson.serialize.JacksonObjectSerializer
import java.util.Optional
import jakarta.inject.Singleton

@Singleton
class ShoppingCartRequestArgumentBinder(private val objectSerializer: JacksonObjectSerializer) :
    TypedRequestArgumentBinder<ShoppingCart> {

    override fun bind(
        context: ArgumentConversionContext<ShoppingCart>,
        source: HttpRequest<*>
    ): BindingResult<ShoppingCart> { //(1)

        val cookie = source.cookies["shoppingCart"]

        return if (cookie == null)
            BindingResult {
                Optional.empty()
            }
        else {
            BindingResult {
                objectSerializer.deserialize( // (2)
                    cookie.value.toByteArray(),
                    ShoppingCart::class.java
                )
            }
        }
    }

    override fun argumentType(): Argument<ShoppingCart> {
        return Argument.of(ShoppingCart::class.java) //(3)
    }
}
```

  </TabItem>
</Tabs>

1. 使用要绑定的数据类型覆盖 `bind` 方法，在本例中为 `ShoppingCart` 类型
2. 检索数据后（在本例中，通过从cookie反序列化JSON文本），返回 [ArgumentBinder.BindingResult](https://docs.micronaut.io/3.8.4/api/io/micronaut/core/bind/ArgumentBinder.BindingResult.html)
3. 还要重写 ArgumentBinderRegistry 使用的 `argumentType` 方法。

创建绑定器后，它将用于关联类型的任何控制器参数：

*使用此类型绑定的控制器操作*

<Tabs>
  <TabItem value="Java" label="Java" default>

```java
@Get("/typed")
public HttpResponse<?> loadCart(ShoppingCart shoppingCart) { //(1)
    Map<String, Object> responseMap = new HashMap<>();
    responseMap.put("sessionId", shoppingCart.getSessionId());
    responseMap.put("total", shoppingCart.getTotal());

    return HttpResponse.ok(responseMap);
}
```

  </TabItem>
  <TabItem value="Groovy" label="Groovy">

```groovy
@Get("/typed")
HttpResponse<Map<String, Object>> loadCart(ShoppingCart shoppingCart) { //(1)
    HttpResponse.ok(
            sessionId: shoppingCart.sessionId,
            total: shoppingCart.total)
}
```

  </TabItem>
  <TabItem value="Kotlin" label="Kotlin">

```kt
@Get("/typed")
fun loadCart(shoppingCart: ShoppingCart): HttpResponse<*> { //(1)
    return HttpResponse.ok(mapOf(
        "sessionId" to shoppingCart.sessionId,
        "total" to shoppingCart.total))
}
```

  </TabItem>
</Tabs>

1. 该参数是使用 TypedRequestArgumentBinder 中为此类型定义的自定义逻辑绑定的

> [英文链接](https://docs.micronaut.io/3.9.4/guide/index.html#customArgumentBinding)

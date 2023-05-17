---
sidebar_position: 240
---

# 6.24 HTTP 会话

默认情况下，Micronau t是一个无状态的 HTTP 服务器，然而根据你的应用需求，你可能需要 HTTP 会话的概念。

Micronaut 包含了一个受 [Spring Session](https://projects.spring.io/spring-session/) 启发的会话模块，该模块目前有两种实现方式：

- 内存会话——如果你计划运行多个实例，你应该结合一个粘性会话代理。

- Redis 会话——在这种情况下，[Redis](https://redis.io/) 存储会话，并使用非阻塞 I/O 来读/写会话到 Redis。

## 启用会话

要启用对内存会话的支持，你只需要 `session` 依赖：

import Tabs from '@theme/Tabs';
import TabItem from '@theme/TabItem';

<Tabs>
  <TabItem value="Gradle" label="Gradle">

```groovy
implementation("io.micronaut:micronaut-session")
```

  </TabItem>
  <TabItem value="Maven" label="Maven">

```xml
<dependency>
    <groupId>io.micronaut</groupId>
    <artifactId>micronaut-session</artifactId>
</dependency>
```

  </TabItem>
</Tabs>

**Redis 会话**

要在 Redis 中存储会话实例，请使用 [Micronaut Redis](/redis/sessions) 模块，其中包括详细说明。

为了快速启动和运行 Redis 会话，你还必须在你的构建中拥有 `redis-lettuce` 依赖：

*build.gradle*

```groovy
compile "io.micronaut:micronaut-session"
compile "io.micronaut.redis:micronaut-redis-lettuce"
```

并通过 `application.yml` 中的配置启用 Redis 会话：

*启用 Redis 会话*

```yaml
redis:
  uri: redis://localhost:6379
micronaut:
  session:
    http:
      redis:
        enabled: true
```

---

## 配置会话解析

[Session](https://docs.micronaut.io/3.8.4/api/io/micronaut/session/Session.html) 解析可以用 [HttpSessionConfiguration](https://docs.micronaut.io/3.8.4/api/io/micronaut/session/http/HttpSessionConfiguration.html) 进行配置。

默认情况下，会话是使用一个 [HttpSessionFilter](https://docs.micronaut.io/3.8.4/api/io/micronaut/session/http/HttpSessionFilter.html) 来解决的，它通过 HTTP 头（使用 `Authorization-Info` 或 `X-Auth-Token` 头）或通过一个名为 `SESSION` 的 Cookie 来寻找会话标识符。

你可以通过 `application.yml` 中的配置来禁用头的解析或 cookie 的解析：

*禁用 Cookie 解析*

```yaml
micronaut:
  session:
    http:
      cookie: false
      header: true
```

上述配置启用了头解析，但禁用了 cookie 解析。你也可以配置头和 cookie 的名称。

---

## 使用会话

一个 [Session](https://docs.micronaut.io/3.8.4/api/io/micronaut/session/Session.html) 可以在控制器方法中用一个 [Session](https://docs.micronaut.io/3.8.4/api/io/micronaut/session/Session.html) 类型的参数来检索。例如，考虑下面的控制器：

<Tabs>
  <TabItem value="Java" label="Java" default>

```java
import io.micronaut.http.annotation.Controller;
import io.micronaut.http.annotation.Get;
import io.micronaut.http.annotation.Post;
import io.micronaut.session.Session;
import io.micronaut.session.annotation.SessionValue;
import io.micronaut.core.annotation.Nullable;

import javax.validation.constraints.NotBlank;

@Controller("/shopping")
public class ShoppingController {
    private static final String ATTR_CART = "cart"; // (1)

@Post("/cart/{name}")
Cart addItem(Session session, @NotBlank String name) { // (2)
    Cart cart = session.get(ATTR_CART, Cart.class).orElseGet(() -> { // (3)
        Cart newCart = new Cart();
        session.put(ATTR_CART, newCart); // (4)
        return newCart;
    });
    cart.getItems().add(name);
    return cart;
}

}
```

  </TabItem>
  <TabItem value="Groovy" label="Groovy">

```groovy
import io.micronaut.http.annotation.Controller
import io.micronaut.http.annotation.Get
import io.micronaut.http.annotation.Post
import io.micronaut.session.Session
import io.micronaut.session.annotation.SessionValue

import javax.annotation.Nullable
import javax.validation.constraints.NotBlank

@Controller("/shopping")
class ShoppingController {
    private static final String ATTR_CART = "cart" // (1)

@Post("/cart/{name}")
Cart addItem(Session session, @NotBlank String name) { // (2)
    Cart cart = session.get(ATTR_CART, Cart).orElseGet({ -> // (3)
        Cart newCart = new Cart()
        session.put(ATTR_CART, newCart) // (4)
        newCart
    })
    cart.items << name
    cart
}

}
```

  </TabItem>
  <TabItem value="Kotlin" label="Kotlin">

```kt
import io.micronaut.http.annotation.Controller
import io.micronaut.http.annotation.Get
import io.micronaut.http.annotation.Post
import io.micronaut.session.Session
import io.micronaut.session.annotation.SessionValue

@Controller("/shopping")
class ShoppingController {

    companion object {
        private const val ATTR_CART = "cart" // (1)
    }

@Post("/cart/{name}")
internal fun addItem(session: Session, name: String): Cart { // (2)
    require(name.isNotBlank()) { "Name cannot be blank" }
    val cart = session.get(ATTR_CART, Cart::class.java).orElseGet { // (3)
        val newCart = Cart()
        session.put(ATTR_CART, newCart) // (4)
        newCart
    }
    cart.items.add(name)
    return cart
}

}
```

  </TabItem>
</Tabs>

1. `ShoppingController` 声明了一个名为 `cart` 的 [Session](https://docs.micronaut.io/3.8.4/api/io/micronaut/session/Session.html) 属性。
2. [Session](https://docs.micronaut.io/3.8.4/api/io/micronaut/session/Session.html) 被声明为一个方法参数
3. 检索 `cart` 属性
4. 否则将创建一个新的 `Cart` 实例并存储在会话中。

注意，由于 [Session](https://docs.micronaut.io/3.8.4/api/io/micronaut/session/Session.html) 被声明为一个必要的参数，为了执行控制器动作，将创建一个 [Session](https://docs.micronaut.io/3.8.4/api/io/micronaut/session/Session.html) 并保存到 [SessionStore](https://docs.micronaut.io/3.8.4/api/io/micronaut/session/SessionStore.html)。

如果你不想创建不必要的会话，请将 [Session](https://docs.micronaut.io/3.8.4/api/io/micronaut/session/Session.html) 声明为 `@Nullable`，在这种情况下，会话将不会被创建和不必要地保存。比如说：

*Session 使用 @Nullable*

<Tabs>
  <TabItem value="Java" label="Java" default>

```java
@Post("/cart/clear")
void clearCart(@Nullable Session session) {
    if (session != null) {
        session.remove(ATTR_CART);
    }
}
```

  </TabItem>
  <TabItem value="Groovy" label="Groovy">

```groovy
@Post("/cart/clear")
void clearCart(@Nullable Session session) {
    session?.remove(ATTR_CART)
}
```

  </TabItem>
  <TabItem value="Kotlin" label="Kotlin">

```kt
@Post("/cart/clear")
internal fun clearCart(session: Session?) {
    session?.remove(ATTR_CART)
}
```

  </TabItem>
</Tabs>

上述方法只在已经存在的情况下注入一个新的 [Session](https://docs.micronaut.io/3.8.4/api/io/micronaut/session/Session.html)。

---

## 会话客户端

如果客户端是一个网络浏览器，如果启用了 cookie，会话应可以工作。然而，对于程序化的 HTTP 客户端，你需要在 HTTP 调用之间传播会话 ID。

例如，当调用前面例子中 `StoreController` 的 `viewCart` 方法时，HTTP客户端默认收到一个 `AUTHORIZATION_INFO` 头。下面的例子，使用 Spock 测试，演示了这一点：

*检索 AUTHORIZATION_INFO 头*

<Tabs>
  <TabItem value="Java" label="Java" default>

```java
HttpResponse<Cart> response = Flux.from(client.exchange(HttpRequest.GET("/shopping/cart"), Cart.class)) // (1)
                                    .blockFirst();
Cart cart = response.body();

assertNotNull(response.header(HttpHeaders.AUTHORIZATION_INFO)); // (2)
assertNotNull(cart);
assertTrue(cart.getItems().isEmpty());
```

  </TabItem>
  <TabItem value="Groovy" label="Groovy">

```groovy
when: "The shopping cart is retrieved"
HttpResponse<Cart> response = client.exchange(HttpRequest.GET('/shopping/cart'), Cart) // (1)
                                        .blockFirst()
Cart cart = response.body()

then: "The shopping cart is present as well as a session id header"
response.header(HttpHeaders.AUTHORIZATION_INFO) != null // (2)
cart != null
cart.items.isEmpty()
```

  </TabItem>
  <TabItem value="Kotlin" label="Kotlin">

```kt
var response = Flux.from(client.exchange(HttpRequest.GET<Cart>("/shopping/cart"), Cart::class.java)) // (1)
                     .blockFirst()
var cart = response.body()

assertNotNull(response.header(HttpHeaders.AUTHORIZATION_INFO)) // (2)
assertNotNull(cart)
cart.items.isEmpty()
```

  </TabItem>
</Tabs>

1. 向 `/shopping/cart` 发起一个请求
2. 响应中出现了 `AUTHORIZATION_INFO` 头

然后你可以在随后的请求中传递这个 `AUTHORIZATION_INFO`，以重用现有的 [Session](https://docs.micronaut.io/3.8.4/api/io/micronaut/session/Session.html)：

*发送 AUTHORIZATION_INFO 头*

<Tabs>
  <TabItem value="Java" label="Java" default>

```java
String sessionId = response.header(HttpHeaders.AUTHORIZATION_INFO); // (1)

response = Flux.from(client.exchange(HttpRequest.POST("/shopping/cart/Apple", "")
                 .header(HttpHeaders.AUTHORIZATION_INFO, sessionId), Cart.class)) // (2)
                 .blockFirst();
cart = response.body();
```

  </TabItem>
  <TabItem value="Groovy" label="Groovy">

```groovy
String sessionId = response.header(HttpHeaders.AUTHORIZATION_INFO) // (1)

response = client.exchange(HttpRequest.POST('/shopping/cart/Apple', "")
                 .header(HttpHeaders.AUTHORIZATION_INFO, sessionId), Cart) // (2)
                 .blockFirst()
cart = response.body()
```

  </TabItem>
  <TabItem value="Kotlin" label="Kotlin">

```kt
val sessionId = response.header(HttpHeaders.AUTHORIZATION_INFO) // (1)

response = Flux.from(client.exchange(HttpRequest.POST("/shopping/cart/Apple", "")
                 .header(HttpHeaders.AUTHORIZATION_INFO, sessionId), Cart::class.java)) // (2)
                 .blockFirst()
cart = response.body()
```

  </TabItem>
</Tabs>

1. `AUTHORIZATION_INFO` 被从响应中检索出来
2. 然后在随后的请求中作为头发送

---

## 使用 @SessionValue

相对显式地将 [Session](https://docs.micronaut.io/3.8.4/api/io/micronaut/session/Session.html) 注入控制器方法中，你也可使用 [@SessionValue](https://docs.micronaut.io/3.8.4/api/io/micronaut/session/annotation/SessionValue.html)。例如：

*使用 @SessionValue*

<Tabs>
  <TabItem value="Java" label="Java" default>

```java
@Get("/cart")
@SessionValue(ATTR_CART) // (1)
Cart viewCart(@SessionValue @Nullable Cart cart) { // (2)
    if (cart == null) {
        cart = new Cart();
    }
    return cart;
}
```

  </TabItem>
  <TabItem value="Groovy" label="Groovy">

```groovy
@Get("/cart")
@SessionValue("cart") // (1)
Cart viewCart(@SessionValue @Nullable Cart cart) { // (2)
    cart ?: new Cart()
}
```

  </TabItem>
  <TabItem value="Kotlin" label="Kotlin">

```kt
@Get("/cart")
@SessionValue(ATTR_CART) // (1)
internal fun viewCart(@SessionValue cart: Cart?): Cart { // (2)
    return cart ?: Cart()
}
```

  </TabItem>
</Tabs>

1. [@SessionValue](https://docs.micronaut.io/3.8.4/api/io/micronaut/session/annotation/SessionValue.html) 被声明在方法上，导致返回值被存储在 [Session](https://docs.micronaut.io/3.8.4/api/io/micronaut/session/Session.html) 中。请注意，在返回值上使用时，你必须指定属性名称。
2. [@SessionValue](https://docs.micronaut.io/3.8.4/api/io/micronaut/session/annotation/SessionValue.html) 被用于一个`@Nullable` 的参数上，其结果是以非阻塞的方式从会话中查找值，如果存在的话就提供给它。在没有为 [@SessionValue](https://docs.micronaut.io/3.8.4/api/io/micronaut/session/annotation/SessionValue.html) 指定一个值的情况下，会导致参数名称被用于查找属性。

---

## 会话事件

你可以注册 [ApplicationEventListener](https://docs.micronaut.io/3.8.4/api/io/micronaut/context/event/ApplicationEventListener.html) bean 来监听位于 [io.micronaut.session.event](https://docs.micronaut.io/3.8.4/api/io/micronaut/session/event/package-summary.html) 包中的 [Session](https://docs.micronaut.io/3.8.4/api/io/micronaut/session/Session.html) 相关事件。

下表总结了这些事件：

*表 1.会话事件*

|类型|描述|
|--|--|
|[SessionCreatedEvent](https://docs.micronaut.io/3.8.4/api/io/micronaut/session/event/SessionCreatedEvent.html)|当一个 [Session](https://docs.micronaut.io/3.8.4/api/io/micronaut/session/Session.html) 创建时触发|
|[SessionDeletedEvent](https://docs.micronaut.io/3.8.4/api/io/micronaut/session/event/SessionDeletedEvent.html)|当一个 [Session](https://docs.micronaut.io/3.8.4/api/io/micronaut/session/Session.html) 删除时触发|
|[SessionExpiredEvent](https://docs.micronaut.io/3.8.4/api/io/micronaut/session/event/SessionExpiredEvent.html)|当一个 [Session](https://docs.micronaut.io/3.8.4/api/io/micronaut/session/Session.html) 过期时触发|
|[SessionDestroyedEvent](https://docs.micronaut.io/3.8.4/api/io/micronaut/session/event/SessionDestroyedEvent.html)|`SessionDeletedEvent` 和 `SessionExpiredEvent` 的父类|

> [英文链接](https://docs.micronaut.io/3.8.4/guide/index.html#sessions)


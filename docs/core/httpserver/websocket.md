---
sidebar_position: 260
---

# 6.26 WebSocket 支持

Micronaut 具有对创建 WebSocket 客户端和服务器的专门支持。[io.micronaut.websocket.annotation](https://micronaut-projects.github.io/micronaut-docs-mn3/3.9.4/api/io/micronaut/websocket/annotation/package-summary.html) 包，包括用于定义客户端和服务器的注解。

## 6.26.1 使用 @ServerWebSocket

[@ServerWebSocket](https://micronaut-projects.github.io/micronaut-docs-mn3/3.9.4/api/io/micronaut/websocket/annotation/ServerWebSocket.html) 注解可应用于任何应映射到 WebSocket URI 的类。下面的例子是一个简单的聊天 WebSocket 实现：

*WebSocket 聊天示例*

import Tabs from '@theme/Tabs';
import TabItem from '@theme/TabItem';

<Tabs>
  <TabItem value="Java" label="Java" default>

```java
import io.micronaut.websocket.WebSocketBroadcaster;
import io.micronaut.websocket.WebSocketSession;
import io.micronaut.websocket.annotation.OnClose;
import io.micronaut.websocket.annotation.OnMessage;
import io.micronaut.websocket.annotation.OnOpen;
import io.micronaut.websocket.annotation.ServerWebSocket;

import java.util.function.Predicate;

@ServerWebSocket("/chat/{topic}/{username}") // (1)
public class ChatServerWebSocket {

    private final WebSocketBroadcaster broadcaster;

    public ChatServerWebSocket(WebSocketBroadcaster broadcaster) {
        this.broadcaster = broadcaster;
    }

    @OnOpen // (2)
    public void onOpen(String topic, String username, WebSocketSession session) {
        String msg = "[" + username + "] Joined!";
        broadcaster.broadcastSync(msg, isValid(topic, session));
    }

    @OnMessage // (3)
    public void onMessage(String topic, String username,
                          String message, WebSocketSession session) {
        String msg = "[" + username + "] " + message;
        broadcaster.broadcastSync(msg, isValid(topic, session)); // (4)
    }

    @OnClose // (5)
    public void onClose(String topic, String username, WebSocketSession session) {
        String msg = "[" + username + "] Disconnected!";
        broadcaster.broadcastSync(msg, isValid(topic, session));
    }

    private Predicate<WebSocketSession> isValid(String topic, WebSocketSession session) {
        return s -> s != session &&
                topic.equalsIgnoreCase(s.getUriVariables().get("topic", String.class, null));
    }
}
```

  </TabItem>
  <TabItem value="Groovy" label="Groovy">

```groovy
import io.micronaut.websocket.WebSocketBroadcaster
import io.micronaut.websocket.WebSocketSession
import io.micronaut.websocket.annotation.OnClose
import io.micronaut.websocket.annotation.OnMessage
import io.micronaut.websocket.annotation.OnOpen
import io.micronaut.websocket.annotation.ServerWebSocket

import java.util.function.Predicate

@ServerWebSocket("/chat/{topic}/{username}") // (1)
class ChatServerWebSocket {

    private final WebSocketBroadcaster broadcaster

    ChatServerWebSocket(WebSocketBroadcaster broadcaster) {
        this.broadcaster = broadcaster
    }

    @OnOpen // (2)
    void onOpen(String topic, String username, WebSocketSession session) {
        String msg = "[$username] Joined!"
        broadcaster.broadcastSync(msg, isValid(topic, session))
    }

    @OnMessage // (3)
    void onMessage(String topic, String username,
                   String message, WebSocketSession session) {
        String msg = "[$username] $message"
        broadcaster.broadcastSync(msg, isValid(topic, session)) // (4)
    }

    @OnClose // (5)
    void onClose(String topic, String username, WebSocketSession session) {
        String msg = "[$username] Disconnected!"
        broadcaster.broadcastSync(msg, isValid(topic, session))
    }

    private Predicate<WebSocketSession> isValid(String topic, WebSocketSession session) {
        return { s -> s != session && topic.equalsIgnoreCase(s.uriVariables.get("topic", String, null)) }
    }
}
```

  </TabItem>
  <TabItem value="Kotlin" label="Kotlin">

```kt
import io.micronaut.websocket.WebSocketBroadcaster
import io.micronaut.websocket.WebSocketSession
import io.micronaut.websocket.annotation.OnClose
import io.micronaut.websocket.annotation.OnMessage
import io.micronaut.websocket.annotation.OnOpen
import io.micronaut.websocket.annotation.ServerWebSocket

import java.util.function.Predicate

@ServerWebSocket("/chat/{topic}/{username}") // (1)
class ChatServerWebSocket(private val broadcaster: WebSocketBroadcaster) {

    @OnOpen // (2)
    fun onOpen(topic: String, username: String, session: WebSocketSession) {
        val msg = "[$username] Joined!"
        broadcaster.broadcastSync(msg, isValid(topic, session))
    }

    @OnMessage // (3)
    fun onMessage(topic: String, username: String,
                  message: String, session: WebSocketSession) {
        val msg = "[$username] $message"
        broadcaster.broadcastSync(msg, isValid(topic, session)) // (4)
    }

    @OnClose // (5)
    fun onClose(topic: String, username: String, session: WebSocketSession) {
        val msg = "[$username] Disconnected!"
        broadcaster.broadcastSync(msg, isValid(topic, session))
    }

    private fun isValid(topic: String, session: WebSocketSession): Predicate<WebSocketSession> {
        return Predicate<WebSocketSession> {
            (it !== session && topic.equals(it.uriVariables.get("topic", String::class.java, null), ignoreCase = true))
        }
    }
}
```

  </TabItem>
</Tabs>

1. [@ServerWebSocket](https://micronaut-projects.github.io/micronaut-docs-mn3/3.9.4/api/io/micronaut/websocket/annotation/ServerWebSocket.html) 注解定义了 WebSocket 所映射的路径。该 URI 可以是一个 URI 模板。
2. [@OnOpen](https://micronaut-projects.github.io/micronaut-docs-mn3/3.9.4/api/io/micronaut/websocket/annotation/OnOpen.html) 注解声明了 WebSocket 被打开时要调用的方法。
3. [@OnMessage](https://micronaut-projects.github.io/micronaut-docs-mn3/3.9.4/api/io/micronaut/websocket/annotation/OnMessage.html) 注解声明了收到消息时要调用的方法。
4. 你可以使用 [WebSocketBroadcaster](https://micronaut-projects.github.io/micronaut-docs-mn3/3.9.4/api/io/micronaut/websocket/WebSocketBroadcaster.html) 来向每个 WebSocket 会话广播消息。你可以用 `Predicate` 过滤要发送给哪些会话。此外，你还可以使用 [WebSocketSession](https://micronaut-projects.github.io/micronaut-docs-mn3/3.9.4/api/io/micronaut/websocket/WebSocketSession.html) 实例，用 `WebSocketSession::send` 向其发送消息。
5. [@OnClose](https://micronaut-projects.github.io/micronaut-docs-mn3/3.9.4/api/io/micronaut/websocket/annotation/OnClose.html) 注解声明了 WebSocket 关闭时要调用的方法。

:::note 提示
在 [Micronaut Guides](https://guides.micronaut.io/latest/micronaut-websocket.html) 上可以找到一个 WebSockets 的工作实例。
:::

对于绑定，每个 WebSocket 方法的方法参数可以是：

- 来自 URI 模板的一个变量（在上面的例子中，`topic` 和 `username` 是 URI 模板变量）
- [WebSocketSession](https://micronaut-projects.github.io/micronaut-docs-mn3/3.9.4/api/io/micronaut/websocket/WebSocketSession.html) 的一个实例

**@OnClose 方法**

[@OnClose](https://micronaut-projects.github.io/micronaut-docs-mn3/3.9.4/api/io/micronaut/websocket/annotation/OnClose.html) 方法可以选择性地接收一个 [CloseReason](https://micronaut-projects.github.io/micronaut-docs-mn3/3.9.4/api/io/micronaut/websocket/CloseReason.html)。在会话关闭之前，`@OnClose` 方法被调用。

**@OnMessage 方法**

[@OnMessage](https://micronaut-projects.github.io/micronaut-docs-mn3/3.9.4/api/io/micronaut/websocket/annotation/OnMessage.html) 方法可以为消息体定义一个参数。该参数可以是以下之一：

- 一个 Netty `WebSocketFrame`
- 任何 Java 原始类型或简单类型（如 `String`）。事实上，任何可以从 `ByteBuf` 转换的类型（你可以注册额外的 [TypeConverter](https://micronaut-projects.github.io/micronaut-docs-mn3/3.9.4/api/io/micronaut/core/convert/TypeConverter.html) bean 以支持自定义类型）。
- 一个 `byte[]`，一个 `ByteBuf` 或一个 Java NIO `ByteBuffer`。
- 一个 POJO。在这种情况下，它将被默认为使用 [JsonMediaTypeCodec](https://micronaut-projects.github.io/micronaut-docs-mn3/3.9.4/api/io/micronaut/jackson/codec/JsonMediaTypeCodec.html) 解码的 JSON。你可以注册一个自定义的编解码器，并使用 [@Consumes](https://micronaut-projects.github.io/micronaut-docs-mn3/3.9.4/api/io/micronaut/http/annotation/Consumes.html) 注解定义处理器的内容类型。
- 一个 [WebSocketPongMessage](https://micronaut-projects.github.io/micronaut-docs-mn3/3.9.4/api/io/micronaut/websocket/WebSocketPongMessage.html)。这是一种特殊情况：该方法将不接收常规消息，而是处理作为发送到客户端的ping的回复而到达的 WebSocket pong。

**@OnError 方法**

可以添加一个带有 [@OnError](https://micronaut-projects.github.io/micronaut-docs-mn3/3.9.4/api/io/micronaut/websocket/annotation/OnError.html) 注解的方法来实现自定义错误处理。`@OnError` 方法可以定义一个参数，接收要处理的异常类型。如果没有 `@OnError` 处理方法，并且发生了不可恢复的异常，那么 WebSocket 将自动关闭。

**非阻塞的消息处理**

前面的例子使用了 [WebSocketBroadcaster](https://micronaut-projects.github.io/micronaut-docs-mn3/3.9.4/api/io/micronaut/websocket/WebSocketBroadcaster.html) 接口的 `broadcastSync` 方法，该方法会阻塞直到广播完成。[WebSocketSession](https://micronaut-projects.github.io/micronaut-docs-mn3/3.9.4/api/io/micronaut/websocket/WebSocketSession.html) 中也有类似的 `sendSync` 方法，以阻塞的方式将消息发送到单个接收器。但是，你可以通过从每个 WebSocket 处理方法返回一个 [Publisher](http://www.reactive-streams.org/reactive-streams-1.0.3-javadoc/org/reactivestreams/Publisher.html) 或一个 [Future](https://docs.oracle.com/javase/8/docs/api/java/util/concurrent/Future.html) 来实现非阻塞的 WebSocket 服务器。例如：

*WebSocket 聊天示例*

<Tabs>
  <TabItem value="Java" label="Java" default>

```java
@OnMessage
public Publisher<Message> onMessage(String topic, String username,
                                    Message message, WebSocketSession session) {
    String text = "[" + username + "] " + message.getText();
    Message newMessage = new Message(text);
    return broadcaster.broadcast(newMessage, isValid(topic, session));
}
```

  </TabItem>
  <TabItem value="Groovy" label="Groovy">

```groovy
@OnMessage
Publisher<Message> onMessage(String topic, String username,
                             Message message, WebSocketSession session) {
    String text = "[$username] $message.text"
    Message newMessage = new Message(text)
    broadcaster.broadcast(newMessage, isValid(topic, session))
}
```

  </TabItem>
  <TabItem value="Kotlin" label="Kotlin">

```kt
@OnMessage
fun onMessage(topic: String, username: String,
              message: Message, session: WebSocketSession): Publisher<Message> {
    val text = "[" + username + "] " + message.text
    val newMessage = Message(text)
    return broadcaster.broadcast(newMessage, isValid(topic, session))
}
```

  </TabItem>
</Tabs>

上面的例子使用了广播，它创建了一个 Publisher 的实例并将其值返回给 Micronaut。Micronaut 基于 Publisher 接口异步地发送消息。类似的发送方法通过 Micronaut 的返回值异步地发送一条消息。

对于在 Micronaut 注解的处理程序方法之外异步发送消息，你可以在其各自的 [WebSocketBroadcaster](https://micronaut-projects.github.io/micronaut-docs-mn3/3.9.4/api/io/micronaut/websocket/WebSocketBroadcaster.html) 和 [WebSocketSession](https://micronaut-projects.github.io/micronaut-docs-mn3/3.9.4/api/io/micronaut/websocket/WebSocketSession.html) 接口中使用 `broadcastAsync` 和 `sendAsync` 方法。对于阻塞式发送，可以使用 `broadcastSync` 和 `sendSync` 方法。

**@ServerWebSocket 和范围**

默认情况下，`@ServerWebSocket` 实例被共享给所有 WebSocket 连接。必须格外注意同步本地状态以避免线程安全问题。

如果你希望每个连接都有一个实例，请用 [@Prototype](https://micronaut-projects.github.io/micronaut-docs-mn3/3.9.4/api/io/micronaut/context/annotation/Prototype.html) 来注解该类。这让你可以从 `@OnOpen` 处理程序中检索 [WebSocketSession](https://micronaut-projects.github.io/micronaut-docs-mn3/3.9.4/api/io/micronaut/websocket/WebSocketSession.html)，并将其分配给 `@ServerWebSocket` 实例的一个字段。

**与 HTTP 会话共享会话**

[WebSocketSession](https://micronaut-projects.github.io/micronaut-docs-mn3/3.9.4/api/io/micronaut/websocket/WebSocketSession.html) 默认是由一个内存映射支持的。不过，如果你添加了 `session` 模块，你可以在 HTTP 服务器和 WebSocket 服务器之间共享[会话](/core/httpserver/sessions)。

:::tip 注意
当会话由持久性存储,如 Redis 支持时，在每个消息被处理后，会话被更新到支持的存储中。
:::

:::note 提示
*使用 CLI*

如果你使用应用类型 `Micronaut Application` 创建了你的项目，你可以使用 Micronaut CLI 的 `create-websocket-server` 命令来创建一个带有 [ServerWebSocket](https://micronaut-projects.github.io/micronaut-docs-mn3/3.9.4/api/io/micronaut/websocket/annotation/ServerWebSocket.html) 注解的类。

```bash
$ mn create-websocket-server MyChat
| Rendered template WebsocketServer.java to destination src/main/java/example/MyChatServer.java
```
:::

**连接超时**

默认情况下，Micronaut 在 5 分钟后会关闭没有活动的空闲连接。通常这不是一个问题，因为浏览器会自动重新连接 WebSocket 会话，但是你可以通过设置 `micronaut.server.idle-timeout` 来控制这种行为（一个负值导致不会超时）：

*设置服务器的连接超时*

```yaml
micronaut:
  server:
    idle-timeout: 30m # 30 minutes
```

如果你使用 Micronaut 的 WebSocket 客户端，你可能还希望在客户端设置超时：

*设置客户端的连接超时*

```yaml
micronaut:
  http:
    client:
      read-idle-timeout: 30m # 30 minutes
```

## 6.26.2 @ClientWebSocket

[@ClientWebSocket](https://micronaut-projects.github.io/micronaut-docs-mn3/3.9.4/api/io/micronaut/websocket/annotation/ClientWebSocket.html) 注解可与 [WebSocketClient](https://micronaut-projects.github.io/micronaut-docs-mn3/3.9.4/api/io/micronaut/websocket/WebSocketClient.html) 接口一起使用，以定义 WebSocket 客户端。

你可以使用 [@Client](https://micronaut-projects.github.io/micronaut-docs-mn3/3.9.4/api/io/micronaut/http/client/annotation/Client.html) 注解注入对 [WebSocketClient](https://micronaut-projects.github.io/micronaut-docs-mn3/3.9.4/api/io/micronaut/websocket/WebSocketClient.html) 的引用：

```java
@Inject
@Client("http://localhost:8080")
WebSocketClient webSocketClient;
```

这让你可以为 WebSocket 客户端使用相同的服务发现和负载平衡功能。

一旦你有了对 [WebSocketClient](https://micronaut-projects.github.io/micronaut-docs-mn3/3.9.4/api/io/micronaut/websocket/WebSocketClient.html) 接口的引用，你就可以使用 `connect` 方法来获得一个用 [@ClientWebSocket](https://micronaut-projects.github.io/micronaut-docs-mn3/3.9.4/api/io/micronaut/websocket/WebSocketClient.html) 注解的 bean 的连接实例。

例如，考虑下面的实现：

*WebSocket 聊天示例*

<Tabs>
  <TabItem value="Java" label="Java" default>

```java
import io.micronaut.http.HttpRequest;
import io.micronaut.websocket.WebSocketSession;
import io.micronaut.websocket.annotation.ClientWebSocket;
import io.micronaut.websocket.annotation.OnMessage;
import io.micronaut.websocket.annotation.OnOpen;
import org.reactivestreams.Publisher;
import io.micronaut.core.async.annotation.SingleResult;
import java.util.Collection;
import java.util.concurrent.ConcurrentLinkedQueue;
import java.util.concurrent.Future;

@ClientWebSocket("/chat/{topic}/{username}") // (1)
public abstract class ChatClientWebSocket implements AutoCloseable { // (2)

    private WebSocketSession session;
    private HttpRequest request;
    private String topic;
    private String username;
    private Collection<String> replies = new ConcurrentLinkedQueue<>();

    @OnOpen
    public void onOpen(String topic, String username,
                       WebSocketSession session, HttpRequest request) { // (3)
        this.topic = topic;
        this.username = username;
        this.session = session;
        this.request = request;
    }

    public String getTopic() {
        return topic;
    }

    public String getUsername() {
        return username;
    }

    public Collection<String> getReplies() {
        return replies;
    }

    public WebSocketSession getSession() {
        return session;
    }

    public HttpRequest getRequest() {
        return request;
    }

    @OnMessage
    public void onMessage(String message) {
        replies.add(message); // (4)
    }
```

  </TabItem>
  <TabItem value="Groovy" label="Groovy">

```groovy
import io.micronaut.http.HttpRequest
import io.micronaut.websocket.WebSocketSession
import io.micronaut.websocket.annotation.ClientWebSocket
import io.micronaut.websocket.annotation.OnMessage
import io.micronaut.websocket.annotation.OnOpen
import org.reactivestreams.Publisher
import reactor.core.publisher.Mono
import java.util.concurrent.ConcurrentLinkedQueue
import java.util.concurrent.Future
import io.micronaut.core.async.annotation.SingleResult

@ClientWebSocket("/chat/{topic}/{username}") // (1)
abstract class ChatClientWebSocket implements AutoCloseable { // (2)

    private WebSocketSession session
    private HttpRequest request
    private String topic
    private String username
    private Collection<String> replies = new ConcurrentLinkedQueue<>()

    @OnOpen
    void onOpen(String topic, String username,
                WebSocketSession session, HttpRequest request) { // (3)
        this.topic = topic
        this.username = username
        this.session = session
        this.request = request
    }

    String getTopic() {
        topic
    }

    String getUsername() {
        username
    }

    Collection<String> getReplies() {
        replies
    }

    WebSocketSession getSession() {
        session
    }

    HttpRequest getRequest() {
        request
    }

    @OnMessage
    void onMessage(String message) {
        replies << message // (4)
    }
```

  </TabItem>
  <TabItem value="Kotlin" label="Kotlin">

```kt
import io.micronaut.http.HttpRequest
import io.micronaut.websocket.WebSocketSession
import io.micronaut.websocket.annotation.ClientWebSocket
import io.micronaut.websocket.annotation.OnMessage
import io.micronaut.websocket.annotation.OnOpen
import reactor.core.publisher.Mono
import java.util.concurrent.ConcurrentLinkedQueue
import java.util.concurrent.Future

@ClientWebSocket("/chat/{topic}/{username}") // (1)
abstract class ChatClientWebSocket : AutoCloseable { // (2)

    var session: WebSocketSession? = null
        private set
    var request: HttpRequest<*>? = null
        private set
    var topic: String? = null
        private set
    var username: String? = null
        private set
    private val replies = ConcurrentLinkedQueue<String>()

    @OnOpen
    fun onOpen(topic: String, username: String,
               session: WebSocketSession, request: HttpRequest<*>) { // (3)
        this.topic = topic
        this.username = username
        this.session = session
        this.request = request
    }

    fun getReplies(): Collection<String> {
        return replies
    }

    @OnMessage
    fun onMessage(message: String) {
        replies.add(message) // (4)
    }
```

  </TabItem>
</Tabs>

1. 该类是抽象的（后面会有更多介绍），并以 [@ClientWebSocket](https://micronaut-projects.github.io/micronaut-docs-mn3/3.9.4/api/io/micronaut/websocket/annotation/ClientWebSocket.html) 为注解。
2. 客户端必须实现 `AutoCloseable`，你应该确保连接在某个时间点被关闭。
3. 你可以使用与服务器上相同的注解，在这种情况下，`@OnOpen` 可以获得对底层会话的引用。
4. `@OnMessage` 注解定义了从服务器接收响应的方法。

你也可以定义以 `send` 或 `broadcast` 开头的抽象方法，这些方法将在编译时为你实现。比如说：

*WebSocket 发送方法*

```java
public abstract void send(String message);
```

注意，通过返回 `void`，这告诉 Micronaut 该方法是一个阻塞的发送。你可以定义返回期货或 [Publisher](http://www.reactive-streams.org/reactive-streams-1.0.3-javadoc/org/reactivestreams/Publisher.html) 的方法：

*WebSocket 发送方法*

```java
public abstract reactor.core.publisher.Mono<String> send(String message);
```

上面的例子定义了一个发送方法，它返回一个 [Mono](https://projectreactor.io/docs/core/release/api/reactor/core/publisher/Mono.html)。

*WebSocket 发送方法*

```java
public abstract java.util.concurrent.Future<String> sendAsync(String message);
```

上面的例子定义了一个异步执行的发送方法，并返回一个 [Future](https://docs.oracle.com/javase/8/docs/api/java/util/concurrent/Future.html) 来访问结果。

一旦你定义了一个客户端类，你就可以连接到客户端套接字并开始发送消息：

*连接一个客户端 WebSocket*

```java
ChatClientWebSocket chatClient = webSocketClient
    .connect(ChatClientWebSocket.class, "/chat/football/fred")
    .blockFirst();
chatClient.send("Hello World!");
```

:::tip 注意
为了说明问题，我们使用 `blockFirst()` 来获取客户端。不过，也可以结合 `connect`（返回一个 [Flux](https://projectreactor.io/docs/core/release/api/reactor/core/publisher/Flux.html)）来通过 WebSocket 进行非阻塞式交互。
:::

:::note 提示
*使用 CLI*

如果你使用 Micronaut CLI 和默认（`service`）配置文件创建了你的项目，你可以使用 `create-websocket-client` 命令来创建 [WebSocketClient](https://micronaut-projects.github.io/micronaut-docs-mn3/3.9.4/api/io/micronaut/websocket/WebSocketClient.html) 的抽象类。

```java
$ mn create-websocket-client MyChat
| Rendered template WebsocketClient.java to destination src/main/java/example/MyChatClient.java
```
:::

> [英文链接](https://docs.micronaut.io/3.9.4/guide/index.html#websocket)

---
sidebar_position: 10
---

# 6.1 运行嵌入式服务器

要运行服务器，请使用 `static void main` 方法创建一个 `Application` 类，例如：

*Micronaut Application 类*

import Tabs from '@theme/Tabs';
import TabItem from '@theme/TabItem';

<Tabs>
  <TabItem value="Java" label="Java" default>

```java
import io.micronaut.runtime.Micronaut;

public class Application {

    public static void main(String[] args) {
        Micronaut.run(Application.class);
    }
}
```

  </TabItem>
  <TabItem value="Groovy" label="Groovy">

```groovy
import io.micronaut.runtime.Micronaut

class Application {

    static void main(String... args) {
        Micronaut.run Application
    }
}
```

  </TabItem>
  <TabItem value="Kotlin" label="Kotlin">

```kt
import io.micronaut.runtime.Micronaut

object Application {

    @JvmStatic
    fun main(args: Array<String>) {
        Micronaut.run(Application.javaClass)
    }
}
```

  </TabItem>
</Tabs>

要从单元测试运行应用程序，请使用 [EmbeddedServer](https://docs.micronaut.io/3.8.4/api/io/micronaut/runtime/server/EmbeddedServer.html) 接口：

*Micronaut 测试用例*

<Tabs>
  <TabItem value="Java" label="Java" default>

```java
import io.micronaut.http.HttpRequest;
import io.micronaut.http.client.HttpClient;
import io.micronaut.http.client.annotation.Client;
import io.micronaut.runtime.server.EmbeddedServer;
import io.micronaut.test.extensions.junit5.annotation.MicronautTest;
import org.junit.jupiter.api.Test;

import jakarta.inject.Inject;

import static org.junit.jupiter.api.Assertions.assertEquals;

@MicronautTest
public class HelloControllerSpec {

    @Inject
    EmbeddedServer server; // (1)

    @Inject
    @Client("/")
    HttpClient client; // (2)

    @Test
    void testHelloWorldResponse() {
        String response = client.toBlocking() // (3)
                .retrieve(HttpRequest.GET("/hello"));
        assertEquals("Hello World", response); // (4)
    }
}
```

  </TabItem>
  <TabItem value="Groovy" label="Groovy">

```groovy
import io.micronaut.http.HttpRequest
import io.micronaut.http.client.HttpClient
import io.micronaut.http.client.annotation.Client
import io.micronaut.runtime.server.EmbeddedServer
import io.micronaut.test.extensions.spock.annotation.MicronautTest
import spock.lang.Specification

import jakarta.inject.Inject

@MicronautTest
class HelloControllerSpec extends Specification {

    @Inject
    EmbeddedServer embeddedServer // (1)

    @Inject
    @Client("/")
    HttpClient client // (2)

    void "test hello world response"() {
        expect:
            client.toBlocking() // (3)
                    .retrieve(HttpRequest.GET('/hello')) == "Hello World" // (4)
    }
}
```

  </TabItem>
  <TabItem value="Kotlin" label="Kotlin">

```kt
import io.micronaut.http.client.HttpClient
import io.micronaut.http.client.annotation.Client
import io.micronaut.runtime.server.EmbeddedServer
import io.micronaut.test.extensions.junit5.annotation.MicronautTest
import org.junit.jupiter.api.Assertions.assertEquals
import org.junit.jupiter.api.Test
import jakarta.inject.Inject

@MicronautTest
class HelloControllerSpec {

    @Inject
    lateinit var server: EmbeddedServer // (1)

    @Inject
    @field:Client("/")
    lateinit var client: HttpClient // (2)

    @Test
    fun testHelloWorldResponse() {
        val rsp: String = client.toBlocking() // (3)
                .retrieve("/hello")
        assertEquals("Hello World", rsp) // (4)
    }
}
```

  </TabItem>
</Tabs>

1. `EmbeddedServer` 正在运行，Spock `@AutoCleanup` 注解可确保在规范完成后停止服务器。
2. `EmbeddedServer` 接口提供在随机端口上运行的被测服务器的 URL。
3. 测试使用 Micronaut HTTP 客户端进行调用
4. `retrieve` 方法以 `String` 的形式返回控制器的响应

:::danger 警告
如果没有明确的端口配置，端口将是 8080，除非应用程序是在端口随机的 `test` 环境下运行的。当应用程序上下文从测试类的上下文开始时，会自动添加测试环境。
:::


> [英文链接](https://docs.micronaut.io/3.9.4/guide/index.html#runningServer)

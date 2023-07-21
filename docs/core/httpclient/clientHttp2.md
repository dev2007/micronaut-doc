---
sidebar_position: 50
---

# 7.5 HTTP/2 支持

默认情况下，Micronaut 的 HTTP 客户端配置为支持 HTTP 1.1。要启用对 HTTP/2 的支持，请在配置中设置支持的 HTTP 版本：

*在客户端启用 HTTP/2*

<Tabs>
  <TabItem value="Properties" label="Properties">

```properties
micronaut.http.client.http-version=2.0
```

  </TabItem>
  <TabItem value="Yaml" label="Yaml">

```yaml
micronaut:
  http:
    client:
      http-version: 2.0
```

  </TabItem>
    <TabItem value="Toml" label="Toml">

```toml
[micronaut]
  [micronaut.http]
    [micronaut.http.client]
      http-version=2.0
```

  </TabItem>
    <TabItem value="Groovy" label="Groovy">

```groovy
micronaut {
  http {
    client {
      httpVersion = 2.0
    }
  }
}
```

  </TabItem>
    <TabItem value="Hoon" label="Hoon">

```hocon
{
  micronaut {
    http {
      client {
        http-version = 2.0
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
        "http-version": 2.0
      }
    }
  }
}
```

  </TabItem>
</Tabs>

或指定注入客户端时使用的 HTTP 版本：

*注入 HTTP/2 客户端*

```java
@Inject
@Client(httpVersion=HttpVersion.HTTP_2_0)
ReactorHttpClient client;
```

> [英文链接](https://micronaut-projects.github.io/micronaut-docs-mn3/3.9.4/guide/index.html#clientHttp2)

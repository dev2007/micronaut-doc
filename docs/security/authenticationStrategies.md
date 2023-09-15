---
sidebar_position: 100
---

# 10. 授权策略

## 10.1 基本认证

开箱即用的 Micronaut 支持 [RFC7617](https://tools.ietf.org/html/rfc7617)，该协议定义了 "Basic" 超文本传输协议（HTTP）认证方案，它以用户-id/密码对的形式传输凭证，并使用 Base64 编码。基本认证默认已启用。你可以通过将 `micronaut.security.basic-auth.enabled` 设置为 `false` 来禁用它。

以下顺序说明了认证流程：

![basicauth](./_img/basicauth.svg)

下面是使用基本认证的 cURL 命令示例：

*使用基本认证的 cURL 命令*

```bash
curl "http://localhost:8080/info" \
     -u 'user:password'
```

从 HTTP 头读取凭证后，凭证会被送 [Authenticator ](https://micronaut-projects.github.io/micronaut-security/latest/api/io/micronaut/security/authentication/Authenticator.html)，验证器会尝试验证凭证。

下面的代码片段说明了如何使用 [MutableHttpRequest](https://micronaut-projects.github.io/micronaut-core/latest/api/io/micronaut/http/MutableHttpRequest.html) 方法中的 `basicAuth` 方法发送凭证：

*使用授权请求标头访问受保护资源*

```java
HttpRequest request = HttpRequest.GET("/home").basicAuth('sherlock', 'password')
```

:::note 提示
阅读[基本认证 Micronaut 指南](https://guides.micronaut.io/latest/micronaut-security-basicauth.html)了解更多信息。
:::

## 10.2 会话授权

Micronaut 支持基于会话的认证。

:::note 提示
*使用 CLI*

如果使用 Micronaut CLI 创建项目，请使用 security-session 功能在项目中配置会话安全性：

```bash
$ mn create-app my-app --features security-session
```

:::

要使用 Micronaut 基于会话的身份验证功能，你必须在类路径中添加 `security-session` 依赖。例如：

import Tabs from '@theme/Tabs';
import TabItem from '@theme/TabItem';

<Tabs>
  <TabItem value="Gradle" label="Gradle">

```groovy
annotationProcessor("io.micronaut.security:micronaut-security-annotations")
```

  </TabItem>
  <TabItem value="Maven" label="Maven">

```xml
<annotationProcessorPaths>
    <path>
        <groupId>io.micronaut.security</groupId>
        <artifactId>micronaut-security-annotations</artifactId>
    </path>
</annotationProcessorPaths>
```

  </TabItem>
</Tabs>

<Tabs>
  <TabItem value="Gradle" label="Gradle">

```groovy
implementation("io.micronaut.security:micronaut-security-session")
```

  </TabItem>
  <TabItem value="Maven" label="Maven">

```xml
<dependency>
    <groupId>io.micronaut.security</groupId>
    <artifactId>micronaut-security-session</artifactId>
</dependency>
```

  </TabItem>
</Tabs>

:::tip 注意
只有在使用 JSR 250 注解时才需要依赖 `micronaut-security-annotations`。
:::

以下顺序说明了认证流程：

![sesssion_based_auth](./_img/sesssion_based_auth.svg)

检查[重定向配置](/security/securityConfiguration#76-重定向配置)，自定义基于会话的认证行为。

### 基于会话的认证配置示例

<Tabs>
  <TabItem value="Properties" label="Properties">

```properties
micronaut.security.authentication=session
micronaut.security.redirect.login-failure=/login/authFailed
```

  </TabItem>
  <TabItem value="Yaml" label="Yaml">

```yaml
micronaut:
  security:
    authentication: session
    redirect:
      login-failure: /login/authFailed
```

  </TabItem>
    <TabItem value="Toml" label="Toml">

```toml
[micronaut]
  [micronaut.security]
    authentication="session"
    [micronaut.security.redirect]
      login-failure="/login/authFailed"
```

  </TabItem>
    <TabItem value="Groovy" label="Groovy">

```groovy
micronaut {
  security {
    authentication = "session"
    redirect {
      loginFailure = "/login/authFailed"
    }
  }
}
```

  </TabItem>
    <TabItem value="Hoon" label="Hoon">

```hocon
{
  micronaut {
    security {
      authentication = "session"
      redirect {
        login-failure = "/login/authFailed"
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
    "security": {
      "authentication": "session",
      "redirect": {
        "login-failure": "/login/authFailed"
      }
    }
  }
}
```

  </TabItem>
</Tabs>

:::note 提示
请阅读[基于会话的认证 Micronaut 指南](https://guides.micronaut.io/latest/micronaut-security-session.html)了解更多信息。
:::

---

### 无重定向的基于会话的认证

当你将 `micronaut.security.authentication` 设置为 `session`，你就启用了 [SessionLoginHandler](https://micronaut-projects.github.io/micronaut-security/latest/api/io/micronaut/security/session/SessionLoginHandler.html) 和 [SessionLogoutHandler](https://micronaut-projects.github.io/micronaut-security/latest/api/io/micronaut/security/session/SessionLogoutHandler.html)。

这些处理程序会向[重定向配置](/security/securityConfiguration#76-重定向配置)中定义的 url 返回 303 响应。使用 `micronaut.security.redirection.enabled=false` 禁用重定向配置，响应将替换为 200。

## 10.3 JSON 网络令牌

以下配置属性可用于自定义基于令牌的认证：

*表 1. [TokenConfigurationProperties](https://micronaut-projects.github.io/micronaut-security/latest/api/io/micronaut/security/token/config/TokenConfigurationProperties.html) 的配置属性*

|属性|类型|描述|
|--|--|--|
|micronaut.security.token.enabled|boolean|设置是否启用配置。默认值 `true`。|
|micronaut.security.token.roles-name|java.lang.String||
|micronaut.security.token.name-key|java.lang.String||
|micronaut.security.token.roles-separator|java.lang.String|如果属性映射中用于角色的条目是字符串，则可以使用分隔符将其值分割为多个角色。默认值 null。|

Micronaut 基于 [Json Web Token (JWT)](https://jwt.io/) 提供安全功能。JWT 是一项 [IETF 标准](https://tools.ietf.org/html/rfc7519)，它定义了一种封装任意数据的安全方法，这些数据可以通过不安全的 URL 发送。

:::note 提示
*使用 CLI*

如果使用 Micronaut CLI 创建项目，请使用 `security-jwt` 功能在项目中配置 JWT 支持：

```bash
$ mn create-app my-app --features security-jwt
```
:::

要使用 Micronaut 基于 JWT 的认证功能，你必须对类路径具有安全 JWT 依赖。例如：

<Tabs>
  <TabItem value="Gradle" label="Gradle">

```groovy
annotationProcessor("io.micronaut.security:micronaut-security-annotations")
```

  </TabItem>
  <TabItem value="Maven" label="Maven">

```xml
<annotationProcessorPaths>
    <path>
        <groupId>io.micronaut.security</groupId>
        <artifactId>micronaut-security-annotations</artifactId>
    </path>
</annotationProcessorPaths>
```

  </TabItem>
</Tabs>

<Tabs>
  <TabItem value="Gradle" label="Gradle">

```groovy
implementation("io.micronaut.security:micronaut-security-jwt")
```

  </TabItem>
  <TabItem value="Maven" label="Maven">

```xml
<dependency>
    <groupId>io.micronaut.security</groupId>
    <artifactId>micronaut-security-jwt</artifactId>
</dependency>
```

  </TabItem>
</Tabs>

:::tip 注意
只有在使用 JSR 250 注解时才需要依赖 `micronaut-security-annotations`
:::

以下配置属性可用于定制基于 JWT 的认证行为：

*表 2. [JwtConfigurationProperties](https://micronaut-projects.github.io/micronaut-security/latest/api/io/micronaut/security/token/jwt/config/JwtConfigurationProperties.html) 的配置属性*

|属性|类型|描述|
|--|--|--|
|micronaut.security.token.jwt.enabled|boolean|设置是否启用 JWT 安全性。默认值 (`true`)。|

### JWT 看起来像什么？

![jwt](./_img/jwt.png)

**Header**

类似于经 base64 编码的 JSON：

*JWT 头*

```json
{
    "alg": "HS256",
    "typ": "JWT"
}
```

**Claims**

类似于经 base64 编码的 JSON 文件：

*JWT claims*

```json
{
    "exp": 1422990129,
    "sub": "jimi",
    "roles": [
        "ROLE_ADMIN",
        "ROLE_USER"
    ],
    "iat": 1422986529
}
```

**Signature**

根据标头指定的算法，它可以是对 base64 编码的标头和声明的数字签名，也可以是对它们的加密。

### 10.3.1 读取 JWT 令牌

#### 10.3.1.1 承载令牌读取器

Micronaut 支持用于传输 JWT 标记的 [RFC 6750 Bearer Token](https://tools.ietf.org/html/rfc6750) 规范。下面的序列说明了 RFC 6750 认证流程：

![jwt-bearer-token](./_img/jwt-bearer-token.svg)

以下配置属性可用于定制如何读取承载令牌：

*表 1. [BearerTokenConfigurationProperties](https://micronaut-projects.github.io/micronaut-security/latest/api/io/micronaut/security/token/bearer/BearerTokenConfigurationProperties.html) 配置属性*

|属性|类型|描述|
|--|--|--|
|micronaut.security.token.bearer.enabled|boolean|设置是否启用承载令牌身份验证。默认值 `true`。|
|micronaut.security.token.bearer.prefix|java.lang.String|设置认证令牌使用的前缀。默认值为 `Bearer`。|
|micronaut.security.token.bearer.header-name|java.lang.String|设置要使用的标头名称。默认值为 `Authorization`。|

##### 在请求中发送令牌

下面的代码片段说明了如何使用 [MutableHttpRequest](https://micronaut-projects.github.io/micronaut-core/latest/api/io/micronaut/http/MutableHttpRequest.html) 方法中的 `bearerAuth` 方法在 `Authorization` 请求标头中发送 JWT 令牌：

*使用 Authorization 请求头访问受保护资源*

```groovy
String accessToken = rsp.body().accessToken
List<Book> books = gatewayClient.toBlocking().retrieve(HttpRequest.GET("/api/gateway")
        .bearerAuth(accessToken), Argument.listOf(Book))
```

*使用 Authorization 请求标头的 HTTP GET 请求示例*

```bash
GET /protectedResource HTTP/1.1
Host: micronaut.example`
Authorization: Bearer eyJhbGciOiJIUzI1NiJ9.eyJleHAiOjE0MjI5OTU5MjIsInN1YiI6ImppbWkiLCJyb2xlcyI6WyJST0xFX0FETUlOIiwiUk9MRV9VU0VSIl0sImlhdCI6MTQyMjk5MjMyMn0.rA7A2Gwt14LaYMpxNRtrCdO24RGrfHtZXY9fIjV8x8o
```

:::note 提示
查看 [Micronaut JWT 验证](https://guides.micronaut.io/latest/micronaut-security-jwt.html) 教程，了解 Micronaut JWT 支持。
:::

#### 10.3.1.2 Cookie 令牌读取器

你也可以从 Cookie 发送/读取 JWT 令牌。

下面的顺序说明了验证流程：

![jwt-cookie](./_img/jwt-cookie.svg)

从 Cookie 中读取令牌默认为禁用。请注意，使用 Cookie 中的 JWT 标记需要启用 JWT 认证。

*表 1. [TokenCookieConfigurationProperties](https://micronaut-projects.github.io/micronaut-security/latest/api/io/micronaut/security/token/cookie/TokenCookieConfigurationProperties.html) 的配置属性*

|属性|类型|描述|
|--|--|--|
|micronaut.security.token.cookie.cookie-domain|java.lang.String||
|micronaut.security.token.cookie.cookie-http-only|java.lang.Boolean||
|micronaut.security.token.cookie.cookie-secure|java.lang.Boolean||
|micronaut.security.token.cookie.cookie-max-age|java.time.Duration||
|micronaut.security.token.cookie.cookie-same-site|[SameSite](https://micronaut-projects.github.io/micronaut-security/latest/api/io/micronaut/http/cookie/SameSite.html)|设置 cookie 的同站点设置。默认值为空。该值区分大小写。允许值：`Strict`、`Lax` 或 `None`。|
|micronaut.security.token.cookie.enabled|boolean||
|micronaut.security.token.cookie.cookie-name|java.lang.String||
|micronaut.security.token.cookie.cookie-path|java.lang.String||

:::note 提示
阅读 [用 Cookies 的 Micronaut JWT Authentication](https://guides.micronaut.io/latest/micronaut-security-jwt-cookie.html) 了解更多。
:::

### 10.3.2 JWT 签名验证

Micronaut 安全功能使用 [JSON Web 签名](https://tools.ietf.org/html/rfc7515)规范指定的签名 JWT。

Micronaut 的 JWT 验证支持多种签名配置。因此，你可以在同一个应用程序中验证由不同发行者签名的 JSON Web 标记。

要验证 JWT 令牌的签名，需要 [SignatureConfiguration](https://micronaut-projects.github.io/micronaut-security/latest/api/io/micronaut/security/token/jwt/signature/SignatureConfiguration.html) 类型的 Bean。

创建 [SignatureConfiguration](https://micronaut-projects.github.io/micronaut-security/latest/api/io/micronaut/security/token/jwt/signature/SignatureConfiguration.html) 类型 Bean 的最简单方法是在应用程序中添加 [RSASignatureConfiguration](https://micronaut-projects.github.io/micronaut-security/latest/api/io/micronaut/security/token/jwt/signature/rsa/RSASignatureConfiguration.html)、[ECSignatureConfiguration](https://micronaut-projects.github.io/micronaut-security/latest/api/io/micronaut/security/token/jwt/signature/ec/ECSignatureConfiguration.html) 或 [SecretSignatureConfiguration](https://micronaut-projects.github.io/micronaut-security/latest/api/io/micronaut/security/token/jwt/signature/secret/SecretSignatureConfiguration.html) 类型的 Bean，这些 Bean 必须使用 `@Named` [限定](/core/ioc#35-bean-限定符)，因为配置 Bean 会被工厂（[RSASignatureFactory](https://micronaut-projects.github.io/micronaut-security/latest/api/io/micronaut/security/token/jwt/signature/rsa/RSASignatureFactory.html)、[ECSignatureFactory](https://micronaut-projects.github.io/micronaut-security/latest/api/io/micronaut/security/token/jwt/signature/ec/ECSignatureConfiguration.html)）或其他 Bean（[SecretSignature](https://micronaut-projects.github.io/micronaut-security/latest/api/io/micronaut/security/token/jwt/signature/secret/SecretSignature.html)）使用，这些工厂或其他 Bean 使用 [@EachBean](https://docs.micronaut.io/latest/guide/index.html#eachBean) 来驱动配置。

#### 10.3.2.1 远程 JWKS

[JSON Web 密钥（JWK）](https://tools.ietf.org/html/rfc7517)是表示加密密钥的 JSON 对象。你可以使用远程 JWK Set（代表一组 JWK 的 JSON 对象）来验证 JWT 签名。

你可以将远程 JWKS 配置为签名验证器：

<Tabs>
  <TabItem value="Properties" label="Properties">

```properties
micronaut.security.token.jwt.signatures.jwks.awscognito.url=https://cognito-idp.eu-west-1.amazonaws.com/eu-west-XXXX/.well-known/jwks.json
```

  </TabItem>
  <TabItem value="Yaml" label="Yaml">

```yaml
micronaut:
  security:
    token:
      jwt:
        signatures:
          jwks:
            awscognito:
              url: 'https://cognito-idp.eu-west-1.amazonaws.com/eu-west-XXXX/.well-known/jwks.json'
```

  </TabItem>
    <TabItem value="Toml" label="Toml">

```toml
[micronaut]
  [micronaut.security]
    [micronaut.security.token]
      [micronaut.security.token.jwt]
        [micronaut.security.token.jwt.signatures]
          [micronaut.security.token.jwt.signatures.jwks]
            [micronaut.security.token.jwt.signatures.jwks.awscognito]
              url="https://cognito-idp.eu-west-1.amazonaws.com/eu-west-XXXX/.well-known/jwks.json"
```

  </TabItem>
    <TabItem value="Groovy" label="Groovy">

```groovy
micronaut {
  security {
    token {
      jwt {
        signatures {
          jwks {
            awscognito {
              url = "https://cognito-idp.eu-west-1.amazonaws.com/eu-west-XXXX/.well-known/jwks.json"
            }
          }
        }
      }
    }
  }
}
```

  </TabItem>
    <TabItem value="Hoon" label="Hoon">

```hocon
{
  micronaut {
    security {
      token {
        jwt {
          signatures {
            jwks {
              awscognito {
                url = "https://cognito-idp.eu-west-1.amazonaws.com/eu-west-XXXX/.well-known/jwks.json"
              }
            }
          }
        }
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
    "security": {
      "token": {
        "jwt": {
          "signatures": {
            "jwks": {
              "awscognito": {
                "url": "https://cognito-idp.eu-west-1.amazonaws.com/eu-west-XXXX/.well-known/jwks.json"
              }
            }
          }
        }
      }
    }
  }
}
```

  </TabItem>
</Tabs>

前面的代码段创建了一个带有 `awscognito` 名称限定符的 [JwksSignature](https://micronaut-projects.github.io/micronaut-security/latest/api/io/micronaut/security/token/jwt/signature/jwks/JwksSignature.html) bean。

如果你想公开自己的 JWK Set，参阅[密钥控制器](/security/endpoints#134-密钥控制器)部分。

##### 10.3.2.1.1 本地 JWKS

你可以指定以 `classpath:` 或 `file:` 开头的路径，以便从磁盘上或 classpath 中的任意位置提供 JSON JWKS。例如，若要从 `src/main/resources/jwks/certs.json` 提供静态资源，则应使用 `classpath:jwks/certs.json` 作为路径。

<Tabs>
  <TabItem value="Properties" label="Properties">

```properties
micronaut.security.token.jwt.signatures.jwks-static.google.path=classpath:jwks/certs.json
```

  </TabItem>
  <TabItem value="Yaml" label="Yaml">

```yaml
micronaut:
  security:
    token:
      jwt:
        signatures:
          jwks-static:
            google:
              path: 'classpath:jwks/certs.json'
```

  </TabItem>
    <TabItem value="Toml" label="Toml">

```toml
[micronaut]
  [micronaut.security]
    [micronaut.security.token]
      [micronaut.security.token.jwt]
        [micronaut.security.token.jwt.signatures]
          [micronaut.security.token.jwt.signatures.jwks-static]
            [micronaut.security.token.jwt.signatures.jwks-static.google]
              path="classpath:jwks/certs.json"
```

  </TabItem>
    <TabItem value="Groovy" label="Groovy">

```groovy
micronaut {
  security {
    token {
      jwt {
        signatures {
          jwksStatic {
            google {
              path = "classpath:jwks/certs.json"
            }
          }
        }
      }
    }
  }
}
```

  </TabItem>
    <TabItem value="Hoon" label="Hoon">

```hocon
{
  micronaut {
    security {
      token {
        jwt {
          signatures {
            jwks-static {
              google {
                path = "classpath:jwks/certs.json"
              }
            }
          }
        }
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
    "security": {
      "token": {
        "jwt": {
          "signatures": {
            "jwks-static": {
              "google": {
                "path": "classpath:jwks/certs.json"
              }
            }
          }
        }
      }
    }
  }
}
```

  </TabItem>
</Tabs>

### 10.3.3 生成 JWT 令牌

Micronaut 依靠 Nimbus JOSE + JWT 库提供 JWT 令牌签名和加密。

以下是可用的配置选项：

*表 1. [AccessTokenConfigurationProperties](https://connect2id.com/products/nimbus-jose-jwt) 的配置属性*

|属性|类型|描述|
|--|--|--|
|micronaut.security.token.generator.access-token.expiration|java.lang.Integer|访问令牌过期。默认值 (`3600`)。|

#### 10.3.3.1 生成签名 JWT

要生成签名 JWT，你需要在应用程序中使用 [RSASignatureGeneratorConfiguration](https://micronaut-projects.github.io/micronaut-security/latest/api/io/micronaut/security/token/jwt/signature/rsa/RSASignatureGeneratorConfiguration.html)、[ECSignatureGeneratorConfiguration](https://micronaut-projects.github.io/micronaut-security/latest/api/io/micronaut/security/token/jwt/signature/ec/ECSignatureGeneratorConfiguration.html) 或 [SecretSignatureConfiguration](https://micronaut-projects.github.io/micronaut-security/latest/api/io/micronaut/security/token/jwt/signature/secret/SecretSignatureConfiguration.html) 类型的 Bean，该 Bean 必须使用 `@Named` `generator` [限定](/core/ioc#35-bean-限定符)，因为配置 Bean 会被使用 [@EachBean](/core/ioc#35-bean-限定符) 驱动配置的工厂（[RSASignatureGeneratorFactory](https://micronaut-projects.github.io/micronaut-security/latest/api/io/micronaut/security/token/jwt/signature/rsa/RSASignatureGeneratorFactory.html)、[ECSignatureGeneratorFactory](https://micronaut-projects.github.io/micronaut-security/latest/api/io/micronaut/security/token/jwt/signature/ec/ECSignatureGeneratorConfiguration.html)）或其他 Bean（[SecretSignature](https://micronaut-projects.github.io/micronaut-security/latest/api/io/micronaut/security/token/jwt/signature/secret/SecretSignature.html)）使用。

:::note 提示
请记住使用 `@Named` `generator` 限定你希望用于签署 JSON 网络令牌的签名配置 Bean。
:::

#### 10.3.3.2 使用 Secret 签名的 JWT 示例

你可以通过配置轻松地设置使用 `@Named` `generator` 限定的 [SecretSignatureConfiguration](https://micronaut-projects.github.io/micronaut-security/latest/api/io/micronaut/security/token/jwt/signature/secret/SecretSignatureConfiguration.html)：

<Tabs>
  <TabItem value="Properties" label="Properties">

```properties
micronaut.security.token.jwt.signatures.secret.generator.secret=pleaseChangeThisSecretForANewOne
micronaut.security.token.jwt.signatures.secret.generator.jws-algorithm=HS256
```

  </TabItem>
  <TabItem value="Yaml" label="Yaml">

```yaml
micronaut:
  security:
    token:
      jwt:
        signatures:
          secret:
            generator:
              secret: pleaseChangeThisSecretForANewOne
              jws-algorithm: HS256
```

  </TabItem>
    <TabItem value="Toml" label="Toml">

```toml
[micronaut]
  [micronaut.security]
    [micronaut.security.token]
      [micronaut.security.token.jwt]
        [micronaut.security.token.jwt.signatures]
          [micronaut.security.token.jwt.signatures.secret]
            [micronaut.security.token.jwt.signatures.secret.generator]
              secret="pleaseChangeThisSecretForANewOne"
              jws-algorithm="HS256"
```

  </TabItem>
    <TabItem value="Groovy" label="Groovy">

```groovy
micronaut {
  security {
    token {
      jwt {
        signatures {
          secret {
            generator {
              secret = "pleaseChangeThisSecretForANewOne"
              jwsAlgorithm = "HS256"
            }
          }
        }
      }
    }
  }
}
```

  </TabItem>
    <TabItem value="Hoon" label="Hoon">

```hocon
{
  micronaut {
    security {
      token {
        jwt {
          signatures {
            secret {
              generator {
                secret = "pleaseChangeThisSecretForANewOne"
                jws-algorithm = "HS256"
              }
            }
          }
        }
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
    "security": {
      "token": {
        "jwt": {
          "signatures": {
            "secret": {
              "generator": {
                "secret": "pleaseChangeThisSecretForANewOne",
                "jws-algorithm": "HS256"
              }
            }
          }
        }
      }
    }
  }
}
```

  </TabItem>
</Tabs>

- **将 `secret` 属性更改为你自己的秘密，并妥善保管**。
- `jws-algorithm` 指定 Json Web 令牌签名名称。在本例中，HMAC 使用 SHA-256 哈希算法。

你可以提供 Base64 编码的 secret。

<Tabs>
  <TabItem value="Properties" label="Properties">

```properties
micronaut.security.token.jwt.signatures.secret.generator.secret=cGxlYXNlQ2hhbmdlVGhpc1NlY3JldEZvckFOZXdPbmU=
micronaut.security.token.jwt.signatures.secret.generator.base64=true
micronaut.security.token.jwt.signatures.secret.generator.jws-algorithm=HS256
```

  </TabItem>
  <TabItem value="Yaml" label="Yaml">

```yaml
micronaut:
  security:
    token:
      jwt:
        signatures:
          secret:
            generator:
              secret: 'cGxlYXNlQ2hhbmdlVGhpc1NlY3JldEZvckFOZXdPbmU='
              base64: true
              jws-algorithm: HS256
```

  </TabItem>
    <TabItem value="Toml" label="Toml">

```toml
[micronaut]
  [micronaut.security]
    [micronaut.security.token]
      [micronaut.security.token.jwt]
        [micronaut.security.token.jwt.signatures]
          [micronaut.security.token.jwt.signatures.secret]
            [micronaut.security.token.jwt.signatures.secret.generator]
              secret="cGxlYXNlQ2hhbmdlVGhpc1NlY3JldEZvckFOZXdPbmU="
              base64=true
              jws-algorithm="HS256"
```

  </TabItem>
    <TabItem value="Groovy" label="Groovy">

```groovy
micronaut {
  security {
    token {
      jwt {
        signatures {
          secret {
            generator {
              secret = "cGxlYXNlQ2hhbmdlVGhpc1NlY3JldEZvckFOZXdPbmU="
              base64 = true
              jwsAlgorithm = "HS256"
            }
          }
        }
      }
    }
  }
}
```

  </TabItem>
    <TabItem value="Hoon" label="Hoon">

```hocon
{
  micronaut {
    security {
      token {
        jwt {
          signatures {
            secret {
              generator {
                secret = "cGxlYXNlQ2hhbmdlVGhpc1NlY3JldEZvckFOZXdPbmU="
                base64 = true
                jws-algorithm = "HS256"
              }
            }
          }
        }
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
    "security": {
      "token": {
        "jwt": {
          "signatures": {
            "secret": {
              "generator": {
                "secret": "cGxlYXNlQ2hhbmdlVGhpc1NlY3JldEZvckFOZXdPbmU=",
                "base64": true,
                "jws-algorithm": "HS256"
              }
            }
          }
        }
      }
    }
  }
}
```

  </TabItem>
</Tabs>

- 本例中的 `secret` 是 Base64 编码的
- 设置 `base64` 表示 secret 是 Base64 编码的

#### 10.3.3.3 使用 RSA 签名的 JWT 示例

生成 RSA 签名的程序设置如下

```groovy
@Factory
class MySignatureGeneratorConfigurationFactory {
    @Bean
    @Named("generator") (1)
    SignatureGeneratorConfiguration signatureGeneratorConfiguration(RSASignatureGeneratorConfiguration configuration) {(2)
        return new RSASignatureGenerator(configuration)
    }
}
```

1. 为签名生成器配置 `generator` 命名，使其参与 JWT 令牌生成。
2. 注册一个 RSASignatureGeneratorConfiguration 类型的附加 Bean，并在此处注入

### 10.3.4 JWT 加密

签名声明可防止攻击者篡改其内容以引入恶意数据或通过添加更多角色来尝试权限升级。不过，只需使用 Base 64 就能解码这些权利要求。

如果声明包含敏感信息，可以使用 JSON Web 加密算法来防止它们被解码。

Micronaut 的 JWT 验证支持多种加密配置。

[RSAEncryptionConfiguration](https://micronaut-projects.github.io/micronaut-security/latest/api/io/micronaut/security/token/jwt/encryption/rsa/RSAEncryptionConfiguration.html), [ECEncryptionConfiguration](https://micronaut-projects.github.io/micronaut-security/latest/api/io/micronaut/security/token/jwt/encryption/ec/ECEncryptionConfiguration.html), [SecretEncryptionConfiguration](https://micronaut-projects.github.io/micronaut-security/latest/api/io/micronaut/security/token/jwt/encryption/secret/SecretEncryptionConfiguration.html) 类型的 bean 可作为加密配置参与 JWT 验证。

这些豆需要用 `@Named` [限定](/core/ioc#35-bean-限定符)，因为配置 bean 会被使用 [@EachBean](https://docs.micronaut.io/latest/guide/index.html#eachBean) 来驱动配置的工厂（[RSAEncryptionFactory](https://micronaut-projects.github.io/micronaut-security/latest/api/io/micronaut/security/token/jwt/encryption/rsa/RSAEncryptionFactory.html)、[ECEncryptionFactory](https://micronaut-projects.github.io/micronaut-security/latest/api/io/micronaut/security/token/jwt/encryption/ec/ECEncryptionFactory.html)）或其他豆（[SecretEncryptionFactory](https://micronaut-projects.github.io/micronaut-security/latest/api/io/micronaut/security/token/jwt/encryption/secret/SecretEncryptionFactory.html)）使用。

如果你想在应用程序生成的令牌中使用加密配置，请使用 `generator` 作为 `@Named` 限定符。

#### 10.3.4.1 用密文签名并用 RSA 加密的 JWT 示例

通过配置属性设置 [SecretSignatureConfiguration](https://micronaut-projects.github.io/micronaut-security/latest/api/io/micronaut/security/token/jwt/signature/secret/SecretSignatureConfiguration.html)

<Tabs>
  <TabItem value="Properties" label="Properties">

```properties
micronaut.security.token.jwt.signatures.secret.generator.secret=pleaseChangeThisSecretForANewOne
micronaut.security.token.jwt.signatures.secret.generator.jws-algorithm=HS256
pem.path=/home/user/rsa-2048bit-key-pair.pem
```

  </TabItem>
  <TabItem value="Yaml" label="Yaml">

```yaml
micronaut:
  security:
    token:
      jwt:
        signatures:
          secret:
            generator:
              secret: pleaseChangeThisSecretForANewOne
              jws-algorithm: HS256
pem:
  path: /home/user/rsa-2048bit-key-pair.pem #(2)
```

  </TabItem>
    <TabItem value="Toml" label="Toml">

```toml
[micronaut]
  [micronaut.security]
    [micronaut.security.token]
      [micronaut.security.token.jwt]
        [micronaut.security.token.jwt.signatures]
          [micronaut.security.token.jwt.signatures.secret]
            [micronaut.security.token.jwt.signatures.secret.generator]
              secret="pleaseChangeThisSecretForANewOne"
              jws-algorithm="HS256"
[pem]
  path="/home/user/rsa-2048bit-key-pair.pem"
```

  </TabItem>
    <TabItem value="Groovy" label="Groovy">

```groovy
micronaut {
  security {
    token {
      jwt {
        signatures {
          secret {
            generator {
              secret = "pleaseChangeThisSecretForANewOne"
              jwsAlgorithm = "HS256"
            }
          }
        }
      }
    }
  }
}
pem {
  path = "/home/user/rsa-2048bit-key-pair.pem"
}
```

  </TabItem>
    <TabItem value="Hoon" label="Hoon">

```hocon
{
  micronaut {
    security {
      token {
        jwt {
          signatures {
            secret {
              generator {
                secret = "pleaseChangeThisSecretForANewOne"
                jws-algorithm = "HS256"
              }
            }
          }
        }
      }
    }
  }
  pem {
    path = "/home/user/rsa-2048bit-key-pair.pem"
  }
}
```

  </TabItem>
    <TabItem value="JSON" label="JSON">

```json
{
  "micronaut": {
    "security": {
      "token": {
        "jwt": {
          "signatures": {
            "secret": {
              "generator": {
                "secret": "pleaseChangeThisSecretForANewOne",
                "jws-algorithm": "HS256"
              }
            }
          }
        }
      }
    }
  },
  "pem": {
    "path": "/home/user/rsa-2048bit-key-pair.pem"
  }
}
```

  </TabItem>
</Tabs>

- 为签名配置 `generator` 命名，使其参与 JWT 令牌生成。
- `pem.path` 指定 PEM 文件的位置

生成 2048 位 RSA 私钥和公钥对：

```bash
openssl genrsa -out rsa-2048bit-key-pair.pem 2048
```

```groovy
@Named("generator") (1)
@Singleton
class RSAOAEPEncryptionConfiguration implements RSAEncryptionConfiguration {

    private RSAPrivateKey rsaPrivateKey
    private RSAPublicKey rsaPublicKey
    JWEAlgorithm jweAlgorithm = JWEAlgorithm.RSA_OAEP_256
    EncryptionMethod encryptionMethod = EncryptionMethod.A128GCM

    RSAOAEPEncryptionConfiguration(@Value('${pem.path}') String pemPath) {
        Optional<KeyPair> keyPair = KeyPairProvider.keyPair(pemPath)
        if (keyPair.isPresent()) {
            this.rsaPublicKey = (RSAPublicKey) keyPair.get().getPublic()
            this.rsaPrivateKey = (RSAPrivateKey) keyPair.get().getPrivate()
        }
    }

    @Override
    RSAPublicKey getPublicKey() {
        return rsaPublicKey
    }

    @Override
    RSAPrivateKey getPrivateKey() {
        return rsaPrivateKey
    }

    @Override
    JWEAlgorithm getJweAlgorithm() {
        return jweAlgorithm
    }

    @Override
    EncryptionMethod getEncryptionMethod() {
        return encryptionMethod
    }
}
```

- 命名 Bean `generator`，将此 Bean 指定为 JWT 令牌生成的参与者。

要解析 PEM 密钥，请使用 [OpenSSL 密钥生成](https://connect2id.com/products/nimbus-jose-jwt/openssl-key-generation)中所述的协作器。

```groovy
@Slf4j
class KeyPairProvider {
    /**
     *
     * @param pemPath Full path to PEM file.
     * @return returns KeyPair if successfully for PEM files.
     */
    static Optional<KeyPair> keyPair(String pemPath) {
        // Load BouncyCastle as JCA provider
        Security.addProvider(new BouncyCastleProvider())

        // Parse the EC key pair
        PEMParser pemParser
        try {
            pemParser = new PEMParser(new InputStreamReader(Files.newInputStream(Paths.get(pemPath))))
            PEMKeyPair pemKeyPair = (PEMKeyPair) pemParser.readObject()

            // Convert to Java (JCA) format
            JcaPEMKeyConverter converter = new JcaPEMKeyConverter()
            KeyPair keyPair = converter.getKeyPair(pemKeyPair)
            pemParser.close()

            return Optional.of(keyPair)

        } catch (FileNotFoundException e) {
            log.warn("file not found: {}", pemPath)

        } catch (PEMException e) {
            log.warn("PEMException {}", e.getMessage())

        } catch (IOException e) {
            log.warn("IOException {}", e.getMessage())
        }
        return Optional.empty()
    }
}
```

### 10.3.5 Claims 生成

如果内置的 [JWTClaimsSetGenerator](https://micronaut-projects.github.io/micronaut-security/latest/api/io/micronaut/security/token/jwt/generator/claims/JWTClaimsSetGenerator.html) 无法满足你的需求，你可以提供自己的 [ClaimsGenerator](https://micronaut-projects.github.io/micronaut-security/latest/api/io/micronaut/security/token/jwt/generator/claims/ClaimsGenerator.html) [替代](/core/ioc#310-bean-替换)程序。

### 10.3.6 Claims 验证

JSON 网络令牌的声明使用每个 [GenericJwtClaimsValidator](https://micronaut-projects.github.io/micronaut-security/latest/api/io/micronaut/security/token/jwt/validator/GenericJwtClaimsValidator.html) 类型的 bean 进行验证。

Micronaut Security 默认包含一些验证器：

|Bean|描述|启用|
|--|--|--|
|[AudienceJwtClaimsValidator](https://micronaut-projects.github.io/micronaut-security/latest/api/io/micronaut/security/token/jwt/validator/AudienceJwtClaimsValidator.html)|JWT `aud` claim 包含一个期望的值。|`micronaut.security.token.jwt.claims-validators.audience` 属性设置时，启用。|
|[ExpirationJwtClaimsValidator](https://micronaut-projects.github.io/micronaut-security/latest/api/io/micronaut/security/token/jwt/validator/ExpirationJwtClaimsValidator.html)|JWT 未过期。它使用的是 `exp` claim。|默认启用。可以通过将 `micronaut.security.token.jwt.claims-validators.expiration` 设置为 `false` 来禁用它。|
|[IssuerJwtClaimsValidator](https://micronaut-projects.github.io/micronaut-security/latest/api/io/micronaut/security/token/jwt/validator/IssuerJwtClaimsValidator.html)|JWT `iss` claim 设置为期望值。|`micronaut.security.token.jwt.claims-validators.issuer` 属性设置时启用。|
|[NotBeforeJwtClaimsValidator](https://micronaut-projects.github.io/micronaut-security/latest/api/io/micronaut/security/token/jwt/validator/NotBeforeJwtClaimsValidator.html)|如果设置了 JWT `nbf` claim，则只有当前日期不在所提供日期之前，令牌才会有效。|默认禁用。当` micronaut.security.token.jwt.claims-validators.not-before` 属性设置为 `true` 时启用。|
|[SubjectNotNullJwtClaimsValidator](https://micronaut-projects.github.io/micronaut-security/latest/api/io/micronaut/security/token/jwt/validator/SubjectNotNullJwtClaimsValidator.html)|JWT `sub` claim 不为 null。|默认启用。可以通过将 `micronaut.security.token.jwt.claims-validators.subject` 设置为 `false` 来禁用它。|

如果你使用的是 `micronaut.security.authentication: idtoken`，[IdTokenClaimsValidator](https://micronaut-projects.github.io/micronaut-security/latest/api/io/micronaut/security/oauth2/client/IdTokenClaimsValidator.html)（一个 [GenericJwtClaimsValidator](https://micronaut-projects.github.io/micronaut-security/latest/api/io/micronaut/security/token/jwt/validator/GenericJwtClaimsValidator.html) 类型的 Bean）也会在 Bean 上下文中注册。IdTokenClaimsValidator 验证 OpenID Connect 规范中 [ID 令牌验证](https://openid.net/specs/openid-connect-core-1_0.html#IDTokenValidation)部分的第 2-5 点。你可以通过将 `micronaut.security.token.jwt.claims-validators.openid-idtoken` 设置为 false 来禁用它。|

### 10.3.7 令牌渲染

使用 [`bearer` 认证](/security/securityConfiguration#73-登录处理器)和内置 [LoginController](/security/endpoints#131-登录控制器) 时，JWT 令牌会作为 OAuth 2.0 [RFC6749](https://tools.ietf.org/html/RFC6749) 访问令牌响应的一部分返回给客户端。

这种响应的示例如下：

```json
HTTP/1.1 200 OK
Content-Type: application/json;charset=UTF-8
Cache-Control: no-store
Pragma: no-cache
{
    "access_token":"eyJhbGciOiJIUzI1NiJ9...",
    "token_type":"Bearer",
    "expires_in":3600,
    "refresh_token":"tGzv3JOkF0XG5Qx2TlKWIA...",
    "username": "euler",
    "roles": [
        "ROLE_USER"
    ],
}
```

如果你希望自定义之前的 JSON 有效负载，你可能需要为 [BearerTokenRenderer](https://micronaut-projects.github.io/micronaut-security/latest/api/io/micronaut/security/token/jwt/render/BearerTokenRenderer.html) 提供一个 Bean 替代。如果这还不够，请检查 [AccessRefreshTokenLoginHandler](https://micronaut-projects.github.io/micronaut-security/latest/api/io/micronaut/security/token/jwt/bearer/AccessRefreshTokenLoginHandler.html) 以满足你的需求。

## 10.4 LDAP 认证

Micronaut 开箱即支持 LDAP 认证。要开始使用，请在应用程序中添加 `security-ldap` 依赖。

*build.gradle*

```groovy
compile "io.micronaut.security:micronaut-security-ldap"
```

:::note 提示
阅读 [LDAP 和数据库认证提供器](https://guides.micronaut.io/latest/micronaut-database-authentication-provider.html)以查看示例。
:::

可通过将 `micronaut.security.ldap.enabled` 设置为 `false` 全面禁用 LDAP 认证，也可按提供程序设置，例如 `micronaut.security.ldap.default.enabled: false`。

### 10.4.1 配置

Micronaut 中的 LDAP 认证支持配置一个或多个 LDAP 服务器以进行认证。每个服务器都有自己的设置，可以启用或禁用。

*表 1. [LdapConfiguration](https://micronaut-projects.github.io/micronaut-security/latest/api/io/micronaut/security/ldap/configuration/LdapConfiguration.html) 的配置属性*

|属性|类型|描述|
|--|--|--|
|micronaut.security.ldap.*.enabled|boolean|设置是否启用此配置。默认值 `false`。|

*表 2. [LdapConfiguration$ContextConfiguration](https://micronaut-projects.github.io/micronaut-security/latest/api/io/micronaut/security/ldap/configuration/LdapConfiguration.ContextConfiguration.html) 的配置属性*

|属性|类型|描述|
|--|--|--|
|micronaut.security.ldap.*.context.server|java.lang.String||
|micronaut.security.ldap.*.context.manager-dn|java.lang.String||
|micronaut.security.ldap.*.context.manager-password|java.lang.String||
|micronaut.security.ldap.*.context.factory|java.lang.String||
|micronaut.security.ldap.*.context.properties|java.util.Map||

*表 3. [LdapConfiguration$SearchConfiguration](https://micronaut-projects.github.io/micronaut-security/latest/api/io/micronaut/security/ldap/configuration/LdapConfiguration.SearchConfiguration.html) 的配置属性*

|属性|类型|描述|
|--|--|--|
|micronaut.security.ldap.*.search.subtree|boolean||
|micronaut.security.ldap.*.search.base|java.lang.String||
|micronaut.security.ldap.*.search.filter|java.lang.String||
|micronaut.security.ldap.*.search.attributes|java.lang.String||

*表 4. [LdapConfiguration$GroupConfiguration](https://micronaut-projects.github.io/micronaut-security/latest/api/io/micronaut/security/ldap/configuration/LdapConfiguration.GroupConfiguration.html) 的配置属性*

|属性|类型|描述|
|--|--|--|
|micronaut.security.ldap.*.groups.subtree|boolean||
|micronaut.security.ldap.*.groups.base|java.lang.String||
|micronaut.security.ldap.*.groups.filter|java.lang.String||
|micronaut.security.ldap.*.groups.attribute|java.lang.String||
|micronaut.security.ldap.*.groups.enabled|boolean|设置是否启用组搜索。默认值 `true`|
|micronaut.security.ldap.*.groups.filter-attribute|java.lang.String|要传递给搜索过滤器的参数。|

:::note 提示
要使用 SSL 连接到 LDAP 服务器，请将标准 Java 系统属性设置为适合服务器的值。
:::

```bash
-Djavax.net.ssl.trustStore="<path to truststore file>"
-Djavax.net.ssl.trustStorePassword="<passphrase for truststore>"
```

### 10.4.2 扩展默认行为

本节将概述一些需要自定义代码才能实现的常见需求，并介绍在这些情况下应采取的措施。

#### 认证数据

认证请求成功后返回的认证对象默认是一个 `Authentication` 实例，其中只包含用户名和与用户相关的任何角色。你可以使用 [Authentication](https://micronaut-projects.github.io/micronaut-security/latest/api/io/micronaut/security/authentication/Authentication.html) `attributes` 来存储其他数据。请替换 [DefaultContextAuthenticationMapper](https://micronaut-projects.github.io/micronaut-security/latest/api/io/micronaut/security/ldap/DefaultContextAuthenticationMapper.html) 并提供自己的实现。

*MyContextAuthenticationMapper.java*

```java
@Singleton
@Replaces(DefaultContextAuthenticationMapper.class) (1)
public class MyContextAuthenticationMapper implements ContextAuthenticationMapper {

    @Override
    public AuthenticationResponse map(ConvertibleValues<Object> attributes, String username, Set<String> groups) {
        // return an Authentication instance (Authentication::build methods) or an AuthenticationFailed object
    }
}
```

1. 使用 `@Replaces` 可以让你的 Bean 替换上下文中的默认实现。

---

#### 组

默认情况下，在 LDAP 中找到的组（如果启用）将不经任何处理按原样返回。任何其他来源的附加组都不会添加到列表中。通常需要从其他来源检索其他组，或以特定格式规范组名。

要扩展此行为，必须创建自己的 [LdapGroupProcessor](https://micronaut-projects.github.io/micronaut-security/latest/api/io/micronaut/security/ldap/group/LdapGroupProcessor.html) 实现。可能需要扩展默认实现，因为它具有从 LDAP 查询组的逻辑，并执行其他方法来处理组和查询其他组。

*MyLdapGroupProcessor.java*

```java
@Singleton
@Replaces(DefaultLdapGroupProcessor.class) (1)
public class MyLdapGroupProcessor extends DefaultLdapGroupProcessor {

    Set<String> getAdditionalGroups(LdapSearchResult result) { (2)
        //Use the result to query another source for additional groups (database, etc)
    }

    Optional<String> processGroup(String group) { (3)
        //convert "Admin" to "ROLE_ADMIN" for example
        //return an empty optional to exclude the group
    }
}
```

1. 使用 `@Replaces` 可以让你的 Bean 替换上下文中的默认实现。
2. [getAdditionalGroups](https://micronaut-projects.github.io/micronaut-security/latest/api/io/micronaut/security/ldap/group/LdapGroupProcessor.html#getAdditionalGroups-io.micronaut.security.ldap.context.LdapSearchResult-) 方法允许你从其他来源添加组
3. 通过 [processGroup](https://micronaut-projects.github.io/micronaut-security/latest/api/io/micronaut/security/ldap/group/LdapGroupProcessor.html#processGroup-java.lang.String-) 方法，你可以转换组的名称或将其排除在外

---

#### 搜索逻辑

要定制 LDAP 搜索方式，请使用自己的搜索方式替换默认的搜索方式。参阅 [LdapSearchService](https://micronaut-projects.github.io/micronaut-security/latest/api/io/micronaut/security/ldap/context/LdapSearchService.html)。

*MyLdapSearchService.java*

```java
@Singleton
@Replaces(DefaultLdapSearchService.class)
public class MyLdapSearchService implements LdapSearchService {

}
```

---

#### 上下文构建

要自定义 LDAP 上下文的创建方式，请使用自己的方法替换默认实现。参阅 [ContextBuilder](https://micronaut-projects.github.io/micronaut-security/latest/api/io/micronaut/security/ldap/context/ContextBuilder.html)。

*MyContextBuilder.java*

```java
@Singleton
@Replaces(DefaultContextBuilder.class)
public class MyContextBuilder implements ContextBuilder {

}
```

## 10.5 X.509 证书认证

Micronaut Security 支持在 HTTPS 中使用 [X.509 客户端证书](https://en.wikipedia.org/wiki/X.509#Certificates)，以实现相互验证。

一旦在应用程序中[配置了 HTTPS](/core/httpserver/serverConfiguration#6296-用-https-保证服务器安全)，用户就可以安装 X.509 浏览器证书，以提供身份验证信息并访问受限制的 URL。

启用 X.509 后，除了客户端（如浏览器或 API 客户端）验证服务器证书是否有效（即证书由受信任的证书颁发机构 (CA) 颁发和签署）外，服务器还可以通过客户端 SSL 握手中的证书验证客户端。如果客户端证书有效，并包含与应用程序用户相对应的用户名/密码，则将允许访问。

**配置**

如下表所示，有两个配置选项：

*表 1. [X509ConfigurationProperties](https://micronaut-projects.github.io/micronaut-security/latest/api/io/micronaut/security/x509/X509ConfigurationProperties.html) 的配置属性*

|属性|类型|描述|
|--|--|--|
|micronaut.security.x509.subject-dn-regex|java.lang.String|设置主题 DN 正则。默认值 `CN=(.*?)(?:,|$)`。|
|micronaut.security.x509.enabled|boolean||启用 [X509AuthenticationFetcher](https://micronaut-projects.github.io/micronaut-security/latest/api/io/micronaut/security/x509/X509AuthenticationFetcher.html)。默认值 `false`。|

使用 `micronaut.security.x509.enabled` 启用 X.509 支持，或按环境启用。

使用 `micronaut.security.x509.subject-dn-regex` 属性来覆盖用于从证书中提取委托人（用户名）的默认正则表达式。通常情况下，本金存储在 `CN`（Common Name，通用名）属性中，前缀为 `"CN="`。默认正则表达式 `"CN=(.*?)(?:,|$)"` 将提取 `"CN="` 之后直至下一个（可选）分隔符的文本，但如果你的证书配置不同，可根据需要覆盖该正则表达式。

除了特定于 X.509 的配置外，还必须为服务器[配置 HTTPS](/core/httpserver/serverConfiguration#6296-用-https-保证服务器安全)，并配置在 SSL 握手过程中请求客户端证书。将 `micronaut.server.ssl.client-authentication` 属性的值设置为 `want` 或 `need`（取决于客户端证书是可选的还是必需的）。

以下是启用和配置 HTTPS 和 X.509 的配置示例：

<Tabs>
  <TabItem value="Properties" label="Properties">

```properties
micronaut.application.name=your_application_name
micronaut.security.x509.enabled=true
micronaut.ssl.enabled=true
micronaut.server.ssl.client-authentication=want
micronaut.server.ssl.key-store.path=classpath:ssl/keystore.p12
micronaut.server.ssl.key-store.password=your_keystore_password
micronaut.server.ssl.key-store.type=PKCS12
micronaut.server.ssl.trust-store.path=classpath:ssl/truststore.jks
micronaut.server.ssl.trust-store.password=your_truststore_password
micronaut.server.ssl.trust-store.type=JKS
```

  </TabItem>
  <TabItem value="Yaml" label="Yaml">

```yaml
micronaut:
  application:
    name: your_application_name
  security:
    x509:
      enabled: true
  ssl:
    enabled: true
  server:
    ssl:
      client-authentication: want # or 'need'
      key-store:
        path: classpath:ssl/keystore.p12
        password: your_keystore_password
        type: PKCS12
      trust-store:
        path: classpath:ssl/truststore.jks
        password: your_truststore_password
        type: JKS
```

  </TabItem>
    <TabItem value="Toml" label="Toml">

```toml
[micronaut]
  [micronaut.application]
    name="your_application_name"
  [micronaut.security]
    [micronaut.security.x509]
      enabled=true
  [micronaut.ssl]
    enabled=true
  [micronaut.server]
    [micronaut.server.ssl]
      client-authentication="want"
      [micronaut.server.ssl.key-store]
        path="classpath:ssl/keystore.p12"
        password="your_keystore_password"
        type="PKCS12"
      [micronaut.server.ssl.trust-store]
        path="classpath:ssl/truststore.jks"
        password="your_truststore_password"
        type="JKS"
```

  </TabItem>
    <TabItem value="Groovy" label="Groovy">

```groovy
micronaut {
  application {
    name = "your_application_name"
  }
  security {
    x509 {
      enabled = true
    }
  }
  ssl {
    enabled = true
  }
  server {
    ssl {
      clientAuthentication = "want"
      keyStore {
        path = "classpath:ssl/keystore.p12"
        password = "your_keystore_password"
        type = "PKCS12"
      }
      trustStore {
        path = "classpath:ssl/truststore.jks"
        password = "your_truststore_password"
        type = "JKS"
      }
    }
  }
}
```

  </TabItem>
    <TabItem value="Hoon" label="Hoon">

```hocon
{
  micronaut {
    application {
      name = "your_application_name"
    }
    security {
      x509 {
        enabled = true
      }
    }
    ssl {
      enabled = true
    }
    server {
      ssl {
        client-authentication = "want"
        key-store {
          path = "classpath:ssl/keystore.p12"
          password = "your_keystore_password"
          type = "PKCS12"
        }
        trust-store {
          path = "classpath:ssl/truststore.jks"
          password = "your_truststore_password"
          type = "JKS"
        }
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
    "application": {
      "name": "your_application_name"
    },
    "security": {
      "x509": {
        "enabled": true
      }
    },
    "ssl": {
      "enabled": true
    },
    "server": {
      "ssl": {
        "client-authentication": "want",
        "key-store": {
          "path": "classpath:ssl/keystore.p12",
          "password": "your_keystore_password",
          "type": "PKCS12"
        },
        "trust-store": {
          "path": "classpath:ssl/truststore.jks",
          "password": "your_truststore_password",
          "type": "JKS"
        }
      }
    }
  }
}
```

  </TabItem>
</Tabs>

:::note 提示
阅读 [X.509 认证 Micronaut 指南](https://guides.micronaut.io/latest/micronaut-security-x509.html)，了解如何配置应用程序以使用 X.509，以及如何创建用于测试的各种证书。
:::

## 10.6 自定义授权策略

所有授权策略都实现了 [AuthenticationFetcher](https://micronaut-projects.github.io/micronaut-security/latest/api/io/micronaut/security/filters/AuthenticationFetcher.html) 接口。该合约旨在从请求中返回一个 [Authentication](https://micronaut-projects.github.io/micronaut-security/latest/api/io/micronaut/security/authentication/Authentication.html)。要实现自定义逻辑以检索当前登录的用户，只需创建一个实现该合约的 Bean，它就会被自动获取。

例如，如果你使用了像 [SiteMinder](https://www.broadcom.com/products/cyber-security/identity/siteminder) 这样的产品来处理认证，那么你就可以相信访问你的应用程序的用户是经过认证的，你可以通过 `SM_USER` 请求头访问他们的用户名，并从中创建一个 `Authentication`：

*SiteMinder 认证捕获器*

```java
import io.micronaut.context.annotation.Requires;
import io.micronaut.core.util.StringUtils;
import io.micronaut.http.HttpRequest;
import io.micronaut.security.authentication.Authentication;
import io.micronaut.security.filters.AuthenticationFetcher;
import jakarta.inject.Singleton;
import java.util.Collection;
import java.util.Collections;
import org.reactivestreams.Publisher;
import reactor.core.publisher.Mono;
@Singleton
public class SiteminderAuthenticationFetcher implements AuthenticationFetcher<HttpRequest<?>> {

    public static final String SITEMINDER_USER_HEADER = "SM_USER";

    @Override
    public Publisher<Authentication> fetchAuthentication(HttpRequest<?> request) {
        return Mono.<Authentication>create(emitter -> {
            String siteminderUser = request.getHeaders().get(SITEMINDER_USER_HEADER);
            if (StringUtils.isEmpty(siteminderUser)) {
                emitter.success();
                return;
            }

            Collection<String> roles = Collections.singleton("ROLE_USER");
            emitter.success(Authentication.build(siteminderUser, roles));
        });
    }
}
```

> [英文链接](https://micronaut-projects.github.io/micronaut-security/latest/guide/index.html#authenticationStrategies)

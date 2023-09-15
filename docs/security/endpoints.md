---
sidebar_position: 130
---

# 13. 内置安全控制器

## 13.1 登录控制器

要启用 LoginController，你需要有一个 LoginHandler 类型的 Bean。当然，也可以提供自定义实现。不过，开箱即用的登录处理程序有好几种。
你可以通过以下方式配置 LoginController：

*表 1. [LoginControllerConfigurationProperties](https://micronaut-projects.github.io/micronaut-security/latest/api/io/micronaut/security/endpoints/LoginControllerConfigurationProperties.html) 的配置属性*

|属性|类型|描述|
|--|--|--|
|micronaut.security.endpoints.login.enabled|boolean||
|micronaut.security.endpoints.login.path|java.lang.String|[LoginController](LoginController) 的路径。默认值 `/login`。|

### 登录端点调用示例

*登录端点调用示例*

```bash
curl -X "POST" "http://localhost:8080/login" \
     -H 'Content-Type: application/json; charset=utf-8' \
     -d $'{
  "username": "euler",
  "password": "password"
}'
```

## 13.2 注销控制器

要启用注销控制器，你需要一个 [LogoutHandler](https://micronaut-projects.github.io/micronaut-security/latest/api/io/micronaut/security/handlers/LogoutHandler.html) 类型的 bean。控制器的行为将委托给它。当然，也可以提供自定义实现。不过，开箱即用的[注销处理器](/security/securityConfiguration#74-注销处理器)实现有好几种。

你可以通过以下方式配置注销端点：

*表 1. [LogoutControllerConfigurationProperties](https://micronaut-projects.github.io/micronaut-security/latest/api/io/micronaut/security/endpoints/LogoutControllerConfigurationProperties.html) 的配置属性*

|属性|类型|描述|
|--|--|--|
|micronaut.security.endpoints.logout.enabled|boolean||
|micronaut.security.endpoints.logout.path|java.lang.String|[LogoutController](https://micronaut-projects.github.io/micronaut-security/latest/api/io/micronaut/security/endpoints/LogoutController.html) 路径。默认值 `/logout`。|
|micronaut.security.endpoints.logout.get-allowed|boolean||

:::note 提示
如果你使用的是未存储在 cookie 中的 JWT 身份验证，你可能不需要调用 `/logout` 端点。因为注销通常意味着在客户端删除 JWT 标记。
:::

### 注销端点调用示例

*注销端点调用示例*

```bash
curl -X "POST" "http://localhost:8080/logout"
```

## 13.3 刷新控制器
 
:::danger 危险
从 Micronaut Security 2.0 开始，刷新令牌功能发生了巨大变化。如果你要升级，阅读本节，因为它现在的行为有所不同。
:::

刷新令牌可用于获取新的访问令牌。默认情况下，不生成刷新令牌。

[RefreshTokenGenerator](https://micronaut-projects.github.io/micronaut-security/latest/api/io/micronaut/security/token/generator/RefreshTokenGenerator.html) API 负责生成包含在响应中的令牌。[RefreshTokenValidator](https://micronaut-projects.github.io/micronaut-security/latest/api/io/micronaut/security/token/validator/RefreshTokenValidator.html) 负责验证刷新令牌。请注意，该验证步骤与令牌的持久性无关，而是为了验证令牌不是随机值/猜测值。

默认情况下，[RefreshTokenGenerator](https://micronaut-projects.github.io/micronaut-security/latest/api/io/micronaut/security/token/generator/RefreshTokenGenerator.html) 和 [RefreshTokenValidator](https://micronaut-projects.github.io/micronaut-security/latest/api/io/micronaut/security/token/validator/RefreshTokenValidator.html) 都可以实现。[SignedRefreshTokenGenerator](https://micronaut-projects.github.io/micronaut-security/latest/api/io/micronaut/security/token/jwt/generator/SignedRefreshTokenGenerator.html) 会创建并验证一个 JWS（JSON 网络签名）编码对象，该对象的有效载荷是一个带有基于哈希的消息验证码（HMAC）的 UUID。参阅以下配置选项：

*表 1. [RefreshTokenConfigurationProperties](https://micronaut-projects.github.io/micronaut-security/latest/api/io/micronaut/security/token/jwt/generator/RefreshTokenConfigurationProperties.html) 的配置属性*

|属性|类型|描述|
|--|--|--|
|micronaut.security.token.jwt.generator.refresh-token.enabled|boolean|设置是否启用。默认值 `true`。|
|micronaut.security.token.jwt.generator.refresh-token.jws-algorithm|com.nimbusds.jose.JWSAlgorithm|默认为 `HS256`|
|micronaut.security.token.jwt.generator.refresh-token.secret|java.lang.String|共享 secret。HS256 必须至少为 256 位。|
|micronaut.security.token.jwt.generator.refresh-token.base64|boolean|指示所提供的密文是否经过 base64 编码。默认值 `false`。|

要启用该功能，你必须提供一个 secret：

import Tabs from '@theme/Tabs';
import TabItem from '@theme/TabItem';

<Tabs>
  <TabItem value="Properties" label="Properties">

```properties
micronaut.security.token.jwt.generator.refresh-token.secret=pleaseChangeThisSecretForANewOne
```

  </TabItem>
  <TabItem value="Yaml" label="Yaml">

```yaml
micronaut:
    security:
        token:
            jwt:
                generator:
                    refresh-token:
                        secret: 'pleaseChangeThisSecretForANewOne'
```

  </TabItem>
    <TabItem value="Toml" label="Toml">

```toml
[micronaut]
  [micronaut.security]
    [micronaut.security.token]
      [micronaut.security.token.jwt]
        [micronaut.security.token.jwt.generator]
          [micronaut.security.token.jwt.generator.refresh-token]
            secret="pleaseChangeThisSecretForANewOne"
```

  </TabItem>
    <TabItem value="Groovy" label="Groovy">

```groovy
micronaut {
  security {
    token {
      jwt {
        generator {
          refreshToken {
            secret = "pleaseChangeThisSecretForANewOne"
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
          generator {
            refresh-token {
              secret = "pleaseChangeThisSecretForANewOne"
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
          "generator": {
            "refresh-token": {
              "secret": "pleaseChangeThisSecretForANewOne"
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

令牌生成后，本库对其一无所知。其值不会被缓存或存储在任何地方。如何存储令牌、支持撤销以及在给定令牌后检索用户详细信息，由每个应用程序自行决定。

除上述要求外，每个应用程序还必须提供 [RefreshTokenPersistence](https://micronaut-projects.github.io/micronaut-security/latest/api/io/micronaut/security/token/refresh/RefreshTokenPersistence.html) 的实现。

当刷新令牌生成时，[RefreshTokenPersistence](https://micronaut-projects.github.io/micronaut-security/latest/api/io/micronaut/security/token/refresh/RefreshTokenPersistence.html) 实现将接收到一个事件，然后负责持久化令牌以及指向生成令牌的用户的链接。用户信息和令牌都可以在 [RefreshTokenGeneratedEvent](https://micronaut-projects.github.io/micronaut-security/latest/api/io/micronaut/security/token/event/RefreshTokenGeneratedEvent.html) 中获得。

**刷新令牌**

Micronaut 安全系统自带一个控制器，用于刷新访问令牌。如果你的上下文包含以下类型的豆子，上下文就会加载 [OauthController](https://micronaut-projects.github.io/micronaut-security/latest/api/io/micronaut/security/token/jwt/endpoints/OauthController.html)：[AccessRefreshTokenGenerator](https://micronaut-projects.github.io/micronaut-security/latest/api/io/micronaut/security/token/jwt/generator/AccessRefreshTokenGenerator.html)、[RefreshTokenPersistence](https://micronaut-projects.github.io/micronaut-security/latest/api/io/micronaut/security/token/refresh/RefreshTokenPersistence.html)、[RefreshTokenValidator](https://micronaut-projects.github.io/micronaut-security/latest/api/io/micronaut/security/token/validator/RefreshTokenValidator.html)。

此外，还可以通过以下方式配置控制器：

*表 2. [OauthControllerConfigurationProperties](https://micronaut-projects.github.io/micronaut-security/latest/api/io/micronaut/security/endpoints/OauthControllerConfigurationProperties.html) 的配置属性*
|属性|类型|描述|
|--|--|--|
|micronaut.security.endpoints.oauth.enabled|boolean||
|micronaut.security.endpoints.oauth.path|java.lang.String|设置将 [OauthController](https://micronaut-projects.github.io/micronaut-security/latest/api/io/micronaut/security/endpoints/OauthController.html) 映射到的路径。默认值 `/oauth/access_token`。|
|micronaut.security.endpoints.oauth.get-allowed|boolean||

控制器会暴露 [OAuth 2.0 规范第 6 节](https://tools.ietf.org/html/rfc6749#section-6)定义的一个端点--刷新访问令牌。

刷新令牌端点使用 [RefreshTokenValidator](https://micronaut-projects.github.io/micronaut-security/latest/api/io/micronaut/security/token/validator/RefreshTokenValidator.html) API 验证令牌是否符合预期格式。[SignedRefreshTokenGenerator](https://micronaut-projects.github.io/micronaut-security/latest/api/io/micronaut/security/token/jwt/generator/SignedRefreshTokenGenerator.html) 会尝试验证签名并返回有效载荷。任何验证器实现都不应关注撤销状态、存在或任何其他与持久性相关的验证。

如果验证器成功验证了令牌，它就会被传递给 [RefreshTokenPersistence](https://micronaut-projects.github.io/micronaut-security/latest/api/io/micronaut/security/token/refresh/RefreshTokenPersistence.html) 实现，每个应用程序都必须提供该实现。然后，根据 `RefreshTokenPersistence::getAuthentication` 返回的用户详细信息创建一个新的访问令牌，并在响应中发送。

下面是一个刷新令牌请求的示例。向 `/oauth/access_token` 端点发送 POST 请求：

*获取访问令牌的 HTTP 请求示例*

```bash
POST /oauth/access_token HTTP/1.1
Host: micronaut.example
Content-Type: application/x-www-form-urlencoded

grant_type=refresh_token&refresh_token=eyJhbGciOiJSU0EtT0FFUCIsImVuYyI6IkEyNTZHQ00ifQ....
```

如你所见，这是一个包含 2 个参数的表单请求：

`grant_type`：必须始终为 `refresh_token`。

`refresh_token`：先前获得的刷新令牌。

:::note 提示
刷新令牌必须安全地存储在客户端应用程序中。更多信息，参阅 [OAuth 2.0 规范第 10.4 节](https://tools.ietf.org/html/rfc6749#section-10.4)。
:::

## 13.4 密钥控制器

:::tip 注意
只有在使用 JWT 认证时才能启用此控制器。
:::

[JSON 网络密钥（JWK）](https://tools.ietf.org/html/rfc7517)是表示加密密钥的 JSON 对象。该对象的成员代表密钥的属性，包括其值。

同时，JWK 集是表示一组 JWK 的 JSON 对象。JSON 对象必须有一个 "keys "成员，它是一个 JWK 数组。

要启用 [KeysController](https://micronaut-projects.github.io/micronaut-security/latest/api/io/micronaut/security/token/jwt/endpoints/KeysController.html)，你必须至少提供一个 [JwkProvider](https://micronaut-projects.github.io/micronaut-security/latest/api/io/micronaut/security/token/jwt/endpoints/JwkProvider.html) 类型的 Bean。

此外，你还可以通过以下方式对其进行配置：

*表 1. [KeysControllerConfigurationProperties](https://micronaut-projects.github.io/micronaut-security/latest/api/io/micronaut/security/token/jwt/endpoints/KeysControllerConfigurationProperties.html) 的配置属性*

|属性|类型|描述|
|--|--|--|
|micronaut.security.endpoints.keys.enabled|boolean||
|micronaut.security.endpoints.keys.path|java.lang.String|指向 [KeysController](https://micronaut-projects.github.io/micronaut-security/latest/api/io/micronaut/security/token/jwt/endpoints/KeysController.html) 的路径。默认值 `/keys`。 |

## 13.5 自省端点

[自省（Introspection）端点](https://tools.ietf.org/html/rfc7662#section-5.1)提供了一个查询令牌当前状态的端点。

```bash
POST /token_info
Accept: application/json
Content-Type: application/x-www-form-urlencoded
Authorization: Basic dXNlcjpwYXNzd29yZA==
token=eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJzdWIiOiIxMjM0NTY3ODkwIiwibmFtZSI6IkpvaG4gRG9lIiwiYWRtaW4iOnRydWUsImp0aSI6IjM1NjhjM2EzLWFlMmMtNDFiMy1hYzU5LTU0ZTkxODVkM2ViOCIsImlhdCI6MTYwMTA0OTU5OCwiZXhwIjoxNjAxMDUzMTk4fQ.Sc5Xh7jI6e_F3FAUo3n3AUCHNSxWH8t-WlM6JxeHZGI&token_type_hint=access_token
```

此外，你还可以访问一个安全的 GET 端点，该端点会响应已验证用户的自省响应：

```bash
GET /token_info
Accept: application/json
Authorization: Bearer eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJzdWIiOiIxMjM0NTY3ODkwIiwibmFtZSI6IkpvaG4gRG9lIiwiYWRtaW4iOnRydWUsImp0aSI6IjM1NjhjM2EzLWFlMmMtNDFiMy1hYzU5LTU0ZTkxODVkM2ViOCIsImlhdCI6MTYwMTA0OTU5OCwiZXhwIjoxNjAxMDUzMTk4fQ.Sc5Xh7jI6e_F3FAUo3n3AUCHNSxWH8t-WlM6JxeHZGI
```

响应：

```json
{
 "active": false
 "username": "1234567890",
 "sub": "1234567890",
 "name": "John Doe",
 "admin": true,
 "jti": "3568c3a3-ae2c-41b3-ac59-54e9185d3eb8",
 "iat": 1601049598,
 "exp": 1601053198
}
```

*表 1. [IntrospectionConfigurationProperties](https://micronaut-projects.github.io/micronaut-security/latest/api/io/micronaut/security/endpoints/introspection/IntrospectionConfigurationProperties.html) 的配置属性*

|属性|类型|描述|
|--|--|--|
|micronaut.security.endpoints.introspection.enabled|boolean||
|micronaut.security.endpoints.introspection.path|java.lang.String|[IntrospectionController](https://micronaut-projects.github.io/micronaut-security/latest/api/io/micronaut/security/endpoints/introspection/IntrospectionController.html) 的路径。默认值 `/token_info`。|

> [英文链接](https://micronaut-projects.github.io/micronaut-security/latest/guide/index.html#endpoints)

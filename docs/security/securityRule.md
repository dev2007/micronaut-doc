---
sidebar_position: 90
---

# 9. 安全规则

允许匿名用户还是通过身份验证的用户访问特定端点的决定是由一系列安全规则决定的，这些规则由 [SecurityFilter](https://micronaut-projects.github.io/micronaut-security/latest/api/io/micronaut/security/filters/SecurityFilter.html) 执行。Micronaut 内置了几种安全规则。如果它们不能满足你的需要，你可以实现自己的 [SecurityRule](https://micronaut-projects.github.io/micronaut-security/latest/api/io/micronaut/security/rules/SecurityRule.html)。

安全规则会返回一个 publisher，该 publisher 应发出一个 [SecurityRuleResult](https://micronaut-projects.github.io/micronaut-security/latest/api/io/micronaut/security/rules/SecurityRuleResult.html)。有关每个结果的描述，参阅下表。

|结果|描述|
|--|--|
|[ALLOWED](https://micronaut-projects.github.io/micronaut-security/latest/api/io/micronaut/security/rules/SecurityRuleResult.html#ALLOWED)|应允许访问该资源，并**不再考虑其他规则**。|
|[REJECTED](https://micronaut-projects.github.io/micronaut-security/latest/api/io/micronaut/security/rules/SecurityRuleResult.html#REJECTED)|应拒绝访问该资源，并**不再考虑其他规则**。|
|[UNKNOWN](https://micronaut-projects.github.io/micronaut-security/latest/api/io/micronaut/security/rules/SecurityRuleResult.html#UNKNOWN)|规则不适用于请求资源，或者无法确定。这种结果将导致考虑其他安全规则。|

:::danger 危险
如果所有安全规则都返回 UNKNOWN，请求将被拒绝！
:::

:::danger 危险
[SecurityFilter](https://micronaut-projects.github.io/micronaut-security/latest/api/io/micronaut/security/filters/SecurityFilter.html) 按顺序评估安全规则。**一旦某条规则返回 `ALLOWED` 或 `REJECTED`，就不再评估其余规则。**
:::

安全规则实现了有序接口，因此所有现有规则都有一个静态变量 ORDER，用于存储该规则的顺序。这些规则按照从低值到高值的顺序执行。你可以使用这些变量将你的自定义规则放在任何现有规则之前或之后。

下表是内置安全规则的执行顺序和简短说明。有关这些规则的更多详情，参阅各自的指南章节。

|规则|排序|ACCEPT 条件|REJECT 条件|UNKNOWN 条件|
|--|--|--|--|--|
|[IpPatternsRule](https://micronaut-projects.github.io/micronaut-security/latest/guide/index.html#ipPattern)|-300|没有|没有一个 IP 模式与 hostaddress 匹配|地址至少与一种模式匹配，否则无法解析地址|
|[SecuredAnnotationRule](https://micronaut-projects.github.io/micronaut-security/latest/guide/index.html#secured)|-200|已向通过认证的用户授予至少一个必需角色|未向通过认证的用户授予任何必需角色|请求的方法未指定安全注解|
|[ConfigurationInterceptUrlMapRule](https://micronaut-projects.github.io/micronaut-security/latest/guide/index.html#interceptUrlMap)|-100|已向通过认证的用户授予至少一个所需角色|未向通过认证的用户授予任何所需角色|未匹配路径模式|
|[SensitiveEndpointRule](https://micronaut-projects.github.io/micronaut-security/latest/guide/index.html#builtInEndpointsAccess)|0|用户已通过验证|用户未通过身份验证|路径并不敏感|

:::caution 警告
在未将规则实现中的任何阻塞操作卸载到另一个线程池的情况下，请勿执行这些操作。
:::

:::caution 警告
自 2.5 版起，Micronaut 框架执行过滤器，然后读取 HTTP 请求的正文。[SecurityFilter](https://micronaut-projects.github.io/micronaut-security/latest/api/io/micronaut/security/filter/SecurityFilter.html) 会评估 [SecurityRule](https://micronaut-projects.github.io/micronaut-security/latest/api/io/micronaut/security/rules/SecurityRule.html) 类型的 Bean。因此，[SecurityRule](https://micronaut-projects.github.io/micronaut-security/latest/api/io/micronaut/security/rules/SecurityRule.html) 不能依赖 HTTP 请求体，因为 Micronaut 框架还没有读取请求体。
:::

## 9.1 IP 模式规则

开启安全功能后，默认情况下允许来自任何 IP 地址的流量。

但你可以拒绝来自白名单 IP 模式的流量，如下图所示：

<Tabs>
  <TabItem value="Properties" label="Properties">

```properties
micronaut.security.ip-patterns[0]=127.0.0.1
micronaut.security.ip-patterns[1]=192.168.1.*
```

  </TabItem>
  <TabItem value="Yaml" label="Yaml">

```yaml
micronaut:
  security:
    ip-patterns:
      - 127.0.0.1
      - 192.168.1.*
```

  </TabItem>
    <TabItem value="Toml" label="Toml">

```toml
[micronaut]
  [micronaut.security]
    ip-patterns=[
      "127.0.0.1",
      "192.168.1.*"
    ]
```

  </TabItem>
    <TabItem value="Groovy" label="Groovy">

```groovy
micronaut {
  security {
    ipPatterns = ["127.0.0.1", "192.168.1.*"]
  }
}
```

  </TabItem>
    <TabItem value="Hoon" label="Hoon">

```hocon
{
  micronaut {
    security {
      ip-patterns = ["127.0.0.1", "192.168.1.*"]
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
      "ip-patterns": ["127.0.0.1", "192.168.1.*"]
    }
  }
}
```

  </TabItem>
</Tabs>

在前面的代码中，[IpPatternsRule](https://micronaut-projects.github.io/micronaut-security/latest/api/io/micronaut/security/rules/IpPatternsRule.html) 会拒绝不在 `127.0.0.1` 或 `192.168.1.*` 范围内的流量。

IP 模式规则从不明确允许请求，它只会在地址不匹配时拒绝请求。必须有其他安全规则来决定是否应访问资源。

如果所需的行为是只要地址匹配就允许访问所有资源，则应创建一条在此规则之后执行、返回 `ALLOWED` 的安全规则。

## 9.2 安全注解

如下图所示，你可以使用 [@Secured](https://micronaut-projects.github.io/micronaut-security/latest/api/io/micronaut/security/annotation/Secured.html) 注解来控制对控制器或控制器方法的访问。

```java
@Controller("/example")
@Secured(SecurityRule.IS_AUTHENTICATED) (1)
public class ExampleController {

    @Produces(MediaType.TEXT_PLAIN)
    @Get("/admin")
    @Secured({"ROLE_ADMIN", "ROLE_X"}) (2)
    public String withroles() {
        return "You have ROLE_ADMIN or ROLE_X roles";
    }

    @Produces(MediaType.TEXT_PLAIN)
    @Get("/anonymous")
    @Secured(SecurityRule.IS_ANONYMOUS)  (3)
    public String anonymous() {
        return "You are anonymous";
    }

    @Produces(MediaType.TEXT_PLAIN)
    @Get("/authenticated") (1)
    public String authenticated(Authentication authentication) {
        return authentication.getName() + " is authenticated";
    }
}
```

1. 已通过认证的用户可以访问 `authenticated` 控制器操作。
2. 授予 `ROLE_ADMIN` 或 `ROLE_X` 角色的用户可以访问 `withroles` 控制器的操作。
3. 匿名用户（已通过认证和未通过认证的用户）可访问 `anonymous` 控制器的操作。

### 9.2.1 Jakarta 注解

你也可以使用 Jakarta 注解：

- `jakarta.annotation.security.PermitAll`
- `jakarta.annotation.security.RolesAllowed`
- `jakarta.annotation.security.DenyAll`

```java
@Controller("/example")
public class ExampleController {

    @Produces(MediaType.TEXT_PLAIN)
    @Get("/admin")
    @RolesAllowed({"ROLE_ADMIN", "ROLE_X"}) (1)
    public String withroles() {
        return "You have ROLE_ADMIN or ROLE_X roles";
    }

    @Produces(MediaType.TEXT_PLAIN)
    @Get("/anonymous")
    @PermitAll  (2)
    public String anonymous() {
        return "You are anonymous";
    }
}
```

1. 授予 `ROLE_ADMIN` 或 `ROLE_X` 角色的用户可以访问 `withroles` 控制器的操作。
2. 匿名用户（已通过认证和未通过认证的用户）可访问 `anonymous` 控制器的操作。

:::tip 注意
使用 JSR 250 注解要求 `io.micronaut.security:micronaut-security-annotations` 分别位于 Java、Kotlin 和 Groovy 的注解处理器类路径（`annotationProcessor`、`kapt`、`compileOnly`）中。
:::

:::danger 危险
当 [@Secured](https://micronaut-projects.github.io/micronaut-security/latest/api/io/micronaut/security/annotation/Secured.html) 注解具有一组角色时，如果用户拥有其中任何一个角色，则 [SecuredAnnotationRule](https://micronaut-projects.github.io/micronaut-security/latest/guide/index.html#secured) 会授予该用户访问权限。
:::

### 9.2.2 使用表达式加密

结合 [@Secured](https://micronaut-projects.github.io/micronaut-security/latest/api/io/micronaut/security/annotation/Secured.html)，你可以使用 Micronaut Framework 4.0 中引入的[表达式](https://docs.micronaut.io/4.0.0-M2/guide/#evaluatedExpressions)来访问通过认证的用户：

<Tabs>
  <TabItem value="Java" label="Java" default>

```java
@Controller("/authenticated")
public class ExampleController {

    @Secured("#{ user?.attributes?.get('email') == 'sherlock@micronaut.example' }")
    @Produces(MediaType.TEXT_PLAIN)
    @Get("/email")
    public String authenticationByEmail(Principal principal) {
        return principal.getName() + " is authenticated";
    }
}
```

  </TabItem>
  <TabItem value="Groovy" label="Groovy">

```groovy
@Controller("/authenticated")
class ExampleController {

    @Secured("#{ user?.attributes?.get('email') == 'sherlock@micronaut.example' }")
    @Produces(MediaType.TEXT_PLAIN)
    @Get("/email")
    String authenticationByEmail(Principal principal) {
        "${principal.name} is authenticated"
    }
}
```

  </TabItem>
  <TabItem value="Kotlin" label="Kotlin">

```kt
@Controller("/authenticated")
class ExampleController {
    @Secured("#{ user?.attributes?.get('email') == 'sherlock@micronaut.example' }")
    @Produces(MediaType.TEXT_PLAIN)
    @Get("/email")
    fun authenticationByEmail(principal: Principal) = "${principal.name} is authenticated"
}
```

  </TabItem>
</Tabs>

`user` 类型为 [Authentication](https://micronaut-projects.github.io/micronaut-security/latest/api/io/micronaut/security/authentication/Authentication.html)

## 9.3 拦截 URL Map

此外，你还可以使用拦截 URL Map 配置端点验证和授权访问：

<Tabs>
  <TabItem value="Properties" label="Properties">

```properties
micronaut.security.intercept-url-map[0].pattern=/images/*
micronaut.security.intercept-url-map[0].http-method=GET
micronaut.security.intercept-url-map[0].access[0]=isAnonymous()
micronaut.security.intercept-url-map[1].pattern=/books
micronaut.security.intercept-url-map[1].access[0]=isAuthenticated()
micronaut.security.intercept-url-map[2].pattern=/books/grails
micronaut.security.intercept-url-map[2].http-method=POST
micronaut.security.intercept-url-map[2].access[0]=ROLE_GRAILS
micronaut.security.intercept-url-map[2].access[1]=ROLE_GROOVY
micronaut.security.intercept-url-map[3].pattern=/books/grails
micronaut.security.intercept-url-map[3].http-method=PUT
micronaut.security.intercept-url-map[3].access[0]=ROLE_ADMIN
```

  </TabItem>
  <TabItem value="Yaml" label="Yaml">

```yaml
micronaut:
  security:
    intercept-url-map:
      -
        pattern: /images/*
        http-method: GET
        access:
          - isAnonymous()
      -
        pattern: /books
        access:
          - isAuthenticated()
      -
        pattern: /books/grails
        http-method: POST
        access:
          - ROLE_GRAILS
          - ROLE_GROOVY
      -
        pattern: /books/grails
        http-method: PUT
        access:
          - ROLE_ADMIN
```

  </TabItem>
    <TabItem value="Toml" label="Toml">

```toml
[micronaut]
  [micronaut.security]
    [[micronaut.security.intercept-url-map]]
      pattern="/images/*"
      http-method="GET"
      access=[
        "isAnonymous()"
      ]
    [[micronaut.security.intercept-url-map]]
      pattern="/books"
      access=[
        "isAuthenticated()"
      ]
    [[micronaut.security.intercept-url-map]]
      pattern="/books/grails"
      http-method="POST"
      access=[
        "ROLE_GRAILS",
        "ROLE_GROOVY"
      ]
    [[micronaut.security.intercept-url-map]]
      pattern="/books/grails"
      http-method="PUT"
      access=[
        "ROLE_ADMIN"
      ]
```

  </TabItem>
    <TabItem value="Groovy" label="Groovy">

```groovy
micronaut {
  security {
    interceptUrlMap = [{
        pattern = "/images/*"
        httpMethod = "GET"
        access = ["isAnonymous()"]
      }, {
        pattern = "/books"
        access = ["isAuthenticated()"]
      }, {
        pattern = "/books/grails"
        httpMethod = "POST"
        access = ["ROLE_GRAILS", "ROLE_GROOVY"]
      }, {
        pattern = "/books/grails"
        httpMethod = "PUT"
        access = ["ROLE_ADMIN"]
      }]
  }
}
```

  </TabItem>
    <TabItem value="Hoon" label="Hoon">

```hocon
{
  micronaut {
    security {
      intercept-url-map = [{
          pattern = "/images/*"
          http-method = "GET"
          access = ["isAnonymous()"]
        }, {
          pattern = "/books"
          access = ["isAuthenticated()"]
        }, {
          pattern = "/books/grails"
          http-method = "POST"
          access = ["ROLE_GRAILS", "ROLE_GROOVY"]
        }, {
          pattern = "/books/grails"
          http-method = "PUT"
          access = ["ROLE_ADMIN"]
        }]
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
      "intercept-url-map": [{
          "pattern": "/images/*",
          "http-method": "GET",
          "access": ["isAnonymous()"]
        }, {
          "pattern": "/books",
          "access": ["isAuthenticated()"]
        }, {
          "pattern": "/books/grails",
          "http-method": "POST",
          "access": ["ROLE_GRAILS", "ROLE_GROOVY"]
        }, {
          "pattern": "/books/grails",
          "http-method": "PUT",
          "access": ["ROLE_ADMIN"]
        }]
    }
  }
}
```

  </TabItem>
</Tabs>

- 模式 `/images/*` 允许已通过认证和未通过认证的用户访问
- 模式 `/books` 允许所有通过认证的用户访问
- 模式 `/books/grails` 允许被授予任何指定角色的用户访问。

正如你在前面的代码列表中所看到的，任何端点都是通过模式和可选 HTTP 方法的组合来识别的。

如果给定的请求 URI 与多个拦截 url 映射相匹配，则将使用指定了与请求方法相匹配的 HTTP 方法的映射。如果有多个映射没有指定方法，但与请求 URI 匹配，则将使用第一个映射。例如：

下面的示例定义了对符合 `/v1/myResource/**` 模式并使用 HTTP 方法 `GET` 的 URI 的所有 HTTP 请求都将对所有人开放。使用不同于 GET 的 HTTP 方法但与相同 URI 模式相匹配的请求需要经过完全验证才能访问。

<Tabs>
  <TabItem value="Properties" label="Properties">

```properties
micronaut.security.intercept-url-map[0].pattern=/v1/myResource/**
micronaut.security.intercept-url-map[0].httpMethod=GET
micronaut.security.intercept-url-map[0].access[0]=isAnonymous()
micronaut.security.intercept-url-map[1].pattern=/v1/myResource/**
micronaut.security.intercept-url-map[1].access[0]=isAuthenticated()
```

  </TabItem>
  <TabItem value="Yaml" label="Yaml">

```yaml
micronaut:
  security:
    intercept-url-map:
      - pattern: /v1/myResource/**
        httpMethod: GET
        access:
          - isAnonymous()
      - pattern: /v1/myResource/**
        access:
          - isAuthenticated()
```

  </TabItem>
    <TabItem value="Toml" label="Toml">

```toml
[micronaut]
  [micronaut.security]
    [[micronaut.security.intercept-url-map]]
      pattern="/v1/myResource/**"
      httpMethod="GET"
      access=[
        "isAnonymous()"
      ]
    [[micronaut.security.intercept-url-map]]
      pattern="/v1/myResource/**"
      access=[
        "isAuthenticated()"
      ]
```

  </TabItem>
    <TabItem value="Groovy" label="Groovy">

```groovy
micronaut {
  security {
    interceptUrlMap = [{
        pattern = "/v1/myResource/**"
        httpMethod = "GET"
        access = ["isAnonymous()"]
      }, {
        pattern = "/v1/myResource/**"
        access = ["isAuthenticated()"]
      }]
  }
}
```

  </TabItem>
    <TabItem value="Hoon" label="Hoon">

```hocon
{
  micronaut {
    security {
      intercept-url-map = [{
          pattern = "/v1/myResource/**"
          httpMethod = "GET"
          access = ["isAnonymous()"]
        }, {
          pattern = "/v1/myResource/**"
          access = ["isAuthenticated()"]
        }]
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
      "intercept-url-map": [{
          "pattern": "/v1/myResource/**",
          "httpMethod": "GET",
          "access": ["isAnonymous()"]
        }, {
          "pattern": "/v1/myResource/**",
          "access": ["isAuthenticated()"]
        }]
    }
  }
}
```

  </TabItem>
</Tabs>

- 使用 GET 请求访问 `/v1/myResource/**` 不需要认证
- 使用非 GET 请求访问 `/v1/myResource/**` 需要认证

:::danger 危险
当 [@Secured](https://micronaut-projects.github.io/micronaut-security/latest/api/io/micronaut/security/annotation/Secured.html) 注解有一组角色时，如果用户拥有其中**任何**一个角色，[SecuredAnnotationRule](https://micronaut-projects.github.io/micronaut-security/latest/guide/index.html#secured) 就会授予其访问权限。
:::

## 9.4 内置端点安全性

打开安全功能后，[内置端点](/core/management/providedEndpoints)会根据其敏感值而受到保护。

<Tabs>
  <TabItem value="Properties" label="Properties">

```properties
endpoints.beans.enabled=true
endpoints.beans.sensitive=true
endpoints.info.enabled=true
endpoints.info.sensitive=false
```

  </TabItem>
  <TabItem value="Yaml" label="Yaml">

```yaml
endpoints:
  beans:
    enabled: true
    sensitive: true
  info:
    enabled: true
    sensitive: false
```

  </TabItem>
    <TabItem value="Toml" label="Toml">

```toml
[endpoints]
  [endpoints.beans]
    enabled=true
    sensitive=true
  [endpoints.info]
    enabled=true
    sensitive=false
```

  </TabItem>
    <TabItem value="Groovy" label="Groovy">

```groovy
endpoints {
  beans {
    enabled = true
    sensitive = true
  }
  info {
    enabled = true
    sensitive = false
  }
}
```

  </TabItem>
    <TabItem value="Hoon" label="Hoon">

```hocon
{
  endpoints {
    beans {
      enabled = true
      sensitive = true
    }
    info {
      enabled = true
      sensitive = false
    }
  }
}
```

  </TabItem>
    <TabItem value="JSON" label="JSON">

```json
{
  "endpoints": {
    "beans": {
      "enabled": true,
      "sensitive": true
    },
    "info": {
      "enabled": true,
      "sensitive": false
    }
  }
}
```

  </TabItem>
</Tabs>

- `/beans` 端点是安全的
- `/info` 端点对未经认证的访问是开放的

你需要替换 [SensitiveEndpointRule](https://micronaut-projects.github.io/micronaut-security/latest/api/io/micronaut/security/rules/SensitiveEndpointRule.html) 的默认实现，并实现 `SensitiveEndpointRule::checkSensitiveAuthenticated` 以允许通过认证的用户访问敏感端点。例如，你可能希望限制具有特定角色的用户访问：

<Tabs>
  <TabItem value="Java" label="Java" default>

```java
import io.micronaut.context.annotation.Replaces;
import io.micronaut.context.annotation.Requires;
import io.micronaut.core.annotation.NonNull;
import io.micronaut.http.HttpRequest;
import io.micronaut.inject.ExecutableMethod;
import io.micronaut.management.endpoint.EndpointSensitivityProcessor;
import io.micronaut.security.authentication.Authentication;
import io.micronaut.security.rules.SecurityRuleResult;
import io.micronaut.security.rules.SensitiveEndpointRule;
import io.micronaut.security.token.RolesFinder;
import jakarta.inject.Singleton;
import java.util.Collections;
import org.reactivestreams.Publisher;
import reactor.core.publisher.Mono;

@Replaces(SensitiveEndpointRule.class)
@Singleton
public class SensitiveEndpointRuleReplacement extends SensitiveEndpointRule {
    private final RolesFinder rolesFinder;

    public SensitiveEndpointRuleReplacement(EndpointSensitivityProcessor endpointSensitivityProcessor,
                                            RolesFinder rolesFinder) {
        super(endpointSensitivityProcessor);
        this.rolesFinder = rolesFinder;
    }

    @Override
    @NonNull
    protected Publisher<SecurityRuleResult> checkSensitiveAuthenticated(@NonNull HttpRequest<?> request,
                                                                        @NonNull Authentication authentication,
                                                                        @NonNull ExecutableMethod<?, ?> method) {
        return Mono.just(rolesFinder.hasAnyRequiredRoles(Collections.singletonList("ROLE_SYSTEM"), authentication.getRoles())
                ? SecurityRuleResult.ALLOWED : SecurityRuleResult.REJECTED);
    }
}
```

  </TabItem>
  <TabItem value="Groovy" label="Groovy">

```groovy
import org.reactivestreams.Publisher
import reactor.core.publisher.Mono


@Replaces(SensitiveEndpointRule.class)
@Singleton
class SensitiveEndpointRuleReplacement extends SensitiveEndpointRule {
    private final RolesFinder rolesFinder;

    SensitiveEndpointRuleReplacement(EndpointSensitivityProcessor endpointSensitivityProcessor,
                                     RolesFinder rolesFinder) {
        super(endpointSensitivityProcessor)
        this.rolesFinder = rolesFinder
    }

    @Override
    @NonNull
    protected Publisher<SecurityRuleResult> checkSensitiveAuthenticated(@NonNull HttpRequest<?> request,
                                                                        @NonNull Authentication authentication,
                                                                        @NonNull ExecutableMethod<?, ?> method) {
        Mono.just(rolesFinder.hasAnyRequiredRoles(["ROLE_SYSTEM"], authentication.roles)
                ? SecurityRuleResult.ALLOWED : SecurityRuleResult.REJECTED)
    }
}
```

  </TabItem>
  <TabItem value="Kotlin" label="Kotlin">

```kt
import io.micronaut.context.annotation.Replaces
import io.micronaut.context.annotation.Requires
import io.micronaut.http.HttpRequest
import io.micronaut.inject.ExecutableMethod
import io.micronaut.management.endpoint.EndpointSensitivityProcessor
import io.micronaut.security.authentication.Authentication
import io.micronaut.security.rules.SecurityRuleResult
import io.micronaut.security.rules.SensitiveEndpointRule
import io.micronaut.security.token.RolesFinder
import jakarta.inject.Singleton
import org.reactivestreams.Publisher
import reactor.core.publisher.Mono


@Replaces(SensitiveEndpointRule::class)
@Singleton
class SensitiveEndpointRuleReplacement(endpointSensitivityProcessor: EndpointSensitivityProcessor,
                                       private val rolesFinder: RolesFinder) : SensitiveEndpointRule(endpointSensitivityProcessor) {
    override fun checkSensitiveAuthenticated(
        request: HttpRequest<*>,
        authentication: Authentication,
        method: ExecutableMethod<*, *>
    ): Publisher<SecurityRuleResult> {
        return Mono.just(
            if (rolesFinder.hasAnyRequiredRoles(listOf("ROLE_SYSTEM"), authentication.roles)) SecurityRuleResult.ALLOWED
            else SecurityRuleResult.REJECTED
        )
    }
}
```

  </TabItem>
</Tabs>

> [英文链接](https://micronaut-projects.github.io/micronaut-security/latest/guide/index.html#securityRule)

---
sidebar_position: 40
---

# 4. 重大变更

本节将记录在里程碑或候选发布版以及主要发布版（例如：1.x.x → 2.x.x）中可能发生的重大变更。

## Micronaut Security 4.0 重大变更

- 对于将 `micronaut.security.authentication` 设置为 cookie 且将 `micronaut.security.redirect.enabled` 设置为 `false` 的应用程序，如果登录失败，服务器将响应 401 HTTP 状态代码，而不是 200。
- `micronaut.security.intercept-url-map-prepend-pattern-with-context-path` 默认为 `true`。因此，如果设置了拦截 URL 模式，就会在该模式前加上服务器上下文路径。

**配置更改**

某些配置关键字已变更。

|旧|新|
|--|--|
|micronaut.security.token.jwt.generator.access-token.expiration|micronaut.security.token.generator.access-token.expiration|
|micronaut.security.token.jwt.cookie.enabled|micronaut.security.token.cookie.enabled|
|micronaut.security.token.jwt.cookie.cookie-max-age|micronaut.security.token.cookie.cookie-max-age|
|micronaut.security.token.jwt.cookie.cookie-path|micronaut.security.token.cookie.cookie-path|
|micronaut.security.token.jwt.cookie.cookie-domain|micronaut.security.token.cookie.cookie-domain|
|micronaut.security.token.jwt.cookie.cookie-same-site|micronaut.security.token.cookie.cookie-same-site|
|micronaut.security.token.jwt.bearer.enabled|micronaut.security.token.bearer.enabled|

**类重定位**

一些类已重命名，并从 `io.micronaut.security:micronaut-security-jwt` 移至 `io.micronaut.security:micronaut.security`。

|旧包|新包|
|--|--|
|io.micronaut.security.token.jwt.endpoints.TokenRefreshRequest|io.micronaut.security.endpoints.TokenRefreshRequest|
|io.micronaut.security.token.jwt.render.AccessRefreshToken|io.micronaut.security.token.render.AccessRefreshToken|
|io.micronaut.security.token.jwt.render.BearerAccessRefreshToken|io.micronaut.security.token.render.BearerAccessRefreshToken|
|io.micronaut.security.token.jwt.endpoints.OauthController|io.micronaut.security.endpoints.OauthController|
|io.micronaut.security.token.jwt.endpoints.OauthControllerConfiguration|io.micronaut.security.endpoints.OauthControllerConfiguration|
|io.micronaut.security.token.jwt.endpoints.OauthControllerConfigurationProperties|io.micronaut.security.endpoints.OauthControllerConfigurationProperties|
|io.micronaut.security.token.jwt.generator.DefaultAccessRefreshTokenGenerator|io.micronaut.security.token.generator.DefaultAccessRefreshTokenGenerator|
|io.micronaut.security.token.jwt.cookie.AccessTokenCookieConfiguration|io.micronaut.security.token.cookie.AccessTokenCookieConfiguration|
|io.micronaut.security.token.jwt.cookie.CookieLoginHandler|io.micronaut.security.token.cookie.CookieLoginHandler|
|io.micronaut.security.token.jwt.bearer.AccessRefreshTokenLoginHandler|io.micronaut.security.token.bearer.AccessRefreshTokenLoginHandler|
|io.micronaut.security.token.jwt.bearer.BearerTokenConfiguration|io.micronaut.security.token.bearer.BearerTokenConfiguration|
|io.micronaut.security.token.jwt.bearer.BearerTokenConfigurationProperties|io.micronaut.security.token.bearer.BearerTokenConfigurationProperties|
|io.micronaut.security.token.jwt.bearer.BearerTokenReader|io.micronaut.security.token.bearer.BearerTokenReader|
|io.micronaut.security.token.jwt.render.TokenRenderer|io.micronaut.security.token.render.TokenRenderer|
|io.micronaut.security.token.jwt.render.BearerTokenRenderer|io.micronaut.security.token.render.BearerTokenRenderer|
|io.micronaut.security.token.jwt.cookie.JwtCookieTokenReader|io.micronaut.security.token.cookie.CookieTokenReader|
|io.micronaut.security.token.jwt.cookie.RefreshTokenCookieConfiguration|io.micronaut.security.token.cookie.RefreshTokenCookieConfiguration|
|io.micronaut.security.token.jwt.cookie.RefreshTokenCookieConfigurationProperties|io.micronaut.security.token.cookie.RefreshTokenCookieConfigurationProperties|
|io.micronaut.security.token.jwt.cookie.JwtCookieClearerLogoutHandler|io.micronaut.security.token.cookie.TokenCookieClearerLogoutHandler|
|io.micronaut.security.token.jwt.cookie.JwtCookieLoginHandler|io.micronaut.security.token.cookie.TokenCookieLoginHandler|
|io.micronaut.security.token.jwt.cookie.JwtCookieTokenReader|io.micronaut.security.token.cookie.TokenCookieTokenReader|
|io.micronaut.security.token.jwt.generator.AccessRefreshTokenGenerator|io.micronaut.security.token.generator.AccessRefreshTokenGenerator|
|io.micronaut.security.token.jwt.generator.AccessTokenConfiguration|io.micronaut.security.token.generator.AccessTokenConfiguration|
|io.micronaut.security.token.jwt.generator.AccessTokenConfigurationProperties|io.micronaut.security.token.generator.AccessTokenConfigurationProperties|
|io.micronaut.security.token.jwt.generator.claims.ClaimsGenerator|io.micronaut.security.token.claims.ClaimsGenerator|
|io.micronaut.security.token.jwt.generator.claims.ClaimsAudienceProvider|io.micronaut.security.token.claims.ClaimsAudienceProvider|
|io.micronaut.security.token.jwt.cookie.AbstractAccessTokenCookieConfigurationProperties|io.micronaut.security.token.cookie.AbstractAccessTokenCookieConfigurationProperties|
|io.micronaut.security.token.jwt.cookie.JwtCookieConfigurationProperties|io.micronaut.security.token.cookie.TokenCookieConfigurationProperties|
|io.micronaut.security.token.jwt.generator.claims.JwtIdGenerator|io.micronaut.security.token.claims.JtiGenerator|
|io.micronaut.security.token.jwt.generator.claims.JwtClaims|io.micronaut.security.token.Claims|

**注解映射器已删除**

`javax.annotation.security` 注解的映射器 —— `DenyAll`、`PermitAll`、`RolesAllowed` —— 已被移除。请使用 Jakarta 版本的 `jakarta.annotation.security` 注解。

|已移除|保留|
|--|--|
|io.micronaut.security.annotation.DenyAllAnnotationMapper|io.micronaut.security.annotation.JakartaDenyAllAnnotationMapper|
|io.micronaut.security.annotation.PermitAllAnnotationMapper|io.micronaut.security.annotation.JakartaPermitAllAnnotationMapper|
|io.micronaut.security.annotation.RolesAllowedAnnotationMapper|io.micronaut.security.annotation.JakartaRolesAllowedAnnotationMapper|

**响应式 OpenIdAuthenticationMapper**

为了与 `OauthAuthenticationMapper` 接口保持一致，`OpenIdAuthenticationMapper.createAuthenticationResponse` 的返回类型已改为返回 `Publisher`。由于该方法现在会返回一个 Publisher，因此可以使用你选择的响应流实现将阻塞操作卸载到另一个线程池中。

---

## Micronaut Security 3.4 重大变更

除非绑定了 [SensitiveEndpointRule](https://micronaut-projects.github.io/micronaut-security/latest/api/io/micronaut/security/rules/SensitiveEndpointRule.html) 的替代品，否则敏感端点现在会以错误响应。

以下代码片段说明了如何恢复以前的功能：

:::tip 注意
以前的功能允许任何经过认证的用户查看敏感端点，无论其角色如何。
:::

import Tabs from '@theme/Tabs';
import TabItem from '@theme/TabItem';

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
import jakarta.inject.Singleton;
import org.reactivestreams.Publisher;
import reactor.core.publisher.Mono;

@Singleton
@Replaces(SensitiveEndpointRule.class)
class SensitiveEndpointRuleReplacement extends SensitiveEndpointRule {
    SensitiveEndpointRuleReplacement(EndpointSensitivityProcessor endpointSensitivityProcessor) {
        super(endpointSensitivityProcessor);
    }

    @Override
    @NonNull
    protected Publisher<SecurityRuleResult> checkSensitiveAuthenticated(@NonNull HttpRequest<?> request,
                                                                        @NonNull Authentication authentication,
                                                                        @NonNull ExecutableMethod<?, ?> method) {
        return Mono.just(SecurityRuleResult.ALLOWED);
    }
}
```

  </TabItem>
  <TabItem value="Groovy" label="Groovy">

```groovy
import io.micronaut.context.annotation.Replaces
import io.micronaut.context.annotation.Requires
import io.micronaut.core.annotation.NonNull
import io.micronaut.http.HttpRequest
import io.micronaut.inject.ExecutableMethod
import io.micronaut.management.endpoint.EndpointSensitivityProcessor
import io.micronaut.security.authentication.Authentication
import io.micronaut.security.rules.SecurityRuleResult
import io.micronaut.security.rules.SensitiveEndpointRule
import jakarta.inject.Singleton
import org.reactivestreams.Publisher
import reactor.core.publisher.Mono

@Singleton
@Replaces(SensitiveEndpointRule.class)
class SensitiveEndpointRuleReplacement extends SensitiveEndpointRule {
    SensitiveEndpointRuleReplacement(EndpointSensitivityProcessor endpointSensitivityProcessor) {
        super(endpointSensitivityProcessor);
    }

    @Override
    @NonNull
    protected Publisher<SecurityRuleResult> checkSensitiveAuthenticated(@NonNull HttpRequest<?> request,
                                                                        @NonNull Authentication authentication,
                                                                        @NonNull ExecutableMethod<?, ?> method) {
        return Mono.just(SecurityRuleResult.ALLOWED);
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
class SensitiveEndpointRuleReplacement(endpointSensitivityProcessor: EndpointSensitivityProcessor) : SensitiveEndpointRule(endpointSensitivityProcessor) {
    override fun checkSensitiveAuthenticated(
        request: HttpRequest<*>,
        authentication: Authentication,
        method: ExecutableMethod<*, *>
    ): Publisher<SecurityRuleResult> = Mono.just(SecurityRuleResult.ALLOWED)
}
```

  </TabItem>
</Tabs>

---

## Micronaut Security 3.1 重大变更

Micronaut 安全不再暴露 `micronaut-management` 依赖。

---

## Micronaut Security 3.0 重大变更

**删除用户详细信息**

已移除 `UserDetails` 类，所有使用都应替换为 [Authentication](https://micronaut-projects.github.io/micronaut-security/latest/api/io/micronaut/security/authentication/Authentication.html)。

**受影响的应用程序接口**

- [AuthenticationFailed](https://micronaut-projects.github.io/micronaut-security/latest/api/io/micronaut/security/authentication/AuthenticationFailed.html)
- [AuthenticationResponse](https://micronaut-projects.github.io/micronaut-security/latest/api/io/micronaut/security/authentication/AuthenticationResponse.html)
- [LoginHandler](https://micronaut-projects.github.io/micronaut-security/latest/api/io/micronaut/security/handlers/LoginHandler.html)
- [AbstractSecurityRule](https://micronaut-projects.github.io/micronaut-security/latest/api/io/micronaut/security/rules/AbstractSecurityRule.html)
- [SecurityRule](https://micronaut-projects.github.io/micronaut-security/latest/api/io/micronaut/security/rules/SecurityRule.html)
- [SensitiveEndpointRule](https://micronaut-projects.github.io/micronaut-security/latest/api/io/micronaut/security/rules/SensitiveEndpointRule.html)
- [RefreshTokenGeneratedEvent](https://micronaut-projects.github.io/micronaut-security/latest/api/io/micronaut/security/token/event/RefreshTokenGeneratedEvent.html)
- [RefreshTokenGenerator](https://micronaut-projects.github.io/micronaut-security/latest/api/io/micronaut/security/token/generator/RefreshTokenGenerator.html)
- [TokenGenerator](https://micronaut-projects.github.io/micronaut-security/latest/api/io/micronaut/security/token/generator/TokenGenerator.html)
- [CookieLoginHandler](https://micronaut-projects.github.io/micronaut-security/latest/api/io/micronaut/security/token/jwt/cookie/CookieLoginHandler.html)
- [AccessRefreshTokenGenerator](https://micronaut-projects.github.io/micronaut-security/latest/api/io/micronaut/security/token/jwt/generator/AccessRefreshTokenGenerator.html)
- [ClaimsGenerator](https://micronaut-projects.github.io/micronaut-security/latest/api/io/micronaut/security/token/jwt/generator/claims/ClaimsGenerator.html)
- [TokenRenderer](https://micronaut-projects.github.io/micronaut-security/latest/api/io/micronaut/security/token/jwt/render/TokenRenderer.html)
- [RefreshTokenPersistence](https://micronaut-projects.github.io/micronaut-security/latest/api/io/micronaut/security/token/refresh/RefreshTokenPersistence.html)

**类重命名**

|旧|新|
|--|--|
|io.micronaut.security.oauth2.endpoint.token.response.OauthUserDetailsMapper|io.micronaut.security.oauth2.endpoint.token.response.OauthAuthenticationMapper|
|io.micronaut.security.oauth2.endpoint.token.response.OpenIdUserDetailsMapper|io.micronaut.security.oauth2.endpoint.token.response.OpenIdAuthenticationMapper|
|io.micronaut.security.oauth2.endpoint.token.response.DefaultOpenIdUserDetailsMapper|io.micronaut.security.oauth2.endpoint.token.response.DefaultOpenIdAuthenticationMapper|

**其他变更**

- 用户登录时发出的 [LoginSuccessfulEvent](https://micronaut-projects.github.io/micronaut-security/latest/api/io/micronaut/security/event/LoginSuccessfulEvent.html) 现在将与 [Authentication](https://micronaut-projects.github.io/micronaut-security/latest/api/io/micronaut/security/authentication/Authentication.html) 实例一起创建。
- `AuthenticationUserDetailsAdapter` 类已删除。

**安全规则变更**

[SecurityRule API](https://micronaut-projects.github.io/micronaut-security/latest/api/io/micronaut/security/rules/SecurityRule.html) 已更改。该方法的最后一个参数是表示用户属性的映射。取而代之的是对 [Authentication](https://micronaut-projects.github.io/micronaut-security/latest/api/io/micronaut/security/authentication/Authentication.html) 的引用。这样做的好处是，规则现在可以访问登录用户的用户名，也可以访问便捷方法 `getRoles()`。

此外，该方法的返回类型已改为返回 `Publisher`。这是必要的，因为安全规则是作为安全过滤器的一部分执行的，而安全过滤器可能在非阻塞线程上。由于该方法现在返回的是 `Publisher`，因此阻塞操作可以使用你选择的反应流实现卸载到另一个线程池。

Micronaut 2 API:

`SecurityRuleResult check(HttpRequest<?> request, @Nullable RouteMatch<?> routeMatch, @Nullable Map<String, Object> claims);`

Micronaut 3 API:

`Publisher<SecurityRuleResult> check(HttpRequest<?> request, @Nullable RouteMatch<?> routeMatch, @Nullable Authentication authentication);`

**LDAP 包变更**

`io.micronaut.configuration.security.ldap` 中的所有类已移至 `io.micronaut.security.ldap` 包。

**安全过滤器**

安全过滤器不再扩展已废弃的 `OncePerRequestHttpServerFilter`，因为它已在 Micronaut 3 中废弃。

**Cookie 安全配置**

Micronaut Security 3.0.0 中删除了以下属性的默认值：

- `micronaut.security.oauth2.openid.nonce.cookie.cookie-secure`
- `micronaut.security.oauth2.state.cookie.cookie-secure`
- `micronaut.security.token.jwt.cookie.cookie-secure`
- `micronaut.security.token.refresh.cookie.cookie-secure`

:::tip 注意
如果未设置 cookie-secure 设置，则在请求被确定为 HTTPS 时，cookie 将是安全的。
:::

**删除弃用内容**

删除了大部分（如果不是全部）已弃用的类构造函数和方法。

**其他变更**

- [DefaultJwtAuthenticationFactory](https://micronaut-projects.github.io/micronaut-security/latest/api/io/micronaut/security/token/jwt/validator/DefaultJwtAuthenticationFactory.html) 的构造函数已更改
- 更改了 [IdTokenLoginHandler](https://micronaut-projects.github.io/micronaut-security/latest/api/io/micronaut/security/oauth2/endpoint/token/response/IdTokenLoginHandler.html) 的构造函数
- [SessionLoginHandler](https://micronaut-projects.github.io/micronaut-security/latest/api/io/micronaut/security/session/SessionLoginHandler.html) 的构造函数已更改
- [BasicAuthAuthenticationFetcher](https://micronaut-projects.github.io/micronaut-security/latest/api/io/micronaut/security/authentication/BasicAuthAuthenticationFetcher.html) 的构造函数已更改
- [RolesFinder](https://micronaut-projects.github.io/micronaut-security/latest/api/io/micronaut/security/token/RolesFinder.html) 方法 `findInClaims` 已被弃用，应使用 `resolveRoles(@Nullable Map<String, Object> attributes)` 代替。

> [英文链接](https://micronaut-projects.github.io/micronaut-security/latest/guide/index.html#breaks)

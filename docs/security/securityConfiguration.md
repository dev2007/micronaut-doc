---
sidebar_position: 70
---

# 7. 安全配置

提供以下全局配置选项：

*表 1. [SecurityConfigurationProperties](https://micronaut-projects.github.io/micronaut-security/latest/api/io/micronaut/security/config/SecurityConfigurationProperties.html) 的配置属性*

|属性|类型|描述|
|--|--|--|
|micronaut.security.authentication|[AuthenticationMode](https://micronaut-projects.github.io/micronaut-security/latest/api/io/micronaut/security/authentication/AuthenticationMode.html)|定义要使用的认证。默认为空。可能的值有 `bearer`、`session`、`cookie`、`idtoken`。只有在服务处理登录和注销请求时才应提供。|
|micronaut.security.enabled|boolean|是否启用了安全功能。默认值 `true`|
|micronaut.security.intercept-url-map|java.util.List|定义拦截模式的映射。|
|micronaut.security.ip-patterns|java.util.List|允许的 IP 模式。默认值 `[]`|
|micronaut.security.intercept-url-map-prepend-pattern-with-context-path|boolean|如果定义了拦截 URL 模式，是否应在其前面加上上下文路径。默认为 `.`|
|micronaut.security.authentication-provider-strategy|[AuthenticationStrategy](https://micronaut-projects.github.io/micronaut-security/latest/api/io/micronaut/security/config/AuthenticationStrategy.html)|确定如何处理认证提供器。默认值为 `ANY`。可能的值：`ANY` 或 `ALL`。|
|micronaut.security.reject-not-found|boolean|服务器是否应对与服务器上任何路由都不匹配的请求作出 401 响应，如果设置为 false，则会对与服务器上任何路由都不匹配的请求返回 404。默认值（`true`）。|

## 7.1 拒绝未找到路由

默认情况下，当你包含 Micronaut 安全性时，应用程序甚至会对不存在的路由返回 401 或 403。这种行为可防止攻击者发现应用程序中可用的端点。不过，如果你希望对未找到的路由返回 404，可以在配置中设置 `micronaut.security.reject-not-found：false`。

## 7.2 验证策略

默认情况下，Micronaut 只需要一个[认证提供器](https://micronaut-projects.github.io/micronaut-security/latest/guide/index.html#authenticationProviders)来返回成功的认证响应。你可以设置 `micronaut.security.authentication-provider-strategy：ALL` 以要求所有 [AuthenticationProvider](https://micronaut-projects.github.io/micronaut-security/latest/api/io/micronaut/security/authentication/AuthenticationProvider.html) 返回成功的认证响应。

## 7.3 登录处理器

[LoginHandler](https://micronaut-projects.github.io/micronaut-security/latest/api/io/micronaut/security/handlers/LoginHandler.html) API 定义了如何响应成功或失败的登录尝试。例如，使用[登录控制器](/endpoints#131-登录控制器)或 [OAuth 2.0](/oauth) 支持。

你可以提供自己的 [LoginHandler](https://micronaut-projects.github.io/micronaut-security/latest/api/io/micronaut/security/handlers/LoginHandler.html) 实现。不过，Micronaut 安全模块随附了多种实现，你可以通过设置配置 `micronaut.security.authentication` 来启用这些实现。

|配置值|必需模块|注册的 bean|
|--|--|--|
|cookie|`micronaut-jwt`|[JwtCookieLoginHandler](https://micronaut-projects.github.io/micronaut-security/latest/api/io/micronaut/security/token/jwt/cookie/JwtCookieLoginHandler.html)|
|session|`micronaut-session`|[SessionLoginHandler](https://micronaut-projects.github.io/micronaut-security/latest/api/io/micronaut/security/session/SessionLoginHandler.html)|
|bearer|`micronaut-jwt`|[AccessRefreshTokenLoginHandler](https://micronaut-projects.github.io/micronaut-security/latest/api/io/micronaut/security/token/jwt/bearer/AccessRefreshTokenLoginHandler.html)|
|idtoken|`micronaut-oauth`|[IdTokenLoginHandler](https://micronaut-projects.github.io/micronaut-security/latest/api/io/micronaut/security/oauth2/endpoint/token/response/IdTokenLoginHandler.html)|

## 7.4 注销处理器

[LogoutHandler](https://micronaut-projects.github.io/micronaut-security/latest/api/io/micronaut/security/handlers/LogoutHandler.html) API 定义了如何响应注销尝试。例如，使用[注销控制器](/endpoints#132-注销控制器)。

你可以提供自己的 [LogoutHandler](https://micronaut-projects.github.io/micronaut-security/latest/api/io/micronaut/security/handlers/LogoutHandler.html) 实现。然而，Micronaut 安全模块自带了几种实现，你可以通过设置配置属性 `micronaut.security.authentication` 的值来启用它们：

|配置值|必需模块|注册的 bean|
|--|--|--|
|cookie|`micronaut-jwt`|[JwtCookieClearerLogoutHandler](https://micronaut-projects.github.io/micronaut-security/latest/api/io/micronaut/security/token/jwt/cookie/JwtCookieClearerLogoutHandler.html)|
|idtoken|`micronaut-jwt`|[JwtCookieClearerLogoutHandler](https://micronaut-projects.github.io/micronaut-security/latest/api/io/micronaut/security/token/jwt/cookie/JwtCookieClearerLogoutHandler.html)|
|session|`micronaut-session`|[SessionLogoutHandler](https://micronaut-projects.github.io/micronaut-security/latest/api/io/micronaut/security/session/SessionLogoutHandler.html)|

## 7.5 无重定向的处理程序

如果将 micronaut.security.redirect.enabled 设置为 false，禁用重定向配置，这些处理程序将以 200 响应。

## 7.6 重定向配置

用户登录后，一些安全流（如基于会话的身份验证、Cookie 令牌身份验证）可能会涉及重定向。

你可以通过以下方式配置重定向目的地：

*表 1. [RedirectConfigurationProperties](https://micronaut-projects.github.io/micronaut-security/latest/api/io/micronaut/security/config/RedirectConfigurationProperties.html) 的配置属性*

|属性|类型|描述|
|--|--|--|
|micronaut.security.redirect.login-success|java.lang.String|用户登录成功后重定向到的位置。默认值 (`/`)。|
|micronaut.security.redirect.login-failure|java.lang.String|用户登录失败后会被重定向到哪里。默认值 (`/`)。|
|micronaut.security.redirect.logout|java.lang.String|用户注销后重定向的 URL。默认值 (`/`)。|
|micronaut.security.redirect.prior-to-login|boolean|如果为 "true"，则应将用户重定向回启动登录流程的未授权请求。在这些情况下取代 `login-success` 配置。默认值 `false`。|
|micronaut.security.redirect.enabled|boolean|设置是否启用重定向配置。默认值 (`true`)。|

*表 2. [RedirectConfigurationProperties$ForbiddenRedirectConfigurationProperties](https://micronaut-projects.github.io/micronaut-security/latest/api/io/micronaut/security/config/RedirectConfigurationProperties.ForbiddenRedirectConfigurationProperties.html) 的配置属性*

|属性|类型|描述|
|--|--|--|
|micronaut.security.redirect.forbidden.url|java.lang.String|用户在尝试访问被禁止访问的安全路由后被重定向到的位置。默认值 (`/`)。|
|micronaut.security.redirect.forbidden.enabled|boolean|是否应在禁止拒绝时重定向。默认值 (`true`)。|

*表 3. [RedirectConfigurationProperties$UnauthorizedRedirectConfigurationProperties](https://micronaut-projects.github.io/micronaut-security/latest/api/io/micronaut/security/config/RedirectConfigurationProperties.UnauthorizedRedirectConfigurationProperties.html) 的配置属性*

|属性|类型|描述|
|--|--|--|
|micronaut.security.redirect.unauthorized.url|java.lang.String|用户尝试访问安全路由后被重定向到的位置。默认值 (`/login`)。|
|micronaut.security.redirect.unauthorized.enabled|boolean|未经授权的拒绝是否应重定向。默认值 (`true`)。|

:::danger 危险
使用 API [RedirectService](https://micronaut-projects.github.io/micronaut-security/latest/api/io/micronaut/security/config/RedirectService.html)，该服务会在重定向 URL 中预置上下文路径（如果已定义）。
:::

> [英文链接](https://micronaut-projects.github.io/micronaut-security/latest/guide/index.html#securityConfiguration)

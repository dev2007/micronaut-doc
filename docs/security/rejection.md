---
sidebar_position: 110
---

# 11. 拒绝处理

Micronaut 允许自定义在请求未被授权访问资源或未通过认证且资源需要认证时发送的响应。

当请求被拒绝时，安全过滤器会发出一个 [AuthorizationException](https://micronaut-projects.github.io/micronaut-security/latest/api/io/micronaut/security/authentication/AuthorizationException.html)。默认实现（[DefaultAuthorizationExceptionHandler](https://micronaut-projects.github.io/micronaut-security/latest/api/io/micronaut/security/authentication/DefaultAuthorizationExceptionHandler.html)）只有在请求接受 `text/html` 时才会根据重定向配置进行重定向：

*表 1. [RedirectConfigurationProperties](https://micronaut-projects.github.io/micronaut-security/latest/api/io/micronaut/security/config/RedirectConfigurationProperties.html) 的配置属性*

|属性|类型|描述|
|--|--|--|
|micronaut.security.redirect.login-success|java.lang.String|用户登录成功后重定向到的位置。默认值 (`/`)。|
|micronaut.security.redirect.login-failure|java.lang.String|用户登录失败后会被重定向到哪里。默认值 (`/`)。|
|micronaut.security.redirect.logout|java.lang.String|用户注销后重定向的 URL。默认值 (`/`)。|
|micronaut.security.redirect.prior-to-login|boolean|如果为 `true`，则应将用户重定向回启动登录流程的未授权请求。在这些情况下取代 `login-success` 配置。默认值 `false`。|
|micronaut.security.redirect.enabled|boolean|设置是否启用重定向配置。默认值 (`true`)。|

对于未经授权的请求，如果 `unauthorized.enabled` 为 `false`，或请求不接受 `text/html`，则会发送 401 http 响应。

对于拒绝的请求，如果 `forbidden.enabled` 为 `false` 或请求不接受 text/html，将发送 403 http 响应。

要完全自定义行为，请用自己的实现替换相关的 Bean。

例如：

```java
import io.micronaut.context.annotation.Replaces;
import io.micronaut.context.annotation.Requires;
import io.micronaut.core.annotation.Nullable;
import io.micronaut.http.HttpRequest;
import io.micronaut.http.MutableHttpResponse;
import io.micronaut.http.server.exceptions.response.ErrorResponseProcessor;
import io.micronaut.security.authentication.AuthorizationException;
import io.micronaut.security.authentication.DefaultAuthorizationExceptionHandler;
import io.micronaut.security.config.RedirectConfiguration;
import io.micronaut.security.config.RedirectService;
import io.micronaut.security.errors.PriorToLoginPersistence;
import jakarta.inject.Singleton;

@Singleton
@Replaces(DefaultAuthorizationExceptionHandler.class)
public class MyRejectionHandler extends DefaultAuthorizationExceptionHandler {

    public MyRejectionHandler(ErrorResponseProcessor<?> errorResponseProcessor,
                              RedirectConfiguration redirectConfiguration,
                              RedirectService redirectService,
                              @Nullable PriorToLoginPersistence priorToLoginPersistence) {
        super(errorResponseProcessor, redirectConfiguration, redirectService, priorToLoginPersistence);
    }

    @Override
    public MutableHttpResponse<?> handle(HttpRequest request, AuthorizationException exception) {
        //Let the DefaultAuthorizationExceptionHandler create the initial response
        //then add a header
        return super.handle(request, exception).header("X-Reason", "Example Header");
    }
}
```

> [英文链接](https://micronaut-projects.github.io/micronaut-security/latest/guide/index.html#rejection)
